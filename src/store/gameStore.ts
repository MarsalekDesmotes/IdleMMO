import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, isSupabaseAvailable, safeSupabaseCall } from '@/lib/supabase'
import { SKILLS } from '@/data/skills'

export type CharacterClass = 'Paladin' | 'Archmage' | 'Ranger'
export type ZoneId = 'outskirts' | 'iron_hills' | 'dark_forest'
export type Gender = 'male' | 'female'

export interface Item {
    id: string
    name: string
    type: 'resource' | 'currency' | 'equipment' | 'consumable' | 'material'
    subtype?: 'head' | 'body' | 'hands' | 'weapon'
    value: number
    description?: string
    icon?: string
    stats?: {
        defense?: number
        attack?: number
        speed?: number
    }
    classRestriction?: CharacterClass[]
    slot?: 'head' | 'body' | 'hands' | 'weapon' // Added for compatibility
}

export interface Equipment {
    head: Item | null
    body: Item | null
    hands: Item | null
    weapon: Item | null
}

export interface Recipe {
    id: string
    name: string
    description: string
    result: Item
    ingredients: { itemId: string; amount: number }[]
    requiredBuilding?: keyof Buildings
    requiredBuildingLevel?: number
    craftingTime: number
    xpReward: number
    goldCost?: number
}

export interface Quest {
    id: string
    title: string
    description: string
    isCompleted: boolean
    status: 'active' | 'completed'
    isDaily?: boolean
    requirements: {
        type: 'resource' | 'level' | 'kill' | 'item'
        target: string
        amount: number
        current: number
    }[]
    rewards: {
        xp: number
        gold: number
        items?: { itemId: string, amount: number }[]
    }
    objectives?: any[] // Legacy support
}

export interface NPC {
    id: string
    name: string
    role: string
    title?: string
    description?: string
    dialogue: string[]
    quests: { id: string }[]
    zone: ZoneId
}

export interface Buildings {
    townHall: number
    lumberMill: number
    mine: number
    blacksmith: number
    library: number
}

export interface Character {
    name: string
    class: CharacterClass
    level: number
    xp: number
    max_xp: number
    hp: number
    max_hp: number
    stamina: number
    max_stamina: number
    mana?: number
    max_mana?: number
    gold: number
    resources: {
        wood: number
        stone: number
        tech: number
    }
    buildings: Buildings
    currentZone: ZoneId
    maxQueueSlots: number
    inventory: { item: Item; count: number }[]
    equipment: Equipment
    unlockedSkills: string[]
    skillPoints: number
    gender: Gender
    customAvatar?: string
    workers: {
        woodsman: number
        miner: number
        researcher: number
    }
    maxPopulation: number
}

export interface Action {
    id: string
    name: string
    description?: string
    duration: number
    rewards: { type: 'xp' | 'gold' | 'item' | 'resource'; value: number; itemId?: string; resourceId?: 'wood' | 'stone' | 'tech' }[]
    staminaCost: number
    resourceReward?: { resource: 'wood' | 'stone' | 'tech'; amount: number }
    requiredBuilding?: { type: keyof Buildings; level: number }
    requiredZone?: ZoneId
}

export interface QueueItem {
    id: string
    action: Action
    startTime?: number
}

export interface GameState {
    character: Character | null
    logs: { id: string; message: string; type: 'info' | 'success' | 'warning' | 'error' | 'loot'; timestamp: number }[]
    actionQueue: QueueItem[]
    activeAction: QueueItem | null
    quests: Quest[]
    npcs: NPC[]

    // Actions
    createCharacter: (name: string, charClass: CharacterClass, gender: Gender, avatar?: string) => void
    addLog: (message: string, type?: 'info' | 'success' | 'warning' | 'error' | 'loot') => void
    addToQueue: (action: Action) => void
    removeFromQueue: (index: number) => void
    setActiveAction: (item: QueueItem | null) => void
    completeAction: (itemId: string) => void
    cancelAction: (itemId: string) => void

    // Inventory & Items
    addItem: (item: Item, count?: number) => void
    removeItem: (itemId: string, count?: number) => void
    equipItem: (item: Item) => void
    unequipItem: (slot: 'head' | 'body' | 'hands' | 'weapon') => void
    moveItem: (fromIndex: number, toIndex: number) => void
    useItem: (item: Item) => void
    craftItem: (recipe: Recipe) => void

    // Progression
    addXp: (amount: number) => void
    levelUp: () => void
    unlockSkill: (skillId: string) => void

    // Kingdom & Map
    constructBuilding: (type: keyof Buildings, cost?: { credits: number, wood: number, stone: number }) => void
    travelToZone: (zoneId: ZoneId) => void
    resetClass: (newClass: CharacterClass) => void
    hireWorker: (workerType: 'woodsman' | 'miner' | 'researcher') => void
    fireWorker: (workerType: 'woodsman' | 'miner' | 'researcher') => void
    processAutoResources: () => void

    // Stats
    regenerateStamina: (amount: number) => void
    regenerateHp: (amount: number) => void
    getDerivedStats: () => { strength: number; intelligence: number; agility: number; defense: number; attack: number; hpRegen: number; critChance: number }

    // Quests & NPCs
    acceptQuest: (quest: { id: string }) => void
    updateQuestProgress: (type: 'resource' | 'level' | 'kill' | 'item', target: string, amount: number) => void
    completeQuest: (questId: string) => void

    // Cloud Sync
    loadFromCloud: () => Promise<void>
    saveToCloud: () => Promise<void>
    resetState: () => void

    // Debug Actions
    debugAddGold: (amount: number) => void
    debugLevelUp: () => void
    debugRefillStamina: () => void
}

// Initial Data
const INITIAL_QUESTS: Quest[] = [
    {
        id: 'q1',
        title: 'Gather Wood',
        description: 'Collect 10 pieces of Wood to help build the settlement.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'resource', target: 'wood', amount: 10, current: 0 }],
        rewards: { xp: 50, gold: 10 }
    },
    {
        id: 'q2',
        title: 'Rat Problem',
        description: 'Defeat 5 Giant Rats in the sewers.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'kill', target: 'Giant Rat', amount: 5, current: 0 }],
        rewards: { xp: 100, gold: 25, items: [{ itemId: 'potion_health', amount: 2 }] }
    },
    {
        id: 'q3',
        title: 'Stone Quarry',
        description: 'Mine 20 pieces of Stone for construction.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'resource', target: 'stone', amount: 20, current: 0 }],
        rewards: { xp: 80, gold: 30 }
    },
    {
        id: 'q4',
        title: 'First Weapon',
        description: 'Craft your first Iron Sword.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'item', target: 'iron_sword', amount: 1, current: 0 }],
        rewards: { xp: 150, gold: 50 }
    },
    {
        id: 'q5',
        title: 'Level Up',
        description: 'Reach level 5 to unlock new skills.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'level', target: '5', amount: 5, current: 0 }],
        rewards: { xp: 200, gold: 100 }
    },
    {
        id: 'q6',
        title: 'Mountain Explorer',
        description: 'Reach Iron Hills and explore the ancient ruins.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'level', target: '20', amount: 20, current: 0 }],
        rewards: { xp: 500, gold: 200 }
    },
    {
        id: 'q7',
        title: 'Tech Collector',
        description: 'Gather 50 Tech points for advanced research.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'resource', target: 'tech', amount: 50, current: 0 }],
        rewards: { xp: 300, gold: 150 }
    },
    {
        id: 'q8',
        title: 'Goblin Hunter',
        description: 'Defeat 10 Goblins to clear the area.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'kill', target: 'Goblin Scout', amount: 10, current: 0 }],
        rewards: { xp: 400, gold: 180, items: [{ itemId: 'potion_health', amount: 5 }] }
    },
    {
        id: 'q9',
        title: 'Forest Explorer',
        description: 'Reach the Dark Forest and uncover its secrets.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'level', target: '40', amount: 40, current: 0 }],
        rewards: { xp: 800, gold: 400 }
    },
    {
        id: 'q10',
        title: 'Shadow Hunter',
        description: 'Defeat 15 Shadow Creatures in the Dark Forest.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'kill', target: 'Shadow Creature', amount: 15, current: 0 }],
        rewards: { xp: 1200, gold: 600, items: [{ itemId: 'potion_health', amount: 10 }] }
    },
    {
        id: 'q11',
        title: 'Ancient Knowledge',
        description: 'Gather 100 Tech points through Dark Forest exploration.',
        isCompleted: false,
        status: 'active',
        requirements: [{ type: 'resource', target: 'tech', amount: 100, current: 0 }],
        rewards: { xp: 1000, gold: 500 }
    }
]

const INITIAL_NPCS: NPC[] = [
    {
        id: 'npc1',
        name: 'Elder Marcus',
        role: 'Village Elder',
        title: 'Village Elder',
        description: 'The wise leader of the village.',
        dialogue: [
            "Welcome to our village, traveler.",
            "We are in dire need of resources. Can you help us?"
        ],
        quests: [{ id: 'q1' }, { id: 'q3' }],
        zone: 'outskirts'
    },
    {
        id: 'npc2',
        name: 'Captain Alaric',
        role: 'Guard Captain',
        title: 'Guard Captain',
        description: 'A stern warrior protecting the gates.',
        dialogue: [
            "Keep your weapon sharp.",
            "The rats are getting bold lately."
        ],
        quests: [{ id: 'q2' }, { id: 'q8' }],
        zone: 'outskirts'
    },
    {
        id: 'npc3',
        name: 'Master Smith Thrain',
        role: 'Master Blacksmith',
        title: 'Master Blacksmith',
        description: 'The finest craftsman in the realm.',
        dialogue: [
            "Fine steel requires fine hands.",
            "Bring me the materials, and I'll forge you a weapon worthy of legend."
        ],
        quests: [{ id: 'q4' }],
        zone: 'outskirts'
    },
    {
        id: 'npc4',
        name: 'Sage Lyra',
        role: 'Wise Scholar',
        title: 'Wise Scholar',
        description: 'A scholar studying the ancient arts.',
        dialogue: [
            "Knowledge is power, young adventurer.",
            "The path of growth requires dedication and wisdom."
        ],
        quests: [{ id: 'q5' }],
        zone: 'outskirts'
    },
    {
        id: 'npc5',
        name: 'Explorer Kael',
        role: 'Mountain Guide',
        title: 'Mountain Guide',
        description: 'An experienced explorer of the Iron Hills.',
        dialogue: [
            "The mountains hold many secrets.",
            "Only the brave dare venture into the Iron Hills."
        ],
        quests: [{ id: 'q6' }, { id: 'q7' }],
        zone: 'iron_hills'
    },
    {
        id: 'npc6',
        name: 'Shadow Whisperer Valen',
        role: 'Forest Guardian',
        title: 'Forest Guardian',
        description: 'A mysterious guardian who watches over the Dark Forest.',
        dialogue: [
            "The forest holds ancient power...",
            "Only those strong enough can survive here."
        ],
        quests: [{ id: 'q9' }, { id: 'q10' }],
        zone: 'dark_forest'
    },
    {
        id: 'npc7',
        name: 'Archmage Seraphine',
        role: 'Master of Dark Arts',
        title: 'Master of Dark Arts',
        description: 'A powerful mage studying the dark magic of the forest.',
        dialogue: [
            "Dark magic requires great understanding.",
            "Collect enough essence and I will teach you secrets."
        ],
        quests: [{ id: 'q11' }],
        zone: 'dark_forest'
    }
]

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            character: null,
            logs: [],
            actionQueue: [],
            activeAction: null,
            quests: INITIAL_QUESTS,
            npcs: INITIAL_NPCS,

            createCharacter: (name, charClass, gender, avatar) => {
                const initialStats = {
                    Paladin: { hp: 120, max_hp: 120, stamina: 100, max_stamina: 100, mana: 50, max_mana: 50 },
                    Archmage: { hp: 80, max_hp: 80, stamina: 80, max_stamina: 80, mana: 150, max_mana: 150 },
                    Ranger: { hp: 100, max_hp: 100, stamina: 120, max_stamina: 120, mana: 75, max_mana: 75 },
                }

                set({
                    character: {
                        name,
                        class: charClass,
                        level: 1,
                        xp: 0,
                        max_xp: 100,
                        gold: 0,
                        resources: { wood: 0, stone: 0, tech: 0 },
                        buildings: { townHall: 1, lumberMill: 0, mine: 0, blacksmith: 0, library: 0 },
                        currentZone: 'outskirts',
                        maxQueueSlots: 3, // Base slots
                        inventory: [],
                        equipment: { head: null, body: null, hands: null, weapon: null },
                        unlockedSkills: [],
                        skillPoints: 0,
                        gender,
                        customAvatar: avatar,
                        workers: { woodsman: 0, miner: 0, researcher: 0 },
                        maxPopulation: 5, // Base population limit (Town Hall level 1)
                        ...initialStats[charClass]
                    },
                    logs: [{ id: crypto.randomUUID(), message: `Character ${name} created.`, type: 'success', timestamp: Date.now() }]
                })
                get().saveToCloud()
            },

            addLog: (message, type = 'info') => {
                set((state) => ({
                    logs: [{ id: crypto.randomUUID(), message, type, timestamp: Date.now() }, ...state.logs].slice(0, 50)
                }))
            },

            addToQueue: (action) => {
                const { character, actionQueue } = get()
                if (!character) return

                if (character.stamina < action.staminaCost) {
                    get().addLog("Not enough stamina!", 'warning')
                    return
                }

                const queueItem: QueueItem = {
                    id: crypto.randomUUID(),
                    action,
                    startTime: actionQueue.length === 0 ? Date.now() : undefined
                }

                set((state) => ({
                    actionQueue: [...state.actionQueue, queueItem],
                    character: { ...state.character!, stamina: state.character!.stamina - action.staminaCost }
                }))
            },

            removeFromQueue: (index) => {
                set((state) => {
                    const item = state.actionQueue[index]
                    const refund = item ? item.action.staminaCost : 0
                    return {
                        actionQueue: state.actionQueue.filter((_, i) => i !== index),
                        character: state.character ? { ...state.character, stamina: Math.min(state.character.stamina + refund, state.character.max_stamina) } : null
                    }
                })
            },

            setActiveAction: (item) => {
                if (item) {
                    set({ activeAction: { ...item, startTime: Date.now() } })
                } else {
                    set({ activeAction: null })
                }
            },

            cancelAction: (itemId) => {
                const { activeAction, actionQueue } = get()

                if (activeAction && activeAction.id === itemId) {
                    get().addLog(`Cancelled ${activeAction.action.name}`, 'info')
                    set((state) => ({
                        activeAction: null,
                        character: state.character ? { ...state.character, stamina: Math.min(state.character.stamina + activeAction.action.staminaCost, state.character.max_stamina) } : null
                    }))
                    return
                }

                const queueIndex = actionQueue.findIndex(i => i.id === itemId)
                if (queueIndex >= 0) {
                    get().removeFromQueue(queueIndex)
                }
            },

            completeAction: (itemId) => {
                const { character, actionQueue } = get()
                const activeItem = actionQueue[0]

                if (!character || !activeItem || activeItem.id !== itemId) return

                const action = activeItem.action
                let logMessage = `Completed ${action.name}.`
                let xpGained = 0
                let goldGained = 0
                let resourcesGained = { wood: 0, stone: 0, tech: 0 }

                if (action.resourceReward) {
                    resourcesGained[action.resourceReward.resource] += action.resourceReward.amount
                    get().updateQuestProgress('resource', action.resourceReward.resource, action.resourceReward.amount)
                    logMessage += ` +${action.resourceReward.amount} ${action.resourceReward.resource}`
                }

                action.rewards.forEach(reward => {
                    if (reward.type === 'xp') {
                        xpGained += reward.value
                        logMessage += ` +${reward.value} XP`
                    } else                     if (reward.type === 'gold') {
                        goldGained += reward.value
                        // Track daily quest gold earned
                        import('./dailyQuestStore').then(({ useDailyQuestStore }) => {
                            useDailyQuestStore.getState().updateDailyQuestProgress('resource', 'gold_earned', reward.value)
                        }).catch(() => {
                            // Daily quest store not available
                        })
                        logMessage += ` +${reward.value} Gold`
                    } else if (reward.type === 'resource' && reward.resourceId) {
                        resourcesGained[reward.resourceId] += reward.value
                        get().updateQuestProgress('resource', reward.resourceId, reward.value)
                        logMessage += ` +${reward.value} ${reward.resourceId}`
                    } else if (reward.type === 'item') {
                        const item: Item = {
                            id: reward.itemId || 'wood',
                            name: reward.itemId ? reward.itemId.charAt(0).toUpperCase() + reward.itemId.slice(1) : 'Resource',
                            type: 'resource',
                            value: 1,
                            icon: '🪵'
                        }
                        get().addItem(item, reward.value)
                        get().updateQuestProgress('resource', item.id, reward.value)
                        logMessage += ` +${reward.value} ${item.name}`
                    }
                })

                if (xpGained > 0) get().addXp(xpGained)

                set((state) => {
                    const nextQueue = state.actionQueue.slice(1)
                    if (nextQueue.length > 0) {
                        nextQueue[0].startTime = Date.now()
                    }

                    return {
                        activeAction: null, // Deprecated, keeping for safety
                        actionQueue: nextQueue,
                        character: state.character ? {
                            ...state.character,
                            gold: state.character.gold + goldGained,
                            resources: {
                                wood: state.character.resources.wood + resourcesGained.wood,
                                stone: state.character.resources.stone + resourcesGained.stone,
                                tech: state.character.resources.tech + resourcesGained.tech,
                            }
                        } : null
                    }
                })

                get().addLog(logMessage, 'success')
                
                // Track daily quest progress for actions
                import('./dailyQuestStore').then(({ useDailyQuestStore }) => {
                    useDailyQuestStore.getState().updateDailyQuestProgress('resource', 'actions_completed', 1)
                }).catch(() => {
                    // Daily quest store not available
                })
                
                get().saveToCloud()
            },

            addItem: (item, count = 1) => {
                set((state) => {
                    if (!state.character) return state
                    const existingItemIndex = state.character.inventory.findIndex(i => i.item.id === item.id)
                    let newInventory = [...state.character.inventory]

                    if (existingItemIndex >= 0) {
                        newInventory[existingItemIndex].count += count
                    } else {
                        newInventory.push({ item, count })
                    }

                    return { character: { ...state.character, inventory: newInventory } }
                })
                // Update quest progress for item type quests
                get().updateQuestProgress('item', item.id, count)
            },

            removeItem: (itemId, count = 1) => {
                set((state) => {
                    if (!state.character) return state
                    const existingItemIndex = state.character.inventory.findIndex(i => i.item.id === itemId)
                    if (existingItemIndex === -1) return state

                    let newInventory = [...state.character.inventory]
                    if (newInventory[existingItemIndex].count > count) {
                        newInventory[existingItemIndex].count -= count
                    } else {
                        newInventory.splice(existingItemIndex, 1)
                    }

                    return { character: { ...state.character, inventory: newInventory } }
                })
            },

            equipItem: (item) => {
                const { character } = get()
                if (!character || !item.subtype) return

                if (item.classRestriction && !item.classRestriction.includes(character.class)) {
                    get().addLog(`You cannot equip this item. Required class: ${item.classRestriction.join(', ')}`, 'error')
                    return
                }

                const currentEquipped = character.equipment[item.subtype]
                if (currentEquipped) {
                    get().addItem(currentEquipped)
                }

                get().removeItem(item.id, 1)

                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        equipment: { ...state.character.equipment, [item.subtype!]: item }
                    } : null
                }))
                get().addLog(`Equipped ${item.name}`, 'info')
            },

            unequipItem: (slot) => {
                const { character } = get()
                if (!character || !character.equipment[slot]) return

                const item = character.equipment[slot]!
                get().addItem(item)

                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        equipment: { ...state.character.equipment, [slot]: null }
                    } : null
                }))
                get().addLog(`Unequipped ${item.name}`, 'info')
            },

            moveItem: (fromIndex, toIndex) => {
                set((state) => {
                    if (!state.character) return state
                    const newInventory = [...state.character.inventory]
                    if (fromIndex < 0 || fromIndex >= newInventory.length || toIndex < 0 || toIndex >= newInventory.length) return state

                    const temp = newInventory[fromIndex]
                    newInventory[fromIndex] = newInventory[toIndex]
                    newInventory[toIndex] = temp

                    return { character: { ...state.character, inventory: newInventory } }
                })
            },

            useItem: (item) => {
                if (item.type !== 'consumable') return

                if (item.id === 'potion_health') {
                    get().regenerateHp(50)
                    get().removeItem(item.id, 1)
                    get().addLog("Used Health Potion. +50 HP", 'success')
                } else {
                    get().addLog(`Cannot use ${item.name}`, 'warning')
                }
            },

            craftItem: (recipe) => {
                const { character } = get()
                if (!character) return

                // Check if can afford gold
                if (recipe.goldCost && character.gold < recipe.goldCost) {
                    get().addLog(`Not enough gold. Required: ${recipe.goldCost}`, 'error')
                    return
                }

                // Check ingredients (resources and inventory items)
                for (const ing of recipe.ingredients) {
                    if (ing.itemId === 'wood') {
                        if (character.resources.wood < ing.amount) {
                            get().addLog(`Missing ingredients: Wood (need ${ing.amount}, have ${character.resources.wood})`, 'error')
                            return
                        }
                    } else if (ing.itemId === 'stone') {
                        if (character.resources.stone < ing.amount) {
                            get().addLog(`Missing ingredients: Stone (need ${ing.amount}, have ${character.resources.stone})`, 'error')
                            return
                        }
                    } else if (ing.itemId === 'tech') {
                        if (character.resources.tech < ing.amount) {
                            get().addLog(`Missing ingredients: Tech (need ${ing.amount}, have ${character.resources.tech})`, 'error')
                            return
                        }
                    } else {
                        const invItem = character.inventory.find(i => i.item.id === ing.itemId)
                        if (!invItem || invItem.count < ing.amount) {
                            get().addLog(`Missing ingredients: ${ing.itemId}`, 'error')
                            return
                        }
                    }
                }

                // Consume gold
                if (recipe.goldCost) {
                    set((state) => ({
                        character: state.character ? {
                            ...state.character,
                            gold: state.character.gold - recipe.goldCost!
                        } : null
                    }))
                }

                // Consume ingredients
                recipe.ingredients.forEach(ing => {
                    if (ing.itemId === 'wood') {
                        set((state) => ({
                            character: state.character ? {
                                ...state.character,
                                resources: {
                                    ...state.character.resources,
                                    wood: state.character.resources.wood - ing.amount
                                }
                            } : null
                        }))
                    } else if (ing.itemId === 'stone') {
                        set((state) => ({
                            character: state.character ? {
                                ...state.character,
                                resources: {
                                    ...state.character.resources,
                                    stone: state.character.resources.stone - ing.amount
                                }
                            } : null
                        }))
                    } else if (ing.itemId === 'tech') {
                        set((state) => ({
                            character: state.character ? {
                                ...state.character,
                                resources: {
                                    ...state.character.resources,
                                    tech: state.character.resources.tech - ing.amount
                                }
                            } : null
                        }))
                    } else {
                        get().removeItem(ing.itemId, ing.amount)
                    }
                })

                // Add result
                get().addItem(recipe.result)
                get().addXp(recipe.xpReward)
                get().addLog(`Crafted ${recipe.result.name}`, 'success')
                get().updateQuestProgress('item', recipe.result.id, 1)
                
                // Track daily quest progress for crafting
                import('./dailyQuestStore').then(({ useDailyQuestStore }) => {
                    useDailyQuestStore.getState().updateDailyQuestProgress('resource', 'items_crafted', 1)
                }).catch(() => {
                    // Daily quest store not available
                })
                
                get().saveToCloud()
            },

            addXp: (amount) => {
                set((state) => {
                    if (!state.character) return state
                    let newXp = state.character.xp + amount
                    let newLevel = state.character.level
                    let newMaxXp = state.character.max_xp
                    let newSkillPoints = state.character.skillPoints

                    if (newXp >= newMaxXp) {
                        newXp -= newMaxXp
                        const oldLevel = newLevel
                        newLevel++
                        newMaxXp = Math.floor(newMaxXp * 1.5)
                        newSkillPoints++
                        
                        // Increase queue slots every 5 levels (3 base + 1 every 5 levels)
                        const newMaxQueueSlots = 3 + Math.floor(newLevel / 5)
                        
                        get().addLog(`Level Up! You are now level ${newLevel}. Queue slots increased to ${newMaxQueueSlots}!`, 'success')
                        // Update quest progress for level type quests
                        get().updateQuestProgress('level', newLevel.toString(), 1)
                        
                        return {
                            character: {
                                ...state.character,
                                xp: newXp,
                                level: newLevel,
                                max_xp: newMaxXp,
                                skillPoints: newSkillPoints,
                                maxQueueSlots: newMaxQueueSlots
                            }
                        }
                    }

                    return {
                        character: {
                            ...state.character,
                            xp: newXp,
                            level: newLevel,
                            max_xp: newMaxXp,
                            skillPoints: newSkillPoints
                        }
                    }
                })
            },

            levelUp: () => {
                get().addXp(get().character?.max_xp || 100)
            },

            unlockSkill: (skillId) => {
                const { character } = get()
                if (!character) return

                if (character.unlockedSkills.includes(skillId)) return

                const skills = SKILLS[character.class]
                const skill = skills.find(s => s.id === skillId)
                if (!skill) return

                if (character.level < skill.requiredLevel) {
                    get().addLog(`Requires Level ${skill.requiredLevel}`, 'error')
                    return
                }

                if (skill.requiredSkill && !character.unlockedSkills.includes(skill.requiredSkill)) {
                    get().addLog(`Requires previous skill`, 'error')
                    return
                }

                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        unlockedSkills: [...state.character.unlockedSkills, skillId]
                    } : null
                }))
                get().addLog(`Unlocked skill: ${skill.name}`, 'success')
                get().saveToCloud()
            },

            constructBuilding: (type, cost) => {
                const { character } = get()
                if (!character) return

                const finalCost = cost || { credits: 0, wood: 0, stone: 0 }

                if (character.gold < finalCost.credits || character.resources.wood < finalCost.wood || character.resources.stone < finalCost.stone) {
                    get().addLog("Not enough resources!", 'warning')
                    return
                }

                const newLevel = character.buildings[type] + 1
                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        gold: state.character.gold - finalCost.credits,
                        resources: {
                            wood: state.character.resources.wood - finalCost.wood,
                            stone: state.character.resources.stone - finalCost.stone,
                            tech: state.character.resources.tech
                        },
                        buildings: {
                            ...state.character.buildings,
                            [type]: newLevel
                        },
                        // Update max population when Town Hall is upgraded
                        maxPopulation: type === 'townHall' 
                            ? 5 + (newLevel - 1) * 3  // 5 base + 3 per level
                            : state.character.maxPopulation
                    } : null
                }))
                if (type === 'townHall') {
                    get().addLog(`Upgraded ${type} to level ${newLevel}. Max population increased to ${5 + (newLevel - 1) * 3}!`, 'success')
                } else {
                    get().addLog(`Upgraded ${type} to level ${newLevel}`, 'success')
                }
                get().saveToCloud()
            },

            travelToZone: (zoneId) => {
                set((state) => ({
                    character: state.character ? { ...state.character, currentZone: zoneId } : null
                }))
                get().addLog(`Traveled to ${zoneId}`, 'info')
            },

            resetClass: (newClass) => {
                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        class: newClass,
                        level: 1,
                        xp: 0,
                        unlockedSkills: []
                    } : null
                }))
                get().addLog(`Reborn as ${newClass}`, 'success')
                get().saveToCloud()
            },

            regenerateStamina: (amount) => {
                set((state) => {
                    if (!state.character) return state
                    return {
                        character: {
                            ...state.character,
                            stamina: Math.min(state.character.stamina + amount, state.character.max_stamina)
                        }
                    }
                })
            },

            regenerateHp: (amount) => {
                set((state) => {
                    if (!state.character) return state
                    const stats = get().getDerivedStats()
                    const totalRegen = amount + (stats.hpRegen || 0)

                    return {
                        character: {
                            ...state.character,
                            hp: Math.min(state.character.hp + totalRegen, state.character.max_hp)
                        }
                    }
                })
            },

            getDerivedStats: () => {
                const { character } = get()
                if (!character) return { strength: 0, intelligence: 0, agility: 0, defense: 0, attack: 0, hpRegen: 0, critChance: 0 }

                let stats = { strength: 0, intelligence: 0, agility: 0, defense: 0, attack: 0, hpRegen: 0, critChance: 0 }

                Object.values(character.equipment).forEach(item => {
                    if (item && item.stats) {
                        if (item.stats.attack) stats.attack += item.stats.attack
                        if (item.stats.defense) stats.defense += item.stats.defense
                        if (item.stats.speed) stats.agility += item.stats.speed
                    }
                })

                const classSkills = SKILLS[character.class]
                character.unlockedSkills.forEach(skillId => {
                    const skill = classSkills.find(s => s.id === skillId)
                    if (skill && skill.type === 'passive' && skill.stats) {
                        if (skill.stats.strength) stats.strength += skill.stats.strength
                        if (skill.stats.intelligence) stats.intelligence += skill.stats.intelligence
                        if (skill.stats.agility) stats.agility += skill.stats.agility
                        if (skill.stats.hpRegen) stats.hpRegen += skill.stats.hpRegen
                        if (skill.stats.critChance) stats.critChance += skill.stats.critChance
                        if (skill.stats.defense) stats.defense += skill.stats.defense
                    }
                })

                return stats
            },

            acceptQuest: (quest) => {
                get().addLog(`Quest Accepted: ${quest.id}`, 'info')
            },

            updateQuestProgress: (type, target, amount) => {
                set((state) => {
                    const newQuests = state.quests.map(q => {
                        if (q.isCompleted) return q

                        const newRequirements = q.requirements.map(req => {
                            if (req.type === type && req.target === target) {
                                return { ...req, current: Math.min(req.current + amount, req.amount) }
                            }
                            return req
                        })

                        const isCompleted = newRequirements.every(req => req.current >= req.amount)
                        if (isCompleted && !q.isCompleted) {
                            get().completeQuest(q.id)
                        }

                        return { ...q, requirements: newRequirements, isCompleted }
                    })
                    return { quests: newQuests }
                })

                // Also update daily quests
                import('./dailyQuestStore').then(({ useDailyQuestStore }) => {
                    useDailyQuestStore.getState().updateDailyQuestProgress(type, target, amount)
                }).catch(() => {
                    // Daily quest store not available, ignore
                })
            },

            completeQuest: (questId) => {
                const { quests } = get()
                const quest = quests.find(q => q.id === questId)
                if (!quest) return

                get().addXp(quest.rewards.xp)
                set((state) => ({
                    character: state.character ? { ...state.character, gold: state.character.gold + quest.rewards.gold } : null
                }))

                if (quest.rewards.items) {
                    quest.rewards.items.forEach(reward => {
                        get().addLog(`Quest Reward: ${reward.itemId} x${reward.amount}`, 'success')
                    })
                }

                get().addLog(`Quest Completed: ${quest.title}!`, 'success')
                get().saveToCloud()
            },

            loadFromCloud: async () => {
                if (!isSupabaseAvailable()) {
                    get().addLog('Cloud save not available - using local storage only', 'warning')
                    return
                }

                const userResult = await safeSupabaseCall(
                    async (client) => {
                        const { data: { user } } = await client.auth.getUser()
                        return user
                    },
                    null,
                    'Failed to get user for cloud load'
                )

                if (!userResult) return

                const data = await safeSupabaseCall(
                    async (client) => {
                        const { data } = await client
                            .from('profiles')
                            .select('game_state')
                            .eq('id', userResult.id)
                            .single()
                        return data
                    },
                    null,
                    'Failed to load game from cloud'
                )

                if (data && data.game_state) {
                    set({ character: data.game_state as Character })
                    get().addLog('Game loaded from cloud.', 'success')
                }
            },

            hireWorker: (workerType) => {
                const { character } = get()
                if (!character) return

                const workerNames = {
                    woodsman: 'Woodsman',
                    miner: 'Miner',
                    researcher: 'Researcher'
                }

                const totalWorkers = character.workers.woodsman + character.workers.miner + character.workers.researcher
                if (totalWorkers >= character.maxPopulation) {
                    get().addLog(`Population limit reached! Upgrade Town Hall to hire more workers.`, 'warning')
                    return
                }

                const hireCost = 50 * (character.workers[workerType] + 1) // Increasing cost per worker

                if (character.gold < hireCost) {
                    get().addLog(`Not enough gold! Need ${hireCost} gold to hire a ${workerNames[workerType]}.`, 'warning')
                    return
                }

                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        gold: state.character.gold - hireCost,
                        workers: {
                            ...state.character.workers,
                            [workerType]: state.character.workers[workerType] + 1
                        }
                    } : null
                }))

                get().addLog(`Hired a ${workerNames[workerType]}! Total: ${character.workers[workerType] + 1}`, 'success')
                get().saveToCloud()
            },

            fireWorker: (workerType) => {
                const { character } = get()
                if (!character || character.workers[workerType] <= 0) return

                const workerNames = {
                    woodsman: 'Woodsman',
                    miner: 'Miner',
                    researcher: 'Researcher'
                }

                set((state) => ({
                    character: state.character ? {
                        ...state.character,
                        workers: {
                            ...state.character.workers,
                            [workerType]: Math.max(0, state.character.workers[workerType] - 1)
                        }
                    } : null
                }))

                get().addLog(`Fired a ${workerNames[workerType]}.`, 'info')
                get().saveToCloud()
            },

            processAutoResources: () => {
                const { character } = get()
                if (!character) return

                let woodProduced = 0
                let stoneProduced = 0
                let techProduced = 0

                // Woodsmen produce wood (1 wood per worker per second)
                if (character.workers.woodsman > 0) {
                    woodProduced = character.workers.woodsman
                    // Lumber Mill bonus: +50% per level
                    if (character.buildings.lumberMill > 0) {
                        woodProduced = Math.floor(woodProduced * (1 + character.buildings.lumberMill * 0.5))
                    }
                }

                // Miners produce stone (1 stone per worker per second)
                if (character.workers.miner > 0) {
                    stoneProduced = character.workers.miner
                    // Mine bonus: +50% per level
                    if (character.buildings.mine > 0) {
                        stoneProduced = Math.floor(stoneProduced * (1 + character.buildings.mine * 0.5))
                    }
                }

                // Researchers produce tech (0.5 tech per worker per second)
                if (character.workers.researcher > 0) {
                    techProduced = Math.floor(character.workers.researcher * 0.5)
                    // Library bonus: +25% per level
                    if (character.buildings.library > 0) {
                        techProduced = Math.floor(techProduced * (1 + character.buildings.library * 0.25))
                    }
                }

                if (woodProduced > 0 || stoneProduced > 0 || techProduced > 0) {
                    set((state) => ({
                        character: state.character ? {
                            ...state.character,
                            resources: {
                                wood: state.character.resources.wood + woodProduced,
                                stone: state.character.resources.stone + stoneProduced,
                                tech: state.character.resources.tech + techProduced
                            }
                        } : null
                    }))
                }
            },

            saveToCloud: async () => {
                if (!isSupabaseAvailable()) {
                    return
                }

                const userResult = await safeSupabaseCall(
                    async (client) => {
                        const { data: { user } } = await client.auth.getUser()
                        return user
                    },
                    null,
                    'Failed to get user for cloud save'
                )

                if (!userResult) return

                const state = get()
                if (!state.character) return

                const error = await safeSupabaseCall(
                    async (client) => {
                        const { error } = await client
                            .from('profiles')
                            .upsert({
                                id: userResult.id,
                                username: state.character.name,
                                game_state: state.character as any,
                                updated_at: new Date().toISOString()
                            })
                        return error
                    },
                    null,
                    'Failed to save game to cloud'
                )

                if (error) {
                    get().addLog('Cloud save failed. Progress saved locally.', 'warning')
                    console.error('Save failed:', error)
                }
            },

            resetState: () => {
                set({ character: null, logs: [], actionQueue: [], quests: INITIAL_QUESTS })
            },

            debugAddGold: (amount) => {
                set((state) => ({
                    character: state.character ? { ...state.character, gold: state.character.gold + amount } : null
                }))
            },

            debugLevelUp: () => {
                get().levelUp()
            },

            debugRefillStamina: () => {
                set((state) => ({
                    character: state.character ? { ...state.character, stamina: state.character.max_stamina } : null
                }))
            }
        }),
        {
            name: 'nexus-protocol-storage',
            partialize: (state) => ({
                character: state.character,
                quests: state.quests
            }),
        }
    )
)
