import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { useGameStore } from './gameStore'

export interface ArenaOpponent {
    id: string
    name: string
    level: number
    class: 'Paladin' | 'Archmage' | 'Ranger'
    hp: number
    max_hp: number
    stats: {
        strength: number
        intelligence: number
        agility: number
        defense: number
    }
    honorReward: number
}

interface PvPState {
    opponents: ArenaOpponent[]
    lastMatchTime: number | null
    dailyMatches: number
    maxDailyMatches: number

    generateOpponents: () => void
    fightOpponent: (opponentId: string) => { victory: boolean, log: string[] }
    resetDailyMatches: () => void
}

import { supabase } from '@/lib/supabase'

const generateRandomName = () => {
    // Fallback if DB fetch fails
    const prefixes = ['Shadow', 'Light', 'Iron', 'Storm', 'Dark', 'Golden', 'Silver', 'Crimson', 'Azure', 'Mystic']
    const suffixes = ['Blade', 'Shield', 'Walker', 'Caster', 'Hunter', 'Strike', 'Soul', 'Heart', 'Fist', 'Wing']
    const p = prefixes[Math.floor(Math.random() * prefixes.length)]
    const s = suffixes[Math.floor(Math.random() * suffixes.length)]
    return `${p} ${s}`
}

export const usePvPStore = create<PvPState>((set, get) => ({
    opponents: [],
    lastMatchTime: null,
    dailyMatches: 0,
    maxDailyMatches: 10,

    generateOpponents: async () => {
        const { character } = useGameStore.getState()
        if (!character) return

        let opponents: ArenaOpponent[] = []

        try {
            // Attempt to fetch real players
            const minLevel = Math.max(1, character.level - 2)
            const maxLevel = character.level + 2

            // Randomly pick a starting point to avoid always getting the same people
            // const randomOffset = Math.floor(Math.random() * 100)

            if (!supabase) return
            const { data } = await supabase
                .from('profiles')
                .select('id, username, game_state')
                .gte('game_state->>level', minLevel)
                .lte('game_state->>level', maxLevel)
                .neq('id', character.id) // Don't fight yourself
                .limit(3)

            if (data && data.length > 0) {
                opponents = data.map(profile => {
                    const state = profile.game_state
                    const level = state.level || 1
                    // Approximate stats if not fully available or simply trust the snapshot
                    // For security/fairness, we might want to sanitize this, but for now we trust the snapshot.

                    // Recalculate basic stats to ensure they have combat stats
                    let str = 10 + level * 2
                    let int = 10 + level * 2
                    let agi = 10 + level * 2
                    let hp = 100 + level * 20
                    const charClass = state.class || 'Paladin'

                    if (charClass === 'Paladin') { str += level; hp += level * 10; }
                    if (charClass === 'Archmage') { int += level; }
                    if (charClass === 'Ranger') { agi += level; }

                    // TODO: Add Pet Bonus if they have equippedPet in snapshot

                    return {
                        id: profile.id,
                        name: profile.username || generateRandomName(),
                        level: level,
                        class: charClass,
                        hp: state.max_hp || hp,
                        max_hp: state.max_hp || hp,
                        stats: {
                            strength: str, // Ideally we'd calculate from their equipment/skills
                            intelligence: int,
                            agility: agi,
                            defense: Math.floor(level * 1.5)
                        },
                        honorReward: 10 + Math.floor(level * 2)
                    }
                })
            }
        } catch (e) {
            console.error("Failed to fetch real opponents", e)
        }

        // Fill with bots if needed
        if (opponents.length < 3) {
            const needed = 3 - opponents.length
            const classes: ('Paladin' | 'Archmage' | 'Ranger')[] = ['Paladin', 'Archmage', 'Ranger']
            const offsets = [-1, 0, 1] // Simplified for bots

            for (let i = 0; i < needed; i++) {
                const offset = offsets[i % offsets.length]
                const level = Math.max(1, character.level + offset)
                const charClass = classes[Math.floor(Math.random() * classes.length)]

                let str = 10 + level * 2
                let int = 10 + level * 2
                let agi = 10 + level * 2
                let hp = 100 + level * 20

                if (charClass === 'Paladin') { str += level; hp += level * 10; }
                if (charClass === 'Archmage') { int += level; }
                if (charClass === 'Ranger') { agi += level; }

                opponents.push({
                    id: uuidv4(),
                    name: generateRandomName(),
                    level,
                    class: charClass,
                    hp,
                    max_hp: hp,
                    stats: {
                        strength: str,
                        intelligence: int,
                        agility: agi,
                        defense: Math.floor(level * 1.5)
                    },
                    honorReward: 10 + Math.floor(level * 2)
                })
            }
        }

        set({ opponents })
    },

    fightOpponent: (opponentId) => {
        const { opponents, dailyMatches } = get()
        const opponent = opponents.find(o => o.id === opponentId)
        if (!opponent) return { victory: false, log: ['Opponent not found'] }

        const { character, getDerivedStats } = useGameStore.getState()
        if (!character) return { victory: false, log: ['Character not found'] }

        const playerStats = getDerivedStats()
        let playerHp = character.hp
        let opponentHp = opponent.hp
        const log: string[] = []

        log.push(`Combat started vs ${opponent.name} (Lvl ${opponent.level} ${opponent.class})`)

        let round = 1
        while (playerHp > 0 && opponentHp > 0 && round <= 20) {
            // Player Turn
            const playerDmg = Math.max(1, Math.floor(playerStats.attack * (1 + Math.random() * 0.2) - opponent.stats.defense * 0.5))
            const playerCrit = Math.random() < playerStats.critChance
            const finalPlayerDmg = playerCrit ? playerDmg * 2 : playerDmg

            opponentHp -= finalPlayerDmg
            log.push(`Round ${round}: You deal ${finalPlayerDmg}${playerCrit ? ' (Crit!)' : ''} damage.`)

            if (opponentHp <= 0) break

            // Enemy Turn
            // Simple enemy damage calc
            // Enemy Attack Power approx = Main Stat
            let enemyAtk = 0
            if (opponent.class === 'Paladin') enemyAtk = opponent.stats.strength
            if (opponent.class === 'Archmage') enemyAtk = opponent.stats.intelligence
            if (opponent.class === 'Ranger') enemyAtk = opponent.stats.agility

            const enemyDmg = Math.max(1, Math.floor(enemyAtk * (1 + Math.random() * 0.2) - playerStats.defense * 0.5))
            playerHp -= enemyDmg
            log.push(`Round ${round}: ${opponent.name} deals ${enemyDmg} damage.`)

            round++
        }

        const victory = playerHp > 0

        if (victory) {
            log.push(`Victory! gained ${opponent.honorReward} Honor.`)
            useGameStore.getState().addHonor(opponent.honorReward)
            // Remove defeated opponent
            set({ opponents: opponents.filter(o => o.id !== opponentId) })
        } else {
            log.push('Defeat! You need to get stronger.')
        }

        set({ dailyMatches: dailyMatches + 1 })

        // Sync basic game stats derived from fight if needed (e.g. reduce HP? For now let's say arena heals you after or is virtual)
        return { victory, log }
    },

    resetDailyMatches: () => set({ dailyMatches: 0 })
}))
