export interface Food {
    id: string
    name: string
    heal: number
    level: number // Cooking level req
    xp: number
    icon: string
    duration?: number
    stats?: {
        attack?: number
        defense?: number
        str?: number
        int?: number
        agi?: number
        hpRegen?: number
        speed?: number
        resourceMult?: number
    }
}

export const FOODS: Food[] = [
    { id: 'cooked_shrimp', name: 'Cooked Shrimp', heal: 20, level: 1, xp: 10, icon: '🦐', duration: 60, stats: { hpRegen: 1 } },
    { id: 'cooked_sardine', name: 'Cooked Sardine', heal: 40, level: 5, xp: 15, icon: '🐟', duration: 120, stats: { hpRegen: 2 } },
    { id: 'cooked_trout', name: 'Cooked Trout', heal: 100, level: 15, xp: 30, icon: '🐠', duration: 300, stats: { hpRegen: 3, str: 2 } },
    { id: 'cooked_salmon', name: 'Cooked Salmon', heal: 180, level: 25, xp: 50, icon: '🍣', duration: 400, stats: { hpRegen: 5, str: 3 } },
    { id: 'cooked_lobster', name: 'Cooked Lobster', heal: 300, level: 40, xp: 80, icon: '🦞', duration: 500, stats: { defense: 5, hpRegen: 5 } },
    { id: 'cooked_swordfish', name: 'Cooked Swordfish', heal: 500, level: 55, xp: 120, icon: '🐡', duration: 600, stats: { attack: 5, str: 5 } },
    { id: 'cooked_shark', name: 'Cooked Shark', heal: 800, level: 70, xp: 200, icon: '🦈', duration: 700, stats: { attack: 10, defense: 5 } },
    { id: 'cooked_manta', name: 'Cooked Manta Ray', heal: 1200, level: 85, xp: 300, icon: '🥪', duration: 800, stats: { hpRegen: 10, defense: 10 } },
    { id: 'cooked_turtle', name: 'Cooked Turtle', heal: 1600, level: 93, xp: 450, icon: '🍲', duration: 900, stats: { defense: 20 } },
    { id: 'cooked_kraken', name: 'Kraken Steak', heal: 2500, level: 99, xp: 1000, icon: '🦑', duration: 1200, stats: { attack: 20, str: 10, defense: 10 } }
]
