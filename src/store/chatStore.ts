import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'

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
        set({ isLoading: true })

        // Fetch initial messages
        supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50)
            .then(({ data }) => {
                if (data) {
                    set({ messages: data.reverse() as ChatMessage[], isLoading: false })
                }
            })

        // Subscribe to new messages
        const channel = supabase
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
            supabase.removeChannel(channel)
        }
    },

    unsubscribe: () => {
        supabase.removeAllChannels()
    },

    sendMessage: async (content: string) => {
        const { user } = useAuthStore.getState()
        if (!user) return

        // Get username from game store or auth metadata
        // For now, let's assume we can get it from the user metadata or just use "Player"
        // Ideally we'd fetch the profile, but let's just use email prefix for now if name missing
        const username = user.email?.split('@')[0] || 'Unknown'

        await supabase
            .from('chat_messages')
            .insert({
                user_id: user.id,
                username: username,
                content
            })
    }
}))
