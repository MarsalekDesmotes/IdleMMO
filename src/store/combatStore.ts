import { create } from 'zustand'
import { useGameStore } from './gameStore'
import { SKILLS } from '@/data/skills'
import { useEventStore } from './eventStore'

export type CombatTurn = 'player' | 'enemy'
export type CombatPhase = 'idle' | 'active' | 'victory' | 'defeat'

export interface Enemy {
    id: string
    name: string
    level: number
    hp: number
    max_hp: number
    damage: number
    image: string // Placeholder for now, maybe use a generic monster image or emoji
}

export interface Skill {
    id: string
    name: string
    description: string
    manaCost: number // or energy/stamina
    cooldown: number
    effect: (state: CombatState) => Partial<CombatState>
}

interface CombatState {
    phase: CombatPhase
    turn: CombatTurn
    enemy: Enemy | null
    playerHp: number
    playerMaxHp: number
    combatLog: string[]

    startCombat: (enemy: Enemy) => void
    playerAction: (skillId: string) => void
    enemyTurn: () => void
    endCombat: () => void
}

export const useCombatStore = create<CombatState>((set, get) => ({
    phase: 'idle',
    turn: 'player',
    enemy: null,
    playerHp: 100,
    playerMaxHp: 100,
    combatLog: [],

    startCombat: (enemy) => {
        const { character } = useGameStore.getState()
        if (!character) return

        const { activeEvent } = useEventStore.getState()
        let finalEnemy = { ...enemy }

        if (activeEvent && activeEvent.enemyModifier) {
            finalEnemy.name = `${activeEvent.enemyModifier.namePrefix} ${finalEnemy.name}`
            finalEnemy.level += activeEvent.enemyModifier.levelBonus
            finalEnemy.max_hp = Math.floor(finalEnemy.max_hp * activeEvent.enemyModifier.hpMultiplier)
            finalEnemy.hp = finalEnemy.max_hp
        }

        set({
            phase: 'active',
            turn: 'player',
            enemy: finalEnemy,
            playerHp: character.hp,
            playerMaxHp: character.max_hp,
            combatLog: [`Combat started vs ${finalEnemy.name}!`]
        })
    },

    playerAction: (skillId) => {
        const state = get()
        if (state.phase !== 'active' || state.turn !== 'player') return

        const { character } = useGameStore.getState()
        if (!character) return

        // Handle Basic Attack
        if (skillId === 'basic_attack') {
            const dmg = Math.floor(character.level + (character.stats?.strength || 0) / 2 + 2)
            let logMsg = `You attacked.`
            let newEnemyHp = state.enemy!.hp - dmg
            logMsg += ` Dealt ${dmg} damage.`

            // Check Victory (Duplicate logic, should refactor but inline for now)
            if (newEnemyHp <= 0) {
                set({
                    enemy: { ...state.enemy!, hp: 0 },
                    phase: 'victory',
                    combatLog: [...state.combatLog, logMsg, `Victory! You defeated ${state.enemy!.name}.`]
                })
                const { activeEvent } = useEventStore.getState()
                const xpMult = activeEvent ? activeEvent.xpMultiplier : 1.0
                useGameStore.getState().addXp(Math.floor(state.enemy!.level * 20 * xpMult))
                useGameStore.getState().debugAddGold(state.enemy!.level * 10)
                return
            }

            set({
                enemy: { ...state.enemy!, hp: newEnemyHp },
                combatLog: [...state.combatLog, logMsg],
                turn: 'enemy'
            })

            setTimeout(() => {
                get().enemyTurn()
            }, 1000)
            return
        }

        const skills = SKILLS[character.class]
        const skill = skills.find(s => s.id === skillId)

        if (!skill) return

        // Validate unlock
        if (!character.unlockedSkills.includes(skillId)) {
            return
        }

        // Apply Skill Effect
        let logMsg = `You used ${skill.name}.`
        let newEnemyHp = state.enemy!.hp
        let newPlayerHp = state.playerHp

        if (skill.combat?.damage) {
            const dmg = skill.combat.damage + (character.level * 2) // Scaling
            newEnemyHp -= dmg
            logMsg += ` Dealt ${dmg} damage.`
        }
        if (skill.combat?.heal) {
            const heal = skill.combat.heal + (character.level * 2)
            newPlayerHp = Math.min(newPlayerHp + heal, state.playerMaxHp)
            logMsg += ` Healed for ${heal}.`
        }

        // Check Victory
        if (newEnemyHp <= 0) {
            set({
                enemy: { ...state.enemy!, hp: 0 },
                phase: 'victory',
                combatLog: [...state.combatLog, logMsg, `Victory! You defeated ${state.enemy!.name}.`]
            })
            // Reward logic
            const { activeEvent } = useEventStore.getState()
            const xpMult = activeEvent ? activeEvent.xpMultiplier : 1.0

            useGameStore.getState().addXp(Math.floor(state.enemy!.level * 20 * xpMult))
            useGameStore.getState().debugAddGold(state.enemy!.level * 10)
            return
        }

        set({
            enemy: { ...state.enemy!, hp: newEnemyHp },
            playerHp: newPlayerHp,
            combatLog: [...state.combatLog, logMsg],
            turn: 'enemy'
        })

        // Sync HP to GameStore
        useGameStore.setState((gs) => ({
            character: gs.character ? { ...gs.character, hp: newPlayerHp } : null
        }))

        // Trigger Enemy Turn after delay
        setTimeout(() => {
            get().enemyTurn()
        }, 1000)
    },

    enemyTurn: () => {
        const state = get()
        if (state.phase !== 'active') return

        const dmg = state.enemy!.damage
        const newPlayerHp = state.playerHp - dmg

        if (newPlayerHp <= 0) {
            set({
                playerHp: 0,
                phase: 'defeat',
                combatLog: [...state.combatLog, `${state.enemy!.name} attacks for ${dmg} damage.`, "You have been defeated."]
            })
            // Sync HP to GameStore (0 HP)
            useGameStore.setState((gs) => ({
                character: gs.character ? { ...gs.character, hp: 0 } : null
            }))
            return
        }

        set({
            playerHp: newPlayerHp,
            combatLog: [...state.combatLog, `${state.enemy!.name} attacks for ${dmg} damage.`],
            turn: 'player'
        })

        // Sync HP to GameStore
        useGameStore.setState((gs) => ({
            character: gs.character ? { ...gs.character, hp: newPlayerHp } : null
        }))
    },

    endCombat: () => {
        set({ phase: 'idle', enemy: null, combatLog: [] })
    }
}))
