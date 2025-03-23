import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { DeployArgs } from "./types";
import { getWorkSpacePath } from "../../utils/path";
import processCLI from "./excute";
import { saveCommandHistory } from "../../services/cmd-history";

const execAsync = promisify(exec);
async function deploy(
  webview: vscode.Webview,
  args: DeployArgs
) {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    saveCommandHistory("aptos move publish", "Workspace path not found");
    throw new Error("Workspace path not found");
  }

  const command = "aptos";
  const cmdArgs: string[] = ["move", "publish"];

  cmdArgs.push(
    "--named-addresses",
    `${args.named_addresses}=default`,
    "--assume-yes"
  );

  if (args.overrideSizeCheck) {
    cmdArgs.push("--override-size-check");
  }
  if (args.chunkedPublish) {
    cmdArgs.push("--chunked-publish");
  }
  if (args.largePackagesModuleAddress && args.largePackagesModuleAddress !== "0x0e1ca3011bdd07246d4d16d909dbb2d6953a86c4735d5acf5865d962c630cce7") {
    cmdArgs.push("--large-packages-module-address", args.largePackagesModuleAddress);
  }
  if (args.chunkSize && args.chunkSize !== "55000") {
    cmdArgs.push("--chunk-size", args.chunkSize);
  }
  if (args.includedArtifacts && args.includedArtifacts !== "sparse") {
    cmdArgs.push("--included-artifacts", args.includedArtifacts);
  }
  if (args.packageDir_deploy) {
    cmdArgs.push("--package-dir", args.packageDir_deploy);
  }
  if (args.outputDir_deploy) {
    cmdArgs.push("--output-dir", args.outputDir_deploy);
  }
  if (args.overrideStd_deploy) {
    cmdArgs.push("--override-std", args.overrideStd_deploy);
  }
  if (args.skipGitDeps_deploy) {
    cmdArgs.push("--skip-git-deps");
  }
  if (args.skipAttributeChecks_deploy) {
    cmdArgs.push("--skip-attribute-checks");
  }
  if (args.checkTestCode_deploy) {
    cmdArgs.push("--check-test-code");
  }
  if (args.optimize && args.optimize !== "default") {
    cmdArgs.push("--optimize", args.optimize);
  }
  if (args.compilerVersion && args.compilerVersion !== "2.0") {
    cmdArgs.push("--compiler-version", args.compilerVersion);
  }
  if (args.languageVersion && args.languageVersion !== "2.1") {
    cmdArgs.push("--language-version", args.languageVersion);
  }
  if (args.senderAccount) {
    cmdArgs.push("--sender-account", args.senderAccount);
  }
  if (args.privateKey_deploy) {
    cmdArgs.push("--private-key", args.privateKey_deploy);
  }
  if (args.encoding && args.encoding !== "hex") {
    cmdArgs.push("--encoding", args.encoding);
  }
  if (args.expirationSecs && args.expirationSecs !== "30") {
    cmdArgs.push("--expiration-secs", args.expirationSecs);
  }
  // if (args.assume_no) {
  //   cmdArgs.push("--assume-no");
  // }
  if (args.local) {
    cmdArgs.push("--local");
  }
  if (args.benmark) {
    cmdArgs.push("--benmark");
  }

  console.log("Deploy command:", command, cmdArgs.join(" "));
  let commandHistory = command + " " + cmdArgs.join(" ");
  let output = "";
  try {
    output = await processCLI(command, cmdArgs, workspacePath);
    saveCommandHistory(commandHistory, output);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: { out: output, isProfile: false },
    });
  } catch (error) {
    saveCommandHistory(commandHistory, `Error: ${error}\n{${output ? `Output: ${output}` : ""}}`);
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: {
        out: `${error}\n{${output ? `Output: ${output}` : ""}}`,
        isProfile: false,
      },
    });
  }
}

async function checkProfile(webview: vscode.Webview) {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    console.error("Workspace path is undefined.");
    return null;
  }
  try {
    const isProfile = true;
    const accountAddress = await getAccount();
    const network = await getNetWork();
    const balance = await checkBalance();
    console.log("check3", accountAddress, network, balance);
    webview.postMessage({
      type: "cliStatus",
      message: { accountAddress, network, balance, isProfile },
    });
    return;
  } catch (error) {
    console.error("Error parsing config file:", error);
  }
  return Promise.reject("Failed to read account from config");
}
async function checkBalance() {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    console.log("No workspace");
    return;
  }
  try {
    const { stdout, stderr } = await execAsync(`aptos account balance`, {
      cwd: workspacePath,
    });
    if (stderr) {
      console.error("Error getting account balance:", stderr);
      return null;
    }
    const result = JSON.parse(stdout);
    const balance = result.Result[0].balance;
    return balance;
  } catch (error: any) {
    console.error("Error executing command:", error);
    return null;
  }
}

async function getAccount() {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    console.log("No workspace");
    return;
  }
  try {
    const { stdout, stderr } = await execAsync(`aptos config show-profiles`, {
      cwd: workspacePath,
    });
    if (stderr) {
      console.error("Error getting account:", stderr);
      return null;
    }
    const result = JSON.parse(stdout);
    const account = result.Result.default.account;
    return account;
  } catch (error) {
    console.error("Error executing account command:", error);
    return null;
  }
}

async function getNetWork() {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    console.log("No workspace");
    return;
  }
  try {
    const { stdout, stderr } = await execAsync(`aptos config show-profiles`, {
      cwd: workspacePath,
    });
    if (stderr) {
      console.error("Error getting network:", stderr);
      return null;
    }
    const result = JSON.parse(stdout);
    const network = result.Result.default.rest_url;
    return network;
  } catch (error) {
    console.error("Error executing network command:", error);
    return null;
  }
}

export { deploy, checkProfile, checkBalance, getAccount, getNetWork };
