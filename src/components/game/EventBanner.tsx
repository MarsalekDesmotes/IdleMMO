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
        <Alert className="mb-4 border-red-500/50 bg-red-950/20 text-red-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
            <Flame className="h-4 w-4 text-red-500 relative z-10 animate-[bounce_2s_ease-in-out_infinite]" />
            <AlertTitle className="flex justify-between items-center relative z-10">
                <span className="font-bold">{activeEvent.name} Active!</span>
                <span className="text-sm font-mono font-bold">{timeLeft}s</span>
            </AlertTitle>
            <AlertDescription className="relative z-10">
                {activeEvent.description}
            </AlertDescription>
            <style>{`
                @keyframes shimmer {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
            `}</style>
        </Alert>
    )
}
