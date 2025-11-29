import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bug } from "lucide-react"
import { useState } from "react"

export function DebugPanel() {
    const { debugAddGold, debugLevelUp, debugRefillStamina, addItem } = useGameStore()
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <Button
                variant="destructive"
                size="icon"
                className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 opacity-50 hover:opacity-100"
                onClick={() => setIsOpen(true)}
            >
                <Bug className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <Card className="fixed bottom-4 right-4 w-64 shadow-xl z-50 border-destructive/50">
            <CardHeader className="py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-mono text-destructive">DEV CONSOLE</CardTitle>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>X</Button>
            </CardHeader>
            <CardContent className="grid gap-2">
                <Button size="sm" variant="outline" onClick={() => debugAddGold(1000)}>+1000 Gold</Button>
                <Button size="sm" variant="outline" onClick={debugLevelUp}>Level Up</Button>
                <Button size="sm" variant="outline" onClick={debugRefillStamina}>Refill Stamina</Button>
                <Button size="sm" variant="outline" onClick={() => {
                    addItem({
                        id: `debug_sword_${Date.now()}`,
                        name: "Debug Slayer",
                        type: "equipment",
                        subtype: "weapon",
                        value: 9999,
                        slot: "weapon",
                        stats: { attack: 100 },
                        classRestriction: ['Paladin'] // Test restriction
                    })
                }}>Spawn Paladin Sword</Button>
                <Button size="sm" variant="outline" onClick={() => {
                    addItem({
                        id: `debug_dagger_${Date.now()}`,
                        name: "Debug Dagger",
                        type: "equipment",
                        subtype: "weapon",
                        value: 500,
                        slot: "weapon",
                        stats: { attack: 20 },
                        classRestriction: ['Ranger'] // Test restriction
                    })
                }}>Spawn Ranger Dagger</Button>
            </CardContent>
        </Card>
    )
}
