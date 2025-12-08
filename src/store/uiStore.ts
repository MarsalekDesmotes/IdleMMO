import { create } from 'zustand'

export type View = 'dashboard' | 'inventory' | 'crafting' | 'combat' | 'world' | 'skills' | 'map' | 'kingdom' | 'leaderboard' | 'arena' | 'market' | 'guild' | 'shop' | 'rebirth' | 'pets' | 'dungeon' | 'cooking' | 'enhancement' | 'settings' | 'rewards' | 'collection'
interface UIState {
    currentView: View
    setView: (view: View) => void
}

export const useUIStore = create<UIState>((set) => ({
    currentView: 'dashboard',
    setView: (view) => set({ currentView: view }),
}))
