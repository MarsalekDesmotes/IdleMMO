import { create } from 'zustand'
import { isSupabaseAvailable, supabase } from '@/lib/supabase'

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
    isOpen: boolean
    lastMessageTime: number // For rate limiting

    toggleChat: () => void
    fetchMessages: () => Promise<void>
    sendMessage: (content: string) => Promise<void>
    subscribeToMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    isLoading: false,
    isOpen: false,
    lastMessageTime: 0,

    toggleChat: () => set(state => ({ isOpen: !state.isOpen })),

    fetchMessages: async () => {
        if (!isSupabaseAvailable()) {
            // Mock messages
            set({
                messages: [
                    { id: '1', user_id: 'system', username: 'System', content: 'Welcome to Nexus Protocol!', created_at: new Date().toISOString() }
                ]
            })
            return
        }

        set({ isLoading: true })
        const { data, error } = await supabase!
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50) // Cost Optimization: Only fetch last 50 messages

        if (!error && data) {
            set({ messages: data.reverse() }) // Show oldest to newest
        }
        set({ isLoading: false })
    },

    sendMessage: async (content) => {
        const { lastMessageTime } = get()
        const now = Date.now()

        // Rate Limiting (Cost Optimization)
        // Prevent sending more than 1 message every 3 seconds
        if (now - lastMessageTime < 3000) {
            // Silently ignore or throw (UI handles disabled state usually)
            return
        }

        if (!content.trim()) return

        if (!isSupabaseAvailable()) {
            const newMessage: ChatMessage = {
                id: crypto.randomUUID(),
                user_id: 'local',
                username: 'You',
                content,
                created_at: new Date().toISOString()
            }
            set(state => ({ messages: [...state.messages, newMessage], lastMessageTime: now }))
            return
        }

        const { data: { user } } = await supabase!.auth.getUser()
        if (!user) return

        // We assume 'profiles' table exists or we get username from metadata
        // For now, simpler to pass username directly if possible, or fetch it.
        // Let's assume we use the gameStore character name if available, or fallback.
        // BUT strict separation of concerns means we might need to pass username in.
        // For simplicity, we'll fetch it from the auth metadata or use a placeholder if not found.

        // Actually best practice: Client sends content, RLS adds user_id, 
        // trigger/function adds username? Or we send username.
        // Sending username is easier for now.

        // Dynamic import to avoid circular dependency if possible, or just grab from local storage if persisted?
        // Let's try to get it from useGameStore BUT that might cause circular deps.
        // Safer: Get it from the user metadata or local state passed in.
        // For this implementation, we will fetch user metadata.

        // Fallback username
        let username = user.email?.split('@')[0] || 'Unknown'

        // Optimistic Update
        const tempId = crypto.randomUUID()
        const optimisticMessage: ChatMessage = {
            id: tempId,
            user_id: user.id,
            username,
            content,
            created_at: new Date().toISOString()
        }

        set(state => ({ messages: [...state.messages, optimisticMessage], lastMessageTime: now }))

        const { error } = await supabase!
            .from('chat_messages')
            .insert({
                user_id: user.id,
                username, // This should ideally be verified server-side
                content
            })

        if (error) {
            // Rollback on error
            set(state => ({ messages: state.messages.filter(m => m.id !== tempId) }))
            console.error('Failed to send message:', error)
        }
    },

    subscribeToMessages: () => {
        if (!isSupabaseAvailable()) return

        const channel = supabase!
            .channel('public:chat_messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'chat_messages' },
                (payload) => {
                    const newMessage = payload.new as ChatMessage
                    set(state => {
                        // Avoid duplicates if we did optimistic update (check by ID if real ID returned, or content/timestamp match)
                        // A simple way is to filter out the temp ID if we could track it, but for now just appending is safer
                        // if we assume we get the Real ID back.
                        // Ideally we replace the optimistic one.
                        // Simplified: Just add it if not exists.
                        if (state.messages.some(m => m.id === newMessage.id)) return state
                        return { messages: [...state.messages, newMessage] }
                    })
                }
            )
            .subscribe()

        return () => {
            supabase!.removeChannel(channel)
        }
    }
}))
