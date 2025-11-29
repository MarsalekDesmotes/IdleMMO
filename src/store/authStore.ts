import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useGameStore } from './gameStore'

interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
    isGuest: boolean
    initialize: () => Promise<void>
    signIn: (email: string) => Promise<{ error: any }>
    loginAsGuest: () => void
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            session: null,
            loading: true,
            isGuest: false,
            initialize: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    set({ session, user: session?.user ?? null, loading: false })

                    if (session?.user) {
                        // Load game state on init if user exists
                        useGameStore.getState().loadFromCloud()
                    }

                    supabase.auth.onAuthStateChange((_event, session) => {
                        set({ session, user: session?.user ?? null })
                        if (session?.user) {
                            useGameStore.getState().loadFromCloud()
                        }
                    })
                } catch (error) {
                    set({ loading: false })
                }
            },
            signIn: async (email: string) => {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password: 'IdleAgeMMO' // Hardcoded for this specific user request/demo
                })

                if (error) {
                    // If login fails, try sign up (auto-register)
                    const { error: signUpError } = await supabase.auth.signUp({
                        email,
                        password: 'IdleAgeMMO'
                    })
                    return { error: signUpError }
                }

                return { error }
            },
            loginAsGuest: () => {
                set({ isGuest: true, user: null, session: null })
            },
            signOut: async () => {
                await supabase.auth.signOut()
                set({ user: null, session: null, isGuest: false })
                useGameStore.getState().resetState() // Clear local state on logout
            },
        }),
        {
            name: 'nexus-protocol-auth',
            partialize: (state) => ({ isGuest: state.isGuest }),
        }
    )
)
