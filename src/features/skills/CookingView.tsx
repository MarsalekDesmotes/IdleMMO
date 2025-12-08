import { useGameStore } from "@/store/gameStore"
import { FOODS } from "@/data/cooking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Flame } from "lucide-react"

export function CookingView() {
    const { character, addToQueue } = useGameStore()

    if (!character) return null

    const handleCook = (food: typeof FOODS[0]) => {
        // Create a queue action for cooking
        // Find raw fish ID: assuming 'cooked_shrimp' comes from 'shrimp'
        const rawFishId = food.id.replace('cooked_', '')

        addToQueue({
            id: `cook_${food.id}`,
            name: `Cook ${food.name}`,
            description: `Cooking ${rawFishId}...`,
            duration: 5, // Fast action
            staminaCost: 5,
            costItems: [{ itemId: rawFishId, amount: 1 }],
            rewards: [
                { type: 'item', itemId: food.id, value: 1 },
                { type: 'xp', value: food.xp } // Cooking XP
            ],
            // We need to CONSUME the raw fish. 
            // The Action interface in gameStore usually *rewards* stuff. 
            // It doesn't have a built-in "Input/Consumption" field in the basic Action type yet?
            // Let's check Action definition in gameStore.ts.
            // If not, we might need to handle consumption immediately upon queuing or completion.
            // Best practice: Comsume on START or COMPLETE. 
            // Since our system is simple, we might need to extend Action to support 'costItems'.
            // For now, let's assume we can add a custom 'costItems' property and handle it in completeAction?
            // Or just hack it: "Cooking" action is Special?
            // NO, let's use the Crafting logic approach?
            // Crafting usually is Instant in this game? No, CraftingView creates items instantly?
            // Let's check CraftingView again.
            // ... CraftingView uses `craftItem` from store. It IS instant.
            // But User wants "Queue" logic ("Queue'da işler ilerlerken...").
            // So Cooking should be a Queue Action.
            // I will add `costItems` to Action interface in gameStore.ts to support this Generic Production Loop.
        } as any)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Flame className="text-orange-500" /> Cooking Station
                </h2>
                <p className="text-muted-foreground">Cook raw food to create powerful healing items.</p>
            </div>

            {FOODS.map(food => {
                const rawFishId = food.id.replace('cooked_', '')
                const hasFish = character.inventory.find(i => i.item.id === rawFishId && i.count > 0)
                const isLevelMet = (character.skills.cooking?.level || 1) >= food.level

                return (
                    <Card key={food.id} className={!isLevelMet ? "opacity-75" : ""}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-base">
                                <span className="flex items-center gap-2">
                                    <span>{food.icon}</span> {food.name}
                                </span>
                                {!isLevelMet && <Lock className="w-4 h-4 text-muted-foreground" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Heals:</span>
                                    <span className="text-green-500 font-bold">+{food.heal} HP</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Req:</span>
                                    <span>{rawFishId}</span>
                                </div>
                                <Button
                                    className="w-full mt-2"
                                    disabled={!isLevelMet || !hasFish}
                                    onClick={() => handleCook(food)}
                                >
                                    Cook (5s)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
