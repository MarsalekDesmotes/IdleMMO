


export interface Enemy {
    id: string
    name: string
    description: string
    level: number
    hp: number
    max_hp: number
    attack: number
    defense: number
    xpReward: number
    goldReward: number
    drops: { itemId: string, chance: number }[]
    zone: 'outskirts' | 'iron_hills' | 'dark_forest' | 'volcanic_peaks' | 'crystal_caves' | 'sky_citadel'
    image?: string
}



export const ENEMIES: Enemy[] = [
    // --- ZONE 1: OUTSKIRTS (Level 1-15) ---
    {
        id: 'rat_scout', name: 'Rat Scout', description: 'A small but aggressive rat.',
        level: 1, hp: 20, max_hp: 20, attack: 3, defense: 0, xpReward: 10, goldReward: 2,
        drops: [{ itemId: 'wood_t1', chance: 0.2 }], zone: 'outskirts'
    },
    {
        id: 'giant_rat', name: 'Giant Rat', description: 'Overgrown vermin.',
        level: 3, hp: 40, max_hp: 40, attack: 5, defense: 1, xpReward: 20, goldReward: 5,
        drops: [{ itemId: 'wood_t1', chance: 0.3 }], zone: 'outskirts'
    },
    {
        id: 'goblin_looter', name: 'Goblin Looter', description: 'Steals anything shiny.',
        level: 5, hp: 60, max_hp: 60, attack: 8, defense: 2, xpReward: 35, goldReward: 10,
        drops: [{ itemId: 'tech_t1', chance: 0.15 }, { itemId: 'dagger_t1', chance: 0.01 }], zone: 'outskirts'
    },
    {
        id: 'goblin_warrior', name: 'Goblin Warrior', description: 'Armed with a rusty blade.',
        level: 7, hp: 90, max_hp: 90, attack: 12, defense: 4, xpReward: 50, goldReward: 15,
        drops: [{ itemId: 'sword_t1', chance: 0.02 }, { itemId: 'stone_t1', chance: 0.2 }], zone: 'outskirts'
    },
    {
        id: 'wolf', name: 'Grey Wolf', description: 'A fierce predator.',
        level: 8, hp: 100, max_hp: 100, attack: 15, defense: 3, xpReward: 60, goldReward: 8,
        drops: [{ itemId: 'leather_t1', chance: 0.1 }], zone: 'outskirts'
    },
    {
        id: 'alpha_wolf', name: 'Alpha Wolf', description: 'Leader of the pack.',
        level: 10, hp: 150, max_hp: 150, attack: 20, defense: 5, xpReward: 100, goldReward: 25,
        drops: [{ itemId: 'leather_t1', chance: 0.3 }, { itemId: 'helm_t1', chance: 0.05 }], zone: 'outskirts'
    },
    {
        id: 'bandit_recruit', name: 'Bandit Recruit', description: 'Looking for trouble.',
        level: 12, hp: 140, max_hp: 140, attack: 18, defense: 6, xpReward: 90, goldReward: 30,
        drops: [{ itemId: 'tech_t1', chance: 0.2 }], zone: 'outskirts'
    },
    {
        id: 'bandit_leader', name: 'Bandit Leader', description: 'Wanted dead or alive.',
        level: 15, hp: 250, max_hp: 250, attack: 25, defense: 10, xpReward: 200, goldReward: 100,
        drops: [{ itemId: 'sword_t2', chance: 0.05 }, { itemId: 'plate_t2', chance: 0.02 }], zone: 'outskirts'
    },

    // --- ZONE 2: IRON HILLS (Level 15-35) ---
    {
        id: 'rock_elemental', name: 'Rock Elemental', description: 'Living stone.',
        level: 16, hp: 300, max_hp: 300, attack: 30, defense: 30, xpReward: 150, goldReward: 20,
        drops: [{ itemId: 'stone_t2', chance: 0.5 }, { itemId: 'stone_t3', chance: 0.1 }], zone: 'iron_hills'
    },
    {
        id: 'dwarf_exile', name: 'Dwarf Exile', description: 'A fallen warrior.',
        level: 18, hp: 350, max_hp: 350, attack: 35, defense: 25, xpReward: 180, goldReward: 40,
        drops: [{ itemId: 'hammer_t2', chance: 0.03 }], zone: 'iron_hills'
    },
    {
        id: 'kobold_miner', name: 'Kobold Miner', description: 'Obsessed with gold.',
        level: 20, hp: 280, max_hp: 280, attack: 40, defense: 15, xpReward: 160, goldReward: 80,
        drops: [{ itemId: 'stone_t3', chance: 0.2 }, { itemId: 'pickaxe_t2', chance: 0.01 }], zone: 'iron_hills'
    },
    {
        id: 'iron_golem', name: 'Iron Golem', description: 'Construct of pure iron.',
        level: 25, hp: 600, max_hp: 600, attack: 50, defense: 50, xpReward: 400, goldReward: 50,
        drops: [{ itemId: 'stone_t4', chance: 0.3 }, { itemId: 'plate_t3', chance: 0.01 }], zone: 'iron_hills'
    },
    {
        id: 'mountain_troll', name: 'Mountain Troll', description: 'Regenerates health rapidly.',
        level: 28, hp: 800, max_hp: 800, attack: 60, defense: 20, xpReward: 500, goldReward: 100,
        drops: [{ itemId: 'wood_t3', chance: 0.4 }], zone: 'iron_hills'
    },
    {
        id: 'dragon_whelp', name: 'Dragon Whelp', description: 'A young dragon, still dangerous.',
        level: 30, hp: 700, max_hp: 700, attack: 70, defense: 40, xpReward: 600, goldReward: 200,
        drops: [{ itemId: 'tech_t3', chance: 0.2 }, { itemId: 'wand_t3', chance: 0.05 }], zone: 'iron_hills'
    },
    {
        id: 'stone_giant', name: 'Stone Giant', description: 'Can crush boulders with one hand.',
        level: 32, hp: 1000, max_hp: 1000, attack: 80, defense: 60, xpReward: 800, goldReward: 150,
        drops: [{ itemId: 'stone_t5', chance: 0.1 }], zone: 'iron_hills'
    },
    {
        id: 'iron_king', name: 'The Iron King', description: 'Ruler of the forgotten deeps.',
        level: 35, hp: 2000, max_hp: 2000, attack: 100, defense: 80, xpReward: 2000, goldReward: 1000,
        drops: [{ itemId: 'hammer_t4', chance: 0.1 }, { itemId: 'crown_t4', chance: 0.01 }], zone: 'iron_hills'
    },

    // --- ZONE 3: DARK FOREST (Level 35-60) ---
    {
        id: 'shadow_stalker', name: 'Shadow Stalker', description: 'Hard to see in the dark.',
        level: 36, hp: 1200, max_hp: 1200, attack: 120, defense: 30, xpReward: 900, goldReward: 50,
        drops: [{ itemId: 'wood_t5', chance: 0.3 }], zone: 'dark_forest'
    },
    {
        id: 'corrupted_ent', name: 'Corrupted Ent', description: 'Twisted by dark magic.',
        level: 40, hp: 2500, max_hp: 2500, attack: 140, defense: 100, xpReward: 1500, goldReward: 100,
        drops: [{ itemId: 'wood_t6', chance: 0.5 }, { itemId: 'staff_t4', chance: 0.02 }], zone: 'dark_forest'
    },
    {
        id: 'void_wisp', name: 'Void Wisp', description: 'A floating ball of nothingness.',
        level: 42, hp: 800, max_hp: 800, attack: 180, defense: 10, xpReward: 1200, goldReward: 300,
        drops: [{ itemId: 'tech_t5', chance: 0.4 }], zone: 'dark_forest'
    },
    {
        id: 'necromancer', name: 'Necromancer', description: 'Raises the dead.',
        level: 45, hp: 1500, max_hp: 1500, attack: 200, defense: 50, xpReward: 2000, goldReward: 500,
        drops: [{ itemId: 'orb_t4', chance: 0.05 }, { itemId: 'robe_t4', chance: 0.05 }], zone: 'dark_forest'
    },
    {
        id: 'undead_knight', name: 'Undead Knight', description: 'Serves even in death.',
        level: 48, hp: 3000, max_hp: 3000, attack: 180, defense: 150, xpReward: 2200, goldReward: 200,
        drops: [{ itemId: 'sword_t4', chance: 0.03 }, { itemId: 'plate_t4', chance: 0.03 }], zone: 'dark_forest'
    },
    {
        id: 'void_beast', name: 'Void Beast', description: 'A horror from another dimension.',
        level: 52, hp: 4000, max_hp: 4000, attack: 250, defense: 100, xpReward: 3000, goldReward: 400,
        drops: [{ itemId: 'tech_t7', chance: 0.2 }], zone: 'dark_forest'
    },
    {
        id: 'elder_dragon', name: 'Elder Dragon', description: 'Ancient and terrifying.',
        level: 55, hp: 8000, max_hp: 8000, attack: 300, defense: 200, xpReward: 5000, goldReward: 2000,
        drops: [{ itemId: 'sword_t5', chance: 0.01 }, { itemId: 'plate_t5', chance: 0.01 }], zone: 'dark_forest'
    },
    {
        id: 'lich_king', name: 'The Lich King', description: 'Master of death itself.',
        level: 60, hp: 10000, max_hp: 10000, attack: 400, defense: 300, xpReward: 10000, goldReward: 5000,
        drops: [{ itemId: 'staff_t5', chance: 0.1 }, { itemId: 'crown_t5', chance: 0.01 }], zone: 'dark_forest'
    },

    // --- ZONE 4: VOLCANIC PEAKS (Level 50-70) ---
    {
        id: 'fire_imp', name: 'Fire Imp', description: 'Small mischievous demon.',
        level: 55, hp: 6000, max_hp: 6000, attack: 280, defense: 100, xpReward: 4000, goldReward: 500,
        drops: [{ itemId: 'obsidian_t1', chance: 0.3 }], zone: 'volcanic_peaks'
    },
    {
        id: 'magma_golem', name: 'Magma Golem', description: 'Walking lava.',
        level: 65, hp: 12000, max_hp: 12000, attack: 450, defense: 300, xpReward: 8000, goldReward: 1000,
        drops: [{ itemId: 'obsidian_t1', chance: 0.5 }, { itemId: 'plate_t6', chance: 0.05 }], zone: 'volcanic_peaks'
    },

    // --- ZONE 5: CRYSTAL CAVES (Level 70-90) ---
    {
        id: 'crystal_scorpion', name: 'Crystal Scorpion', description: 'Sharp and shiny.',
        level: 75, hp: 20000, max_hp: 20000, attack: 600, defense: 400, xpReward: 15000, goldReward: 2000,
        drops: [{ itemId: 'crystal_shard', chance: 0.4 }], zone: 'crystal_caves'
    },
    {
        id: 'arcane_construct', name: 'Arcane Construct', description: 'Powered by pure magic.',
        level: 85, hp: 35000, max_hp: 35000, attack: 900, defense: 600, xpReward: 25000, goldReward: 4000,
        drops: [{ itemId: 'crystal_shard', chance: 0.6 }, { itemId: 'staff_t7', chance: 0.05 }], zone: 'crystal_caves'
    },

    // --- ZONE 6: SKY CITADEL (Level 90-100) ---
    {
        id: 'sky_knight', name: 'Sky Knight', description: 'Guardian of the clouds.',
        level: 95, hp: 50000, max_hp: 50000, attack: 1200, defense: 1000, xpReward: 40000, goldReward: 10000,
        drops: [{ itemId: 'aether_dust', chance: 0.5 }, { itemId: 'plate_t8', chance: 0.05 }], zone: 'sky_citadel'
    },
    {
        id: 'seraphim', name: 'Seraphim', description: 'Angelic judgement.',
        level: 100, hp: 100000, max_hp: 100000, attack: 2000, defense: 1500, xpReward: 100000, goldReward: 50000,
        drops: [{ itemId: 'aether_dust', chance: 0.8 }, { itemId: 'weapon_godly', chance: 0.01 }], zone: 'sky_citadel'
    }
]
