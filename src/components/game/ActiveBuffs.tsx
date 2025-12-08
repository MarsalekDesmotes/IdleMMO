import { useGameStore } from "@/store/gameStore"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock } from "lucide-react"

export function ActiveBuffs() {
    const { character } = useGameStore()
    const activeEffects = character?.activeEffects || []

    if (activeEffects.length === 0) return null

    return (
        <TooltipProvider>
            <div className="flex gap-2">
                {activeEffects.map(effect => (
                    <Tooltip key={effect.id} delayDuration={100}>
                        <TooltipTrigger asChild>
                            <div className="relative group cursor-help">
                                <div className="h-8 w-8 rounded-md bg-black/40 border border-[#5c4033] flex items-center justify-center text-lg overflow-hidden shadow-sm hover:border-[#ffd700] transition-colors">
                                    {effect.icon}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-[#2c241b] text-[10px] text-white px-1 rounded-full border border-[#5c4033] flex items-center gap-0.5">
                                    <Clock className="w-2 h-2" />
                                    {Math.ceil(effect.duration)}s
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="w-64 bg-[#2c241b] border-[#5c4033] text-[#e8dcb9]">
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-[#ffd700] font-medieval flex items-center gap-2">
                                    <span>{effect.icon}</span> {effect.name}
                                </h4>
                                <div className="text-xs space-y-1">
                                    <p className="text-muted-foreground">Expires in <span className="text-white">{Math.ceil(effect.duration)}s</span></p>
                                    <div className="border-t border-[#5c4033]/50 pt-1 mt-1">
                                        {Object.entries(effect.stats).map(([stat, val]) => (
                                            <div key={stat} className="flex justify-between">
                                                <span className="capitalize text-[#ccbfa3]">{stat.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                <span className="text-green-400 font-bold">+{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    )
}
