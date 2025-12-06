import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useGameStore } from "@/store/gameStore"
import { useUIStore } from "@/store/uiStore"
import { useEventStore } from "@/store/eventStore"
import { ActionQueue } from "@/features/game/ActionQueue"
import { ActiveAction } from "@/features/game/ActiveAction"
import { GameLog } from "@/features/game/GameLog"
import { InventoryGrid } from "@/features/inventory/InventoryGrid"
import { EquipmentSlots } from "@/features/inventory/EquipmentSlots"
import { CraftingView } from "@/features/crafting/CraftingView"
import { NPCView } from "@/features/world/NPCView"
import { MapView } from "@/features/map/MapView"
import { KingdomView } from "@/features/kingdom/KingdomView"
import { CombatView } from "@/features/combat/CombatView"
import { ArenaView } from "@/features/combat/ArenaView"
import { SkillTree } from "@/features/character/SkillTree"

import { LeaderboardView } from "@/features/leaderboard/LeaderboardView"
import { DailyQuests } from "@/features/quests/DailyQuests"
import { HourlyReward } from "@/features/rewards/HourlyReward"
import { PeriodicRewards } from "@/features/rewards/PeriodicRewards"
import { MarketView } from "@/features/economy/MarketView"
import { GuildView } from "@/features/social/GuildView"
import { DebugPanel } from "@/components/debug/DebugPanel"
import { ResourceHeader } from "@/components/layout/ResourceHeader"
import { AppShell } from "@/components/layout/AppShell"
import { EventBanner } from "@/components/game/EventBanner"
import { GuestAccountLink } from "@/components/game/GuestAccountLink"
import { AvatarSelection } from "@/features/character/AvatarSelection"
import { AuthPage } from "@/features/auth/AuthPage"
import { ShopView } from "@/features/shop/ShopView"
import { RebirthView } from "@/features/rebirth/RebirthView"
import { PetView } from "@/features/pets/PetView"
import { DungeonView } from "@/features/dungeon/DungeonView"
import { CookingView } from "@/features/skills/CookingView"
import { EnhancementView } from "@/features/blacksmith/EnhancementView"
import { OfflineProgressModal } from "@/components/OfflineProgressModal"

function App() {
  const { user, isGuest } = useAuthStore()
  const { character, regenerateStamina, regenerateHp, processAutoResources } = useGameStore()
  const { checkForEvent } = useEventStore()
  const { currentView } = useUIStore()

  // Stamina, HP, Event Loop, and Auto Resource Processing
  useEffect(() => {
    if (!character) return
    const interval = setInterval(() => {
      regenerateStamina(1)
      regenerateHp(0.5)
      checkForEvent()
      processAutoResources()
    }, 1000)
    return () => clearInterval(interval)
  }, [character, regenerateStamina, regenerateHp, checkForEvent, processAutoResources])

  if (!user && !isGuest) {
    return <AuthPage />
  }

  if (!character) {
    return <AvatarSelection />
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <ResourceHeader />

        <GuestAccountLink />

        <EventBanner />

        {currentView === 'dashboard' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 space-y-6">
              <ActiveAction />
              <ActionQueue />
            </div>
            <div className="space-y-6">
              <HourlyReward />
              <DailyQuests />
              <GameLog />
            </div>
          </div>
        )}

        {currentView === 'rewards' && (
          <PeriodicRewards />
        )}

        {currentView === 'inventory' && (
          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <InventoryGrid />
            <EquipmentSlots />
          </div>
        )}

        {currentView === 'crafting' && (
          <CraftingView />
        )}

        {currentView === 'combat' && (
          <CombatView />
        )}

        {currentView === 'world' && (
          <NPCView />
        )}

        {currentView === 'skills' && (
          <SkillTree />
        )}

        {currentView === 'map' && (
          <MapView />
        )}

        {currentView === 'kingdom' && (
          <KingdomView />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView />
        )}

        {currentView === 'arena' && (
          <ArenaView />
        )}

        {currentView === 'market' && (
          <MarketView />
        )}

        {currentView === 'guild' && (
          <GuildView />
        )}

        {currentView === 'shop' && (
          <ShopView />
        )}

        {currentView === 'rebirth' && (
          <RebirthView />
        )}

        {currentView === 'pets' && (
          <PetView />
        )}

        {currentView === 'dungeon' && (
          <DungeonView />
        )}

        {currentView === 'cooking' && (
          <CookingView />
        )}

        {currentView === 'enhancement' && (
          <EnhancementView />
        )}

      </div>

      <DebugPanel />
      <OfflineProgressModal />
    </AppShell>
  )
}

export default App
