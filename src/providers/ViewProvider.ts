import * as vscode from "vscode";
import { SolidityService } from "../contract/solidity";
// import { AptosService } from "./contract/aptos";
import { WorkspaceService } from "../contract/aptos/workspace";
import { DeployerService } from "../contract/solidity/deployer";
import {
  CheckAptos,
  CheckAptosInit,
  AptosInit,
  AptosMoveInit,
  AptosInfo,
  MoveTest,
} from "../services/Aptos-Cli";
import { AiCmd } from "../ai/chatbot";
import compile from "../contract/aptos/compile";
import { checkProfile, deploy } from "../contract/aptos/deploy";
import { createFileSystem } from "../lib/filesystem"; // Import FileSystem


export class ViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "MovelazyView";
  private readonly solidityService: SolidityService;
  // private readonly aptosService: SolidityService;
  private static currentWebviewView: vscode.WebviewView | null = null;
  private workspace: WorkspaceService;
  private deployerService: DeployerService;
  private currentPath: string = "/";

  constructor(private readonly context: vscode.ExtensionContext) {
    this.workspace = new WorkspaceService(context);
    this.solidityService = new SolidityService(context);
    // this.aptosService = new AptosService(context);
    this.deployerService = new DeployerService();
  }

  public static getWebviewView(): vscode.WebviewView | null {
    return ViewProvider.currentWebviewView;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    ViewProvider.currentWebviewView = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "webview", "build"),
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.command) {
          case "solidity.compile":
            await this.solidityService.updateCompilerConfig(message.settings);
            await this.solidityService.compile(webviewView.webview);
            break;
          case "solidity.deploy":
            console.log("handling deploy");
            try {
              const result = await this.deployerService.deploy(
                message.settings
              );
              webviewView.webview.postMessage({
                type: "deploySuccess",
                result: result,
              });
            } catch (error) {
              webviewView.webview.postMessage({
                type: "error",
                message: (error as Error).message,
              });
            }
            break;
          case "solidity.getSettings":
            const settings = this.solidityService.getSettings();
            webviewView.webview.postMessage({
              type: "settings",
              settings,
            });
            break;
          case "solidity.initWorkspace":
            webviewView.webview.postMessage({
              type: "cliStatus",
              loading: true,
            });
            try {
              await this.solidityService.initWorkspace();
              webviewView.webview.postMessage({
                type: "cliStatus",
                initialized: true,
                loading: false,
              });
            } catch (error) {
              webviewView.webview.postMessage({
                type: "cliStatus",
                error: (error as Error).message,
                loading: false,
              });
            }
            break;
          case "solidity.checkWorkspace":
            const isHardhatWorkspace =
              await this.solidityService.checkWorkspace();
            webviewView.webview.postMessage({
              type: "cliStatus",
              initialized: isHardhatWorkspace,
              loading: false,
            });
            break;
          case "solidity.clean":
            await this.solidityService.clean(webviewView.webview);
            break;
          case "solidity.startLocalNode":
            await this.solidityService.startLocalNode(webviewView.webview);
            break;
          case "solidity.stopLocalNode":
            await this.solidityService.stopLocalNode();
            break;
          case "getFiles": {
            const fileSystem = createFileSystem(this.context.extensionUri);
            const allFiles = fileSystem.getAllFiles();
            webviewView.webview.postMessage({
              type: "cliStatus",
              files: allFiles,
            });
            break;
          }
          // case "openMarkdown":
          //   {
          //     if (vscode.workspace.workspaceFolders && message.path) {
          //       const workspacePath =
          //         vscode.workspace.workspaceFolders[0].uri.fsPath;
          //       const fileUri = vscode.Uri.file(
          //         path.join(workspacePath, message.pathfile)
          //       );
          //       vscode.workspace.openTextDocument(fileUri).then((doc) => {
          //         vscode.window.showTextDocument(doc);
          //       });
          //     }
          //   }
          //   break;
          case "aptos.check":
            const isAptosInstalled = await CheckAptos();
            webviewView.webview.postMessage({
              type: "cliStatus",
              installed: isAptosInstalled,
            });
            break;
          case "aptos.info":
            await AptosInfo(webviewView.webview);
            break;
          case "aptos.checkInit":
            const isAptosInitialized = await CheckAptosInit();
            webviewView.webview.postMessage({
              type: "cliStatus",
              initialized: isAptosInitialized,
            });
            break;
          case "aptos.init":
            const [network, endpoint, faucetEndpoint, privateKey] =
              message.initConfig;
            await AptosInit(
              webviewView.webview,
              network,
              endpoint,
              faucetEndpoint,
              privateKey
            );
            break;
          case "aptos.moveinit":
            const [
              name,
              packageDir,
              namedAddresses,
              template,
              assumeYes,
              assumeNo,
              frameworkGitRev,
              frameworkLocalDir,
              skipFetchLatestGitDeps,
            ] = message.initArgs;
            await AptosMoveInit(
              webviewView.webview,
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
            break;
          case "aptos.compile":
            await compile(webviewView.webview, message.compileArgs);
            break;
          case "aptos.deploy":
            await deploy(webviewView.webview, message.deployArgs);
            break;
          case "aptos.checkProfile":
            await checkProfile(webviewView.webview);
            break;
          case "aptos.movetest":
            await MoveTest(webviewView.webview, message.testArgs);
            break;
          case "aptos.checkFolder":
            await this.workspace.checkFolder(webviewView.webview);
            break;
          case "aptos.selectFolder":
            await this.workspace.selectFolder(webviewView.webview);
            break;
          case "ai-command":
            AiCmd();
            break;
          case "updatePath":
            if (message.path !== "/") {
              this.currentPath = message.path;
              // console.log("Changed path to: ", this.currentPath);
            } else {
              webviewView.webview.postMessage({
                type: "pathChanged",
                path: this.currentPath,
              });
            }

            break;
        }
      } catch (error) {
        webviewView.webview.postMessage({
          type: "error",
          message: (error as Error).message,
        });
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "webview",
        "build",
        "assets",
        "index.js"
      )
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "webview",
        "build",
        "assets",
        "style.css"
      )
    );

    // const monacoPath = vscode.Uri.joinPath(
    //   this.context.extensionUri,
    //   "media",
    //   "monaco",
    //   "min",
    //   "vs"
    // );
    // const monacoUri = webview.asWebviewUri(monacoPath);

    // console.log("Monaco URI:", monacoUri.toString());

    // Thêm container để hiển thị danh sách markdown
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="
    default-src 'none'; 
    img-src ${webview.cspSource} https: data:; 
    script-src ${webview.cspSource} 'unsafe-inline'; 
    style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; 
    font-src ${webview.cspSource} https://fonts.gstatic.com; 
    connect-src ${webview.cspSource} https://fullnode.devnet.aptoslabs.com;">
      <title>MoveLazy</title>
      <link href="${styleUri}" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
  </head>
  <body>
      <div id="root"></div>
      <script>
          (function() {
              try {
                  const vscode = acquireVsCodeApi();
                  window.vscode = vscode;
                  console.log('VSCode API initialized successfully');
              } catch (error) {
                  console.error('Failed to initialize VSCode API:', error);
              }
          })();
      </script>
     
      <script type="module" src="${scriptUri}"></script>
  </body>
  </html>`;
  }
}
