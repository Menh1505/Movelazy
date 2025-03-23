import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { execAsync } from "../../utils/execAsync";

export class WorkspaceService {
  private readonly stateKey = "compiler.settings";

  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Check folder status
   */
  async checkFolder(webview: vscode.Webview): Promise<void> {
    const hasFolder =
      vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders.length > 0;

    console.log("check hasFolder", hasFolder);

    webview.postMessage({
      type: "folderStatus",
      hasFolder,
    });
  }

  // Select folder
  async selectFolder(webview: vscode.Webview): Promise<void> {
    try {
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        title: "Select Project Folder",
      });

      if (folderUri && folderUri[0]) {
        await vscode.commands.executeCommand("vscode.openFolder", folderUri[0]);
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
    }
  }

  // public createPublicContentFolder(workspacePath: string) {
  //   const contentPath = path.join(workspacePath, "public", "content");
  //   const filePath = path.join(contentPath, "file.md"); // Or 'file.mmd'

  //   // Check and create the directory if it doesn't exist
  //   if (!fs.existsSync(contentPath)) {
  //     fs.mkdirSync(contentPath, { recursive: true });
  //     console.log(`Created directory: ${contentPath}`);
  //   }

  //   // Check and create the file if it doesn't exist
  //   if (!fs.existsSync(filePath)) {
  //     const content = `# This is a Markdown file\n\nContent created automatically.`;
  //     fs.writeFileSync(filePath, content);
  //     console.log(`Created file: ${filePath}`);
  //   }
  // }

  /**
   * Create template project
   */
  // async createTemplate(webview: vscode.Webview): Promise<void> {
  //   try {
  //     const workspacePath = this.getWorkspacePath();
  //     if (!workspacePath) {
  //       throw new Error("No workspace folder found");
  //     }

  //     // Create project from template
  //     await execAsync(
  //       "aptos move init --name hello_blockchain --template hello-blockchain",
  //       { cwd: workspacePath }
  //     );

  //     webview.postMessage({
  //       type: "cliStatus",
  //       initialized: true,
  //     });
  //   } catch (error) {
  //     webview.postMessage({
  //       type: "cliStatus",
  //       initialized: false,
  //       error: (error as Error).message,
  //     });
  //   }
  // }

  /**
   * Save settings
   */
  // public async saveSettings(settings: any) {
  //   console.log("Saving settings:", settings);
  //   await this.context.workspaceState.update(this.stateKey, settings);
  // }

  /**
   * Get settings
   */
  // public getSettings(): any {
  //   const settings = this.context.workspaceState.get(this.stateKey, {
  //     optimizer: {
  //       enabled: false,
  //       level: "default",
  //     },
  //     metadata: {
  //       bytecodeHash: "6",
  //     },
  //     packageDir: "",
  //     namedAddresses: "",
  //     network: "https://api.testnet.aptoslabs.com/v1",
  //   });

  //   console.log("Retrieved settings:", settings);
  //   return settings;
  // }

  //   private getWorkspacePath(): string | undefined {
  //     return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  //   }
}
