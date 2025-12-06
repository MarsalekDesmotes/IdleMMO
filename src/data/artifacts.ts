export interface Artifact {
    id: string
    name: string
    description: string
    rarity: 'rare' | 'epic' | 'legendary' | 'mythic'
    effect: {
        type: 'resource_chance' | 'combat_stats' | 'crafting_mult'
        value: number
    }
    icon: string
}

export const ARTIFACTS: Artifact[] = [
    {
        id: 'ancient_ring',
        name: 'Ring of Greed',
        description: 'A tarnished gold ring that seems to attract wealth.',
        rarity: 'rare',
        effect: { type: 'resource_chance', value: 0.1 }, // 10% chance for double gold/resources
        icon: 'Ring'
    },
    {
        id: 'fire_heart',
        name: 'Heart of the Volcano',
        description: 'Warm to the touch. Pulsates with energy.',
        rarity: 'epic',
        effect: { type: 'combat_stats', value: 0.2 }, // +20% All Stats
        icon: 'Flame'
    },
    {
        id: 'chronos_hourglass',
        name: 'Hourglass of Eternity',
        description: 'Sands flow upwards. Time bends around it.',
        rarity: 'legendary',
        effect: { type: 'crafting_mult', value: 2 }, // x2 Crafting Speed
        icon: 'Hourglass'
    }
]
