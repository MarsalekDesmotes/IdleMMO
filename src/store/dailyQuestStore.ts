import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useGameStore, type Quest } from './gameStore'

interface DailyQuestState {
    dailyQuests: Quest[]
    lastResetDate: string
    resetDailyQuests: () => void
    completeDailyQuest: (questId: string) => void
    initializeDailyQuests: () => void
    updateDailyQuestProgress: (type: 'resource' | 'level' | 'kill' | 'item', target: string, amount: number) => void
}

const DAILY_QUEST_POOL: Omit<Quest, 'current' | 'isCompleted' | 'status'>[] = [
    {
        id: 'daily_wood_30',
        title: 'Daily Wood Gathering',
        description: 'Collect 30 pieces of Wood today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'wood', amount: 30, current: 0 }],
        rewards: { xp: 150, gold: 50 }
    },
    {
        id: 'daily_stone_25',
        title: 'Daily Stone Mining',
        description: 'Mine 25 pieces of Stone today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'stone', amount: 25, current: 0 }],
        rewards: { xp: 120, gold: 45 }
    },
    {
        id: 'daily_combat_10',
        title: 'Daily Combat Challenge',
        description: 'Defeat 10 enemies today.',
        isDaily: true,
        requirements: [{ type: 'kill', target: 'any', amount: 10, current: 0 }],
        rewards: { xp: 200, gold: 100 }
    },
    {
        id: 'daily_action_20',
        title: 'Daily Action Master',
        description: 'Complete 20 actions today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'actions_completed', amount: 20, current: 0 }],
        rewards: { xp: 180, gold: 80 }
    },
    {
        id: 'daily_craft_5',
        title: 'Daily Craftsman',
        description: 'Craft 5 items today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'items_crafted', amount: 5, current: 0 }],
        rewards: { xp: 250, gold: 120 }
    },
    {
        id: 'daily_tech_15',
        title: 'Daily Tech Collector',
        description: 'Gather 15 Tech points today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'tech', amount: 15, current: 0 }],
        rewards: { xp: 180, gold: 90 }
    },
    {
        id: 'daily_gold_500',
        title: 'Daily Wealth',
        description: 'Earn 500 Gold today.',
        isDaily: true,
        requirements: [{ type: 'resource', target: 'gold_earned', amount: 500, current: 0 }],
        rewards: { xp: 150, gold: 150 }
    }
]

const getTodayDateString = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const selectRandomDailyQuests = (count: number = 3): Quest[] => {
    const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count).map(q => ({
        ...q,
        isCompleted: false,
        status: 'active' as const,
        requirements: q.requirements.map(req => ({ ...req, current: 0 }))
    }))
}

export const useDailyQuestStore = create<DailyQuestState>()(
    persist(
        (set, get) => ({
            dailyQuests: [],
            lastResetDate: '',

            initializeDailyQuests: () => {
                const today = getTodayDateString()
                const { lastResetDate, dailyQuests } = get()

                if (lastResetDate !== today) {
                    get().resetDailyQuests()
                } else if (dailyQuests.length === 0) {
                    set({ dailyQuests: selectRandomDailyQuests(3), lastResetDate: today })
                }
            },

            resetDailyQuests: () => {
                const today = getTodayDateString()
                const newQuests = selectRandomDailyQuests(3)
                
                set({ 
                    dailyQuests: newQuests,
                    lastResetDate: today
                })

                useGameStore.getState().addLog('New daily quests are available!', 'info')
            },

            completeDailyQuest: (questId: string) => {
                const quest = get().dailyQuests.find(q => q.id === questId)
                if (!quest) return

                set((state) => ({
                    dailyQuests: state.dailyQuests.map(q =>
                        q.id === questId ? { ...q, isCompleted: true, status: 'completed' as const } : q
                    )
                }))

                useGameStore.getState().addXp(quest.rewards.xp)
                const character = useGameStore.getState().character
                if (character) {
                    useGameStore.setState((state) => ({
                        character: state.character ? {
                            ...state.character,
                            gold: state.character.gold + quest.rewards.gold
                        } : null
                    }))
                    useGameStore.getState().addLog(`Daily Quest Completed: ${quest.title}! +${quest.rewards.xp} XP, +${quest.rewards.gold} Gold`, 'success')
                }
            },

            updateDailyQuestProgress: (type, target, amount) => {
                set((state) => {
                    const newQuests = state.dailyQuests.map(q => {
                        if (q.isCompleted) return q

                        const newRequirements = q.requirements.map(req => {
                            let shouldUpdate = false

                            if (req.type === type) {
                                if (type === 'kill' && req.target === 'any') {
                                    shouldUpdate = true
                                } else if (type === 'resource' && req.target === target) {
                                    shouldUpdate = true
                                } else if (req.target === target) {
                                    shouldUpdate = true
                                }
                            }

                            if (shouldUpdate) {
                                const newCurrent = Math.min(req.current + amount, req.amount)
                                return { ...req, current: newCurrent }
                            }
                            return req
                        })

                        const isCompleted = newRequirements.every(req => req.current >= req.amount)
                        
                        if (isCompleted && !q.isCompleted) {
                            // Complete the quest
                            get().completeDailyQuest(q.id)
                        }

                        return { 
                            ...q, 
                            requirements: newRequirements, 
                            isCompleted: isCompleted || q.isCompleted 
                        }
                    })

                    return { dailyQuests: newQuests }
                })
            }
        }),
        {
            name: 'nexus-protocol-daily-quests',
        }
    )
)

