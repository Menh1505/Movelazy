export interface HardhatAccount {
    address: string;
    balance: string;
    privateKey: string;
}

export interface AccountInfoProps {
    accounts: HardhatAccount[];
    selectedPrivateKey?: string;
    onAccountSelect: (account: HardhatAccount) => void;
}
