import { create } from 'zustand'
import { useGameStore } from './gameStore'

export interface GameEvent {
    id: string
    name: string
    description: string
    duration: number // in seconds
    startTime: number
    enemyModifier?: {
        namePrefix: string
        levelBonus: number
        hpMultiplier: number
    }
    xpMultiplier: number
}

interface EventState {
    activeEvent: GameEvent | null
    nextEventTime: number

    checkForEvent: () => void
    triggerEvent: (event: GameEvent) => void
    endEvent: () => void
}

const EVENTS: Omit<GameEvent, 'startTime'>[] = [
    {
        id: 'blood_moon',
        name: 'Blood Moon',
        description: 'Enemies are stronger but grant double XP!',
        duration: 60, // 1 minute for testing
        enemyModifier: {
            namePrefix: 'Corrupted',
            levelBonus: 2,
            hpMultiplier: 1.5
        },
        xpMultiplier: 2.0
    },
    {
        id: 'goblin_raid',
        name: 'Goblin Raid',
        description: 'Goblins are swarming! Quick battles.',
        duration: 60,
        enemyModifier: {
            namePrefix: 'Raider',
            levelBonus: 0,
            hpMultiplier: 0.8
        },
        xpMultiplier: 1.2
    }
]

export const useEventStore = create<EventState>((set, get) => ({
    activeEvent: null,
    nextEventTime: Date.now() + 10000, // First event in 10 seconds

    checkForEvent: () => {
        const state = get()
        const now = Date.now()

        // If active event, check if it should end
        if (state.activeEvent) {
            if (now > state.activeEvent.startTime + (state.activeEvent.duration * 1000)) {
                get().endEvent()
            }
            return
        }

        // If no active event, check if we should start one
        if (now > state.nextEventTime) {
            const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)]
            get().triggerEvent({
                ...randomEvent,
                startTime: now
            })
        }
    },

    triggerEvent: (event) => {
        set({ activeEvent: event })
        useGameStore.getState().addLog(`EVENT STARTED: ${event.name}! ${event.description}`, 'warning')
    },

    endEvent: () => {
        const event = get().activeEvent
        if (event) {
            useGameStore.getState().addLog(`EVENT ENDED: ${event.name}.`, 'info')
        }
        set({
            activeEvent: null,
            nextEventTime: Date.now() + (Math.random() * 60000) + 30000 // Next event in 30-90 seconds
        })
    }
}))
