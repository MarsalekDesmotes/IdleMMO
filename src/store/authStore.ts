import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
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
                    if (!isSupabaseAvailable()) {
                        set({ loading: false, user: null, session: null })
                        return
                    }

                    const { data: { session } } = await supabase!.auth.getSession()
                    set({ session, user: session?.user ?? null, loading: false })

                    if (session?.user) {
                        // Load game state on init if user exists
                        useGameStore.getState().loadFromCloud()
                    }

                    supabase!.auth.onAuthStateChange((_event, session) => {
                        set({ session, user: session?.user ?? null })
                        if (session?.user) {
                            useGameStore.getState().loadFromCloud()
                        }
                    })
                } catch (error) {
                    console.error('Auth initialization failed:', error)
                    set({ loading: false })
                }
            },
            signIn: async (email: string) => {
                if (!isSupabaseAvailable()) {
                    return { error: { message: 'Supabase not configured. Please use Guest mode.' } }
                }

                try {
                    const { error } = await supabase!.auth.signInWithPassword({
                        email,
                        password: 'IdleAgeMMO' // Hardcoded for this specific user request/demo
                    })

                    if (error) {
                        // If login fails, try sign up (auto-register)
                        const { error: signUpError } = await supabase!.auth.signUp({
                            email,
                            password: 'IdleAgeMMO'
                        })
                        return { error: signUpError }
                    }

                    return { error }
                } catch (error) {
                    console.error('Sign in failed:', error)
                    return { error: { message: 'Authentication failed. Please try Guest mode.' } }
                }
            },
            loginAsGuest: () => {
                set({ isGuest: true, user: null, session: null })
            },
            signOut: async () => {
                if (isSupabaseAvailable()) {
                    try {
                        await supabase!.auth.signOut()
                    } catch (error) {
                        console.error('Sign out failed:', error)
                    }
                }
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
