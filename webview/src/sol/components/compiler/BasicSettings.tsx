interface BasicSettingsProps {
    version: string
    evmVersion: string | undefined
    onChange: (key: string, value: string) => void
}

export const BasicSettings = ({ version, evmVersion, onChange }: BasicSettingsProps) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-text-muted text-sm mb-2">
                    Solidity Version
                </label>
                <select
                    value={version}
                    onChange={(e) => onChange('version', e.target.value)}
                    className="w-full bg-background-dark text-text p-4 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                    <option>0.8.20</option>
                    <option>0.8.19</option>
                    <option>0.8.18</option>
                </select>
            </div>

            <div>
                <label className="block text-text-muted text-sm mb-2">
                    EVM Version
                </label>
                <select
                    value={evmVersion}
                    onChange={(e) => onChange('evmVersion', e.target.value)}
                    className="w-full bg-background-dark text-text p-4 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                    <option>london</option>
                    <option>berlin</option>
                    <option>istanbul</option>
                </select>
            </div>
        </div>
    )
}
