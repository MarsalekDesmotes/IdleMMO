import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
    // Audio
    masterVolume: number
    sfxEnabled: boolean
    musicEnabled: boolean

    // Visuals
    lowPerformanceMode: boolean

    // Actions
    setMasterVolume: (volume: number) => void
    setSfxEnabled: (enabled: boolean) => void
    setMusicEnabled: (enabled: boolean) => void
    setLowPerformanceMode: (enabled: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            masterVolume: 0.5,
            sfxEnabled: true,
            musicEnabled: true,
            lowPerformanceMode: false,

            setMasterVolume: (volume) => set({ masterVolume: volume }),
            setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),
            setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),
            setLowPerformanceMode: (enabled) => set({ lowPerformanceMode: enabled }),
        }),
        {
            name: 'nexus-settings',
        }
    )
)
