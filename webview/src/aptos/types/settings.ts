export interface CompilerSettings {
    version: string;
    evmVersion?: string;
    moveVersion?: string;
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

    packageDir?: string,
    namedAddresses?: string,
}

export interface DeployerSettings {
    nameAddresses: string;
    account?: string; 
    balance?: number;
}

export interface Flags {
    enabled: boolean;
    testName: string;
}

export interface DeployerSettings {
    nameAddresses: string;
}