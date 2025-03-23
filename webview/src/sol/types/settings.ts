export interface NetworkConfig {
    networkName: string;
    url: string;
    accounts: string[];
    chainId: number;
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

export interface HardhatConfig {
    version: string;
    evmVersion: string;
    optimizer: {
        enabled: boolean;
        runs?: number;
        level?: string;
    };
    metadata?: {
        bytecodeHash: string;
    };
    viaIR?: boolean;
    debug?: {
        debugInfo: string[];
    };
    networks: {
        hardhat: {
            chainId: 1337;
        };
        network?: NetworkConfig;
    };
    namedAccounts: {
        deployer: {
            default: number;
        };
    };
    paths: {
        sources: string;
        tests: string;
        cache: string;
        artifacts: string;
    };
}
