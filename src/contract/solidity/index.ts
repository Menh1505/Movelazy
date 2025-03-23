import { CompilerService } from './compiler';
import { WorkspaceService } from './workspace';
import { AccountService } from './account';
import * as vscode from 'vscode';
import { CompilerConfig, DeployMessage } from './types';
export class SolidityService {
    private compiler: CompilerService;
    private workspace: WorkspaceService;
    private account: AccountService;

    constructor(context: vscode.ExtensionContext) {
        this.workspace = new WorkspaceService(context);
        this.compiler = new CompilerService();
        this.account = new AccountService(context);
    }

    async compile(webview: vscode.Webview) {
        return this.compiler.compile(webview);
    }

    async initWorkspace() {
        return this.workspace.initializeWorkspace();
    }

    async updateCompilerConfig(settings: CompilerConfig) {
        await this.compiler.updateCompilerConfig(settings);
        await this.workspace.saveSettings(settings);
    }

    /*
    I don't know why I couldn't call this function, it thrown  getCompiledContracts() is not a function.
     */
    // public async getCompiledContracts(): Promise<string[]> {
    //     try {
    //         console.log('SolidityService: Getting compiled contracts');
    //         const contracts = await this.workspace.getCompiledContracts();
    //         console.log('SolidityService: Retrieved contracts:', contracts);
    //         return contracts;
    //     } catch (error) {
    //         console.error('Error getting compiled contracts:', error);
    //         throw error;
    //     }
    // }

    getSettings() {
        return this.workspace.getSettings();
    }

    async checkWorkspace() {
        return this.workspace.isHardhatWorkspace();
    }

    async clean(webview: vscode.Webview) {
        return this.compiler.clean(webview);
    }

    async startLocalNode(webview: vscode.Webview) {
        return this.account.startLocalNode(webview);
    }

    async stopLocalNode() {
        return this.account.stopLocalNode();
    }

    getAccounts() {
        return this.account.getAccounts();
    }
} 