export interface Fish {
    id: string
    name: string
    level: number
    xp: number
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
    cookProduct: string // ID of cooked item
}

export const FISH: Fish[] = [
    { id: 'shrimp', name: 'Raw Shrimp', level: 1, xp: 10, rarity: 'common', cookProduct: 'cooked_shrimp' },
    { id: 'sardine', name: 'Raw Sardine', level: 5, xp: 15, rarity: 'common', cookProduct: 'cooked_sardine' },
    { id: 'trout', name: 'Raw Trout', level: 20, xp: 40, rarity: 'uncommon', cookProduct: 'cooked_trout' },
    { id: 'salmon', name: 'Raw Salmon', level: 30, xp: 60, rarity: 'uncommon', cookProduct: 'cooked_salmon' },
    { id: 'lobster', name: 'Raw Lobster', level: 40, xp: 90, rarity: 'rare', cookProduct: 'cooked_lobster' },
    { id: 'swordfish', name: 'Raw Swordfish', level: 50, xp: 140, rarity: 'rare', cookProduct: 'cooked_swordfish' },
    { id: 'blue_shark', name: 'Raw Blue Shark', level: 65, xp: 200, rarity: 'rare', cookProduct: 'cooked_shark' },
    { id: 'manta_ray', name: 'Raw Manta Ray', level: 80, xp: 300, rarity: 'epic', cookProduct: 'cooked_manta' },
    { id: 'sea_turtle', name: 'Raw Sea Turtle', level: 90, xp: 500, rarity: 'epic', cookProduct: 'cooked_turtle' },
    { id: 'kraken_tentacle', name: 'Kraken Tentacle', level: 99, xp: 1000, rarity: 'legendary', cookProduct: 'cooked_kraken' }
]
