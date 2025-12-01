import { create } from 'zustand'
import { supabase, isSupabaseAvailable } from '@/lib/supabase'
import { useAuthStore } from './authStore'
import { useGameStore } from './gameStore'

export interface ChatMessage {
    id: string
    user_id: string
    username: string
    content: string
    created_at: string
}

interface ChatState {
    messages: ChatMessage[]
    isLoading: boolean
    subscribe: () => void
    unsubscribe: () => void
    sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,

    subscribe: () => {
        if (!isSupabaseAvailable()) {
            set({ isLoading: false, messages: [] })
            return () => {}
        }

        set({ isLoading: true })

        // Fetch initial messages
        void (async () => {
            try {
                const { data, error } = await supabase!
                    .from('chat_messages')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50)
                
                if (error) {
                    console.error('Failed to load chat messages:', error)
                    set({ isLoading: false })
                    return
                }
                if (data) {
                    set({ messages: data.reverse() as ChatMessage[], isLoading: false })
                }
            } catch (error: unknown) {
                console.error('Chat subscription error:', error)
                set({ isLoading: false })
            }
        })()

        // Subscribe to new messages
        const channel = supabase!
            .channel('public:chat_messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    const newMessage = payload.new as ChatMessage
                    set((state) => ({
                        messages: [...state.messages, newMessage]
                    }))
                }
            )
            .subscribe()

        return () => {
            if (isSupabaseAvailable()) {
                supabase!.removeChannel(channel)
            }
        }
    },

    unsubscribe: () => {
        if (isSupabaseAvailable()) {
            supabase!.removeAllChannels()
        }
    },

    sendMessage: async (content: string) => {
        if (!isSupabaseAvailable()) {
            console.warn('Chat not available - Supabase not configured')
            return
        }

        const { user, isGuest } = useAuthStore.getState()
        const { character } = useGameStore.getState()

        if (!user && !isGuest) {
            console.warn('Cannot send message - user not authenticated')
            return
        }

        // Get username from character name (guest or authenticated)
        const username = character?.name || user?.email?.split('@')[0] || 'Unknown'
        const userId = user?.id || `guest_${Date.now()}`

        try {
            const { error } = await supabase!
                .from('chat_messages')
                .insert({
                    user_id: userId,
                    username: username,
                    content
                })

            if (error) {
                console.error('Failed to send message:', error)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }
}))
