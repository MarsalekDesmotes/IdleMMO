import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useGameStore } from "@/store/gameStore"
import { useUIStore } from "@/store/uiStore"
import { useEventStore } from "@/store/eventStore"
import { ActionQueue } from "@/features/game/ActionQueue"
import { ActiveAction } from "@/features/game/ActiveAction"
import { InventoryGrid } from "@/features/inventory/InventoryGrid"
import { EquipmentSlots } from "@/features/inventory/EquipmentSlots"
import { CraftingView } from "@/features/crafting/CraftingView"
import { CombatView } from "@/features/combat/CombatView"
import { SkillTree } from "@/features/character/SkillTree"
import { NPCView } from "@/features/world/NPCView"
import { DebugPanel } from "@/components/debug/DebugPanel"
import { ResourceHeader } from "@/components/layout/ResourceHeader"
import { AppShell } from "@/components/layout/AppShell"
import { EventBanner } from "@/components/game/EventBanner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarSelection } from "@/features/character/AvatarSelection"
import { AuthPage } from "@/features/auth/AuthPage"

function App() {
  const { user, isGuest } = useAuthStore()
  const { character, regenerateStamina, regenerateHp } = useGameStore()
  const { checkForEvent } = useEventStore()
  const { currentView } = useUIStore()

  // Stamina, HP, and Event Loop
  useEffect(() => {
    if (!character) return
    const interval = setInterval(() => {
      regenerateStamina(1)
      regenerateHp(0.5)
      checkForEvent()
    }, 1000)
    return () => clearInterval(interval)
  }, [character, regenerateStamina, regenerateHp, checkForEvent])

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

        <EventBanner />

        {currentView === 'dashboard' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 space-y-6">
              <ActiveAction />
              <ActionQueue />
            </div>
            <div className="space-y-6">
              {/* Right Sidebar content if any */}
            </div>
          </div>
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
      </div>

      <DebugPanel />
    </AppShell>
  )
}

export default App
