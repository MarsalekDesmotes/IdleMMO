import { cn } from "@/lib/utils"

interface ShaderBackgroundProps {
    className?: string
    intensity?: number
}

export function ShaderBackground({ className }: ShaderBackgroundProps) {
    return (
        <div className={cn("absolute inset-0 overflow-hidden rounded-xl", className)}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 animate-gradient-x opacity-50" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Magical Particles (CSS Simulation) */}
            <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping [animation-duration:2s]" />
        </div>
    )
}
