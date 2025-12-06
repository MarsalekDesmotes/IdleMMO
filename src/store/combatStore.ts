import { create } from 'zustand'
import { useGameStore } from './gameStore'
import { SKILLS } from '@/data/skills'
import { useEventStore } from './eventStore'

export type CombatTurn = 'player' | 'enemy'
export type CombatPhase = 'idle' | 'active' | 'victory' | 'defeat'

import type { Enemy } from '@/data/enemies'
import { ITEMS } from '@/data/items'

// Re-export or just use the imported one
export type { Enemy }

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
        const finalEnemy = { ...enemy }

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
            const stats = useGameStore.getState().getDerivedStats()
            const baseDmg = Math.floor(character.level + stats.strength / 2 + 2)

            // Critical hit chance (5% base + agility bonus)
            const critChance = 0.05 + (stats.agility * 0.001)
            const isCrit = Math.random() < critChance
            const dmg = isCrit ? Math.floor(baseDmg * 2) : baseDmg

            let logMsg = `You attacked.`
            if (isCrit) {
                logMsg += ` Critical Hit!`
            }
            logMsg += ` Dealt ${dmg} damage.`
            const newEnemyHp = state.enemy!.hp - dmg

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
                const goldEarned = state.enemy!.level * 10
                useGameStore.getState().debugAddGold(goldEarned)
                const honorEarned = 5 + Math.floor(state.enemy!.level * 2)
                useGameStore.getState().addHonor(honorEarned)

                // Drop Logic
                state.enemy!.drops.forEach(drop => {
                    if (Math.random() < drop.chance) {
                        const item = ITEMS[drop.itemId]
                        if (item) {
                            useGameStore.getState().addItem(item, 1)
                            // We should probably log this better
                            set(s => ({ combatLog: [...s.combatLog, `Loot: ${item.name}`] }))
                        }
                    }
                })

                // Track daily quest progress for kills
                import('./dailyQuestStore').then(({ useDailyQuestStore }) => {
                    useDailyQuestStore.getState().updateDailyQuestProgress('kill', 'any', 1)
                }).catch(() => {
                    // Daily quest store not available
                })

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

        const { character } = useGameStore.getState()
        if (!character) return

        const baseDmg = state.enemy!.attack

        const stats = useGameStore.getState().getDerivedStats()

        // Dodge chance (agility based)
        const dodgeChance = 0.03 + (stats.agility * 0.002)
        const isDodged = Math.random() < dodgeChance

        if (isDodged) {
            set({
                combatLog: [...state.combatLog, `${state.enemy!.name} attacks, but you dodged!`],
                turn: 'player'
            })
            return
        }

        // Block chance (defense based)
        const blockChance = 0.02 + (stats.defense * 0.001)
        const isBlocked = Math.random() < blockChance
        const dmg = isBlocked ? Math.floor(baseDmg * 0.5) : baseDmg

        let logMsg = `${state.enemy!.name} attacks`
        if (isBlocked) {
            logMsg += `, but you blocked!`
        }
        logMsg += ` for ${dmg} damage.`

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
            combatLog: [...state.combatLog, logMsg],
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
