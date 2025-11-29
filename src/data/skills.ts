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
        {
            id: 'divine_strength',
            name: 'Divine Strength',
            description: 'Increases Strength by 5.',
            type: 'passive',
            cost: 1,
            requiredLevel: 2,
            stats: { strength: 5 }
        },
        {
            id: 'holy_aura',
            name: 'Holy Aura',
            description: 'Passive health regeneration (+1 HP/s).',
            type: 'passive',
            cost: 2,
            requiredLevel: 5,
            requiredSkill: 'divine_strength',
            stats: { hpRegen: 1 }
        },
        {
            id: 'smite',
            name: 'Smite',
            description: 'Strike the enemy with holy light.',
            type: 'active',
            cost: 1,
            requiredLevel: 3,
            combat: { damage: 15, manaCost: 10, cooldown: 0 }
        },
        {
            id: 'divine_heal',
            name: 'Divine Heal',
            description: 'Restore a large amount of health.',
            type: 'active',
            cost: 2,
            requiredLevel: 8,
            requiredSkill: 'holy_aura',
            combat: { heal: 30, manaCost: 20, cooldown: 3 }
        }
    ],
    'Archmage': [
        {
            id: 'arcane_intellect',
            name: 'Arcane Intellect',
            description: 'Increases Intelligence by 5.',
            type: 'passive',
            cost: 1,
            requiredLevel: 2,
            stats: { intelligence: 5 }
        },
        {
            id: 'mana_flow',
            name: 'Mana Flow',
            description: 'Increases Agility (Cast Speed) by 3.',
            type: 'passive',
            cost: 2,
            requiredLevel: 5,
            requiredSkill: 'arcane_intellect',
            stats: { agility: 3 }
        },
        {
            id: 'fireball',
            name: 'Fireball',
            description: 'Launch a ball of fire.',
            type: 'active',
            cost: 1,
            requiredLevel: 3,
            combat: { damage: 25, manaCost: 15, cooldown: 0 }
        },
        {
            id: 'deep_freeze',
            name: 'Deep Freeze',
            description: 'Freeze the enemy dealing damage.',
            type: 'active',
            cost: 2,
            requiredLevel: 8,
            requiredSkill: 'mana_flow',
            combat: { damage: 15, manaCost: 20, cooldown: 2 }
        }
    ],
    'Ranger': [
        {
            id: 'eagle_eye',
            name: 'Eagle Eye',
            description: 'Increases Agility by 5.',
            type: 'passive',
            cost: 1,
            requiredLevel: 2,
            stats: { agility: 5 }
        },
        {
            id: 'swift_step',
            name: 'Swift Step',
            description: 'Increases Strength (Movement) by 3.',
            type: 'passive',
            cost: 2,
            requiredLevel: 5,
            requiredSkill: 'eagle_eye',
            stats: { strength: 3 }
        },
        {
            id: 'quick_shot',
            name: 'Quick Shot',
            description: 'A fast arrow shot.',
            type: 'active',
            cost: 1,
            requiredLevel: 3,
            combat: { damage: 12, manaCost: 5, cooldown: 0 }
        },
        {
            id: 'aimed_shot',
            name: 'Aimed Shot',
            description: 'A precise shot dealing high damage.',
            type: 'active',
            cost: 2,
            requiredLevel: 8,
            requiredSkill: 'swift_step',
            combat: { damage: 35, manaCost: 25, cooldown: 2 }
        }
    ]
}
