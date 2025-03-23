interface FlagsProps {
    enabled: boolean
    onChange: (enabled: boolean, level?: string) => void
}

export const FlagsSettings = ({ enabled, onChange }: FlagsProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-background-dark"
                />
                <span className="text-text-muted">Only run tests with names containing</span>
            </div>

            {enabled && (
                <div>
                    <label className="block text-text-muted text-sm mb-2">
                        Test Name
                    </label>
                    <input
                        type="text"
                        onChange={(e) => onChange(enabled, e.target.value)}
                        className="w-full bg-background-dark text-text p-4 rounded-lg border border-border focus:outline-none focus:border-primary"
                        placeholder="Example zero_coin"
                    />
                </div>
            )}
        </div>
    )
}