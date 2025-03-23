import { HardhatAccount } from '../../types/account';
import { Select } from '../ui/select';

interface AccountInfoProps {
    accounts: HardhatAccount[];
    selectedPrivateKey: string;
    onAccountSelect: (account: HardhatAccount, index: number) => void;
}

export const AccountInfo = ({ accounts, selectedPrivateKey, onAccountSelect }: AccountInfoProps) => {
    const selectedIndex = accounts.findIndex(acc => acc.privateKey === selectedPrivateKey);
    const selectedAccount = selectedIndex >= 0 ? accounts[selectedIndex] : null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Local Network Account</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text mb-1">
                        Select Account
                    </label>
                    <Select
                        value={selectedIndex.toString()}
                        onChange={(e) => {
                            const index = parseInt(e.target.value);
                            const account = accounts[index];
                            if (account) onAccountSelect(account, index);
                        }}
                    >
                        {accounts.map((account, index) => (
                            <option key={index} value={index.toString()}>
                                Account #{index}: {account.address} ({account.balance} ETH)
                            </option>
                        ))}
                    </Select>
                </div>

                {selectedAccount && (
                    <div className="p-4 bg-background rounded-md border border-border">
                        <div className="space-y-2">
                            <div>
                                <span className="text-sm font-medium text-text-light">Address:</span>
                                <p className="text-sm font-mono text-text break-all">{selectedAccount.address}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-text-light">Balance:</span>
                                <p className="text-sm font-mono text-text">{selectedAccount.balance} ETH</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-text-light">Private Key:</span>
                                <p className="text-sm font-mono text-text break-all">{selectedAccount.privateKey}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 