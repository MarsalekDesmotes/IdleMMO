export interface Food {
    id: string
    name: string
    heal: number
    level: number // Cooking level req
    xp: number
    icon: string
}

export const FOODS: Food[] = [
    { id: 'cooked_shrimp', name: 'Cooked Shrimp', heal: 20, level: 1, xp: 10, icon: '🦐' },
    { id: 'cooked_sardine', name: 'Cooked Sardine', heal: 40, level: 5, xp: 15, icon: '🐟' },
    { id: 'cooked_trout', name: 'Cooked Trout', heal: 100, level: 15, xp: 30, icon: '🐠' },
    { id: 'cooked_salmon', name: 'Cooked Salmon', heal: 180, level: 25, xp: 50, icon: '🍣' },
    { id: 'cooked_lobster', name: 'Cooked Lobster', heal: 300, level: 40, xp: 80, icon: '🦞' },
    { id: 'cooked_swordfish', name: 'Cooked Swordfish', heal: 500, level: 55, xp: 120, icon: '🐡' },
    { id: 'cooked_shark', name: 'Cooked Shark', heal: 800, level: 70, xp: 200, icon: '🦈' },
    { id: 'cooked_manta', name: 'Cooked Manta Ray', heal: 1200, level: 85, xp: 300, icon: '🥪' }, // Placeholder icon
    { id: 'cooked_turtle', name: 'Cooked Turtle', heal: 1600, level: 93, xp: 450, icon: '🍲' },
    { id: 'cooked_kraken', name: 'Kraken Steak', heal: 2500, level: 99, xp: 1000, icon: '🦑' }
]
