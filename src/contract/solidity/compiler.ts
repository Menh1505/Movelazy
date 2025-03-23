import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { CompilerConfig } from './types';
import { getWorkSpacePath } from '../../utils/path';

const execAsync = promisify(exec);

export class CompilerService {
    async compile(webview: vscode.Webview) {
        const workspacePath = getWorkSpacePath();
        if (!workspacePath) {
            webview.postMessage({
                type: 'compileStatus',
                success: false,
                message: 'No workspace folder found.'
            });
            return;
        }

        try {
            // Check if Hardhat is installed
            await execAsync('npx hardhat --version', { cwd: workspacePath });

            // Compile contracts
            const { stdout, stderr } = await execAsync('npx hardhat compile', { cwd: workspacePath });

            if (stderr && !stderr.includes('Compiled')) {
                webview.postMessage({
                    type: 'compileStatus',
                    success: false,
                    message: stderr
                });
                return;
            }

            webview.postMessage({
                type: 'compileStatus',
                success: true,
                message: stdout || 'Compilation successful!'
            });

        } catch (error) {
            webview.postMessage({
                type: 'compileStatus',
                success: false,
                message: (error as Error).message
            });
        }
    }
    async updateCompilerConfig(settings: CompilerConfig) {
        const workspacePath = getWorkSpacePath();
        if (!workspacePath) {
            return;
        }
        const hardhatConfigPath = path.join(workspacePath, 'hardhat.config.ts');

        const configContent = `
        require("dotenv").config();
        import { HardhatUserConfig } from "hardhat/config";
        import "@nomicfoundation/hardhat-toolbox";
        import "hardhat-deploy";

        const config: HardhatUserConfig = {
            solidity: {
                version: "${settings.version}",
                settings: {
                    optimizer: {
                        enabled: ${settings.settings.optimizer.enabled},
                        runs: ${settings.settings.optimizer.runs}
                    },
                    evmVersion: "${settings.settings.evmVersion}",
                    viaIR: ${settings.settings.viaIR},
                    metadata: {
                        bytecodeHash: "${settings.settings.metadata.bytecodeHash}"
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

        export default config;`;

        await fs.promises.writeFile(hardhatConfigPath, configContent);
    }
    async clean(webview: vscode.Webview) {
        const workspacePath = getWorkSpacePath();
        if (!workspacePath) {
            webview.postMessage({
                type: 'cleanStatus',
                success: false,
                message: 'No workspace folder found.'
            });
            return;
        }

        try {
            // Run hardhat clean
            const { stdout, stderr } = await execAsync('npx hardhat clean', { cwd: workspacePath });

            if (stderr) {
                webview.postMessage({
                    type: 'cleanStatus',
                    success: false,
                    message: stderr
                });
                return;
            }

            webview.postMessage({
                type: 'cleanStatus',
                success: true,
                message: stdout || 'Cleaned successfully!'
            });

        } catch (error) {
            webview.postMessage({
                type: 'cleanStatus',
                success: false,
                message: (error as Error).message
            });
        }
    }
} 