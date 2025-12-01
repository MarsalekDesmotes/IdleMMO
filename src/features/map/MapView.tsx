import { useGameStore, type ZoneId } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Mountain, Tent, RefreshCw, Trees } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ZoneCardProps {
    id: ZoneId
    name: string
    levelRange: string
    description: string
    icon: LucideIcon
    character: ReturnType<typeof useGameStore>['character']
    travelToZone: ReturnType<typeof useGameStore>['travelToZone']
}

const ZoneCard = ({ id, name, levelRange, description, icon: Icon, character, travelToZone }: ZoneCardProps) => {
    if (!character) return null

    const isCurrent = character.currentZone === id
    const [minLevel] = levelRange.split('-').map(Number)
    const isLocked = character.level < minLevel

        return (
            <Card className={cn("relative overflow-hidden transition-all hover:border-primary", isCurrent && "border-primary bg-primary/5")}>
                {isCurrent && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-primary">
                        <MapPin className="h-3 w-3" /> Current Location
                    </div>
                )}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {name}
                    </CardTitle>
                    <CardDescription>Level {levelRange}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        variant={isCurrent ? "outline" : "default"}
                        disabled={isCurrent || isLocked}
                        onClick={() => travelToZone(id)}
                    >
                        {isCurrent ? "Exploring" : isLocked ? "Locked" : "Travel"}
                    </Button>
                </CardFooter>
            </Card>
    )
}

export function MapView() {
    const { character, travelToZone, resetClass } = useGameStore()

    if (!character) return null

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ZoneCard
                    id="outskirts"
                    name="The Outskirts"
                    levelRange="1-20"
                    description="Safe lands surrounding the stronghold. Good for gathering basic resources."
                    icon={Tent}
                    character={character}
                    travelToZone={travelToZone}
                />
                <ZoneCard
                    id="iron_hills"
                    name="Iron Hills"
                    levelRange="20-40"
                    description="Rugged terrain rich in minerals. Home to the Temple of Rebirth."
                    icon={Mountain}
                    character={character}
                    travelToZone={travelToZone}
                />
                <ZoneCard
                    id="dark_forest"
                    name="Dark Forest"
                    levelRange="40-60"
                    description="A mysterious forest shrouded in ancient magic. Dangerous but rewarding for the brave."
                    icon={Trees}
                    character={character}
                    travelToZone={travelToZone}
                />
            </div>

            {/* Class Reset Temple - Only visible in Iron Hills */}
            {character.currentZone === 'iron_hills' && (
                <Card className="border-purple-500/50 bg-purple-950/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-400">
                            <RefreshCw className="h-5 w-5" />
                            Temple of Rebirth
                        </CardTitle>
                        <CardDescription>Reset your class and be reborn. Requires Level 20.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                className="w-full"
                                disabled={character.level < 20}
                                onClick={() => resetClass('Paladin')}
                            >
                                Reborn as Paladin
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                disabled={character.level < 20}
                                onClick={() => resetClass('Archmage')}
                            >
                                Reborn as Archmage
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                disabled={character.level < 20}
                                onClick={() => resetClass('Ranger')}
                            >
                                Reborn as Ranger
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
