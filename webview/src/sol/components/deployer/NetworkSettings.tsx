import { NetworkConfig } from '../../types/deployment';

export const NetworkSettings = ({ network, onChange }: { network: NetworkConfig, onChange: (network: NetworkConfig) => void }) => {
    return (
        <div className="p-4 bg-background rounded-lg border border-border">
            <h4 className="text-lg font-medium mb-4">Network Settings</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Network Name</label>
                    <input
                        type="text"
                        value={network.name}
                        onChange={(e) => onChange({ ...network, name: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        placeholder="goerli"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">RPC URL</label>
                    <input
                        type="text"
                        value={network.url}
                        onChange={(e) => onChange({ ...network, url: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        placeholder="https://goerli.infura.io/v3/YOUR-PROJECT-ID"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Private Key</label>
                    <input
                        type="password"
                        value={network.accounts}
                        onChange={(e) => onChange({ ...network, accounts: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        placeholder="Your wallet private key"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Chain ID</label>
                    <input
                        type="string"
                        value={network.chainId}
                        onChange={(e) => onChange({ ...network, chainId: e.target.value })}
                        className="w-full p-2 border rounded text-black"
                        placeholder="5"
                    />
                </div>
            </div>
        </div>
    );
};