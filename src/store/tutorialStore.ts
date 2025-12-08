
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TutorialStep =
    | 'WELCOME'
    | 'GATHER_WOOD'
    | 'CRAFT_WEAPON'
    | 'OPEN_INVENTORY'
    | 'EQUIP_WEAPON'
    | 'ENTER_COMBAT'
    | 'COMPLETED'

interface TutorialState {
    currentStep: TutorialStep
    isVisible: boolean
    isCompleted: boolean

    // Actions
    advanceStep: (step: TutorialStep) => void
    completeTutorial: () => void
    resetTutorial: () => void
    setVisible: (visible: boolean) => void
}

export const useTutorialStore = create<TutorialState>()(
    persist(
        (set, get) => ({
            currentStep: 'WELCOME',
            isVisible: true,
            isCompleted: false,

            advanceStep: (step) => {
                const { isCompleted, currentStep } = get()
                if (isCompleted) return

                // Only allow advancing forward in the sequence
                const order: TutorialStep[] = ['WELCOME', 'GATHER_WOOD', 'CRAFT_WEAPON', 'OPEN_INVENTORY', 'EQUIP_WEAPON', 'ENTER_COMBAT', 'COMPLETED']
                const currentIndex = order.indexOf(currentStep)
                const nextIndex = order.indexOf(step)

                if (nextIndex > currentIndex) {
                    set({ currentStep: step, isVisible: true })
                    if (step === 'COMPLETED') {
                        set({ isCompleted: true, isVisible: false })
                    }
                }
            },

            completeTutorial: () => set({ isCompleted: true, isVisible: false, currentStep: 'COMPLETED' }),

            resetTutorial: () => set({ currentStep: 'WELCOME', isCompleted: false, isVisible: true }),

            setVisible: (visible) => set({ isVisible: visible })
        }),
        {
            name: 'tutorial-storage',
        }
    )
)
