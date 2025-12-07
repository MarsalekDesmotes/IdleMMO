import { useMemo } from "react"
import { useGameStore } from "@/store/gameStore"
import { useUIStore } from "@/store/uiStore"
import { TrendingUp } from "lucide-react"

// Import Icons
import goldIcon from "@/assets/icons/gold.png"
import woodIcon from "@/assets/icons/wood.png"
import stoneIcon from "@/assets/icons/stone.png"
import techIcon from "@/assets/icons/tech.png"
import honorIcon from "@/assets/icons/honor.png"

export function ResourceHeader() {
    const { character } = useGameStore()
    const { setView } = useUIStore()

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
        <div className="flex w-full items-center justify-between rounded-sm border-y border-primary/30 bg-card/90 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2 border-r border-border pr-6">
                    <span className="text-sm font-bold text-primary font-medieval">Lvl {character.level}</span>
                </div>

                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-primary/10 p-1 rounded transition-colors"
                    onClick={() => setView('leaderboard')}
                    title="View Leaderboard"
                >
                    <img src={honorIcon} alt="Honor" className="h-5 w-5 object-contain" />
                    <span className="font-bold text-purple-400 font-medieval">{character.honor?.lifetime || 0}</span>
                </div>

                <div className="flex items-center gap-2">
                    <img src={goldIcon} alt="Gold" className="h-5 w-5 object-contain" />
                    <span className="font-bold text-amber-500 font-medieval tracking-widest">{character.gold}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline font-body">Gold</span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <img src={woodIcon} alt="Wood" className="h-5 w-5 object-contain" />
                        <span className="font-bold text-amber-700/80 font-medieval tracking-widest">{character.resources.wood}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline font-body">Wood</span>
                    </div>
                    {resourceRates.wood > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-green-500/70 ml-6 font-mono">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.wood}/s</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <img src={stoneIcon} alt="Stone" className="h-5 w-5 object-contain" />
                        <span className="font-bold text-stone-400 font-medieval tracking-widest">{character.resources.stone}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline font-body">Stone</span>
                    </div>
                    {resourceRates.stone > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-stone-400/70 ml-6 font-mono">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.stone}/s</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <img src={techIcon} alt="Tech" className="h-5 w-5 object-contain" />
                        <span className="font-bold text-blue-400 font-medieval tracking-widest">{character.resources.tech}</span>
                        <span className="text-xs text-muted-foreground hidden md:inline font-body">Tech</span>
                    </div>
                    {resourceRates.tech > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-blue-400/70 ml-6 font-mono">
                            <TrendingUp className="h-3 w-3" />
                            <span>+{resourceRates.tech}/s</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-xs text-muted-foreground font-body">
                <span className="opacity-70">Region:</span> <span className="font-bold text-primary capitalize font-medieval text-sm">{character.currentZone.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
            </div>
        </div>
    )
}
