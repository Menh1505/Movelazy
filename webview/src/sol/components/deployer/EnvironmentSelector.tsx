import { ChangeEvent } from 'react';

interface EnvironmentSelectorProps {
    environment: 'local' | 'imported';
    onChange: (environment: 'local' | 'imported') => void;
}

export const EnvironmentSelector = ({ environment, onChange }: EnvironmentSelectorProps) => {
    const environments = [
        { 
            value: 'local', 
            label: 'Hardhat Network (Local)', 
            description: 'Deploy to local development network with chainId 1337' 
        },
        { 
            value: 'imported', 
            label: 'Import Network', 
            description: 'Deploy to custom networks like testnet or mainnet' 
        }
    ] as const;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value as 'local' | 'imported');
    };

    return (
        <div className="p-4 bg-background rounded-lg border border-border">
            <h4 className="text-lg font-medium mb-4">Environment</h4>

            <select
                value={environment}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-black"
            >
                {environments.map(({ value, label }) => (
                    <option key={value} value={value} className="text-black">
                        {label}
                    </option>
                ))}
            </select>

            <p className="mt-2 text-sm">
                {environments.find(env => env.value === environment)?.description}
            </p>
        </div>
    );
}; 