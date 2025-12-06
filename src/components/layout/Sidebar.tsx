import {
    Sword,
    Backpack,
    Hammer,
    Map as MapIcon,
    Castle,
    Swords,
    Store,
    Users,
    ShoppingCart,
    Flame,
    LayoutDashboard, // Kept for 'dashboard'
    Globe,           // Kept for 'world'
    Zap,             // Kept for 'skills'
    Gift,            // Kept for 'rewards'
    PawPrint,        // Kept for 'pets'
    Skull,           // Added for 'dungeon'
    Settings,        // Added for 'settings'
    Scroll           // Added for 'cooking'
} from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"
import { UserProfile } from "@/features/character/UserProfile"
import { useAvailableRewards, useAvailableSkills } from "@/hooks/useNotifications"

export function Sidebar() {
    const { currentView, setView } = useUIStore()
    const { character, actionQueue } = useGameStore()
    const hasActiveJobs = actionQueue.length > 0
    const hasAvailableRewards = useAvailableRewards()
    const hasAvailableSkills = useAvailableSkills()

    const navItems = [
        { id: 'dashboard', label: 'Stronghold', icon: LayoutDashboard, minLevel: 1, showIdle: true },
        { id: 'combat', label: 'Combat', icon: Sword, minLevel: 1 },
        { id: 'skills', label: 'Skills', icon: Zap, minLevel: 2, showNotification: hasAvailableSkills },
        { id: 'inventory', label: 'Inventory', icon: Backpack, minLevel: 1 },
        { id: 'crafting', label: 'Crafting', icon: Hammer, minLevel: 1 },
        { id: 'map', label: 'Map', icon: MapIcon, minLevel: 1 }, // Changed to MapIcon
        { id: 'world', label: 'World', icon: Globe, minLevel: 1 },
        { id: 'kingdom', label: 'Kingdom', icon: Castle, minLevel: 3 },
        { id: 'market', label: 'Market', icon: ShoppingCart, minLevel: 5 }, // Changed to ShoppingCart
        { id: 'pets', icon: PawPrint, label: 'Pets', minLevel: 5 },
        { id: 'dungeon', icon: Skull, label: 'Dungeon', minLevel: 10 },
        { id: 'enhancement', icon: Hammer, label: 'Forge', minLevel: 10 }, // Enhancement Link
        { id: 'cooking', icon: Scroll, label: 'Cooking', minLevel: 5 }, // Changed to ShoppingCart
        { id: 'guild', label: 'Guilds', icon: Users, minLevel: 10 },
        { id: 'arena', label: 'Arena', icon: Swords, minLevel: 10 },
        { id: 'rewards', label: 'Rewards', icon: Gift, minLevel: 1, showNotification: hasAvailableRewards },
        { id: 'shop', label: 'Shop', icon: Store, minLevel: 1 },
        { id: 'rebirth', label: 'Rebirth', icon: Flame, minLevel: 20 },
        { id: 'pets', label: 'Companions', icon: PawPrint, minLevel: 5 },
        { id: 'cooking', label: 'Cooking', icon: Scroll, minLevel: 5 }, // Added Cooking link
        { id: 'settings', label: 'Settings', icon: Settings, minLevel: 1 }, // Added Settings link
    ]

    return (
        <aside className="w-64 border-r bg-card/30 flex flex-col hidden md:flex z-10">
            <div className="p-6 border-b border-border/50">
                <h1 className="text-2xl font-bold tracking-tighter text-primary">IdleAgeMMO</h1>
                <p className="text-xs text-muted-foreground">Protocol v0.2.0</p>
            </div>

            <UserProfile />
            {character?.isPrime && (
                <div className="mx-6 mb-2 px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded text-center text-xs font-bold text-blue-400">
                    NEXUS PRIME ACTIVE
                </div>
            )}

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isLocked = (character?.level || 1) < item.minLevel
                    const showIdle = item.showIdle && !hasActiveJobs && !isLocked
                    const showNotification = item.showNotification && !isLocked
                    return (
                        <button
                            key={item.id}
                            onClick={() => !isLocked && setView(item.id as any)}
                            disabled={isLocked}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
                                currentView === item.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                isLocked && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                            {showIdle && (
                                <span className="ml-auto text-xs text-muted-foreground/70 animate-pulse">z z z</span>
                            )}
                            {showNotification && (
                                <span className="ml-auto h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                            )}
                            {isLocked && <span className="ml-auto text-[10px] text-muted-foreground">Lvl {item.minLevel}</span>}
                        </button>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium">Server Status</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs text-muted-foreground">Online (42ms)</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
