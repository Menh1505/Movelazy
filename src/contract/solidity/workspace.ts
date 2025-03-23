import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { execAsync } from '../../utils/execAsync';
import { CompilerConfig, DefaultConfig } from './types';

export class WorkspaceService {
    private readonly stateKey = 'compiler.settings';

    constructor(private context: vscode.ExtensionContext) { }

    public async saveSettings(settings: CompilerConfig) {
        await this.context.workspaceState.update(this.stateKey, settings);
    }

    public getWorkspacePath(): string {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }
        return workspaceFolders[0].uri.fsPath;
    }


    public getSettings(): DefaultConfig {
        const defaultSettings: DefaultConfig = {
            version: '0.8.20',
            evmVersion: 'london',
            optimizer: {
                enabled: false,
                runs: 200
            },
            metadata: {
                bytecodeHash: 'ipfs'
            },
            viaIR: false,
            debug: {
                debugInfo: ['location', 'snippet']
            },
            networks: {
            },
            namedAccounts: {
                deployer: {
                    default: 0
                }
            }
        };

        return this.context.workspaceState.get(this.stateKey) || defaultSettings;
    }

    public async initializeWorkspace() {
        const workspacePath = this.getWorkspacePath();

        try {
            // Check if npm is installed
            await execAsync('npm --version');

            /*  // Initialize npm if needed
             if (!fs.existsSync(path.join(workspacePath, 'package.json'))) {
                 await execAsync('npm init -y', { cwd: workspacePath });
             }
 
             // Install Hardhat if not installed
             if (!fs.existsSync(path.join(workspacePath, 'node_modules', 'hardhat'))) {
                 await execAsync('npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox hardhat-deploy dotenv typescript ts-node ethers', {
                     cwd: workspacePath
                 });
             }
  */
            // Create tsconfig.json if it doesn't exist
            const tsconfigPath = path.join(workspacePath, 'tsconfig.json');
            if (!fs.existsSync(tsconfigPath)) {
                const tsconfigContent = {
                    compilerOptions: {
                        module: "NodeNext",
                        moduleResolution: "NodeNext",
                        target: "es2020",
                        outDir: "dist",
                        rootDir: "./",
                        strict: true,
                        esModuleInterop: true,
                        forceConsistentCasingInFileNames: true
                    }
                };
                await fs.promises.writeFile(
                    tsconfigPath,
                    JSON.stringify(tsconfigContent, null, 2)
                );
            }
            // Create contracts directory if it doesn't exist
            const contractsDir = path.join(workspacePath, 'contracts');
            if (!fs.existsSync(contractsDir)) {
                await fs.promises.mkdir(contractsDir);
            }

            // Create hardhat.config.ts with default settings
            const hardhatConfigPath = path.join(workspacePath, 'hardhat.config.ts');
            if (!fs.existsSync(hardhatConfigPath)) {
                const defaultSettings = this.getSettings();
                const configContent = `
require("dotenv").config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: false,
                runs: 200
            },
            evmVersion: "london",
            viaIR: false,
            metadata: {
                bytecodeHash: "ipfs"
            }
        }
    },
        paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
};

export default config;
                `;
                await fs.promises.writeFile(hardhatConfigPath, configContent);
            }

            return true;
        } catch (error) {
            throw new Error(`Failed to initialize workspace: ${(error as Error).message}`);
        }
    }

    public async getContractFiles(): Promise<string[]> {
        const workspacePath = this.getWorkspacePath();
        const contractsPath = path.join(workspacePath, 'contracts');

        if (!fs.existsSync(contractsPath)) {
            return [];
        }

        const files = await fs.promises.readdir(contractsPath);
        return files.filter(file => file.endsWith('.sol'));
    }

    public async isHardhatWorkspace(): Promise<boolean> {
        const workspacePath = this.getWorkspacePath();

        try {
            // Check 1: npx hardhat --version
            try {
                // await execAsync('npx hardhat --version', { cwd: workspacePath });
            } catch {
                return false;
            }

            // Check 2: hardhat.config.ts exists
            const configExists = fs.existsSync(path.join(workspacePath, 'hardhat.config.ts'));
            if (!configExists) {
                return false;
            }

            // Check 3: node_modules/hardhat exists
            const nodeModulesExists = fs.existsSync(path.join(workspacePath, 'node_modules', 'hardhat'));
            if (!nodeModulesExists) {
                return false;
            }

            // Check 4: package.json has hardhat dependency
            const packageJsonPath = path.join(workspacePath, 'package.json');
            if (!fs.existsSync(packageJsonPath)) {
                return false;
            }

            const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));
            const hasHardhatDep = !!(packageJson.dependencies?.hardhat || packageJson.devDependencies?.hardhat);

            return hasHardhatDep;
        } catch {
            return false;
        }
    }

    public async getCompiledContracts(): Promise<string[]> {
        const workspacePath = this.getWorkspacePath();
        const artifactsPath = path.join(workspacePath, 'artifacts', 'contracts');
        const contractNames: string[] = [];

        if (!fs.existsSync(artifactsPath)) {
            return [];
        }

        // Read all .sol directories
        const solDirs = await fs.promises.readdir(artifactsPath);

        for (const solDir of solDirs) {
            const solPath = path.join(artifactsPath, solDir);
            const stat = await fs.promises.stat(solPath);

            if (stat.isDirectory()) {
                const files = await fs.promises.readdir(solPath);
                // Filter for .json files that aren't .dbg.json
                const contractFiles = files.filter(f => f.endsWith('.json') && !f.endsWith('.dbg.json'));

                for (const file of contractFiles) {
                    contractNames.push(path.parse(file).name);
                }
            }
        }

        return contractNames;
    }
}
