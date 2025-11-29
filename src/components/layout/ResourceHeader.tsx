import { useGameStore } from "@/store/gameStore"
import { Coins, Trees, Mountain, Cpu } from "lucide-react"

export function ResourceHeader() {
    const { character } = useGameStore()

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
                <div className="flex items-center gap-2">
                    <Trees className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">{character.resources.wood}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Wood</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-stone-300" />
                    <span className="font-bold text-stone-300">{character.resources.stone}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Stone</span>
                </div>
                <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-400" />
                    <span className="font-bold text-blue-400">{character.resources.tech}</span>
                    <span className="text-xs text-muted-foreground hidden md:inline">Tech</span>
                </div>
            </div>
            <div className="text-xs text-muted-foreground">
                Zone: <span className="font-medium text-foreground capitalize">{character.currentZone.replace('_', ' ')}</span>
            </div>
        </div>
    )
}
