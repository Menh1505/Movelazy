interface OptimizerSettingsProps {
    enabled: boolean
    runs: number | undefined
    onChange: (enabled: boolean, runs?: number) => void
}

export const OptimizerSettings = ({ enabled, runs, onChange }: OptimizerSettingsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-background-dark"
                />
                <span className="text-text-muted">Enable optimizer</span>
            </div>

            {enabled && (
                <div>
                    <label className="block text-text-muted text-sm mb-2">
                        Optimizer Runs
                    </label>
                    <input
                        type="number"
                        value={runs}
                        onChange={(e) => onChange(enabled, parseInt(e.target.value))}
                        className="w-full bg-background-dark text-text p-4 rounded-lg border border-border focus:outline-none focus:border-primary"
                    />
                </div>
            )}
        </div>
    )
}