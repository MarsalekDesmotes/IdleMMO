import { useGameStore, type Recipe } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Hammer, Lock, Shield, Sword } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

const RECIPES: Recipe[] = [
    {
        id: 'iron_sword',
        name: 'Iron Sword',
        description: 'A sturdy blade for combat.',
        goldCost: 50,
        ingredients: [
            { itemId: 'wood', amount: 20 },
            { itemId: 'stone', amount: 40 }
        ],
        requiredBuilding: 'blacksmith',
        requiredBuildingLevel: 1,
        craftingTime: 10,
        xpReward: 20,
        result: {
            id: 'iron_sword',
            name: 'Iron Sword',
            type: 'equipment',
            subtype: 'weapon',
            value: 50,
            stats: { attack: 5 }
        }
    },
    {
        id: 'iron_shield',
        name: 'Iron Shield',
        description: 'Basic protection.',
        goldCost: 40,
        ingredients: [
            { itemId: 'wood', amount: 30 },
            { itemId: 'stone', amount: 30 }
        ],
        requiredBuilding: 'blacksmith',
        requiredBuildingLevel: 1,
        craftingTime: 10,
        xpReward: 15,
        result: {
            id: 'iron_shield',
            name: 'Iron Shield',
            type: 'equipment',
            subtype: 'weapon', // Using weapon slot for now as offHand isn't fully supported
            value: 40,
            stats: { defense: 3 }
        }
    },
    {
        id: 'steel_pickaxe',
        name: 'Steel Pickaxe',
        description: 'Improved mining tool.',
        goldCost: 100,
        ingredients: [
            { itemId: 'wood', amount: 50 },
            { itemId: 'stone', amount: 100 },
            { itemId: 'tech', amount: 10 }
        ],
        requiredBuilding: 'blacksmith',
        requiredBuildingLevel: 2,
        craftingTime: 20,
        xpReward: 50,
        result: {
            id: 'steel_pickaxe',
            name: 'Steel Pickaxe',
            type: 'equipment',
            subtype: 'weapon',
            value: 100,
            stats: { attack: 4 }
        }
    }
]

export function CraftingView() {
    const { character, craftItem } = useGameStore()

    if (!character) return null

    return (
        <TooltipProvider>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {RECIPES.map((recipe) => {
                    const buildingLevel = recipe.requiredBuilding ? character.buildings[recipe.requiredBuilding] : 0
                    const isBuildingMet = !recipe.requiredBuilding || buildingLevel >= (recipe.requiredBuildingLevel || 0)

                    // Check ingredients
                    const hasIngredients = recipe.ingredients.every(ing => {
                        if (ing.itemId === 'wood') return character.resources.wood >= ing.amount
                        if (ing.itemId === 'stone') return character.resources.stone >= ing.amount
                        if (ing.itemId === 'tech') return character.resources.tech >= ing.amount
                        // Check inventory for other items
                        const invItem = character.inventory.find(i => i.item.id === ing.itemId)
                        return invItem && invItem.count >= ing.amount
                    })

                    const canAfford = character.gold >= (recipe.goldCost || 0) && hasIngredients

                    const isDisabled = !isBuildingMet || !canAfford

                    return (
                        <Card key={recipe.id} className={!isBuildingMet ? "opacity-75 bg-muted/50" : ""}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        {recipe.id.includes('sword') ? <Sword className="h-4 w-4" /> :
                                            recipe.id.includes('shield') ? <Shield className="h-4 w-4" /> :
                                                <Hammer className="h-4 w-4" />}
                                        {recipe.name}
                                    </span>
                                    {!isBuildingMet && <Lock className="h-4 w-4 text-muted-foreground" />}
                                </CardTitle>
                                <CardDescription className="text-xs">{recipe.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="text-xs space-y-1">
                                    {recipe.goldCost && (
                                        <div className={character.gold < recipe.goldCost ? "text-red-500" : "text-muted-foreground"}>
                                            Gold: {recipe.goldCost}
                                        </div>
                                    )}
                                    {recipe.ingredients.map(ing => {
                                        let current = 0
                                        if (ing.itemId === 'wood') current = character.resources.wood
                                        else if (ing.itemId === 'stone') current = character.resources.stone
                                        else if (ing.itemId === 'tech') current = character.resources.tech
                                        else {
                                            const invItem = character.inventory.find(i => i.item.id === ing.itemId)
                                            current = invItem ? invItem.count : 0
                                        }

                                        return (
                                            <div key={ing.itemId} className={current < ing.amount ? "text-red-500" : "text-muted-foreground"}>
                                                {ing.itemId.charAt(0).toUpperCase() + ing.itemId.slice(1)}: {ing.amount}
                                            </div>
                                        )
                                    })}
                                </div>
                                {!isBuildingMet && (
                                    <div className="mt-2 text-xs text-red-400 font-medium">
                                        Requires {recipe.requiredBuilding} Lvl {recipe.requiredBuildingLevel}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    variant="secondary"
                                    disabled={isDisabled}
                                    onClick={() => craftItem(recipe)}
                                >
                                    Craft
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </TooltipProvider>
    )
}
