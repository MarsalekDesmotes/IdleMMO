import type { Item } from "@/store/gameStore"
import { FOODS } from "@/data/cooking"

export const ITEM_TIERS = {
    resource: [
        { name: 'Oak', suffix: 'Wood', value: 1, rarity: 'common' }, // Tier 1
        { name: 'Birch', suffix: 'Wood', value: 3, rarity: 'common' },
        { name: 'Cedar', suffix: 'Wood', value: 7, rarity: 'common' },
        { name: 'Ironwood', suffix: 'Log', value: 15, rarity: 'uncommon' },
        { name: 'Ancient', suffix: 'Bark', value: 30, rarity: 'uncommon' }, // Tier 5
        { name: 'Elder', suffix: 'Wood', value: 60, rarity: 'rare' },
        { name: 'Spirit', suffix: 'Wood', value: 120, rarity: 'rare' },
        { name: 'Void', suffix: 'Log', value: 250, rarity: 'epic' },
        { name: 'Celestial', suffix: 'Bough', value: 500, rarity: 'epic' },
        { name: 'Yggdrasil', suffix: 'Root', value: 1000, rarity: 'legendary' }, // Tier 10
    ],
    stone: [
        { name: 'Granite', suffix: 'Stone', value: 1, rarity: 'common' },
        { name: 'Basalt', suffix: 'Rock', value: 4, rarity: 'common' },
        { name: 'Slate', suffix: 'Shard', value: 8, rarity: 'common' },
        { name: 'Marble', suffix: 'Block', value: 20, rarity: 'uncommon' },
        { name: 'Obsidian', suffix: 'Shard', value: 40, rarity: 'uncommon' },
        { name: 'Gemstone', suffix: 'Cluster', value: 80, rarity: 'rare' },
        { name: 'Crystal', suffix: 'Geode', value: 160, rarity: 'rare' },
        { name: 'Mithril', suffix: 'Ore', value: 350, rarity: 'epic' },
        { name: 'Adamantite', suffix: 'Bar', value: 700, rarity: 'epic' },
        { name: 'Netherite', suffix: 'Ingot', value: 1500, rarity: 'legendary' },
    ],
    tech: [
        { name: 'Scrap', suffix: 'Metal', value: 2, rarity: 'common' },
        { name: 'Copper', suffix: 'Wire', value: 6, rarity: 'common' },
        { name: 'Circuit', suffix: 'Board', value: 12, rarity: 'common' },
        { name: 'Energy', suffix: 'Cell', value: 30, rarity: 'uncommon' },
        { name: 'Fiber', suffix: 'Optic', value: 60, rarity: 'uncommon' },
        { name: 'Data', suffix: 'Crystal', value: 120, rarity: 'rare' },
        { name: 'Plasma', suffix: 'Core', value: 250, rarity: 'rare' },
        { name: 'Quantum', suffix: 'Processor', value: 600, rarity: 'epic' },
        { name: 'Nanite', suffix: 'Swarm', value: 1200, rarity: 'epic' },
        { name: 'AI', suffix: 'Singularity', value: 3000, rarity: 'legendary' },
    ],
    equipment: [
        { name: 'Wooden', tier: 1, rarity: 'common', powerMult: 1 },
        { name: 'Iron', tier: 2, rarity: 'common', powerMult: 2 },
        { name: 'Steel', tier: 3, rarity: 'uncommon', powerMult: 4 },
        { name: 'Mithril', tier: 4, rarity: 'rare', powerMult: 8 },
        { name: 'Adamantite', tier: 5, rarity: 'epic', powerMult: 16 },
        { name: 'Dragonbone', tier: 6, rarity: 'legendary', powerMult: 32 }
    ]
} as const;

export const EQUIPMENT_TYPES = {
    weapon: [
        { id: 'sword', name: 'Sword', class: ['Paladin'], icon: '⚔️' },
        { id: 'mace', name: 'Mace', class: ['Paladin'], icon: '🔨' },
        { id: 'hammer', name: 'Hammer', class: ['Paladin'], icon: '🛡️' }, // Warhammer
        { id: 'staff', name: 'Staff', class: ['Archmage'], icon: '🦯' },
        { id: 'wand', name: 'Wand', class: ['Archmage'], icon: '🪄' },
        { id: 'orb', name: 'Orb', class: ['Archmage'], icon: '🔮' },
        { id: 'bow', name: 'Bow', class: ['Ranger'], icon: '🏹' },
        { id: 'dagger', name: 'Dagger', class: ['Ranger'], icon: '🗡️' },
        { id: 'crossbow', name: 'Crossbow', class: ['Ranger'], icon: '🔫' },
    ],
    head: [
        { id: 'helm', name: 'Helm', class: ['Paladin'], icon: '🪖' },
        { id: 'hood', name: 'Hood', class: ['Ranger'], icon: '🧢' },
        { id: 'hat', name: 'Hat', class: ['Archmage'], icon: '🎩' },
    ],
    body: [
        { id: 'plate', name: 'Plate Armor', class: ['Paladin'], icon: '🥋' },
        { id: 'leather', name: 'Leather Armor', class: ['Ranger'], icon: '🦺' },
        { id: 'robe', name: 'Robe', class: ['Archmage'], icon: '👘' },
    ],
    hands: [
        { id: 'gauntlets', name: 'Gauntlets', class: ['Paladin'], icon: '🥊' },
        { id: 'gloves', name: 'Gloves', class: ['Ranger'], icon: '🧤' },
        { id: 'bracers', name: 'Bracers', class: ['Archmage'], icon: '💅' },
    ]
}

const ITEMS_DB: Record<string, Item> = {}

// Generate Resources
ITEM_TIERS.resource.forEach((tier, index) => {
    const id = `wood_t${index + 1}`
    ITEMS_DB[id] = {
        id,
        name: `${tier.name} ${tier.suffix}`,
        type: 'resource',
        value: tier.value,
        rarity: tier.rarity as any,
        description: `Tier ${index + 1} wood resource.`,
        icon: '🪵'
    }
})

ITEM_TIERS.stone.forEach((tier, index) => {
    const id = `stone_t${index + 1}`
    ITEMS_DB[id] = {
        id,
        name: `${tier.name} ${tier.suffix}`,
        type: 'resource',
        value: tier.value,
        rarity: tier.rarity as any,
        description: `Tier ${index + 1} stone resource.`,
        icon: '🪨'
    }
})

ITEM_TIERS.tech.forEach((tier, index) => {
    const id = `tech_t${index + 1}`
    ITEMS_DB[id] = {
        id,
        name: `${tier.name} ${tier.suffix}`,
        type: 'resource',
        value: tier.value,
        rarity: tier.rarity as any,
        description: `Tier ${index + 1} tech resource.`,
        icon: '💎'
    }
})

// Generate Equipment
ITEM_TIERS.equipment.forEach((tier) => {
    // Weapons
    EQUIPMENT_TYPES.weapon.forEach((type) => {
        const id = `${type.id}_t${tier.tier}`
        ITEMS_DB[id] = {
            id,
            name: `${tier.name} ${type.name}`,
            type: 'equipment',
            subtype: 'weapon',
            value: 50 * tier.powerMult,
            rarity: tier.rarity as any,
            description: `Tier ${tier.tier} ${type.name}. Power: ${tier.powerMult}`,
            icon: type.icon,
            classRestriction: type.class as any,
            stats: {
                attack: 5 * tier.powerMult,
                speed: type.id === 'dagger' ? 2 * tier.tier : 0
            }
        }
    })

    // Armor (Head, Body, Hands)
    Object.entries(EQUIPMENT_TYPES).forEach(([slot, types]) => {
        if (slot === 'weapon') return
        const equipSlot = slot as 'head' | 'body' | 'hands'
        types.forEach((type: any) => {
            const id = `${type.id}_t${tier.tier}`
            ITEMS_DB[id] = {
                id,
                name: `${tier.name} ${type.name}`,
                type: 'equipment',
                subtype: equipSlot,
                value: 40 * tier.powerMult,
                rarity: tier.rarity as any,
                description: `Tier ${tier.tier} ${type.name}. Defense: ${tier.powerMult}`,
                icon: type.icon,
                classRestriction: type.class as any,
                stats: {
                    defense: (equipSlot === 'body' ? 3 : 1) * tier.powerMult,
                    hpRegen: equipSlot === 'body' ? 0.5 * tier.tier : 0
                }
            }
        })
    })
})

// Map Foods
FOODS.forEach(food => {
    ITEMS_DB[food.id] = {
        id: food.id,
        name: food.name,
        type: 'consumable',
        subtype: 'food',
        value: 10 * food.level,
        rarity: 'common',
        description: `Restores ${food.heal} HP. ${food.stats ? 'Grants buffs.' : ''}`,
        icon: food.icon,
        stats: {
            hpRegen: food.heal,
            ...food.stats,
            duration: food.duration
        }
    }
})

export const ITEMS = ITEMS_DB
