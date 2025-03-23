import { useState, useEffect } from 'react'
import { EnvironmentSelector } from '../../components/deployer/EnvironmentSelector'
import { AccountInfo } from '../../components/deployer/AccountInfo'
import { NetworkSettings } from '../../components/deployer/NetworkSettings'
import { HardhatAccount } from '../../types/account'
import { DeploymentState, DeployMessage, NetworkConfig } from '../../types/deployment'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/deployButton'

// Add interface for deployment result
interface DeploymentResult {
    success: boolean;
    address: string;
    output: string;
}

const isNetworkConfigValid = (network: NetworkConfig): boolean => {
    return Boolean(
        network.name &&
        network.url &&
        network.accounts &&
        network.chainId
    );
};

const DeployerPage = () => {
    const [settings, setSettings] = useState<DeploymentState>({
        environment: 'local',
        network: {
            name: 'hardhat',
            url: 'http://127.0.0.1:8545',
            accounts: '',
            chainId: '1337'
        },
        selectedContract: '',
    });

    const [accounts, setAccounts] = useState<HardhatAccount[]>([]);
    const [contractNames, setContractNames] = useState<string[]>([]);
    const [selectedAccountIndex, setSelectedAccountIndex] = useState<number | null>(null);

    // Add state for deployment result
    const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'accounts':
                    setAccounts(message.accounts);
                    if (message.accounts.length > 0) {
                        setSettings(prev => ({
                            ...prev,
                            network: {
                                ...prev.network,
                                accounts: message.accounts[0].privateKey
                            }
                        }));
                    }
                    break;
                case 'compiledContracts':
                    setContractNames(message.contracts);
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        window.vscode.postMessage({ command: 'solidity.startLocalNode' });
        window.vscode.postMessage({ command: 'solidity.getCompiledContracts' });
    }, []);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const message = event.data;
            switch (message.type) {
                case 'deploySuccess':
                    setDeploymentResult(message.result);
                    break;
                case 'error':
                    setDeploymentResult({
                        success: false,
                        address: '',
                        output: message.message
                    });
                    break;
            }
        };
        window.addEventListener('message', messageHandler);
        return () => window.removeEventListener('message', messageHandler);
    }, []);

    const handleDeploy = () => {
        const deployMessage: DeployMessage = settings.environment === 'local'
            ? {
                isHardhat: true,
                accountNumber: selectedAccountIndex ? selectedAccountIndex : 0,
                NetworkConfig: null,
                contractName: settings.selectedContract
            }
            : {
                isHardhat: false,
                accountNumber: null,
                NetworkConfig: settings.network,
                contractName: settings.selectedContract
            };

        window.vscode.postMessage({
            command: 'solidity.deploy',
            settings: deployMessage
        });
    };

    const canDeploy = settings.selectedContract && (
        settings.environment === 'local' ||
        (settings.environment === 'imported' && isNetworkConfigValid(settings.network))
    );

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col">
            <div className="flex-1 overflow-auto bg-background-light">
                <div className="min-h-full w-full border border-border">
                    <div className="p-8 space-y-6">
                        <EnvironmentSelector
                            environment={settings.environment}
                            onChange={(env) => setSettings({
                                ...settings,
                                environment: env,
                                network: env === 'local' ? {
                                    name: 'hardhat',
                                    url: 'http://127.0.0.1:8545',
                                    accounts: settings.network.accounts,
                                    chainId: '1337'
                                } : {
                                    name: '',
                                    url: '',
                                    accounts: '',
                                    chainId: '1337'
                                }
                            })}
                        />

                        {settings.environment === 'local' ? (
                            <AccountInfo
                                accounts={accounts}
                                selectedPrivateKey={settings.network.accounts}
                                onAccountSelect={(account: HardhatAccount, index: number) => {
                                    setSelectedAccountIndex(index);
                                    setSettings({
                                        ...settings,
                                        network: {
                                            ...settings.network,
                                            accounts: account.privateKey
                                        }
                                    });
                                }}
                            />
                        ) : (
                            <NetworkSettings
                                network={settings.network}
                                onChange={(network: NetworkConfig) => setSettings({
                                    ...settings,
                                    network
                                })}
                            />
                        )}

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-text">Select Compiled Contract</h3>
                            <Select
                                value={settings.selectedContract}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    selectedContract: e.target.value
                                })}
                            >
                                <option value="">Select a contract</option>
                                {contractNames.map(name => (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                ))}
                            </Select>
                            {settings.selectedContract && (
                                <p className="text-sm text-text-light">
                                    Selected contract: {settings.selectedContract}
                                </p>
                            )}

                            <div className="mt-6">
                                <Button
                                    onClick={handleDeploy}
                                    disabled={!canDeploy}
                                    className="w-full"
                                >
                                    Deploy Contract
                                </Button>
                                {!settings.selectedContract ? (
                                    <p className="text-sm text-red-500 mt-2">
                                        Please select a contract to deploy
                                    </p>
                                ) : (settings.environment === 'imported' && !isNetworkConfigValid(settings.network)) && (
                                    <p className="text-sm text-red-500 mt-2">
                                        Please fill in all network settings
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Add deployment result display */}
                        {deploymentResult && (
                            <div className="mt-4 p-4 bg-background rounded-md border border-border">
                                <h3 className="text-lg font-medium text-text mb-2">Deployment Result</h3>
                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-medium">Status:</span>{' '}
                                        <span className={deploymentResult.success ? 'text-green-500' : 'text-red-500'}>
                                            {deploymentResult.success ? 'Success' : 'Failed'}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Contract Address:</span>{' '}
                                        <code className="bg-background-light px-2 py-1 rounded">{deploymentResult.address}</code>
                                    </p>
                                    <div className="text-sm">
                                        <span className="font-medium">Output:</span>
                                        <pre className="mt-1 bg-background-light p-2 rounded overflow-x-auto">
                                            {deploymentResult.output}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeployerPage; 