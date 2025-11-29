import { useEventStore } from "@/store/eventStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Flame } from "lucide-react"
import { useEffect, useState } from "react"

export function EventBanner() {
    const { activeEvent } = useEventStore()
    const [timeLeft, setTimeLeft] = useState(0)

    useEffect(() => {
        if (!activeEvent) return

        const interval = setInterval(() => {
            const end = activeEvent.startTime + (activeEvent.duration * 1000)
            const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000))
            setTimeLeft(remaining)
        }, 1000)

        return () => clearInterval(interval)
    }, [activeEvent])

    if (!activeEvent) return null

    return (
        <Alert className="mb-4 border-red-500/50 bg-red-950/20 text-red-500 animate-pulse">
            <Flame className="h-4 w-4 text-red-500" />
            <AlertTitle className="flex justify-between items-center">
                <span>{activeEvent.name} Active!</span>
                <span className="text-sm font-mono">{timeLeft}s</span>
            </AlertTitle>
            <AlertDescription>
                {activeEvent.description}
            </AlertDescription>
        </Alert>
    )
}
