
export interface NetworkConfig {
    name: string;
    url: string;
    accounts: string;
    chainId: string;
}

export interface DeploymentState {
    environment: 'local' | 'imported';
    network: NetworkConfig;
    selectedContract: string;
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