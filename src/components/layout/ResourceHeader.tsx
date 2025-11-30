import { useMemo } from "react"
import { useGameStore } from "@/store/gameStore"
import { Coins, Trees, Mountain, Cpu, TrendingUp } from "lucide-react"

export function ResourceHeader() {
    const { character } = useGameStore()

    const resourceRates = useMemo(() => {
        if (!character) return { wood: 0, stone: 0, tech: 0 }

        // Base worker production
        let woodRate = character.workers.woodsman || 0
        let stoneRate = character.workers.miner || 0
        let techRate = Math.floor((character.workers.researcher || 0) * 0.5)

        // Building bonuses
        // Lumber Mill: +50% wood production per level
        if (character.buildings.lumberMill > 0) {
            woodRate = Math.floor(woodRate * (1 + character.buildings.lumberMill * 0.5))
        }

        // Mine: +50% stone production per level
        if (character.buildings.mine > 0) {
            stoneRate = Math.floor(stoneRate * (1 + character.buildings.mine * 0.5))
        }

        // Library: +25% tech production per level
        if (character.buildings.library > 0) {
            techRate = Math.floor(techRate * (1 + character.buildings.library * 0.25))
        }

        return { wood: woodRate, stone: stoneRate, tech: techRate }
    }, [character])

    if (!character) return null

    return (
        <div className="flex w-full items-center justify-between rounded-lg border bg-card/50 p-3 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 border-r pr-6">
                    <span className="text-sm font-bold text-primary">Lvl {character.level}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-bold text-yellow-500">{character.gold}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Gold</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <Trees className="h-4 w-4 text-green-600" />
                        <span className="font-bold text-green-600">{character.resources.wood}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline">Wood</span>
                    </div>
                    {resourceRates.wood > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-green-500/70 ml-6">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.wood}/s</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <Mountain className="h-4 w-4 text-stone-300" />
                        <span className="font-bold text-stone-300">{character.resources.stone}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline">Stone</span>
                    </div>
                    {resourceRates.stone > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400/70 ml-6">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.stone}/s</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-400" />
                        <span className="font-bold text-blue-400">{character.resources.tech}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline">Tech</span>
                    </div>
                    {resourceRates.tech > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400/70 ml-6">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.tech}/s</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-xs text-muted-foreground">
                World - <span className="font-medium text-foreground capitalize">{character.currentZone.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
            </div>
        </div>
    )
}
