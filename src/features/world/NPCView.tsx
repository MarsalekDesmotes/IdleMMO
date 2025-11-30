import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, CheckCircle2, Circle } from "lucide-react"

export function NPCView() {
    const { character, npcs, quests, acceptQuest, completeQuest } = useGameStore()

    if (!character) return null

    // Filter NPCs by current zone
    const zoneNPCs = npcs.filter(npc => npc.zone === character.currentZone)

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* NPC List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    World - {character.currentZone.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </h3>
                {zoneNPCs.map(npc => (
                    <Card key={npc.id}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{npc.name}</CardTitle>
                            <CardDescription>{npc.title}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            "{npc.description}"
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 pt-0">
                            {npc.quests.map(npcQuest => {
                                const activeQuest = quests.find(q => q.id === npcQuest.id)
                                // If quest is not active, we need to find its definition. 
                                // Since we don't have a separate definitions store, we'll assume quests in store are the definitions.
                                // But wait, INITIAL_QUESTS are in the store.
                                const questDef = activeQuest || quests.find(q => q.id === npcQuest.id)

                                if (!questDef) return null

                                const isCompleted = activeQuest?.isCompleted === true || activeQuest?.status === 'completed'
                                const isAccepted = !!activeQuest && activeQuest.status !== 'completed'

                                return (
                                    <div key={npcQuest.id} className="w-full rounded-md border p-2 bg-muted/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-sm">{questDef.title}</span>
                                            {isCompleted ? <CheckCircle2 className="h-4 w-4 text-green-500" /> :
                                                isAccepted ? <Circle className="h-4 w-4 text-blue-500" /> :
                                                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">New</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{questDef.description}</p>

                                        {isAccepted && !isCompleted && activeQuest && (
                                            <div className="mb-2 space-y-1">
                                                {activeQuest.requirements.map((req, idx) => (
                                                    <div key={idx} className="text-xs flex justify-between items-center">
                                                        <span className="text-muted-foreground">{req.type === 'resource' ? req.target : req.type === 'kill' ? `Kill ${req.target}` : req.type === 'level' ? `Level ${req.target}` : req.target}</span>
                                                        <span className={req.current >= req.amount ? "text-green-500 font-medium" : ""}>
                                                            {req.current} / {req.amount}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div className="text-xs">
                                                Rewards: <span className="text-yellow-500">{questDef.rewards.gold}g</span>, <span className="text-blue-400">{questDef.rewards.xp} XP</span>
                                            </div>
                                            {!isAccepted && !isCompleted && (
                                                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={() => acceptQuest({ id: npcQuest.id })}>
                                                    Accept
                                                </Button>
                                            )}
                                            {isAccepted && !isCompleted && activeQuest && activeQuest.requirements.every(r => r.current >= r.amount) && (
                                                <Button size="sm" className="h-6 text-xs" onClick={() => completeQuest(npcQuest.id)}>
                                                    Complete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </CardFooter>
                    </Card>
                ))}
                {zoneNPCs.length === 0 && (
                    <div className="text-muted-foreground text-sm italic">
                        No one seems to be around...
                    </div>
                )}
            </div>

            {/* Active Quests Log */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Quest Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px]">
                        {quests.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No active quests. Talk to NPCs to find work.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {quests.map(quest => (
                                    <div key={quest.id} className={`p-3 rounded-lg border ${quest.status === 'completed' ? 'opacity-60 bg-muted' : 'bg-card'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-medium text-sm">{quest.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${quest.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                                {quest.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2">{quest.description}</p>
                                        <div className="space-y-1">
                                            {quest.requirements.map((obj, i) => (
                                                <div key={i} className="text-xs flex justify-between">
                                                    <span>{obj.type} {obj.target}</span>
                                                    <span>{obj.current}/{obj.amount}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
