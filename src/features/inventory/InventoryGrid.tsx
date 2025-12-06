import { useGameStore, type Item, getItemColor } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Sword, FlaskConical, Package } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function InventoryGrid() {
    const { character, equipItem, moveItem, useItem, getDerivedStats } = useGameStore()
    const inventory = character?.inventory || []
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const derivedStats = getDerivedStats()

    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null) return
        if (draggedIndex === dropIndex) return
        moveItem(draggedIndex, dropIndex)
        setDraggedIndex(null)
    }

    const handleDoubleClick = (item: Item) => {
        if (item.type === 'equipment') {
            equipItem(item)
        } else if (item.type === 'consumable' || item.type === 'material') {
            useItem(item)
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-[1fr_250px]">
            <div className="space-y-6">


                <Card className="h-full select-none">
                    <CardHeader>
                        <CardTitle>Inventory Storage</CardTitle>
                        <CardDescription>{inventory.length} / 50 Slots Used (Drag to Organize, Double-click to Use/Equip)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8">
                                {inventory.map((slot, index) => (
                                    <div
                                        key={slot.item.id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDoubleClick={() => handleDoubleClick(slot.item)}
                                        className={cn(
                                            "group relative flex aspect-square cursor-grab active:cursor-grabbing flex-col items-center justify-center rounded-md border bg-card hover:bg-accent transition-colors",
                                            getItemColor(slot.item.rarity)
                                        )}
                                    >
                                        <div className="mb-2 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                                            {slot.item.type === 'equipment' && slot.item.subtype === 'weapon' ? <Sword className="h-6 w-6" /> :
                                                slot.item.type === 'equipment' ? <Shield className="h-6 w-6" /> :
                                                    slot.item.type === 'consumable' ? <FlaskConical className="h-6 w-6" /> :
                                                        slot.item.icon ? <span className="text-2xl">{slot.item.icon}</span> :
                                                            <Package className="h-6 w-6" />}
                                        </div>
                                        <span className="text-[10px] font-medium truncate w-full text-center px-1 pointer-events-none">{slot.item.name}</span>
                                        {slot.count > 1 && (
                                            <div className="absolute bottom-1 right-1 bg-background/80 text-[10px] font-bold px-1 rounded border">
                                                x{slot.count}
                                            </div>
                                        )}
                                        {slot.item.subtype && character?.equipment[slot.item.subtype]?.id === slot.item.id && (
                                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] px-1 rounded">
                                                Equipped
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {/* Empty Slots (Droppable) */}
                                {Array.from({ length: Math.max(0, 50 - inventory.length) }).map((_, i) => {
                                    const realIndex = inventory.length + i
                                    return (
                                        <div
                                            key={`empty-${i}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, realIndex)}
                                            className="aspect-square rounded-md border border-dashed bg-muted/20"
                                        />
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Character Stats Panel */}
            <Card>
                <CardHeader>
                    <CardTitle>Attributes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {character && (
                        <>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Strength</span>
                                <span className="text-lg font-bold text-red-400">{derivedStats.strength}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Intelligence</span>
                                <span className="text-lg font-bold text-blue-400">{derivedStats.intelligence}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Agility</span>
                                <span className="text-lg font-bold text-green-400">{derivedStats.agility}</span>
                            </div>
                            <div className="border-t pt-4 mt-4 space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Attack</span>
                                    <span>{derivedStats.attack}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Crit Chance</span>
                                    <span>{derivedStats.agility * 0.5}%</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Defense</span>
                                    <span>{derivedStats.defense}</span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
