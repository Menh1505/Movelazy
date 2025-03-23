import { exec, spawn } from "child_process";
import * as vscode from "vscode";
import { promisify } from "util";
import { TestArgs } from "../contract/aptos/types";
import path from "path";
import * as fs from "fs";
import { getWorkSpacePath } from "../utils/path";
import { saveCommandHistory } from "./cmd-history";
import { coin_example, nft_example, prover_example, todo_example } from "./example-contract";

const execAsync = promisify(exec);

async function CheckAptos(): Promise<Boolean> {
  try {
    // Run command "aptos --version"
    const { stdout } = await execAsync("aptos --version");

    // If has output, Aptos has been installed
    if (stdout.trim().length > 0) {
      return true;
    }

    // Other case, Aptos has not been installed
    return false;
  } catch (error) {
    return false;
  }
}

async function CheckAptosInit(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // Get workspace path
    const historyOutput = "";
    const workspacePath = getWorkSpacePath();
    if (!workspacePath) {
      resolve(false);
      return;
    }

    const aptosProcess = spawn("aptos", ["init"], {
      cwd: workspacePath, // Set current working directory
      stdio: ["pipe", "pipe", "pipe"], // Connect stdin, stdout, stderr
    });


    // Listen output (stdout) from process
    aptosProcess.stdout.on("data", (data) => {
      const output = data.toString();

      // Check notify "Aptos already initialized for profile default"
      if (output.includes("Aptos already initialized for profile default")) {
        aptosProcess.kill(); // terminate process
        resolve(true); // Return true
      }

      // If have other input request, return false
      if (output.includes("Please choose a network")) {
        aptosProcess.kill(); // terminate process
        resolve(false); // Return false
      }
    });

    // Listen error (stderr)
    aptosProcess.stderr.on("data", (data) => {
      console.error("Error:", data.toString());
      aptosProcess.kill(); // Terminate process when error
      resolve(false); // Return false when error
    });

    // Listen when process end
    aptosProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`Aptos process failed with exit code ${code}`);
        resolve(false); // Return false when process failed
      }
    });
  });
}

async function deleteAptosFolder() {
  const workspacePath = getWorkSpacePath();

  if (!workspacePath) {
    vscode.window.showErrorMessage("Workspace path not found.");
    return;
  }

  const aptosFolderPath = path.join(workspacePath, ".aptos");

  try {
    // Kiểm tra xem thư mục .aptos có tồn tại không
    if (fs.existsSync(aptosFolderPath)) {
      // Xóa thư mục .aptos nếu tồn tại
      await fs.promises.rm(aptosFolderPath, { recursive: true, force: true });
    }
    saveCommandHistory("Remove .aptos folder", "Success");
  } catch (error) {
    saveCommandHistory("Remove folder .aptos", "Failed to remove .aptos folder: " + error);
    throw new Error("Failed to delete .aptos folder: " + error);
  }
}

async function AptosInit(
  webview: vscode.Webview,
  network: string = "devnet",
  endpoint: string,
  faucetEndpoint: string,
  privateKey: string
) {
  // Get workspace path
  let cmdHistory = "Aptos init ";
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    saveCommandHistory("Aptos init", "Error: Workspace path not found");
    throw new Error("Workspace path not found");
  }

  const isAptosInit = await CheckAptosInit();
  if (isAptosInit) {
    await deleteAptosFolder();
  }

  function customNetwork(
    network: string,
    endpoint: string,
    faucetEndpoint: string,
    privateKey: string
  ) {
    console.log("Initializing Aptos CLI...");
    const aptosProcess = spawn("aptos", ["init"], {
      cwd: workspacePath,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputData = "";
    aptosProcess.stderr.on("data", (data) => {
      const output = data.toString();

      if (output.includes("Choose network")) {
        cmdHistory += network + " ";
        aptosProcess.stdin.write(`${network}\n`);
      }

      if (output.includes("Enter your rest endpoint")) {
        cmdHistory += endpoint + " ";
        aptosProcess.stdin.write(`${endpoint || ""}\n`);
      }

      if (output.includes("Enter your faucet endpoint")) {
        cmdHistory += faucetEndpoint + " ";
        aptosProcess.stdin.write(`${faucetEndpoint || ""}\n`);
      }

      if (output.includes("Enter your private key as a hex literal")) {
        cmdHistory += privateKey + " ";
        aptosProcess.stdin.write(`${privateKey || ""}\n`);
      }

      if (output.includes("creating it and funding it")) {
        console.log("Creating and funding account...");
        aptosProcess.stdin.write(`\n`);
      }

      if (output.includes("account") || output.includes("Account")) {
        outputData += output;
      }
    });

    aptosProcess.on("close", (code) => {
      if (code === 0) {
        webview.postMessage({
          type: "cliStatus",
          success: true,
          message: outputData,
        });
      } else {
        saveCommandHistory("Apots init", "Aptos initialization failed with exit code " + code);
        webview.postMessage({
          type: "cliStatus",
          success: false,
          message: `Aptos initialization failed with exit code ${code}`,
        });
      }
    });
    saveCommandHistory("Apots init", outputData);
  }

  function notCustomNetwork(network: string, privateKey: string) {
    let isDevnet = network === "devnet";

    const aptosProcess = spawn("aptos", ["init"], {
      cwd: workspacePath,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputData = "";

    aptosProcess.stderr.on("data", (data) => {
      const output = data.toString();
      console.log("CLI Output:", output);

      if (output.includes("already initialized")) {
        console.log("Aptos already initialized, confirming overwrite...");
        aptosProcess.stdin.write("yes\n");
      } else if (output.includes("Choose network")) {
        cmdHistory += network + " ";
        aptosProcess.stdin.write(`${network}\n`);
      } else if (output.includes("Enter your private key as a hex literal")) {
        cmdHistory += privateKey + " ";
        aptosProcess.stdin.write(`${privateKey || ""}\n`);
      } else if (output.includes("The account has not been created on chain yet")) {
        if (network === "testnet") {
          saveCommandHistory(cmdHistory, `Success initialized with network ${network}\n` + output);
          webview.postMessage({
            type: "cliStatus",
            success: true,
            message: "Success initialized with network " + network + output,
          });
        } else if (network === "mainnet") {
          saveCommandHistory(cmdHistory, "Success initialized with network " + network);
          webview.postMessage({
            type: "cliStatus",
            success: true,
            message: "Success initialized with network " + network,
          });
        }
        aptosProcess.kill();
      } else {
        aptosProcess.stdin.write("\n");
        webview.postMessage({
          type: "cliStatus",
          success: true,
          message: outputData.trim(),
        });
      }

      if (output.match(/Account\s0x[a-fA-F0-9]+/)) {
        outputData += output;
      }
    });

    if (isDevnet) {
      aptosProcess.on("close", (code) => {
        if (code === 0) {
          saveCommandHistory(cmdHistory, `Success initialized with network devnet\n${outputData}`);
          webview.postMessage({
            type: "cliStatus",
            success: true,
            message: outputData.trim(),
          });
        } else {
          saveCommandHistory(cmdHistory, "Aptos initialization failed with exit code " + code);
          webview.postMessage({
            type: "cliStatus",
            success: false,
            message: `Aptos initialization failed with exit code ${code}`,
          });
        }
      });
    }
  }

  if (network === "custom") {
    customNetwork(network, endpoint, faucetEndpoint, privateKey);
  } else {
    notCustomNetwork(network, privateKey);
  }
}

async function AptosInfo(webview: vscode.Webview) {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    saveCommandHistory("Aptos info", "Error: Workspace path not found");
    throw new Error("Workspace path not found");
  }

  try {
    const { stdout, stderr } = await execAsync("aptos info", {
      cwd: workspacePath,
    });
    saveCommandHistory("Aptos info", stdout + stderr);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: stderr + stdout,
    });
  } catch (error) {
    saveCommandHistory("Aptos info", (error as Error).message);
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: (error as Error).message,
    });
  }
}

async function cleanProjectFiles(workspacePath: string) {
  const dirsToClean = ["sources", "scripts", "tests"];
  const filesToClean = [".gitignore", "Move.toml"];

  try {
    // Clean directories
    for (const dir of dirsToClean) {
      const dirPath = path.join(workspacePath, dir);
      if (fs.existsSync(dirPath)) {
        await fs.promises.rm(dirPath, { recursive: true, force: true });
      }
    }

    // Clean files
    for (const file of filesToClean) {
      const filePath = path.join(workspacePath, file);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (error) {
    throw new Error(`Failed to clean project files: ${error}`);
  }
}

async function AptosMoveInit(
  webview: vscode.Webview,
  name: string,
  packageDir: string,
  namedAddresses: string,
  template: string,
  assumeYes: boolean,
  assumeNo: boolean,
  frameworkGitRev: string,
  frameworkLocalDir: string,
  skipFetchLatestGitDeps: boolean
) {
  if (!name || name.trim() === "") {
    saveCommandHistory("Aptos move init", "Error: Project name is required");
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: "Error: Project name is required",
    });
    return;
  }
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    saveCommandHistory("Aptos move init", "Error: Workspace path not found");
    throw new Error("Workspace path not found");
  }

  const sourcesPath = path.join(workspacePath, "sources");
  if (fs.existsSync(sourcesPath)) {
    try {
      const files = await fs.promises.readdir(sourcesPath);
      if (files.length > 0) {
        // Send confirmation request to webview
        saveCommandHistory("Aptos move init", "Sources directory already contains files. Delete to continue init?");
        webview.postMessage({
          type: "cliStatus",
          success: false,
          message:
            "Sources directory already contains files. Delete to continue init?",
        });
        return; // Wait for user response before proceeding
      }
    } catch (error) {
      throw new Error("Failed to read sources directory: " + error);
    }
  }

  await cleanProjectFiles(workspacePath);

  let command = "aptos move init";
  if (name) {
    command += " --name " + name;
  }
  if (packageDir !== "") {
    command += " --package-dir " + packageDir;
  }
  if (namedAddresses !== "") {
    command += " --named-addresses " + namedAddresses;
  }
  if (
    template === "NFT_Marketplace" ||
    template === "moon_coin" ||
    template === "ToDo_list" ||
    template === "hello_prover" ||
    template === "hello-blockchain"
  ) {
    command += " --template hello-blockchain";
  }

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: workspacePath });
    saveCommandHistory("Aptos move init", stdout + stderr + `\nTemplate: ${template}`);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: stderr + stdout,
    });

    const sourcePath = path.join(workspacePath, "sources");
    const oldFile = path.join(sourcePath, "hello_blockchain.move");
    const moveTomlPath = path.join(workspacePath, "Move.toml");

    if (template === "moon_coin") {
      const newFile = path.join(sourcePath, "Coin.move");
      await fs.promises.rename(oldFile, newFile);

      //Get Coin example contract content
      const coinContent = coin_example(name);

      await fs.promises.writeFile(newFile, coinContent.trim());

      const moveTomlContent = await fs.promises.readFile(moveTomlPath, "utf8");
      await fs.promises.writeFile(
        moveTomlPath,
        moveTomlContent.replace(/hello_blockchain/g, name)
      );
    } else if (template === "NFT_Marketplace") {
      const newFile = path.join(sourcePath, "Marketplace_NFT.move");
      await fs.promises.rename(oldFile, newFile);

      //Get NFT example contract content
      const nftContent = nft_example(name);

      await fs.promises.writeFile(newFile, nftContent);

      const moveTomlContent = await fs.promises.readFile(moveTomlPath, "utf8");
      await fs.promises.writeFile(
        moveTomlPath,
        moveTomlContent.replace(/hello_blockchain/g, name)
      );
    } else if (template === "ToDo_list") {
      const newFile = path.join(sourcePath, "AdvancedTodoList.move");
      await fs.promises.rename(oldFile, newFile);

      //Get Todo example contract content
      const todoContent = todo_example(name); // Your Todo list content here
      await fs.promises.writeFile(newFile, todoContent);

      const moveTomlContent = await fs.promises.readFile(moveTomlPath, "utf8");
      await fs.promises.writeFile(
        moveTomlPath,
        moveTomlContent.replace(/hello_blockchain/g, name)
      );
    } else if (template === "hello_prover") {
      const newFile = path.join(sourcePath, "HelloProver.move");
      await fs.promises.rename(oldFile, newFile);

      //Get Prover example contract content
      const proverContent = prover_example(name); // Your Prover content here
      await fs.promises.writeFile(newFile, proverContent.trim());

      const moveTomlContent = await fs.promises.readFile(moveTomlPath, "utf8");
      await fs.promises.writeFile(
        moveTomlPath,
        moveTomlContent.replace(/hello_blockchain/g, name)
      );
    }
  } catch (error) {
    saveCommandHistory("Aptos move init", "Failed to execute template commands: " + error);
    throw new Error("Failed to execute template commands: " + error);
  }

  if (assumeYes) {
    command += " --assume-yes";
  }
  if (assumeNo) {
    command += " --assume-no";
  }
  if (frameworkGitRev !== "") {
    command += " --framework-git-rev " + frameworkGitRev;
  }
  if (frameworkLocalDir !== "") {
    command += " --framework-local-dir " + frameworkLocalDir;
  }
  if (skipFetchLatestGitDeps) {
    command += " --skip-fetch-latest-git-deps";
  }

  try {
    const { stdout, stderr } = await execAsync(command, { cwd: workspacePath });
    saveCommandHistory("Aptos move init", stdout + stderr);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: stderr + stdout,
    });
  } catch (error) {
    saveCommandHistory("Aptos move init", (error as Error).message);
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: (error as Error).message,
    });
  }
}

async function MoveTest(webview: vscode.Webview, args: TestArgs) {
  const workspacePath = getWorkSpacePath();
  if (!workspacePath) {
    saveCommandHistory("Aptos move test", "Error: Workspace path not found");
    throw new Error("Workspace path not found");
  }

  let command = "aptos move test";
  if (args.namedAddresses !== "") {
    command += " --named-addresses " + args.namedAddresses + "=default";
  }
  if (args.filter !== "") {
    command += " --filter " + args.filter;
  }
  if (args.ignoreCompileWarnings) {
    command += " --ignore-compile-warnings";
  }
  if (args.packageDir !== "") {
    command += " --package-dir " + args.packageDir;
  }
  if (args.outputDir !== "") {
    command += " --output-dir " + args.outputDir;
  }
  if (args.overrideStd !== "") {
    command += " --override-std " + args.overrideStd;
  }
  if (args.skipFetchLatestGitDeps) {
    command += " --skip-fetch-latest-git-deps";
  }
  if (args.skipAttributeChecks) {
    command += " --skip-attribute-checks";
  }
  if (args.dev) {
    command += " --dev";
  }
  if (args.checkTestCode) {
    command += " --check-test-code";
  }
  if (args.optimize !== "") {
    command += " --optimize " + args.optimize;
  }
  if (args.bytecodeVersion !== "") {
    command += " --bytecode-version " + args.bytecodeVersion;
  }
  if (args.compilerVersion !== "") {
    command += " --compiler-version " + args.compilerVersion;
  }
  if (args.languageVersion !== "") {
    command += " --language-version " + args.languageVersion;
  }
  if (args.moveVersion !== "") {
    command += " --move-version " + args.moveVersion;
  }
  if (args.instructions !== "") {
    command += " --instructions " + args.instructions;
  }
  if (args.coverage) {
    command += " --coverage";
  }
  if (args.dump) {
    command += " --dump";
  }

  try {
    const { stdout } = await execAsync(command, { cwd: workspacePath });
    saveCommandHistory("Aptos move test", stdout);
    webview.postMessage({
      type: "cliStatus",
      success: true,
      message: stdout,
    });
  } catch (error) {
    saveCommandHistory("Aptos move test", `Error: ${(error as Error).message}`);
    webview.postMessage({
      type: "cliStatus",
      success: false,
      message: (error as Error).message,
    });
  }
}

export {
  CheckAptos,
  CheckAptosInit,
  AptosInit,
  AptosMoveInit,
  AptosInfo,
  MoveTest,
};
