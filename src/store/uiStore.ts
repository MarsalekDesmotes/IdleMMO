import { create } from 'zustand'

export type View = 'dashboard' | 'combat' | 'inventory' | 'crafting' | 'skills' | 'map' | 'world' | 'kingdom' | 'market' | 'guild' | 'settings' | 'leaderboard' | 'arena' | 'rewards' | 'shop' | 'rebirth' | 'pets' | 'dungeon' | 'cooking' | 'enhancement'

interface UIState {
    currentView: View
    setView: (view: View) => void
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'dashboard',
    setView: (view) => set({ currentView: view }),
}))
