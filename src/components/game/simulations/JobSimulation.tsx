import { motion, AnimatePresence } from "framer-motion"
import { Axe, Pickaxe, Map as MapIcon, Hammer, Sword, Sparkles, Ghost, Hexagon } from "lucide-react"

interface JobSimulationProps {
    jobType: string
    isActive: boolean
}

export function JobSimulation({ jobType, isActive }: JobSimulationProps) {
    if (!isActive) return null

    const type = jobType.toLowerCase()

    // --- Type Detection Helpers ---
    const isWood = type.includes('wood') || type.includes('chop') || type.includes('lumber') || type.includes('forest')
    const isMining = type.includes('mine') || type.includes('stone') || type.includes('rock') || type.includes('ore') || type.includes('basalt')
    const isCombat = type.includes('hunt') || type.includes('patrol') || type.includes('wolf') || type.includes('creature') || type.includes('fight')
    const isMagic = type.includes('magic') || type.includes('runes') || type.includes('essence') || type.includes('study') || type.includes('dark') || type.includes('learn') || type.includes('golem')
    const isCrafting = type.includes('craft') || type.includes('smith') || type.includes('help') || type.includes('construct') || type.includes('work')
    const isExploration = type.includes('explore') || type.includes('scout') || type.includes('travel') || type.includes('gather') || type.includes('collect')

    // 1. Woodcutting Animation
    if (isWood) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-sky-900/10 rounded-lg overflow-hidden border border-emerald-900/20">
                <div className="absolute bottom-0 w-full h-4 bg-[#3e2723]" />
                {/* Tree */}
                <motion.div
                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative z-10 flex flex-col items-center"
                >
                    <div className="w-12 h-16 bg-green-800 rounded-t-full rounded-b-lg shadow-lg border-b-4 border-green-900" />
                    <div className="w-4 h-6 bg-[#5d4037]" />
                </motion.div>
                {/* Axe */}
                <motion.div
                    animate={{ rotate: [0, -45, 0], x: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "backIn" }}
                    className="absolute right-1/2 translate-x-8 top-1/2 z-20"
                >
                    <Axe className="h-8 w-8 text-slate-300 fill-slate-400 drop-shadow-md" />
                </motion.div>
                {/* Chips */}
                <AnimatePresence>
                    {[1, 2].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 1, y: 0, x: 0 }}
                            animate={{ opacity: 0, y: 10, x: (i === 1 ? -10 : 10) }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                            className="absolute bottom-6 left-1/2 w-1.5 h-1.5 bg-[#8d6e63] rounded-full"
                        />
                    ))}
                </AnimatePresence>
            </div>
        )
    }

    // 2. Mining Animation (Improved)
    if (isMining) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-stone-900/10 rounded-lg overflow-hidden border border-stone-700/20">
                <div className="absolute bottom-0 w-full h-4 bg-[#1c1917]" />

                {/* Rock Node */}
                <motion.div
                    animate={{ scale: [1, 0.97, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="relative z-10 mt-4"
                >
                    <div className="w-16 h-12 bg-stone-700 rounded-lg border-2 border-stone-600 shadow-inner relative overflow-hidden">
                        <div className="absolute top-1 left-2 w-4 h-4 bg-stone-500/30 rounded-full blur-[1px]" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 bg-stone-800/30 rounded-full blur-[2px]" />
                    </div>
                </motion.div>

                {/* Pickaxe Swing */}
                <motion.div
                    style={{ originX: 1, originY: 1 }}
                    animate={{ rotate: [0, -75, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "circIn" }}
                    className="absolute left-[54%] top-[-10%] z-20"
                >
                    <Pickaxe className="h-10 w-10 text-stone-300 fill-stone-400 drop-shadow-xl" />
                </motion.div>

                {/* Impact Sparks */}
                <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                    className="absolute top-[45%] left-[50%] z-30 transform -translate-x-1/2"
                >
                    <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-200" />
                </motion.div>
            </div>
        )
    }

    // 3. Combat / Hunting Animation
    if (isCombat) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-red-900/10 rounded-lg overflow-hidden border border-red-900/20">
                {/* Enemy (Ghost/Icon) */}
                <motion.div
                    animate={{ x: [0, 5, -5, 0], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="relative z-10 mr-8"
                >
                    <Ghost className="h-10 w-10 text-red-500/80" />
                </motion.div>

                {/* Player Weapons Clash */}
                <motion.div
                    animate={{ x: [0, -15, 0], rotate: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="absolute right-1/3 z-20"
                >
                    <Sword className="h-8 w-8 text-slate-300 fill-slate-500" />
                </motion.div>

                {/* Hit Effect */}
                <motion.div
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                    className="absolute left-1/2 w-8 h-8 rounded-full bg-red-500/30 blur-md z-0"
                />
            </div>
        )
    }

    // 4. Magic / Research Animation
    if (isMagic) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-violet-900/10 rounded-lg overflow-hidden border border-violet-900/20">
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="relative z-10"
                >
                    <Hexagon className="h-12 w-12 text-violet-500 fill-violet-900/20" strokeWidth={1} />
                </motion.div>

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute z-20"
                >
                    <Sparkles className="h-6 w-6 text-violet-300" />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent" />
            </div>
        )
    }

    // 5. Crafting / Blacksmith / Help Villager Animation
    if (isCrafting) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-orange-900/10 rounded-lg overflow-hidden border border-orange-900/20">
                {/* Anvil */}
                <div className="relative z-10 mt-6">
                    <div className="w-16 h-8 bg-zinc-700 rounded-md shadow-lg" />
                    <div className="w-8 h-6 bg-zinc-800 mx-auto" />
                    <div className="w-20 h-2 bg-zinc-900 mx-auto rounded-full" />
                </div>

                {/* Hammer - Adjusted Origin to look less 'faulty' */}
                <motion.div
                    style={{ originX: 0.8, originY: 1 }}
                    animate={{ rotate: [0, -60, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "circIn" }}
                    className="absolute top-0 right-1/3 z-20"
                >
                    <Hammer className="h-10 w-10 text-zinc-400 fill-zinc-600" />
                </motion.div>

                {/* Heat/Sparks */}
                <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
                    className="absolute top-8 left-1/2 z-30"
                >
                    <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_orange] blur-[1px]" />
                </motion.div>
            </div>
        )
    }

    // 6. Generic Exploration
    if (isExploration) {
        return (
            <div className="relative h-24 w-full flex items-center justify-center bg-amber-900/10 rounded-lg overflow-hidden border border-amber-900/20">
                <motion.div
                    animate={{ x: [-5, 5, -5], rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="relative z-10"
                >
                    <MapIcon className="h-10 w-10 text-amber-600 drop-shadow-md" />
                </motion.div>
                <motion.div className="absolute bottom-2 w-32 h-1 bg-amber-900/20 rounded-full" />
            </div>
        )
    }

    // Default Generic
    return (
        <div className="relative h-24 w-full flex items-center justify-center bg-background/20 rounded-lg overflow-hidden border border-dashed border-primary/20">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="flex items-center gap-2 text-muted-foreground"
            >
                <div className="h-3 w-3 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-mono">Simulating Task...</span>
            </motion.div>
        </div>
    )
}
