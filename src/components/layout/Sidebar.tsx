import {
    Sword,
    Backpack,
    Hammer, // Keeping for fallback
    Map as MapIcon,
    Castle,
    Swords,
    Store,
    Users,
    ShoppingCart,
    Flame,
    LayoutDashboard,
    Globe,
    Zap,
    Gift,
    PawPrint,
    Skull,
    Settings,
    Scroll
} from "lucide-react"
import { useUIStore } from "@/store/uiStore"
import { useGameStore } from "@/store/gameStore"
import { cn } from "@/lib/utils"
import { UserProfile } from "@/features/character/UserProfile"
import { useAvailableRewards, useAvailableSkills } from "@/hooks/useNotifications"

// Import Icons
import strongholdIcon from "@/assets/icons/stronghold.png"
import combatIcon from "@/assets/icons/combat.png"
import skillsIcon from "@/assets/icons/skills.png"
import inventoryIcon from "@/assets/icons/inventory.png"
import craftingIcon from "@/assets/icons/crafting.png"
import mapImgIcon from "@/assets/icons/map.png"
import worldIcon from "@/assets/icons/world.png"
import kingdomIcon from "@/assets/icons/kingdom.png"
import marketIcon from "@/assets/icons/market.png"
import petsIcon from "@/assets/icons/pets.png"
import dungeonIcon from "@/assets/icons/dungeon.png"
import guildIcon from "@/assets/icons/guild.png"
import rewardsIcon from "@/assets/icons/rewards.png"
import shopIcon from "@/assets/icons/shop.png"
import rebirthIcon from "@/assets/icons/rebirth.png"
import settingsIcon from "@/assets/icons/settings.png"

export function Sidebar() {
    const { currentView, setView } = useUIStore()
    const { character, actionQueue } = useGameStore()
    const hasActiveJobs = actionQueue.length > 0
    const hasAvailableRewards = useAvailableRewards()
    const hasAvailableSkills = useAvailableSkills()

    const navItems = [
        { id: 'dashboard', label: 'Stronghold', icon: LayoutDashboard, iconSrc: strongholdIcon, minLevel: 1, showIdle: true },
        { id: 'combat', label: 'Combat', icon: Sword, iconSrc: combatIcon, minLevel: 1 },
        { id: 'skills', label: 'Skills', icon: Zap, iconSrc: skillsIcon, minLevel: 2, showNotification: hasAvailableSkills },
        { id: 'inventory', label: 'Inventory', icon: Backpack, iconSrc: inventoryIcon, minLevel: 1 },
        { id: 'crafting', label: 'Crafting', icon: Hammer, iconSrc: craftingIcon, minLevel: 1 },
        { id: 'map', label: 'Map', icon: MapIcon, iconSrc: mapImgIcon, minLevel: 1 },
        { id: 'world', label: 'World', icon: Globe, iconSrc: worldIcon, minLevel: 1 },
        { id: 'kingdom', label: 'Kingdom', icon: Castle, iconSrc: kingdomIcon, minLevel: 3 },
        { id: 'market', label: 'Market', icon: ShoppingCart, iconSrc: marketIcon, minLevel: 5 },
        { id: 'pets', label: 'Pets', icon: PawPrint, iconSrc: petsIcon, minLevel: 5 },
        { id: 'dungeon', label: 'Dungeon', icon: Skull, iconSrc: dungeonIcon, minLevel: 10 },
        { id: 'enhancement', label: 'Forge', icon: Hammer, iconSrc: craftingIcon, minLevel: 10 }, // Reusing Crafting Icon
        { id: 'cooking', label: 'Cooking', icon: Scroll, minLevel: 5 }, // No icon generated yet
        { id: 'guild', label: 'Guilds', icon: Users, iconSrc: guildIcon, minLevel: 10 },
        { id: 'arena', label: 'Arena', icon: Swords, iconSrc: combatIcon, minLevel: 10 }, // Reusing Combat Icon
        { id: 'rewards', label: 'Rewards', icon: Gift, iconSrc: rewardsIcon, minLevel: 1, showNotification: hasAvailableRewards },
        { id: 'shop', label: 'Shop', icon: Store, iconSrc: shopIcon, minLevel: 1 },
        { id: 'rebirth', label: 'Rebirth', icon: Flame, iconSrc: rebirthIcon, minLevel: 20 },
        { id: 'settings', label: 'Settings', icon: Settings, iconSrc: settingsIcon, minLevel: 1 },
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
                            {item.iconSrc ? (
                                <img src={item.iconSrc} alt={item.label} className="h-4 w-4 object-contain" />
                            ) : (
                                <item.icon className="h-4 w-4" />
                            )}
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
