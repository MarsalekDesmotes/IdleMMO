import { useEffect, useState } from "react"
import { useLeaderboardStore, type LeaderboardEntry } from "@/store/leaderboardStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Medal, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LeaderboardView() {
    const {
        dailyLeaderboard,
        weeklyLeaderboard,
        lifetimeLeaderboard,
        fetchLeaderboards,
        isLoading
    } = useLeaderboardStore()

    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'lifetime'>('weekly')

    useEffect(() => {
        fetchLeaderboards()
    }, [fetchLeaderboards])

    const getCurrentList = () => {
        switch (activeTab) {
            case 'daily': return dailyLeaderboard
            case 'weekly': return weeklyLeaderboard
            case 'lifetime': return lifetimeLeaderboard
            default: return weeklyLeaderboard
        }
    }

    const getTabLabel = (tab: string) => {
        switch (tab) {
            case 'daily': return 'Daily'
            case 'weekly': return 'Weekly'
            case 'lifetime': return 'All Time'
            default: return ''
        }
    }

    return (
        <Card className="h-[600px] flex flex-col w-full max-w-2xl mx-auto border-2 border-primary/20 bg-background/95 backdrop-blur shadow-2xl">
            <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl text-primary">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        Hall of Honor
                    </CardTitle>
                    <div className="flex bg-muted/50 p-1 rounded-lg">
                        {(['daily', 'weekly', 'lifetime'] as const).map((tab) => (
                            <Button
                                key={tab}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "text-xs font-medium px-4 py-1 h-8 rounded-md transition-all",
                                    activeTab === tab
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {getTabLabel(tab)}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background/10 to-transparent pointer-events-none z-10" />

                <div className="grid grid-cols-12 gap-2 p-3 text-xs font-bold text-muted-foreground border-b bg-muted/20">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-6 px-2">Hero</div>
                    <div className="col-span-2 text-center">Class</div>
                    <div className="col-span-3 text-right px-4">Honor</div>
                </div>

                <ScrollArea className="h-full">
                    <div className="p-2 space-y-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-40 text-muted-foreground">
                                Loading champions...
                            </div>
                        ) : getCurrentList().length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                                <Medal className="h-8 w-8 opacity-20" />
                                <p>No champions recorded yet.</p>
                            </div>
                        ) : (
                            getCurrentList().map((entry) => (
                                <LeaderboardItem key={entry.id} entry={entry} />
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

function LeaderboardItem({ entry }: { entry: LeaderboardEntry }) {
    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
        if (rank === 2) return <Medal className="h-4 w-4 text-slate-300 fill-slate-300/20" />
        if (rank === 3) return <Medal className="h-4 w-4 text-amber-600 fill-amber-600/20" />
        return <span className="text-muted-foreground font-mono">{rank}</span>
    }

    const getRankStyle = (rank: number) => {
        if (rank === 1) return "bg-yellow-500/10 border-yellow-500/20"
        if (rank === 2) return "bg-slate-500/10 border-slate-500/20"
        if (rank === 3) return "bg-amber-500/10 border-amber-500/20"
        return "hover:bg-muted/50 border-transparent"
    }

    return (
        <div className={cn(
            "grid grid-cols-12 gap-2 items-center p-3 rounded-lg border transition-all duration-200",
            getRankStyle(entry.rank)
        )}>
            <div className="col-span-1 flex justify-center font-bold">
                {getRankIcon(entry.rank)}
            </div>
            <div className="col-span-6 px-2 font-medium truncate flex items-center gap-2">
                <span className="text-foreground">{entry.username}</span>
                {entry.id === useLeaderboardStore.getState().dailyLeaderboard.find(x => x.username === 'You')?.id && (
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-2">YOU</span>
                )}
            </div>
            <div className="col-span-2 text-center text-xs text-muted-foreground capitalize">
                {entry.class}
            </div>
            <div className="col-span-3 text-right px-4 font-mono font-bold text-primary">
                {entry.honor.toLocaleString()}
            </div>
        </div>
    )
}
