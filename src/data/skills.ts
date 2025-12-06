import type { CharacterClass } from "@/store/gameStore"

export interface SkillDefinition {
    id: string
    name: string
    description: string
    type: 'passive' | 'active'
    cost: number
    requiredLevel: number
    requiredSkill?: string
    // Passive Effects
    stats?: {
        strength?: number
        intelligence?: number
        agility?: number
        hpRegen?: number
        critChance?: number
        defense?: number
    }
    // Active Effects (Combat)
    combat?: {
        damage?: number
        heal?: number
        manaCost: number
        cooldown: number
    }
}

export const SKILLS: Record<CharacterClass, SkillDefinition[]> = {
    'Paladin': [
        // Tier 1
        { id: 'divine_strength', name: 'Divine Strength', description: 'Increases Strength by 5.', type: 'passive', cost: 1, requiredLevel: 2, stats: { strength: 5 } },
        { id: 'iron_skin', name: 'Iron Skin', description: 'Increases Defense by 3.', type: 'passive', cost: 1, requiredLevel: 3, stats: { defense: 3 } },
        // Tier 2
        { id: 'smite', name: 'Smite', description: 'Strike with holy light.', type: 'active', cost: 1, requiredLevel: 5, requiredSkill: 'divine_strength', combat: { damage: 15, manaCost: 10, cooldown: 0 } },
        { id: 'shield_bash', name: 'Shield Bash', description: 'Bash enemy with shield.', type: 'active', cost: 1, requiredLevel: 6, requiredSkill: 'iron_skin', combat: { damage: 10, manaCost: 15, cooldown: 2 } },
        // Tier 3
        { id: 'holy_aura', name: 'Holy Aura', description: 'Passive health regeneration (+1 HP/s).', type: 'passive', cost: 2, requiredLevel: 10, requiredSkill: 'smite', stats: { hpRegen: 1 } },
        { id: 'devotion', name: 'Devotion', description: 'Increases Max Stamina via endurance (Strength +5).', type: 'passive', cost: 2, requiredLevel: 12, stats: { strength: 5 } },
        // Tier 4
        { id: 'divine_heal', name: 'Divine Heal', description: 'Restore health.', type: 'active', cost: 2, requiredLevel: 15, requiredSkill: 'holy_aura', combat: { heal: 40, manaCost: 25, cooldown: 3 } },
        { id: 'judgment', name: 'Judgment', description: 'Heavy holy damage.', type: 'active', cost: 3, requiredLevel: 20, combat: { damage: 40, manaCost: 35, cooldown: 4 } },
        // Tier 5 (Ultimate)
        { id: 'wrath_of_god', name: 'Wrath of God', description: 'Massive damage to one enemy.', type: 'active', cost: 5, requiredLevel: 30, requiredSkill: 'judgment', combat: { damage: 100, manaCost: 80, cooldown: 10 } },
        { id: 'guardian_angel', name: 'Guardian Angel', description: 'Passive +10 Defense.', type: 'passive', cost: 5, requiredLevel: 35, stats: { defense: 10 } }
    ],
    'Archmage': [
        // Tier 1
        { id: 'arcane_intellect', name: 'Arcane Intellect', description: 'Increases Intelligence by 5.', type: 'passive', cost: 1, requiredLevel: 2, stats: { intelligence: 5 } },
        { id: 'mana_spring', name: 'Mana Spring', description: 'Increases Mana/Intelligence.', type: 'passive', cost: 1, requiredLevel: 3, stats: { intelligence: 3 } },
        // Tier 2
        { id: 'fireball', name: 'Fireball', description: 'Launch a ball of fire.', type: 'active', cost: 1, requiredLevel: 5, requiredSkill: 'arcane_intellect', combat: { damage: 25, manaCost: 15, cooldown: 0 } },
        { id: 'ice_shard', name: 'Ice Shard', description: 'Piercing ice damage.', type: 'active', cost: 1, requiredLevel: 6, combat: { damage: 20, manaCost: 10, cooldown: 1 } },
        // Tier 3
        { id: 'mana_flow', name: 'Mana Flow', description: 'Increases Agility (Cast Speed) by 3.', type: 'passive', cost: 2, requiredLevel: 10, requiredSkill: 'arcane_intellect', stats: { agility: 3 } },
        { id: 'glass_cannon', name: 'Glass Cannon', description: '+10 Intellect, -5 Defense (simulated via strict stats).', type: 'passive', cost: 2, requiredLevel: 12, stats: { intelligence: 10 } },
        // Tier 4
        { id: 'deep_freeze', name: 'Deep Freeze', description: 'High damage ice spell.', type: 'active', cost: 2, requiredLevel: 15, requiredSkill: 'ice_shard', combat: { damage: 35, manaCost: 25, cooldown: 2 } },
        { id: 'lightning_strike', name: 'Lightning Strike', description: 'Fast lightning damage.', type: 'active', cost: 2, requiredLevel: 20, combat: { damage: 45, manaCost: 30, cooldown: 1 } },
        // Tier 5 (Ultimate)
        { id: 'meteor', name: 'Meteor', description: 'Summon a meteor.', type: 'active', cost: 5, requiredLevel: 30, requiredSkill: 'fireball', combat: { damage: 120, manaCost: 100, cooldown: 10 } },
        { id: 'archon', name: 'Archon Form', description: 'Passive +20 Intelligence.', type: 'passive', cost: 5, requiredLevel: 35, stats: { intelligence: 20 } }
    ],
    'Ranger': [
        // Tier 1
        { id: 'eagle_eye', name: 'Eagle Eye', description: 'Increases Agility by 5.', type: 'passive', cost: 1, requiredLevel: 2, stats: { agility: 5 } },
        { id: 'light_foot', name: 'Light Foot', description: 'Increases Speed/Agility.', type: 'passive', cost: 1, requiredLevel: 3, stats: { agility: 3 } },
        // Tier 2
        { id: 'quick_shot', name: 'Quick Shot', description: 'A fast arrow shot.', type: 'active', cost: 1, requiredLevel: 5, requiredSkill: 'eagle_eye', combat: { damage: 12, manaCost: 5, cooldown: 0 } },
        { id: 'poison_arrow', name: 'Poison Arrow', description: 'Damage over time (simulated via raw damage for now).', type: 'active', cost: 1, requiredLevel: 6, combat: { damage: 15, manaCost: 8, cooldown: 1 } },
        // Tier 3
        { id: 'swift_step', name: 'Swift Step', description: 'Increases Strength (Movement) by 3.', type: 'passive', cost: 2, requiredLevel: 10, requiredSkill: 'light_foot', stats: { strength: 3 } },
        { id: 'bullseye', name: 'Bullseye', description: 'Increases Crit Chance (via Agility).', type: 'passive', cost: 2, requiredLevel: 12, stats: { agility: 10 } },
        // Tier 4
        { id: 'aimed_shot', name: 'Aimed Shot', description: 'Precise high damage.', type: 'active', cost: 2, requiredLevel: 15, requiredSkill: 'quick_shot', combat: { damage: 50, manaCost: 25, cooldown: 3 } },
        { id: 'volley', name: 'Volley', description: 'Multiple arrows.', type: 'active', cost: 3, requiredLevel: 20, combat: { damage: 40, manaCost: 30, cooldown: 2 } },
        // Tier 5 (Ultimate)
        { id: 'rain_of_arrows', name: 'Rain of Arrows', description: 'Massive area damage.', type: 'active', cost: 5, requiredLevel: 30, requiredSkill: 'volley', combat: { damage: 90, manaCost: 60, cooldown: 8 } },
        { id: 'hunter_instinct', name: 'Hunter Instinct', description: 'Passive +15 Agility.', type: 'passive', cost: 5, requiredLevel: 35, stats: { agility: 15 } }
    ]
}
