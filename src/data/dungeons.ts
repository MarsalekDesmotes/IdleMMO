export interface DungeonEnemy {
    name: string
    hp: number
    damage: number
}

export interface DungeonWave {
    enemies: DungeonEnemy[]
    isBoss: boolean
}

export interface Dungeon {
    id: string
    name: string
    description: string
    minLevel: number
    waves: DungeonWave[]
    rewards: {
        xp: number
        gold: number
        artifactId?: string
        dropRate: number // 0-1
        items?: { itemId: string, chance: number }[] // New rewards
    }
}

export const DUNGEONS: Dungeon[] = [
    {
        id: 'goblin_cave',
        name: 'Goblin Cave',
        description: 'A dark cave infested with goblins. Rumor has it they stole a magical ring.',
        minLevel: 10,
        waves: [
            { enemies: [{ name: 'Goblin Grunt', hp: 50, damage: 5 }, { name: 'Goblin Grunt', hp: 50, damage: 5 }], isBoss: false },
            { enemies: [{ name: 'Goblin Archer', hp: 40, damage: 8 }, { name: 'Goblin Warrior', hp: 80, damage: 10 }], isBoss: false },
            { enemies: [{ name: 'Goblin King', hp: 300, damage: 15 }], isBoss: true }
        ],
        rewards: {
            xp: 500,
            gold: 200,
            artifactId: 'ancient_ring',
            dropRate: 0.2,
            items: [
                { itemId: 'sword_t3', chance: 0.1 }, // Rare
                { itemId: 'plate_t3', chance: 0.1 }
            ]
        }
    },
    {
        id: 'volcanic_core',
        name: 'Volcanic Core',
        description: 'Deep within the fire mountain lies an ancient power.',
        minLevel: 50,
        waves: [
            { enemies: [{ name: 'Fire Elemental', hp: 200, damage: 20 }, { name: 'Magma Slime', hp: 150, damage: 15 }], isBoss: false },
            { enemies: [{ name: 'Drake', hp: 400, damage: 30 }], isBoss: false },
            { enemies: [{ name: 'Pyroclast Titan', hp: 2000, damage: 50 }], isBoss: true }
        ],
        rewards: {
            xp: 2500,
            gold: 1000,
            artifactId: 'fire_heart',
            dropRate: 0.1,
            items: [
                { itemId: 'sword_t4', chance: 0.05 }, // Epic
                { itemId: 'plate_t4', chance: 0.05 },
                { itemId: 'sword_t5', chance: 0.01 } // Legendary
            ]
        }
    }
]
