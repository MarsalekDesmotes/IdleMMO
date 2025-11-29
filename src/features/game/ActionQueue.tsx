import { useGameStore, type Action } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Scroll, Hammer, Axe, Pickaxe, Lock, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const JOB_ACTIONS: Action[] = [
    // Outskirts Actions
    {
        id: 'chop_wood',
        name: 'Chop Wood',
        description: 'Gather timber from the forest.',
        duration: 5,
        staminaCost: 10,
        requiredZone: 'outskirts',
        rewards: [
            { type: 'xp', value: 5 },
            { type: 'gold', value: 2 },
            { type: 'resource', resourceId: 'wood', value: 5 }
        ]
    },
    {
        id: 'mine_stone',
        name: 'Mine Stone',
        description: 'Quarry stone from the deposits.',
        duration: 8,
        staminaCost: 15,
        requiredZone: 'outskirts',
        rewards: [
            { type: 'xp', value: 8 },
            { type: 'gold', value: 3 },
            { type: 'resource', resourceId: 'stone', value: 3 }
        ]
    },
    {
        id: 'patrol_village',
        name: 'Patrol Village',
        description: 'Keep the peace in the local hamlet.',
        duration: 10,
        staminaCost: 20,
        requiredZone: 'outskirts',
        rewards: [
            { type: 'xp', value: 15 },
            { type: 'gold', value: 10 }
        ]
    },

    // Global / Building Actions
    {
        id: 'blacksmith_help',
        name: 'Help Blacksmith',
        description: 'Assist in forging simple tools.',
        duration: 20,
        staminaCost: 25,
        requiredBuilding: { type: 'blacksmith', level: 1 },
        rewards: [
            { type: 'xp', value: 30 },
            { type: 'gold', value: 40 }
        ]
    },

    // Iron Hills Actions (Zone 2)
    {
        id: 'deep_mining',
        name: 'Deep Mining',
        description: 'Extract rare minerals from deep shafts.',
        duration: 15,
        staminaCost: 30,
        requiredZone: 'iron_hills',
        rewards: [
            { type: 'xp', value: 25 },
            { type: 'gold', value: 10 },
            { type: 'resource', resourceId: 'stone', value: 10 },
            { type: 'resource', resourceId: 'tech', value: 1 }
        ]
    },
    {
        id: 'study_runes',
        name: 'Study Ancient Runes',
        description: 'Decipher runes found in the mountains.',
        duration: 25,
        staminaCost: 35,
        requiredZone: 'iron_hills',
        rewards: [
            { type: 'xp', value: 50 },
            { type: 'gold', value: 20 },
            { type: 'resource', resourceId: 'tech', value: 5 }
        ]
    },
    {
        id: 'construct_golem',
        name: 'Construct Golem',
        description: 'Assemble a guardian from stone and magic.',
        duration: 45,
        staminaCost: 50,
        requiredZone: 'iron_hills',
        requiredBuilding: { type: 'library', level: 1 },
        rewards: [
            { type: 'xp', value: 100 },
            { type: 'resource', resourceId: 'tech', value: 10 }
        ]
    }
]

export function ActionQueue() {
    const { addToQueue, actionQueue, character } = useGameStore()

    if (!character) return null

    // Filter actions based on zone (if requiredZone is set)
    const availableActions = JOB_ACTIONS.filter(action =>
        !action.requiredZone || action.requiredZone === character.currentZone
    )

    return (
        <TooltipProvider>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Job Queue</CardTitle>
                    <CardDescription>
                        Current Zone: <span className="font-semibold text-primary capitalize">{character.currentZone.replace('_', ' ')}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    {availableActions.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No jobs available in this zone.
                        </div>
                    )}
                    {availableActions.map((action) => {
                        const isBuildingMissing = action.requiredBuilding && character.buildings[action.requiredBuilding.type] < action.requiredBuilding.level
                        const isQueueFull = actionQueue.length >= character.maxQueueSlots
                        const isDisabled = isBuildingMissing || isQueueFull

                        return (
                            <div key={action.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        {action.id.includes('chop') ? <Axe className="h-5 w-5" /> :
                                            action.id.includes('mine') ? <Pickaxe className="h-5 w-5" /> :
                                                action.id.includes('runes') ? <Scroll className="h-5 w-5" /> :
                                                    action.id.includes('blacksmith') ? <Hammer className="h-5 w-5" /> :
                                                        action.id.includes('golem') ? <Sparkles className="h-5 w-5" /> :
                                                            <Map className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm flex items-center gap-2">
                                            {action.name}
                                            {isBuildingMissing && <Lock className="h-3 w-3 text-muted-foreground" />}
                                        </h4>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            <span>{action.duration}s</span>
                                            {action.rewards.map((reward, i) => (
                                                <span key={i}>
                                                    • {reward.value} {reward.type === 'resource' ? reward.resourceId : reward.type === 'gold' ? 'Gold' : 'XP'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                disabled={isDisabled}
                                                onClick={() => addToQueue(action)}
                                            >
                                                {isBuildingMissing ? "Locked" : "Queue"}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {isBuildingMissing ? `Requires ${action.requiredBuilding?.type} Level ${action.requiredBuilding?.level}.` :
                                            isQueueFull ? "Queue is full." :
                                                "Add to task queue."}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
