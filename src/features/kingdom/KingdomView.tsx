import { useGameStore, type Buildings } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Castle, Hammer, Book, Trees, Pickaxe, Cpu, Users, UserPlus, UserMinus } from "lucide-react"

export function KingdomView() {
    const { character, constructBuilding, hireWorker, fireWorker } = useGameStore()

    if (!character) return null

    const totalWorkers = character.workers.woodsman + character.workers.miner + character.workers.researcher

    const BuildingCard = ({
        type,
        name,
        icon: Icon,
        description,
        baseCost
    }: {
        type: keyof Buildings,
        name: string,
        icon: any,
        description: string,
        baseCost: { credits: number, wood: number, stone: number }
    }) => {
        const level = character.buildings[type]
        const cost = {
            credits: Math.floor(baseCost.credits * Math.pow(1.5, level)),
            wood: Math.floor(baseCost.wood * Math.pow(1.5, level)),
            stone: Math.floor(baseCost.stone * Math.pow(1.5, level))
        }

        const canAfford = character.gold >= cost.credits &&
            character.resources.wood >= cost.wood &&
            character.resources.stone >= cost.stone

        return (
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Icon className="h-5 w-5" />
                            {name}
                        </CardTitle>
                        <span className="text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded">Lvl {level}</span>
                    </div>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="text-xs space-y-1">
                        <div className={character.gold < cost.credits ? "text-red-500" : "text-muted-foreground"}>
                            Gold: {cost.credits}
                        </div>
                        <div className={character.resources.wood < cost.wood ? "text-red-500" : "text-muted-foreground"}>
                            Wood: {cost.wood}
                        </div>
                        <div className={character.resources.stone < cost.stone ? "text-red-500" : "text-muted-foreground"}>
                            Stone: {cost.stone}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        size="sm"
                        disabled={!canAfford}
                        onClick={() => constructBuilding(type, cost)}
                    >
                        Upgrade
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Resource Overview */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                        <Trees className="h-6 w-6 text-amber-600 mb-2" />
                        <span className="text-2xl font-bold">{character.resources.wood}</span>
                        <span className="text-xs text-muted-foreground">Wood</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                        <Pickaxe className="h-6 w-6 text-stone-500 mb-2" />
                        <span className="text-2xl font-bold">{character.resources.stone}</span>
                        <span className="text-xs text-muted-foreground">Stone</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                        <Cpu className="h-6 w-6 text-blue-400 mb-2" />
                        <span className="text-2xl font-bold">{character.resources.tech}</span>
                        <span className="text-xs text-muted-foreground">Tech</span>
                    </CardContent>
                </Card>
            </div>

            {/* Population & Workers */}
            <Card className="border-primary/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Population & Workers
                    </CardTitle>
                    <CardDescription>
                        Workers automatically collect resources every second while the game is open
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-primary" />
                            <div>
                                <div className="font-medium">Population</div>
                                <p className="text-xs text-muted-foreground">
                                    {totalWorkers} / {character.maxPopulation} workers
                                    {totalWorkers >= character.maxPopulation && (
                                        <span className="text-red-500 ml-1">(Max reached! Upgrade Town Hall)</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-bold text-primary">
                                {totalWorkers}/{character.maxPopulation}
                            </div>
                        </div>
                    </div>

                    {/* Woodsman */}
                    <div className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Trees className="h-5 w-5 text-amber-600" />
                                <div>
                                    <div className="font-medium">Woodsman</div>
                                    <p className="text-xs text-muted-foreground">
                                        Produces {character.workers.woodsman} wood/second
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{character.workers.woodsman}</span>
                                {character.workers.woodsman > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => fireWorker('woodsman')}
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    disabled={totalWorkers >= character.maxPopulation}
                                    onClick={() => hireWorker('woodsman')}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Hire Cost: {50 * (character.workers.woodsman + 1)} gold
                        </div>
                    </div>

                    {/* Miner */}
                    <div className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Pickaxe className="h-5 w-5 text-stone-500" />
                                <div>
                                    <div className="font-medium">Miner</div>
                                    <p className="text-xs text-muted-foreground">
                                        Produces {character.workers.miner} stone/second
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{character.workers.miner}</span>
                                {character.workers.miner > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => fireWorker('miner')}
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    disabled={totalWorkers >= character.maxPopulation}
                                    onClick={() => hireWorker('miner')}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Hire Cost: {50 * (character.workers.miner + 1)} gold
                        </div>
                    </div>

                    {/* Researcher */}
                    <div className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <Cpu className="h-5 w-5 text-blue-400" />
                                <div>
                                    <div className="font-medium">Researcher</div>
                                    <p className="text-xs text-muted-foreground">
                                        Produces {(character.workers.researcher * 0.5).toFixed(1)} tech/second
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{character.workers.researcher}</span>
                                {character.workers.researcher > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 w-7 p-0"
                                        onClick={() => fireWorker('researcher')}
                                    >
                                        <UserMinus className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    disabled={totalWorkers >= character.maxPopulation}
                                    onClick={() => hireWorker('researcher')}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Hire Cost: {50 * (character.workers.researcher + 1)} gold
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Core Buildings */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Core Buildings</span>
                    <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <BuildingCard
                        type="townHall"
                        name="Town Hall"
                        icon={Castle}
                        description="The heart of your kingdom. Increases population limit."
                        baseCost={{ credits: 100, wood: 50, stone: 20 }}
                    />
                </div>
            </div>

            {/* Resource Buildings */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Resource Buildings</span>
                    <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <BuildingCard
                        type="lumberMill"
                        name="Lumber Mill"
                        icon={Trees}
                        description="Increases wood production by 50% per level."
                        baseCost={{ credits: 80, wood: 40, stone: 20 }}
                    />
                    <BuildingCard
                        type="mine"
                        name="Mine"
                        icon={Pickaxe}
                        description="Increases stone production by 50% per level."
                        baseCost={{ credits: 100, wood: 30, stone: 40 }}
                    />
                </div>
            </div>

            {/* Production Buildings */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Production Buildings</span>
                    <div className="h-px flex-1 bg-border"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <BuildingCard
                        type="blacksmith"
                        name="Blacksmith"
                        icon={Hammer}
                        description="Forge better weapons and tools."
                        baseCost={{ credits: 150, wood: 100, stone: 50 }}
                    />
                    <BuildingCard
                        type="library"
                        name="Library"
                        icon={Book}
                        description="Increases tech production by 25% per level. Research technologies."
                        baseCost={{ credits: 200, wood: 150, stone: 100 }}
                    />
                </div>
            </div>
        </div>
    )
}
