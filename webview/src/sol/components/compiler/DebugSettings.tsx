interface DebugSettingsProps {
    debugInfo: string[]
    onChange: (debugInfo: string[]) => void
}

export const DebugSettings = ({ debugInfo, onChange }: DebugSettingsProps) => {
    return (
        <div>
            <label className="block text-text-muted text-sm mb-2">
                Debug Info
            </label>
            <div className="space-y-2">
                {['location', 'snippet'].map(info => (
                    <div key={info} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={debugInfo.includes(info)}
                            onChange={(e) => {
                                const newDebugInfo = e.target.checked
                                    ? [...debugInfo, info]
                                    : debugInfo.filter(i => i !== info)
                                onChange(newDebugInfo)
                            }}
                            className="w-4 h-4 rounded border-border bg-background-dark"
                        />
                        <span className="text-text-muted capitalize">{info}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}