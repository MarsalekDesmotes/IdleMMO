import { ITEMS, ITEM_TIERS, EQUIPMENT_TYPES } from './items'
import type { Recipe } from '@/store/gameStore'

const RECIPES_DB: Recipe[] = []

// Helper to find resource by tier
const getResource = (type: 'wood' | 'stone' | 'tech', tier: number) => {
    return `${type}_t${Math.max(1, Math.min(10, tier))}`
}

// Generate Equipment Recipes
ITEM_TIERS.equipment.forEach((tier) => {
    // Limit crafting to Tier 3 (Rare) max
    if (tier.tier > 3) return
    const tierLevel = tier.tier

    // Weapons
    EQUIPMENT_TYPES.weapon.forEach((type) => {
        const itemId = `${type.id}_t${tierLevel}`
        const item = ITEMS[itemId]
        if (!item) return

        const resourceTier = Math.max(1, Math.min(10, (tierLevel * 2) - 1)) // Scaling resource tier
        const amount = 20 * tierLevel

        const ingredients = [
            { itemId: getResource('wood', resourceTier), amount: amount },
            { itemId: getResource('stone', resourceTier), amount: amount }
        ]

        // Add Tech for higher tiers
        if (tierLevel >= 3) {
            ingredients.push({ itemId: getResource('tech', resourceTier), amount: Math.floor(amount / 2) })
        }

        RECIPES_DB.push({
            id: `recipe_${itemId}`,
            name: item.name,
            description: `Craft a ${item.name}.`,
            result: item,
            ingredients,
            craftingTime: 10 * tierLevel,
            xpReward: 50 * tierLevel,
            goldCost: 100 * tierLevel,
            requiredBuilding: 'blacksmith',
            requiredBuildingLevel: tierLevel
        })
    })

        // Armor
        ;['head', 'body', 'hands'].forEach((slot) => {
            const slotKey = slot as 'head' | 'body' | 'hands'
            const types = EQUIPMENT_TYPES[slotKey]

            types.forEach((type) => {
                const itemId = `${type.id}_t${tierLevel}`
                const item = ITEMS[itemId]
                if (!item) return

                const resourceTier = Math.max(1, Math.min(10, (tierLevel * 2) - 1))
                const baseAmount = slot === 'body' ? 30 : 15
                const amount = baseAmount * tierLevel

                const ingredients = [
                    { itemId: getResource('wood', resourceTier), amount: amount },
                    { itemId: getResource('stone', resourceTier), amount: amount }
                ]

                if (tierLevel >= 3) {
                    ingredients.push({ itemId: getResource('tech', resourceTier), amount: Math.floor(amount / 2) })
                }

                RECIPES_DB.push({
                    id: `recipe_${itemId}`,
                    name: item.name,
                    description: `Craft ${item.name}.`,
                    result: item,
                    ingredients,
                    craftingTime: 10 * tierLevel,
                    xpReward: 40 * tierLevel,
                    goldCost: 80 * tierLevel,
                    requiredBuilding: 'blacksmith',
                    requiredBuildingLevel: tierLevel
                })
            })
        })
})

export const RECIPES = RECIPES_DB
