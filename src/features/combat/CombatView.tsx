import { useGameStore } from "@/store/gameStore"
import { useCombatStore } from "@/store/combatStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sword } from "lucide-react"
import { SKILLS } from "@/data/skills"
import { ENEMIES, type Enemy } from "@/data/enemies"

export function CombatView() {
    const { character } = useGameStore()
    const { phase, turn, enemy, playerHp, playerMaxHp, combatLog, startCombat, playerAction, endCombat } = useCombatStore()

    if (!character) return null

    const availableSkills = character ? SKILLS[character.class].filter(s => s.type === 'active' && character.unlockedSkills.includes(s.id)) : []

    const handleFindEnemy = () => {
        // Filter enemies by current zone
        const zoneEnemies = ENEMIES.filter(e => e.zone === (character.currentZone || 'outskirts'))

        // Fallback if no enemies found (shouldn't happen)
        const pool = zoneEnemies.length > 0 ? zoneEnemies : ENEMIES.filter(e => e.zone === 'outskirts')

        // Pick random
        const template = pool[Math.floor(Math.random() * pool.length)]

        // Create instance with some variance
        const levelVariance = Math.floor(Math.random() * 3) - 1 // -1, 0, or +1
        const finalLevel = Math.max(1, template.level + levelVariance)

        const combatEnemy: Enemy = {
            id: `enemy_${Date.now()}`,
            name: template.name,
            description: template.description || 'A hostile creature.',
            level: finalLevel,
            hp: template.hp, // Simple scaling could go here
            max_hp: template.max_hp,
            attack: template.attack, // Fixed: was damage
            defense: template.defense,
            xpReward: template.xpReward,
            goldReward: template.goldReward,
            zone: template.zone,
            image: '👾', // TODO: Add images to Enemy DB
            drops: template.drops
        }

        startCombat(combatEnemy)
        useGameStore.getState().updateQuestProgress('kill', combatEnemy.name, 1)
    }

    if (phase === 'idle') {
        return (
            <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Sword className="h-16 w-16 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-bold">No Active Combat</h2>
                <Button size="lg" onClick={handleFindEnemy}>
                    Find Enemy
                </Button>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 h-[500px]">
            {/* Battle Arena */}
            <Card className="col-span-2 md:col-span-1 relative overflow-hidden bg-slate-950 border-red-900/50">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-20 pointer-events-none" />

                <CardContent className="h-full flex flex-col justify-between p-6 relative z-10">
                    {/* Enemy Side (Top Right) */}
                    <div className="flex flex-col items-end self-end w-2/3">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-red-400">{enemy?.name}</span>
                            <span className="text-xs bg-red-900/50 px-2 py-0.5 rounded text-red-200">Lvl {enemy?.level}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full mb-1">
                            <div
                                className="bg-red-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(enemy!.hp / enemy!.max_hp) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">{enemy?.hp} / {enemy?.max_hp} HP</span>
                        <div className="text-6xl mt-4 animate-bounce">
                            {enemy?.image}
                        </div>
                    </div>

                    {/* Player Side (Bottom Left) */}
                    <div className="flex flex-col items-start self-start w-2/3 mt-8">
                        <div className="text-6xl mb-4">
                            👤
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-blue-400">{character.name}</span>
                            <span className="text-xs bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">{character.class}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full mb-1">
                            <div
                                className="bg-green-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs text-muted-foreground">{playerHp} / {playerMaxHp} HP</span>
                    </div>
                </CardContent>
            </Card>

            {/* Controls & Log */}
            <div className="flex flex-col gap-4 h-full">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-sm">Combat Log</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[200px] p-4">
                            <div className="space-y-1">
                                {combatLog.map((log, i) => (
                                    <div key={i} className="text-xs text-muted-foreground border-b border-border/10 pb-1 last:border-0">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                        {phase === 'active' && (
                            <>
                                <Button
                                    variant="secondary"
                                    onClick={() => playerAction('basic_attack')}
                                    disabled={turn !== 'player'}
                                    className="h-auto flex flex-col items-start p-3 border-2 border-primary/20 hover:border-primary"
                                >
                                    <span className="font-bold text-sm">Basic Attack</span>
                                    <span className="text-[10px] text-muted-foreground">Deals physical damage</span>
                                </Button>
                                {availableSkills.length > 0 ? availableSkills.map(skill => (
                                    <Button
                                        key={skill.id}
                                        variant="outline"
                                        onClick={() => playerAction(skill.id)}
                                        disabled={turn !== 'player'}
                                        className="h-auto flex flex-col items-start p-3"
                                    >
                                        <span className="font-bold text-sm">{skill.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{skill.description}</span>
                                    </Button>
                                )) : (
                                    <div className="col-span-2 text-center text-muted-foreground text-sm">
                                        No active skills unlocked. Go to Skills tab!
                                    </div>
                                )}
                            </>
                        )}
                        {(phase === 'victory' || phase === 'defeat') && (
                            <Button className="col-span-2 w-full" onClick={endCombat}>
                                {phase === 'victory' ? 'Claim Rewards & Leave' : 'Retreat'}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
