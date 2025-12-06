import { useDungeonStore } from "@/store/dungeonStore"
import { useCombatStore } from "@/store/combatStore"
import { useGameStore } from "@/store/gameStore"
import { DUNGEONS } from "@/data/dungeons"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skull, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

export function DungeonView() {
    const { activeDungeon, currentWaveIndex, isDungeonActive, dungeonLog, startDungeon, advanceWave, failDungeon, leaveDungeon } = useDungeonStore()
    const { phase, startCombat, enemy: combatEnemy, playerHp } = useCombatStore()
    const { character } = useGameStore()

    // Local state to track which enemy in the wave we are fighting
    const [subWaveIndex, setSubWaveIndex] = useState(0)

    useEffect(() => {
        if (!isDungeonActive || !activeDungeon) return

        if (phase === 'idle') {
            // Check if we just finished a fight (victory)
            // If we are in dungeon mode, 'idle' means we killed the enemy or haven't started.
            // But combatStore doesn't explicitly store "Victory" state in persistent way for us to read ONCE.
            // We need to trigger the next fight.

            const currentWave = activeDungeon.waves[currentWaveIndex]
            if (subWaveIndex < currentWave.enemies.length) {
                // Start fight with next enemy in wave
                const enemyData = currentWave.enemies[subWaveIndex]
                startCombat({
                    id: `dungeon_mob_${Date.now()}`,
                    name: enemyData.name,
                    level: activeDungeon.minLevel, // simplified
                    hp: enemyData.hp,
                    max_hp: enemyData.hp,
                    attack: enemyData.damage,
                    defense: 0,
                    description: 'A dungeon creature.',
                    xpReward: 10, // minor xp per mob
                    goldReward: 5,
                    zone: 'outskirts', // dummy
                    drops: []
                })
                setSubWaveIndex(prev => prev + 1)
            } else {
                // Wave Complete
                // Reset subwave
                setSubWaveIndex(0)
                advanceWave()
            }
        }

    }, [phase, isDungeonActive, activeDungeon, currentWaveIndex, subWaveIndex, startCombat, advanceWave])

    // Handling Player Death to Fail Dungeon
    useEffect(() => {
        if (isDungeonActive && playerHp <= 0) {
            failDungeon()
        }
    }, [playerHp, isDungeonActive, failDungeon])


    if (!character) return null

    if (isDungeonActive && activeDungeon) {
        return (
            <div className="max-w-4xl mx-auto space-y-4">
                <Card className="border-red-900/50 bg-slate-950">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-red-500 flex items-center gap-2">
                                <Skull /> {activeDungeon.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xl">
                                Wave {currentWaveIndex + 1} / {activeDungeon.waves.length}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[400px] flex flex-col relative">
                        {/* Re-use Combat Logic visually or just show status? */}
                        {/* Since combatStore is running, the CombatView *could* be embedded or we replicate simple view */}
                        <div className="flex-1 flex items-center justify-center">
                            {phase === 'active' && combatEnemy ? (
                                <div className="text-center space-y-4">
                                    <div className="text-6xl animate-pulse">⚔️</div>
                                    <div className="text-2xl font-bold text-red-400">Fighting {combatEnemy.name}...</div>
                                    <div className="w-64 h-4 bg-slate-800 rounded-full mx-auto overflow-hidden">
                                        <div className="bg-red-500 h-full" style={{ width: `${(combatEnemy.hp / combatEnemy.max_hp) * 100}%` }} />
                                    </div>
                                    <div className="text-sm">Enemy HP: {combatEnemy.hp} / {combatEnemy.max_hp}</div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    Preparing next encounter...
                                </div>
                            )}
                        </div>

                        <ScrollArea className="h-32 border rounded bg-black/50 p-2 text-xs font-mono mt-4">
                            {dungeonLog.map((log, i) => <div key={i}>{log}</div>)}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" className="w-full" onClick={leaveDungeon}>Retreat (Leave Dungeon)</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="col-span-2">
                <h2 className="text-3xl font-bold mb-2">Dungeons</h2>
                <p className="text-muted-foreground">Challenge dangerous instances for legendary rewards.</p>
            </div>
            {DUNGEONS.map(dungeon => (
                <Card key={dungeon.id} className="relative overflow-hidden hover:border-primary transition-colors group">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {dungeon.name}
                            <Badge variant={character.level >= dungeon.minLevel ? "default" : "destructive"}>
                                Lv {dungeon.minLevel}+
                            </Badge>
                        </CardTitle>
                        <CardDescription>{dungeon.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2"><Skull className="w-4 h-4" /> {dungeon.waves.length} Waves</div>
                            <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /> Rare Artifacts</div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            disabled={character.level < dungeon.minLevel}
                            onClick={() => startDungeon(dungeon.id)}
                        >
                            Enter Dungeon
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
