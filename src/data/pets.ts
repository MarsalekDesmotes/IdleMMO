export type PetRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface PetDefinition {
    id: string
    name: string
    description: string
    rarity: PetRarity
    bonus: {
        type: 'resource' | 'xp' | 'gold' | 'combat'
        resourceId?: 'wood' | 'stone' | 'tech'
        multiplier: number // 0.1 means +10%
    }
    icon: string // Lucide icon name or emoji for now
}

export const PETS: PetDefinition[] = [
    {
        id: 'rock_golem',
        name: 'Rock Golem',
        description: 'A sturdy companion made of living stone.',
        rarity: 'common',
        bonus: { type: 'resource', resourceId: 'stone', multiplier: 0.1 },
        icon: 'Pickaxe'
    },
    {
        id: 'forest_sprite',
        name: 'Forest Sprite',
        description: 'A playful spirit that guides your axe.',
        rarity: 'common',
        bonus: { type: 'resource', resourceId: 'wood', multiplier: 0.1 },
        icon: 'Leaf'
    },
    {
        id: 'mech_drone',
        name: 'Tech Drone',
        description: 'Automated assistant for research.',
        rarity: 'rare',
        bonus: { type: 'resource', resourceId: 'tech', multiplier: 0.15 },
        icon: 'Cpu'
    },
    {
        id: 'golden_goose',
        name: 'Golden Goose',
        description: 'Lays golden eggs... occasionally.',
        rarity: 'epic',
        bonus: { type: 'gold', multiplier: 0.2 },
        icon: 'Coins'
    },
    {
        id: 'wisdom_owl',
        name: 'Owl of Wisdom',
        description: 'Ancient knowledge flows through it.',
        rarity: 'legendary',
        bonus: { type: 'xp', multiplier: 0.25 },
        icon: 'GraduationCap'
    }
]
