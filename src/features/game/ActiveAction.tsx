import { useEffect, useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Clock } from "lucide-react"
import { ShaderBackground } from "@/components/ui/shader-background"

export function ActiveAction() {
    const { actionQueue, completeAction, cancelAction, character } = useGameStore()
    const [progress, setProgress] = useState(0)
    const [timeLeft, setTimeLeft] = useState(0)

    const activeItem = actionQueue.length > 0 ? actionQueue[0] : null

    useEffect(() => {
        if (!activeItem || !activeItem.startTime) {
            setProgress(0)
            setTimeLeft(0)
            return
        }

        const interval = setInterval(() => {
            const now = Date.now()
            const elapsed = (now - activeItem.startTime!) / 1000
            const duration = activeItem.action.duration

            if (elapsed >= duration) {
                setProgress(100)
                setTimeLeft(0)
                clearInterval(interval)
                completeAction(activeItem.id)
                return
            }

            const newProgress = Math.min((elapsed / duration) * 100, 100)
            const newTimeLeft = Math.max(duration - elapsed, 0)

            setProgress(newProgress)
            setTimeLeft(newTimeLeft)
        }, 100)

        return () => clearInterval(interval)
    }, [activeItem, completeAction])

    if (!activeItem) {
        return (
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="flex h-32 items-center justify-center text-muted-foreground text-sm">
                    No active tasks. The queue is empty.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            {/* Active Task */}
            <Card className="relative overflow-hidden border-primary/50 shadow-lg shadow-primary/10">
                <ShaderBackground />
                <div className="relative z-10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <span className="animate-pulse text-primary">●</span>
                            Working: {activeItem.action.name}
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-background/20" onClick={() => cancelAction(activeItem.id)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-xs font-semibold">
                            <span className="text-primary font-mono">{progress.toFixed(1)}%</span>
                            <span className="text-muted-foreground font-mono">{timeLeft.toFixed(1)}s remaining</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-background/50" />
                        <p className="text-xs text-muted-foreground">
                            {activeItem.action.description}
                        </p>
                    </CardContent>
                </div>
            </Card>

            {/* Queue List */}
            {actionQueue.length > 1 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                        <span>Queue ({actionQueue.length - 1} / {character?.maxQueueSlots || 3})</span>
                    </div>
                    {actionQueue.slice(1).map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-md border bg-card/50 p-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{item.action.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => cancelAction(item.id)}>
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
