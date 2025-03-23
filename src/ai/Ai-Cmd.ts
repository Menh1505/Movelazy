import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import SplitCmd from "../utils/SplitCmd";
import * as aptosCli from "../services/Aptos-Cli";
import { ViewProvider } from "../providers/ViewProvider";
import { CompileArgs, DeployArgs, TestArgs } from "../contract/aptos/types";
import compile from "../contract/aptos/compile";
import { deploy } from "../contract/aptos/deploy";
import { getWorkSpacePath } from "../utils/path";

export function GetCmd(): string {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    throw new Error("Workspace path not found");
  }

  const filePath = path.join(workspacePath, "chat_with_ai.md");
  let result: string = "";
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    result = fileContent;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }
  return result;
}

function ProcInit(
  webview: vscode.Webview,
  args: { [key: string]: string } | null
) {
  //network: string, endpoint: string, faucetEndpoint: string, privateKey: string
  let network = "",
    endpoint = "",
    faucetEndpoint = "",
    privateKey = "";
  if (args) {
    network = args.network || "";
    endpoint = args.endpoint || "";
    faucetEndpoint = args.faucetEndpoint || "";
    privateKey = args.privateKey || "";
  }
  aptosCli.AptosInit(webview, network, endpoint, faucetEndpoint, privateKey);
}

function ProcMoveInit(
  webview: vscode.Webview,
  args: { [key: string]: string } | null
) {
  //name: string, packageDir: string, namedAddresses: string, template: string, assumeYes: boolean, assumeNo: boolean, frameworkGitRev: string, frameworkLocalDir: string, skipFetchLatestGitDeps: boolean
  let name = "",
    packageDir = "",
    namedAddresses = "",
    template = "",
    assumeYes = false,
    assumeNo = false,
    frameworkGitRev = "",
    frameworkLocalDir = "",
    skipFetchLatestGitDeps = false;
  if (args) {
    name = args.name || "";
    packageDir = args.packageDir || "";
    namedAddresses = args.namedAddresses || "";
    template = args.template || "";
    assumeYes = Boolean(args.assumeYes) || false;
    assumeNo = Boolean(args.assumeNo) || false;
    frameworkGitRev = args.frameworkGitRev || "";
    frameworkLocalDir = args.frameworkLocalDir || "";
    skipFetchLatestGitDeps = Boolean(args.skipFetchLatestGitDeps) || false;
  }
  aptosCli.AptosMoveInit(
    webview,
    name,
    packageDir,
    namedAddresses,
    template,
    assumeYes,
    assumeNo,
    frameworkGitRev,
    frameworkLocalDir,
    skipFetchLatestGitDeps
  );
}

function ProcMoveTest(
  webview: vscode.Webview,
  args: { [key: string]: string } | null
) {
  let testArgs: TestArgs = {
    namedAddresses: "",
    filter: "",
    ignoreCompileWarnings: false,
    packageDir: "",
    outputDir: "",
    overrideStd: "",
    skipFetchLatestGitDeps: false,
    skipAttributeChecks: false,
    dev: false,
    checkTestCode: false,
    optimize: "",
    bytecodeVersion: "",
    compilerVersion: "",
    languageVersion: "",
    moveVersion: "",
    instructions: "",
    coverage: false,
    dump: false,
  };

  if (args) {
    testArgs.namedAddresses = args.namedAddresses || "";
    testArgs.filter = args.filter || "";
    testArgs.ignoreCompileWarnings =
      Boolean(args.ignoreCompileWarnings) || false;
    testArgs.packageDir = args.packageDir || "";
    testArgs.outputDir = args.outputDir || "";
    testArgs.overrideStd = args.overrideStd || "";
    testArgs.skipFetchLatestGitDeps =
      Boolean(args.skipFetchLatestGitDeps) || false;
    testArgs.skipAttributeChecks = Boolean(args.skipAttributeChecks) || false;
    testArgs.dev = Boolean(args.dev) || false;
    testArgs.checkTestCode = Boolean(args.checkTestCode) || false;
    testArgs.optimize = args.optimize || "";
    testArgs.bytecodeVersion = args.bytecodeVersion || "";
    testArgs.compilerVersion = args.compilerVersion || "";
    testArgs.languageVersion = args.languageVersion || "";
    testArgs.moveVersion = args.moveVersion || "";
    testArgs.instructions = args.instructions || "";
    testArgs.coverage = Boolean(args.coverage) || false;
    testArgs.dump = Boolean(args.dump) || false;
  }

  aptosCli.MoveTest(webview, testArgs);
}

function ProcCompile(
  webview: vscode.Webview,
  args: { [key: string]: string } | null
) {
  /*webview: vscode.Webview,
        saveMetadata: boolean,
        fetchDepsOnly: boolean,
        artifacts: "none" | "sparse" | "all",
        packageDir_compile: string,
        outputDir: string,
        namedAddresses_compile: string,
        overrideStd: string | null,
        devMode: boolean,
        skipGitDeps: boolean,
        skipAttributeChecks: boolean,
        checkTestCode: boolean,
        optimization: "none" | "default" | "extra" */

  let saveMetadata = false,
    fetchDepsOnly = false,
    devMode = false,
    skipGitDeps = false,
    skipAttributeChecks = false,
    checkTestCode = false;
  let artifacts: "none" | "sparse" | "all" | "" = "";
  let optimization: "none" | "default" | "extra" | "" = "";
  let packageDir_compile = "",
    outputDir = "",
    named_addresses = "",
    overrideStd: string | null = null;

  const compileArgs: CompileArgs = {
    saveMetadata: Boolean(args?.saveMetadata) || false,
    fetchDepsOnly: Boolean(args?.fetchDepsOnly) || false,
    artifacts: args?.artifacts as "none" | "sparse" | "all" | "",
    packageDir_compile: args?.packageDir_compile || "",
    outputDir: args?.outputDir || "",
    named_addresses: args?.named_addresses || "",
    overrideStd: args?.overrideStd || null,
    devMode: Boolean(args?.devMode) || false,
    skipGitDeps: Boolean(args?.skipGitDeps) || false,
    skipAttributeChecks: Boolean(args?.skipAttributeChecks) || false,
    checkTestCode: Boolean(args?.checkTestCode) || false,
    optimization: args?.optimization as "none" | "default" | "extra" | "",
  };

  compile(webview, compileArgs);
}

export function ProcCmdCase(ai_out: string) {
  const webviewView = ViewProvider.getWebviewView();
  const fmtCmd = SplitCmd(ai_out);
  console.log("fmtCmd: ", fmtCmd);
  if (webviewView === undefined) {
    throw new Error("Webview view not found");
  }

  if (webviewView) {
    const cmd = fmtCmd.cmd;
    console.log("Cmd: ", fmtCmd.cmd);
    try {
      switch (cmd) {
        case "aptos.init":
          ProcInit(webviewView.webview, fmtCmd.args);
          break;
        case "aptos.moveinit":
          ProcMoveInit(webviewView.webview, fmtCmd.args);
          break;
        case "aptos.movetest":
          ProcMoveTest(webviewView.webview, fmtCmd.args);
          break;
        case "aptos.compile":
          ProcCompile(webviewView.webview, fmtCmd.args);
          break;
        case "aptos.deploy":
          ProcDeploy(webviewView.webview, fmtCmd.args);
          break;
        default:
          console.log("Command not found");
          throw new Error("Command not found in switch case with cmd: " + cmd);
      }
    } catch (error) {
      webviewView.webview.postMessage({
        type: "cliStatus",
        success: false,
        message: (error as Error).message,
      });
    }
  } else {
    throw new Error("Webview view is null");
  }
}

function ProcDeploy(
  webview: vscode.Webview,
  args: { [key: string]: string } | null
) {
  console.log("ProcDeploy: ", args);
  let overrideSizeCheck = false,
    chunkedPublish = false,
    skipGitDeps_deploy = false,
    skipAttributeChecks_deploy = false,
    checkTestCode_deploy = false,
    assume_yes = false,
    assume_no = false,
    local = false,
    benmark = false;
  let largePackagesModuleAddress = "",
    chunkSize = "",
    includedArtifacts = "",
    packageDir_deploy = "",
    outputDir_deploy = "",
    named_addresses = "",
    overrideStd_deploy = "",
    optimize = "",
    bytecodeVersion = "",
    compilerVersion = "",
    languageVersion = "",
    senderAccount = "",
    privateKey_deploy = "",
    encoding = "",
    gasUnitPrice = "",
    maxGas = "",
    expirationSecs = "";

  const deployArgs: DeployArgs = {
    overrideSizeCheck: Boolean(args?.overrideSizeCheck) || false,
    chunkedPublish: Boolean(args?.chunkedPublish) || false,
    largePackagesModuleAddress: args?.largePackagesModuleAddress || "",
    chunkSize: args?.chunkSize || "",
    includedArtifacts: args?.includedArtifacts || "",
    packageDir_deploy: args?.packageDir_deploy || "",
    outputDir_deploy: args?.outputDir_deploy || "",
    named_addresses: args?.named_addresses || "",
    overrideStd_deploy: args?.overrideStd_deploy || "",
    skipGitDeps_deploy: Boolean(args?.skipGitDeps_deploy) || false,
    skipAttributeChecks_deploy: Boolean(args?.skipAttributeChecks_deploy) || false,
    checkTestCode_deploy: Boolean(args?.checkTestCode_deploy) || false,
    optimize: args?.optimize || "",
    bytecodeVersion: args?.bytecodeVersion || "",
    compilerVersion: args?.compilerVersion || "",
    languageVersion: args?.languageVersion || "",
    senderAccount: args?.senderAccount || "",
    privateKey_deploy: args?.privateKey_deploy || "",
    encoding: args?.encoding || "",
    gasUnitPrice: args?.gasUnitPrice || "",
    maxGas: args?.maxGas || "",
    expirationSecs: args?.expirationSecs || "",
    assume_yes: Boolean(args?.assume_yes) || false,
    assume_no: Boolean(args?.assume_no) || false,
    local: Boolean(args?.local) || false,
    benmark: Boolean(args?.benmark) || false,
  };

  deploy(
    webview,
    deployArgs
  );
}
