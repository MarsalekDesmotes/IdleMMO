
import { useTutorialStore, type TutorialStep } from "@/store/tutorialStore"
import { useUIStore } from "@/store/uiStore"
import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { SoundManager } from "@/lib/audio/SoundManager"

const TUTORIAL_CONTENT: Record<TutorialStep, { title: string, description: string, targetView?: string }> = {
    'WELCOME': {
        title: "Welcome, Traveler!",
        description: "Your journey in this kingdom begins now. You start with nothing but your bare hands. Gather resources to survive.",
        targetView: 'dashboard'
    },
    'GATHER_WOOD': {
        title: "The First Step",
        description: "We need wood to craft a weapon. Go to the Stronghold and chop some wood.",
        targetView: 'dashboard'
    },
    'CRAFT_WEAPON': {
        title: "Crafting a Blade",
        description: "Excellent. Now go to the 'Crafting' tab and create a Wooden Sword.",
        targetView: 'crafting'
    },
    'OPEN_INVENTORY': {
        title: "Check Your Bag",
        description: "You have your weapon! Open your 'Inventory' to manage your gear.",
        targetView: 'inventory'
    },
    'EQUIP_WEAPON': {
        title: "Gear Up",
        description: "Click on the Wooden Sword in your bag to equip it. Prepare for battle.",
        targetView: 'inventory'
    },
    'ENTER_COMBAT': {
        title: "To Battle!",
        description: "You are armed. Go to the 'Combat' tab and find an enemy to fight.",
        targetView: 'combat'
    },
    'COMPLETED': {
        title: "Tutorial Complete",
        description: "You know the basics. Explore the world, craft better gear, and build your kingdom!",
    }
}

export function TutorialOverlay() {
    const { currentStep, isVisible, advanceStep, setVisible } = useTutorialStore()
    const { currentView } = useUIStore()
    const { character } = useGameStore()
    const [isAnimating, setIsAnimating] = useState(false)

    // Tutorial Triggers
    useEffect(() => {
        if (!isVisible) return

        // 1. Gather Wood -> Craft Weapon
        if (currentStep === 'GATHER_WOOD' && (character?.resources?.wood || 0) >= 3) {
            advanceStep('CRAFT_WEAPON')
        }

        // 2. Craft Weapon -> Open Inventory
        const hasWeapon = character?.inventory.some(slot => slot.item.type === 'equipment' && slot.item.subtype === 'weapon')
        // Advance if they have a weapon (and haven't equipped it yet, or even if they have)
        if (currentStep === 'CRAFT_WEAPON' && hasWeapon) {
            advanceStep('OPEN_INVENTORY')
        }

        // 3. Open Inventory -> Equip Weapon
        if (currentStep === 'OPEN_INVENTORY' && currentView === 'inventory') {
            advanceStep('EQUIP_WEAPON')
        }

        // 4. Equip Weapon -> Enter Combat
        if (currentStep === 'EQUIP_WEAPON' && character?.equipment?.weapon) {
            advanceStep('ENTER_COMBAT')
        }

        // 5. Enter Combat -> Complete
        if (currentStep === 'ENTER_COMBAT' && currentView === 'combat') {
            const timer = setTimeout(() => advanceStep('COMPLETED'), 2000)
            return () => clearTimeout(timer)
        }
    }, [currentStep, character?.resources?.wood, currentView, character?.equipment?.weapon, character?.inventory, advanceStep, isVisible])

    // Animation Effect
    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true)
            SoundManager.getInstance().playClick(0.5)
            const timer = setTimeout(() => setIsAnimating(false), 500)
            return () => clearTimeout(timer)
        }
    }, [currentStep, isVisible])

    // Render Logic
    if (!isVisible || currentStep === 'COMPLETED') return null

    const content = TUTORIAL_CONTENT[currentStep]

    const handleContinue = () => {
        SoundManager.getInstance().playClick()
        if (currentStep === 'WELCOME') {
            advanceStep('GATHER_WOOD')
        }
    }

    const handleClose = () => {
        setVisible(false)
    }

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[400px] pointer-events-none">
            <div className={cn(
                "pointer-events-auto transition-all duration-500 ease-out transform",
                isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
            )}>
                <Card className="border-2 border-[#d4af37] bg-[#e8dcb9]/95 shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur">
                    <CardHeader className="py-3 px-4 border-b border-[#5c4033]/10 flex flex-row items-center justify-between space-y-0 text-[#3e2723]">
                        <CardTitle className="text-lg font-medieval flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />
                            {content.title}
                        </CardTitle>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-[#5c4033]/50 hover:text-[#5c4033]" onClick={handleClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="py-3 px-4 text-[#2c241b] text-sm leading-relaxed font-medium">
                        {content.description}
                    </CardContent>
                    <CardFooter className="py-2 px-4 bg-[#f5e6c8]/50 rounded-b-lg flex justify-end">
                        {currentStep === 'WELCOME' ? (
                            <Button size="sm" onClick={handleContinue} className="bg-[#5c4033] text-[#d4af37] hover:bg-[#3e2723] font-bold font-medieval tracking-wide">
                                Begin Journey <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        ) : (
                            <div className="text-xs text-[#5c4033]/60 italic flex items-center gap-1.5 animate-pulse">
                                <div className="h-1.5 w-1.5 rounded-full bg-[#5c4033]/40" />
                                Action Required...
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
