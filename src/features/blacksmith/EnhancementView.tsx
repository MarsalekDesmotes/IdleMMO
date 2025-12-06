import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hammer, Sword, Skull, Sparkles } from "lucide-react"
import { useState } from "react"
import type { Item } from "@/store/gameStore"

export function EnhancementView() {
    const { character, enhanceItem } = useGameStore()
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [isEnhancing, setIsEnhancing] = useState(false)

    if (!character) return null

    // Filter equipment items from inventory
    const equipment = character.inventory.filter(slot => slot.item.type === 'equipment')

    const handleEnhance = async () => {
        if (!selectedItem) return
        setIsEnhancing(true)

        // Slight delay for tension
        await new Promise(r => setTimeout(r, 1500))

        const result = await enhanceItem(selectedItem.id)

        setIsEnhancing(false)
        if (result.destroyed) {
            setSelectedItem(null)
        } else {
            // Find updated item
            const updated = character.inventory.find(i => i.item.id === selectedItem.id)?.item
            if (updated) setSelectedItem(updated)
        }
    }

    const currentLevel = selectedItem?.enhancement || 0
    const rates = [100, 90, 80, 70, 60, 50, 30, 15, 5, 1]
    const successRate = rates[currentLevel] || 1
    const goldCost = selectedItem ? 100 * (currentLevel + 1) * (selectedItem.value || 1) : 0
    const canAfford = character.gold >= goldCost

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Inventory List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sword className="h-5 w-5" /> Select Equipment
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px] overflow-y-auto space-y-2">
                    {equipment.length === 0 && <div className="text-muted-foreground text-center py-8">No equipment found.</div>}
                    {equipment.map((slot) => (
                        <div
                            key={slot.item.id}
                            onClick={() => !isEnhancing && setSelectedItem(slot.item)}
                            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent ${selectedItem?.id === slot.item.id ? 'border-primary bg-accent' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{slot.item.icon}</div>
                                <div>
                                    <h4 className="font-medium">
                                        {slot.item.enhancement ? <span className="text-primary mr-1">+{slot.item.enhancement}</span> : ''}
                                        {slot.item.name}
                                    </h4>
                                    <div className="text-xs text-muted-foreground flex gap-2">
                                        {slot.item.stats?.attack && <span>Atk: {slot.item.stats.attack}</span>}
                                        {slot.item.stats?.defense && <span>Def: {slot.item.stats.defense}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Enhancement Anvil */}
            <Card className="relative overflow-hidden border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Hammer className="h-5 w-5 text-orange-500" /> Enhancement Anvil
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 space-y-6">
                    {!selectedItem ? (
                        <div className="text-center text-muted-foreground">Select an item to enhance</div>
                    ) : (
                        <>
                            {/* Item Preview */}
                            <div className="relative group">
                                <div className={`text-6xl p-6 rounded-xl border-4 bg-background transition-all duration-300 ${isEnhancing ? 'animate-bounce border-orange-500 shadow-orange-500/50 shadow-lg' : 'border-muted'}`}>
                                    {selectedItem.icon}
                                </div>
                                {isEnhancing && <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="h-12 w-12 text-yellow-400 animate-spin" />
                                </div>}
                            </div>

                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-bold">
                                    {selectedItem.enhancement ? <span className="text-primary">+{selectedItem.enhancement}</span> : ''} {selectedItem.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">Level {currentLevel} ➔ <span className="text-green-500 font-bold">{currentLevel + 1}</span></p>
                            </div>

                            {/* Stats Preview */}
                            <div className="grid grid-cols-2 gap-4 w-full bg-muted/30 p-4 rounded-lg">
                                <div className="text-center">
                                    <div className="text-xs uppercase text-muted-foreground">Success Rate</div>
                                    <div className={`${successRate < 30 ? 'text-red-500' : 'text-green-500'} font-bold text-xl`}>{successRate}%</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xs uppercase text-muted-foreground">Risk</div>
                                    <div className="text-red-600 font-bold text-xl flex items-center justify-center gap-1">
                                        <Skull className="h-4 w-4" /> DESTROY
                                    </div>
                                </div>
                            </div>

                            {/* Cost & Action */}
                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-sm px-2">
                                    <span>Cost:</span>
                                    <span className={character.gold < goldCost ? "text-red-500" : "text-yellow-500"}>{goldCost} Gold</span>
                                </div>
                                <Button
                                    className="w-full relative overflow-hidden"
                                    size="lg"
                                    disabled={!canAfford || isEnhancing || currentLevel >= 10}
                                    onClick={handleEnhance}
                                >
                                    {isEnhancing ? "Forging..." : "Attempt Enhancement"}
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
