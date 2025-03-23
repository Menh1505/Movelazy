import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";
import { CompileArgs } from "./types";
import processCLI from "./excute";
import { getWorkSpacePath } from "../../utils/path";
import { saveCommandHistory } from "../../services/cmd-history";

const execAsync = promisify(exec);

export default async function compile(
  webview: vscode.Webview,
  args: CompileArgs
) {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    throw new Error("Workspace path not found");
  }

  // let command = "aptos move compile";
  // command += ` --named-addresses ${args.named_addresses}=default`;

  const command = "aptos";
  const cmdArgs: string[] = ["move", "compile"];

  cmdArgs.push("--named-addresses", `${args.named_addresses}=default`);
  if (args.optimization !== "default" && args.optimization) {
    // command += ` --optimize ${args.optimization}`;
    cmdArgs.push("--optimize", args.optimization);
  }
  if (args.artifacts !== "sparse" && args.artifacts) {
    // command += ` --included-artifacts ${args.artifacts}`;
    cmdArgs.push("--included-artifacts ", args.artifacts);
  }
  if (args.saveMetadata) {
    // command += " --save-metadata";
    cmdArgs.push("--save-metadata");
  }
  if (args.devMode) {
    // command += " --dev";
    cmdArgs.push("--dev");
  }
  if (args.skipGitDeps) {
    // command += " --skip-fetch-latest-git-deps";
    cmdArgs.push("--skip-fetch-latest-git-deps");
  }
  if (args.skipAttributeChecks) {
    // command += " --skip-attribute-checks";
    cmdArgs.push("--skip-attribute-checks");
  }
  if (args.checkTestCode) {
    // command += " --check-test-code";
    cmdArgs.push("--check-test-code");
  }
  if (args.packageDir_compile) {
    // command += ` --package-dir ${args.packageDir_compile}`;
    cmdArgs.push("--package-dir", args.packageDir_compile);
  }
  if (args.outputDir) {
    // command += ` --output-dir ${args.outputDir}`;
    cmdArgs.push("--output-dir", args.outputDir);
  }
  if (args.fetchDepsOnly) {
    // command += " --fetch-deps-only";
    cmdArgs.push("--fetch-deps-only");
  }
  if (args.overrideStd) {
    // command += ` --override-std ${args.overrideStd}`;
    cmdArgs.push("--override-std", args.overrideStd);
  }

  console.log("compile command ai che: ", cmdArgs);
  let output = "";
  // try {
  //   const { stdout, stderr } = await execAsync(command, {
  //     cwd: workspacePath,
  //   });
  //   webview.postMessage({
  //     type: "cliStatus",
  //     success: true,
  //     message: stderr + stdout,
  //   });
  // } catch (error) {
  //   webview.postMessage({
  //     type: "cliStatus",
  //     success: false,
  //     message: (error as Error).message,
  //   });
  // }

  let commandHistory = command + " " + cmdArgs.join(" ");
  try {
    output = await processCLI(command, cmdArgs, workspacePath);
    saveCommandHistory(commandHistory, output);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: output,
    });
  } catch (error) {
    saveCommandHistory(commandHistory, `Error: ${error}\n{${output ? `Output: ${output}` : ""}}`);
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: `${error}\n{${output ? `Output: ${output}` : ""}}`
    });
  }
}

