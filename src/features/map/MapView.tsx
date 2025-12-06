import { useGameStore, type ZoneId, type Character, type GameState } from "@/store/gameStore"
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
    character: Character
    travelToZone: GameState['travelToZone']
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
    const { character, travelToZone, resetClass, performRebirth } = useGameStore()

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
                <div className="space-y-4">
                    {/* Ascension (Rebirth) Card */}
                    <Card className="border-yellow-500/50 bg-yellow-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-yellow-400">
                                <RefreshCw className="h-5 w-5 animate-spin-slow" />
                                Temple of Ascension
                            </CardTitle>
                            <CardDescription>
                                Ascend to a higher plane of existence. Resets Level and Skills, but grants <span className="text-yellow-400 font-bold">Ancient Shards</span> and permanent power.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="text-sm text-yellow-200/80">
                                    <p>Current Rebirths: <span className="text-white font-mono">{character.rebirthCount || 0}</span></p>
                                    <p>Ancient Shards: <span className="text-white font-mono">{character.ancientShards || 0}</span></p>
                                    {character.level >= 50 ? (
                                        <p className="mt-2 text-green-400">Ready to Ascend! You will gain {character.level} Shards.</p>
                                    ) : (
                                        <p className="mt-2 text-red-400">Requires Level 50 to Ascend.</p>
                                    )}
                                </div>
                                <Button
                                    variant="default"
                                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
                                    disabled={character.level < 50}
                                    onClick={performRebirth}
                                >
                                    Ascend Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Class Reset Card */}
                    <Card className="border-purple-500/50 bg-purple-950/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-400">
                                <RefreshCw className="h-5 w-5" />
                                Chamber of Reflection
                            </CardTitle>
                            <CardDescription>Change your path. Resets Level to 1 (No Bonus). Requires Level 20.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={character.level < 20}
                                    onClick={() => resetClass('Paladin')}
                                >
                                    Paladin
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={character.level < 20}
                                    onClick={() => resetClass('Archmage')}
                                >
                                    Archmage
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={character.level < 20}
                                    onClick={() => resetClass('Ranger')}
                                >
                                    Ranger
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
