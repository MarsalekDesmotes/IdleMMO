import { useEffect } from "react"
import { useDailyQuestStore } from "@/store/dailyQuestStore"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Circle } from "lucide-react"
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
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-4 w-4 text-yellow-500" />
                    Daily Quests
                </CardTitle>
                <CardDescription className="text-xs">
                    Complete daily challenges for bonus rewards. Resets every day.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {dailyQuests.map((quest) => {
                    const totalReq = quest.requirements.reduce((sum, req) => sum + req.amount, 0)
                    const totalCurrent = quest.requirements.reduce((sum, req) => sum + req.current, 0)
                    const progress = totalReq > 0 ? (totalCurrent / totalReq) * 100 : 0

                    return (
                        <div
                            key={quest.id}
                            className={cn(
                                "p-3 rounded-lg border transition-all",
                                quest.isCompleted
                                    ? "bg-green-950/20 border-green-500/50"
                                    : "bg-muted/30 border-border/50"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {quest.isCompleted ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Circle className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className={cn(
                                            "text-sm font-medium",
                                            quest.isCompleted && "line-through text-muted-foreground"
                                        )}>
                                            {quest.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {quest.description}
                                    </p>
                                </div>
                            </div>

                            {!quest.isCompleted && (
                                <>
                                    <Progress value={progress} className="h-2 mb-2" />
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            {totalCurrent} / {totalReq}
                                        </span>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                +{quest.rewards.xp} XP
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                +{quest.rewards.gold} Gold
                                            </Badge>
                                        </div>
                                    </div>
                                </>
                            )}

                            {quest.isCompleted && (
                                <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Completed
                                </div>
                            )}
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}

