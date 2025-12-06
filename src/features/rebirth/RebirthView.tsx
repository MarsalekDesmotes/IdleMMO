import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, ArrowUpCircle, AlertTriangle, Zap, Database, Clock } from "lucide-react"

export function RebirthView() {
    const { character, performRebirth, buyTempleUpgrade } = useGameStore()

    if (!character) return null

    const shardsOnRebirth = character.level
    const canRebirth = character.level >= 50
    const upgrades = character.templeUpgrades || { xpBoost: 0, resourceCap: 0, autoSpeed: 0 }

    const getCost = (type: 'xpBoost' | 'resourceCap' | 'autoSpeed', level: number) => {
        if (type === 'xpBoost') return Math.floor(10 * Math.pow(1.5, level))
        if (type === 'resourceCap') return Math.floor(20 * Math.pow(1.5, level))
        return Math.floor(50 * Math.pow(2, level))
    }

    return (
        <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
                        <Flame className="h-8 w-8" />
                        Temple of Eternity
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Sacrifice your progress to ascend higher. Spend Ancient Shards on eternal power.
                    </p>
                </div>
                <div className="p-4 bg-amber-950/30 border border-amber-900/50 rounded-lg text-center min-w-[120px]">
                    <div className="text-xs text-amber-500 uppercase tracking-wider font-semibold">Ancient Shards</div>
                    <div className="text-2xl font-bold text-amber-400">{character.ancientShards || 0}</div>
                </div>
            </div>

            <Tabs defaultValue="ascension" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ascension">Ascension</TabsTrigger>
                    <TabsTrigger value="upgrades">Permanent Upgrades</TabsTrigger>
                </TabsList>

                <TabsContent value="ascension" className="space-y-4 py-4">
                    <Card className="border-amber-900/50 bg-black/20">
                        <CardHeader>
                            <CardTitle className="text-amber-500">Rebirth Ritual</CardTitle>
                            <CardDescription>Reset your journey to gain Ancient Shards.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-amber-950/20 rounded-lg border border-amber-900/30">
                                <div>
                                    <div className="text-sm text-muted-foreground">Current Level</div>
                                    <div className="text-2xl font-bold">{character.level}</div>
                                </div>
                                <div className="text-amber-500">
                                    <ArrowUpCircle className="h-6 w-6 mx-auto" />
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Shards to Gain</div>
                                    <div className="text-2xl font-bold text-amber-400">+{shardsOnRebirth}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    What you will LOSE:
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                    <li>Current Level and XP</li>
                                    <li>All Resources (Wood, Stone, Tech)</li>
                                    <li>Building Levels (Town Hall resets to 1)</li>
                                    <li>Worker assignments</li>
                                    <li>Current Action Queue</li>
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-semibold text-green-400 flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    What you will KEEP:
                                </h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground ml-2">
                                    <li>Ancient Shards</li>
                                    <li>Diamonds</li>
                                    <li>Guild Composition</li>
                                    <li>Achievements</li>
                                    <li>Nexus Prime Status</li>
                                </ul>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full h-16 text-lg bg-amber-600 hover:bg-amber-700 text-white"
                                    disabled={!canRebirth}
                                    onClick={() => {
                                        if (confirm("Are you sure you want to Rebirth? This will reset your progress!")) {
                                            performRebirth()
                                        }
                                    }}
                                >
                                    {canRebirth ? "PERFORM REBIRTH" : "Requires Level 50"}
                                </Button>
                                {!canRebirth && (
                                    <p className="text-center text-xs text-muted-foreground mt-2">
                                        Reach Level 50 to unlock Rebirth.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="upgrades" className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-blue-900/50 bg-black/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-400">
                                    <Zap className="h-5 w-5" />
                                    Wisdom
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground">Increases XP Gain by 10% per level.</div>
                                <div className="text-2xl font-bold text-blue-400">Lv {upgrades.xpBoost}</div>
                                <Button
                                    variant="outline"
                                    className="w-full border-blue-900/50 hover:bg-blue-900/20"
                                    onClick={() => buyTempleUpgrade('xpBoost')}
                                    disabled={character.ancientShards < getCost('xpBoost', upgrades.xpBoost)}
                                >
                                    Upgrade ({getCost('xpBoost', upgrades.xpBoost)} Shards)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-emerald-900/50 bg-black/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-400">
                                    <Database className="h-5 w-5" />
                                    Storage
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground">Increases Resource Cap by 500 per level.</div>
                                <div className="text-2xl font-bold text-emerald-400">Lv {upgrades.resourceCap}</div>
                                <Button
                                    variant="outline"
                                    className="w-full border-emerald-900/50 hover:bg-emerald-900/20"
                                    onClick={() => buyTempleUpgrade('resourceCap')}
                                    disabled={character.ancientShards < getCost('resourceCap', upgrades.resourceCap)}
                                >
                                    Upgrade ({getCost('resourceCap', upgrades.resourceCap)} Shards)
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-900/50 bg-black/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-400">
                                    <Clock className="h-5 w-5" />
                                    Efficiency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground">Increases Worker Speed by 5% per level.</div>
                                <div className="text-2xl font-bold text-purple-400">Lv {upgrades.autoSpeed}</div>
                                <Button
                                    variant="outline"
                                    className="w-full border-purple-900/50 hover:bg-purple-900/20"
                                    onClick={() => buyTempleUpgrade('autoSpeed')}
                                    disabled={character.ancientShards < getCost('autoSpeed', upgrades.autoSpeed)}
                                >
                                    Upgrade ({getCost('autoSpeed', upgrades.autoSpeed)} Shards)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
