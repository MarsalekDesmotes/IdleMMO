import { useEffect } from "react"
import { useDailyQuestStore } from "@/store/dailyQuestStore"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle2, Circle, Crown } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyQuests() {
    const dailyQuests = useDailyQuestStore((state) => state.dailyQuests)
    const initializeDailyQuests = useDailyQuestStore((state) => state.initializeDailyQuests)
    const { character } = useGameStore()

    useEffect(() => {
        if (character) {
            initializeDailyQuests()
        }
    }, [character, initializeDailyQuests])

    // Force re-render when daily quests change
    useEffect(() => {
        // This ensures component updates when store changes
    }, [dailyQuests])

    if (!character || dailyQuests.length === 0) return null

    return (
        <Card className="border-none bg-transparent shadow-none">
            <div className="relative p-6 rounded-sm bg-[#e8dcb9] text-[#2c241b] shadow-xl border-[6px] border-[#5c4033] outline outline-2 outline-[#3e2723] overflow-hidden">
                {/* Parchment Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}>
                </div>

                <CardHeader className="pb-4 border-b-2 border-[#5c4033]/30 relative z-10 p-0 mb-4">
                    <CardTitle className="flex items-center gap-3 text-2xl font-medieval font-bold text-[#3e2723]">
                        <div className="p-2 border-2 border-[#5c4033] rounded-full bg-[#d4af37] shadow-inner">
                            <Calendar className="h-5 w-5 text-[#2c241b]" />
                        </div>
                        Royal Decrees
                    </CardTitle>
                    <CardDescription className="text-sm font-medieval font-semibold text-[#5c4033]/80 italic mt-1">
                        "By order of the Crown, the following tasks must be completed before sundown."
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10 p-0">
                    {dailyQuests.map((quest) => {
                        const totalReq = quest.requirements.reduce((sum, req) => sum + req.amount, 0)
                        const totalCurrent = quest.requirements.reduce((sum, req) => sum + req.current, 0)
                        const progress = totalReq > 0 ? (totalCurrent / totalReq) * 100 : 0

                        return (
                            <div
                                key={quest.id}
                                className={cn(
                                    "p-3 relative transition-all border-b-2 border-dotted border-[#5c4033]/30 last:border-0",
                                    quest.isCompleted ? "opacity-60 grayscale-[0.5]" : "hover:bg-[#5c4033]/5"
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {quest.isCompleted ? (
                                                <div className="text-green-700">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <div className="text-[#8b4513]">
                                                    <Circle className="h-4 w-4" />
                                                </div>
                                            )}
                                            <span className={cn(
                                                "text-lg font-bold font-medieval text-[#3e2723]",
                                                quest.isCompleted && "line-through decoration-[#8b0000] decoration-2"
                                            )}>
                                                {quest.title}
                                            </span>
                                        </div>
                                        <p className="text-sm font-serif text-[#4e342e] mb-3 leading-tight italic pl-6">
                                            {quest.description}
                                        </p>
                                    </div>
                                </div>

                                {!quest.isCompleted && (
                                    <div className="pl-6 space-y-2">
                                        <div className="relative h-3 w-full bg-[#ccbfa3] rounded-sm border border-[#5c4033]/40 overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-[#8b4513]"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs font-bold font-medieval text-[#5c4033]">
                                            <span>
                                                Progress: {totalCurrent} / {totalReq}
                                            </span>
                                            <div className="flex gap-2">
                                                <span className="flex items-center gap-1 text-[#d4af37] drop-shadow-sm bg-[#3e2723] px-2 py-0.5 rounded-sm">
                                                    +{quest.rewards.xp} XP
                                                </span>
                                                <span className="flex items-center gap-1 text-[#ffd700] drop-shadow-sm bg-[#3e2723] px-2 py-0.5 rounded-sm">
                                                    +{quest.rewards.gold} Gold
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {quest.isCompleted && (
                                    <div className="pl-6 flex items-center gap-2 text-sm text-[#2e7d32] font-bold font-medieval">
                                        <span className="uppercase tracking-widest">Task Fulfilled</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </div>
            {/* Wax Seal Decoration */}
            <div className="absolute -bottom-2 right-8 h-16 w-16 bg-[#8b0000] rounded-full shadow-lg flex items-center justify-center border-4 border-[#5c0000] opacity-90 z-20">
                <Crown className="h-8 w-8 text-[#d4af37] drop-shadow-md" />
            </div>
        </Card>
    )
}

