import * as vscode from 'vscode';
import { ChildProcess, spawn } from 'child_process';
import { WorkspaceService } from './workspace';

interface HardhatAccount {
    address: string;
    balance: string;
    privateKey: string;
}

export class AccountService {
    private hardhatNode: ChildProcess | null = null;
    private accounts: HardhatAccount[] = [];

    constructor(private context: vscode.ExtensionContext) {
        // Load saved accounts on initialization
        this.accounts = this.context.workspaceState.get('hardhat.accounts', []);
    }

    private async saveAccounts(accounts: HardhatAccount[]) {
        this.accounts = accounts;
        await this.context.workspaceState.update('hardhat.accounts', accounts);
    }

    getAccounts(): HardhatAccount[] {
        return this.accounts;
    }

    async startLocalNode(webview: vscode.Webview) {
        if (this.accounts.length > 0) {
            webview.postMessage({
                type: 'accounts',
                accounts: this.accounts
            });
            return;
        }

        const workspacePath = new WorkspaceService(this.context).getWorkspacePath();
        console.log('Starting local node at:', workspacePath);
        
        try {
            if (this.hardhatNode) {
                console.log('Hardhat node already running');
                return;
            }

            this.hardhatNode = spawn('npx', ['hardhat', 'node'], { 
                cwd: workspacePath,
                shell: true 
            });

            let buffer = '';
            this.hardhatNode.stdout?.on('data', async (data: Buffer) => {
                buffer += data.toString();
                if (buffer.includes('WARNING: These accounts, and their private keys, are publicly known.') && 
                    buffer.includes('Account #19:')) {
                    const accounts = this.parseAccounts(buffer);
                    if (accounts.length === 20) {
                        await this.saveAccounts(accounts);
                        webview.postMessage({
                            type: 'accounts',
                            accounts: this.accounts
                        });
                    }
                }
            });
        } catch (error) {
            webview.postMessage({
                type: 'error',
                message: (error as Error).message
            });
        }
    }

    private parseAccounts(output: string): HardhatAccount[] {
        const accounts: HardhatAccount[] = [];
        const lines = output.split('\n');
        let currentAccount: Partial<HardhatAccount> = {};
        
        for (const line of lines) {
            if (line.includes('Account #')) {
                const addressMatch = line.match(/0x[a-fA-F0-9]{40}/);
                const balanceMatch = line.match(/\((\d+) ETH\)/);
                if (addressMatch) {
                    currentAccount.address = addressMatch[0];
                    currentAccount.balance = balanceMatch ? balanceMatch[1] : '10000';
                }
            } else if (line.includes('Private Key:')) {
                const privateKeyMatch = line.match(/0x[a-fA-F0-9]{64}/);
                if (privateKeyMatch && currentAccount.address) {
                    currentAccount.privateKey = privateKeyMatch[0];
                    accounts.push(currentAccount as HardhatAccount);
                    currentAccount = {};
                }
            }
        }
        
        return accounts;
    }

    async stopLocalNode() {
        if (this.hardhatNode) {
            this.hardhatNode.kill();
            this.hardhatNode = null;
        }
    }
}
