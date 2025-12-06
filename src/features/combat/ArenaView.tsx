import { useEffect, useState } from "react"
import { usePvPStore, type ArenaOpponent } from "@/store/pvpStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Swords, Shield, Zap, Skull, Trophy } from "lucide-react"
import { useGameStore } from "@/store/gameStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ArenaView() {
    const { opponents, generateOpponents, fightOpponent, dailyMatches, maxDailyMatches } = usePvPStore()
    const { character } = useGameStore()
    const [combatLog, setCombatLog] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [lastVictory, setLastVictory] = useState(false)

    useEffect(() => {
        if (opponents.length === 0) {
            generateOpponents()
        }
    }, [opponents, generateOpponents])

    const handleFight = (opponentId: string) => {
        const result = fightOpponent(opponentId)
        setCombatLog(result.log)
        setLastVictory(result.victory)
        setShowResult(true)
    }

    const closeResult = () => {
        setShowResult(false)
        if (opponents.length === 0) {
            generateOpponents()
        }
    }

    if (!character) return null

    if (showResult) {
        return (
            <Card className="h-[600px] flex flex-col max-w-2xl mx-auto border-2 border-primary/20">
                <CardHeader className={lastVictory ? "bg-green-500/10" : "bg-red-500/10"}>
                    <CardTitle className="flex items-center gap-2">
                        {lastVictory ? <Trophy className="text-yellow-500" /> : <Skull className="text-red-500" />}
                        {lastVictory ? "Victory!" : "Defeat!"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-hidden">
                    <ScrollArea className="h-full rounded-md border p-4 bg-muted/50">
                        <div className="space-y-1 font-mono text-xs">
                            {combatLog.map((line, i) => (
                                <div key={i} className={line.includes('Victory') ? 'text-green-500 font-bold' : line.includes('Defeat') ? 'text-red-500 font-bold' : ''}>
                                    {line}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Button onClick={closeResult} className="w-full">Back to Arena</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Arena</h2>
                    <p className="text-muted-foreground">Challenge other players for Honor and Glory.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">Daily Matches</p>
                    <p className="text-2xl font-bold">{dailyMatches} / {maxDailyMatches}</p>
                </div>
            </div>

            {dailyMatches >= maxDailyMatches && (
                <Alert variant="destructive">
                    <AlertTitle>Daily Limit Reached</AlertTitle>
                    <AlertDescription>You have exhausted your arena matches for today. Come back tomorrow.</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-3">
                {opponents.map((opponent) => (
                    <OpponentCard
                        key={opponent.id}
                        opponent={opponent}
                        onFight={() => handleFight(opponent.id)}
                        disabled={dailyMatches >= maxDailyMatches}
                    />
                ))}
            </div>

            {opponents.length === 0 && (
                <div className="text-center p-10 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">Searching for worthy opponents...</p>
                    <Button onClick={generateOpponents} variant="outline" className="mt-4">Refresh Opponents</Button>
                </div>
            )}
        </div>
    )
}

function OpponentCard({ opponent, onFight, disabled }: { opponent: ArenaOpponent, onFight: () => void, disabled: boolean }) {
    const { character } = useGameStore.getState()
    const levelDiff = opponent.level - (character?.level || 1)

    let difficultyColor = "text-muted-foreground"
    let difficultyText = "Matched"

    if (levelDiff > 0) {
        difficultyColor = "text-red-500"
        difficultyText = "Hard"
    } else if (levelDiff < 0) {
        difficultyColor = "text-green-500"
        difficultyText = "Easy"
    }

    return (
        <Card className="flex flex-col relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg group">
            <div className="absolute top-0 right-0 p-2 opacity-50 text-[100px] leading-none pointer-events-none group-hover:scale-110 transition-transform">
                {opponent.class === 'Paladin' && '🛡️'}
                {opponent.class === 'Archmage' && '🔮'}
                {opponent.class === 'Ranger' && '🏹'}
            </div>

            <CardHeader className="relative z-10">
                <div className="flex justify-between items-start">
                    <Badge variant="outline">{opponent.class}</Badge>
                    <span className={`text-xs font-bold ${difficultyColor}`}>{difficultyText}</span>
                </div>
                <CardTitle className="mt-2">{opponent.name}</CardTitle>
                <CardDescription>Level {opponent.level}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 relative z-10 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Def: {opponent.stats.defense}</div>
                    <div className="flex items-center gap-1"><Zap className="h-3 w-3" /> Str: {opponent.stats.strength}</div>
                </div>
                <div className="mt-4 p-2 bg-muted/50 rounded text-center">
                    <span className="text-xs text-muted-foreground uppercase">Reward</span>
                    <div className="font-bold text-purple-500 flex items-center justify-center gap-1">
                        <Trophy className="h-3 w-3" /> {opponent.honorReward} Honor
                    </div>
                </div>
            </CardContent>

            <CardFooter className="relative z-10">
                <Button className="w-full gap-2" onClick={onFight} disabled={disabled}>
                    <Swords className="h-4 w-4" /> Fight
                </Button>
            </CardFooter>
        </Card>
    )
}
