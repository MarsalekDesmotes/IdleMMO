import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function GameLog() {
    const { logs } = useGameStore()

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">System Logs</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <div className="h-[300px] overflow-y-auto p-4 space-y-2 font-mono text-xs">
                    {logs.map((log) => (
                        <div key={log.id} className="flex gap-2">
                            <span className="text-muted-foreground">
                                [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]
                            </span>
                            <span className={cn(
                                log.type === 'success' && "text-green-400",
                                log.type === 'error' && "text-red-400",
                                log.type === 'warning' && "text-yellow-400",
                                log.type === 'loot' && "text-orange-400",
                                log.type === 'info' && "text-foreground"
                            )}>
                                {log.message}
                            </span>
                        </div>
                    ))}
                    {logs.length === 0 && (
                        <div className="text-muted-foreground italic">No logs available.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
