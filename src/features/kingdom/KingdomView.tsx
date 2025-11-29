import { useGameStore, type Buildings } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Castle, Hammer, Book, Trees, Pickaxe, Cpu } from "lucide-react"

export function KingdomView() {
    const { character, constructBuilding } = useGameStore()

    if (!character) return null

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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BuildingCard
                    type="townHall"
                    name="Town Hall"
                    icon={Castle}
                    description="The heart of your kingdom. Unlocks new possibilities."
                    baseCost={{ credits: 100, wood: 50, stone: 20 }}
                />
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
                    description="Research ancient technologies."
                    baseCost={{ credits: 200, wood: 150, stone: 100 }}
                />
            </div>
        </div>
    )
}
