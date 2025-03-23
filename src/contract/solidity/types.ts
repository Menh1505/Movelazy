export type NetworkEnvironment = 'local' | 'imported';

export interface NetworkConfig {
    name: string;
    url?: string;
    accounts?: string;
    chainId?: string;
}
export interface DefaultConfig {
    version: string;
    evmVersion: string;
    optimizer: {
        enabled: boolean;
        runs: number;
    };
    metadata: {
        bytecodeHash: string;
    };
    viaIR: boolean;
    debug: {
        debugInfo: string[];
    };
    networks: {
        network?: {
            url: string;
            accounts: string[];
            chainId: number;
        };
    };
    namedAccounts: {
        deployer: {
            default: number;
        };
    }
}
export interface CompilerConfig {
    version: string;
    settings: {
        optimizer: {
            enabled: boolean;
            runs: number;
        };
        evmVersion: string;
        viaIR: boolean;
        metadata: {
            bytecodeHash: "ipfs" | "bzzr1";
        };
        outputSelection: {
            "*": {
                "*": string[];
            };
        };
    };
}

export interface LocalDeployMessage {
    isHardhat: true;
    accountNumber: number;
    NetworkConfig: null;
    contractName: string;
}

export interface NetworkDeployMessage {
    isHardhat: false;
    accountNumber: null;
    NetworkConfig: NetworkConfig;
    contractName: string;
}

export type DeployMessage = LocalDeployMessage | NetworkDeployMessage;