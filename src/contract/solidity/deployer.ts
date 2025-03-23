import { DeployMessage, LocalDeployMessage, NetworkDeployMessage } from './types';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as vscode from 'vscode';

const execAsync = promisify(exec);

export class DeployerService {
    private workspaceRoot: string;
    constructor() {
        this.workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath || '';
    }

    async deploy(message: DeployMessage) {
        if (message.isHardhat) {
            return this.deployLocal(message);
        } else {
            return this.deployNetwork(message);
        }
    }

    async writeDeployScript(contractName: string) {
        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        // Deploy script 
        const scriptPath = path.join(this.workspaceRoot, 'scripts', 'deploy.js');
        const deployScript = `
 async function main() {
     const Contract = await ethers.getContractFactory("${contractName}");
     console.log("Deploying contract to local Hardhat network...");
     const contract = await Contract.deploy();
     await contract.waitForDeployment();
     console.log("Contract deployed to address:", contract.target);
     return contract.target;
 }
 
 main()
     .then(() => process.exit(0))
     .catch((error) => {
         console.error("Error deploying contract:", error);
         process.exit(1);
     });`;

        const scriptsDir = path.dirname(scriptPath);
        if (!fs.existsSync(scriptsDir)) {
            fs.mkdirSync(scriptsDir, { recursive: true });
        }

        // Write or update deploy script
        fs.writeFileSync(scriptPath, deployScript);
    }

    async executeDeployScript(command: string) {
        try {
            // Execute deploy script from the workspace root
            const { stdout, stderr } = await execAsync(command, {
                cwd: this.workspaceRoot // Set the working directory to workspace root
            });

            if (stderr) {
                throw new Error(stderr);
            }

            // Extract contract address from stdout
            const addressMatch = stdout.match(/Contract deployed to address: (0x[a-fA-F0-9]{40})/);
            if (!addressMatch) {
                throw new Error('Could not find contract address in deployment output');
            }

            return {
                success: true,
                address: addressMatch[1],
                output: stdout
            };

        } catch (error) {
            throw new Error(`Deployment failed: ${(error as Error).message}`);
        }
    }

    private async deployLocal(message: LocalDeployMessage) {
        const { contractName, accountNumber } = message;
        // Get the workspace root directory where hardhat.config.js should be located
        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        // Hardhat config
        const configPath = path.join(this.workspaceRoot, 'hardhat.config.ts');
        let configContent = `require("dotenv").config();
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
    namedAccounts: {
        deployer: {
            default: ${accountNumber}
        }
    }
};

export default config;`;

        fs.writeFileSync(configPath, configContent);

        //write deploy script
        await this.writeDeployScript(contractName);

        //execute deploy script
        const command = 'npx hardhat run scripts/deploy.js --network hardhat';
        return await this.executeDeployScript(command);
    }

    private async deployNetwork(message: NetworkDeployMessage) {
        // Handle network deployment
        const { NetworkConfig, contractName } = message;
        console.log('Deploying on network with config:', NetworkConfig, 'and contract name:', contractName);

        if (!this.workspaceRoot) {
            throw new Error('No workspace folder found');
        }

        const configPath = path.join(this.workspaceRoot, 'hardhat.config.ts');
        let configContent = `require("dotenv").config();
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
    networks: {
        ${NetworkConfig.name}: {
            url: "${NetworkConfig.url}",
            chainId: ${NetworkConfig.chainId},
            accounts: ['${NetworkConfig.accounts}']
        }
    }
};

export default config;`;

        fs.writeFileSync(configPath, configContent);

        //write deploy script
        await this.writeDeployScript(contractName);

        //execute deploy script
        const command = `npx hardhat run scripts/deploy.js --network ${NetworkConfig.name}`;
        return await this.executeDeployScript(command);
    }
}
