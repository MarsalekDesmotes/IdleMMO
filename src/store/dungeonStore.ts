import { create } from 'zustand'
import { DUNGEONS, type Dungeon } from '@/data/dungeons'
import { useGameStore } from './gameStore'
import { ITEMS } from '@/data/items'

interface DungeonState {
    activeDungeon: Dungeon | null
    currentWaveIndex: number
    isDungeonActive: boolean
    dungeonLog: string[]

    startDungeon: (dungeonId: string) => void
    advanceWave: () => void
    failDungeon: () => void
    completeDungeon: () => void
    leaveDungeon: () => void
}

export const useDungeonStore = create<DungeonState>((set, get) => ({
    activeDungeon: null,
    currentWaveIndex: 0,
    isDungeonActive: false,
    dungeonLog: [],

    startDungeon: (dungeonId) => {
        const dungeon = DUNGEONS.find(d => d.id === dungeonId)
        if (!dungeon) return

        // Check level requirement
        const { character } = useGameStore.getState()
        if (!character || character.level < dungeon.minLevel) {
            set({ dungeonLog: ['Level too low to enter this dungeon.'] })
            return
        }

        // Initialize
        set({
            activeDungeon: dungeon,
            currentWaveIndex: 0,
            isDungeonActive: true,
            dungeonLog: [`Entered ${dungeon.name}!`, `Wave 1/${dungeon.waves.length} started.`]
        })
    },

    advanceWave: () => {
        const { activeDungeon, currentWaveIndex } = get()
        if (!activeDungeon) return

        if (currentWaveIndex + 1 < activeDungeon.waves.length) {
            set(state => ({
                currentWaveIndex: state.currentWaveIndex + 1,
                dungeonLog: [...state.dungeonLog, `Wave ${state.currentWaveIndex + 2} started!`]
            }))
        } else {
            get().completeDungeon()
        }
    },

    failDungeon: () => {
        set(state => ({
            isDungeonActive: false,
            dungeonLog: [...state.dungeonLog, 'Dungeon Failed! You were defeated.']
        }))
    },

    completeDungeon: () => {
        const { activeDungeon } = get()
        if (!activeDungeon) return

        // Give Rewards
        const gameStore = useGameStore.getState()
        gameStore.addLog(`Completed ${activeDungeon.name}!`, 'success')

        // XP & Gold
        if (activeDungeon.rewards.xp) gameStore.addXp(activeDungeon.rewards.xp)
        if (activeDungeon.rewards.gold) gameStore.addGold(activeDungeon.rewards.gold)

        // Artifact Drop
        if (activeDungeon.rewards.artifactId && activeDungeon.rewards.dropRate) {
            if (Math.random() < activeDungeon.rewards.dropRate) {
                // Artifact logic (not fully implemented in store yet, just log for now or add item if artifact is item)
                // Assuming artifact is just an item ID
                // We don't have artifact items in ITEMS map? Or we do?
                // Let's assume it's just a log for now to avoid errors if item missing.
                gameStore.addLog(`Artifact Found: ${activeDungeon.rewards.artifactId}`, 'loot')
            }
        }

        // Item Rewards (Epic/Legendary)
        if (activeDungeon.rewards.items) {
            activeDungeon.rewards.items.forEach(drop => {
                if (Math.random() < drop.chance) {
                    const item = ITEMS[drop.itemId]
                    if (item) {
                        gameStore.addItem(item, 1)
                        gameStore.addLog(`Found ${item.name}!`, 'loot')
                    }
                }
            })
        }

        set(state => ({
            isDungeonActive: false,
            dungeonLog: [...state.dungeonLog, 'Dungeon Cleared! Rewards claimed.']
        }))
    },

    leaveDungeon: () => {
        set({
            activeDungeon: null,
            currentWaveIndex: 0,
            isDungeonActive: false,
            dungeonLog: []
        })
    }
}))
