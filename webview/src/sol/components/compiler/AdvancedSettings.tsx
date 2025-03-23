interface AdvancedSettingsProps {
    bytecodeHash: string
    viaIR: boolean | undefined
    onChange: (key: string, value: string | boolean) => void
}

export const AdvancedSettings = ({ bytecodeHash, viaIR, onChange }: AdvancedSettingsProps) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-text-muted text-sm mb-2">
                    Bytecode Hash
                </label>
                <select
                    value={bytecodeHash}
                    onChange={(e) => onChange('bytecodeHash', e.target.value)}
                    className="w-full bg-background-dark text-text p-4 rounded-lg border border-border focus:outline-none focus:border-primary"
                >
                    <option value="ipfs">IPFS</option>
                    <option value="bzzr1">BZZR1</option>
                    <option value="none">None</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={viaIR}
                    onChange={(e) => onChange('viaIR', e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-background-dark"
                />
                <span className="text-text-muted">Enable IR-based code generation</span>
            </div>
        </div>
    )
}