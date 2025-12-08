import { create } from 'zustand'
import { isSupabaseAvailable, supabase } from '@/lib/supabase'

export type ChatChannel = 'global' | 'guild' | 'system'

export interface ChatMessage {
    id: string
    userId: string
    username: string
    channel: ChatChannel
    content: string
    timestamp: number
    isSystem?: boolean
}

interface ChatState {
    messages: ChatMessage[]
    activeChannel: ChatChannel
    isConnected: boolean
    onlineUsers: number

    // Actions
    sendMessage: (user: { id: string, name: string }, content: string) => Promise<void>
    addMessage: (message: ChatMessage) => void
    setActiveChannel: (channel: ChatChannel) => void
    setOnlineUsers: (count: number) => void

    // Internals
    initialize: () => void
    simulationInterval: ReturnType<typeof setInterval> | null
}

const MAX_MESSAGES = 100

// Simulation Data
const SIM_NAMES = ['DragonSlayer', 'IdleKing', 'MegaMiner', 'NoobMaster', 'ForestGump', 'CryptoLord', 'AFK_Legend']
const SIM_MESSAGES = [
    'Where do I find iron?',
    'Anyone want to join my guild?',
    'This game is addictive!',
    'Just got a rare drop!',
    'LFG Dungeon run',
    'How do I upgrade my sword?',
    'Selling 500 wood for 100g',
    'Is the server lagging?',
    'Woot level 50!',
    'Goblins are surprisingly tough today.'
]

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    activeChannel: 'global',
    isConnected: false,
    onlineUsers: 1, // Start with self
    simulationInterval: null,

    initialize: () => {
        // If already initialized, skip
        if (get().simulationInterval) return

        const isRealtime = isSupabaseAvailable()

        if (isRealtime) {
            console.log("Chat: Realtime mode enabled (Supabase)")
            set({ isConnected: true })
            if (supabase) {
                // Placeholder for actual subscription
                // supabase.channel('global_chat').on(...)
                // For MVP we just enable the flag
            }
        } else {
            console.log("Chat: Running in Simulation Mode")

            // Initial System Message
            get().addMessage({
                id: 'sys-init',
                userId: 'system',
                username: 'System',
                channel: 'system',
                content: 'Welcome to Global Chat! (Simulation Mode Active)',
                timestamp: Date.now(),
                isSystem: true
            })

            // Simulate "Online Users" count fluctuation
            set({ onlineUsers: Math.floor(Math.random() * 50) + 120 }) // Fake 120-170 players

            // Start Simulation Loop
            const interval = setInterval(() => {
                // 10% chance to receive a message every 3 seconds
                if (Math.random() > 0.8) {
                    const randomName = SIM_NAMES[Math.floor(Math.random() * SIM_NAMES.length)]
                    const randomMsg = SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)]

                    get().addMessage({
                        id: `sim-${Date.now()}`,
                        userId: `sim-${randomName}`,
                        username: randomName,
                        channel: 'global',
                        content: randomMsg,
                        timestamp: Date.now()
                    })
                }

                // Fluctuate online count occasionally
                if (Math.random() > 0.95) {
                    const current = get().onlineUsers
                    const change = Math.random() > 0.5 ? 1 : -1
                    set({ onlineUsers: current + change })
                }

            }, 3000)

            set({ simulationInterval: interval, isConnected: true })
        }
    },

    addMessage: (message) => {
        set(state => {
            const newMessages = [...state.messages, message]
            if (newMessages.length > MAX_MESSAGES) {
                newMessages.shift()
            }
            return { messages: newMessages }
        })
    },

    sendMessage: async (user, content) => {
        const { activeChannel, addMessage } = get()

        // Create message object
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            userId: user.id,
            username: user.name,
            channel: activeChannel,
            content: content,
            timestamp: Date.now()
        }

        // Optimistic UI update
        addMessage(newMessage)

        // If real DB available, push there
        if (isSupabaseAvailable() && supabase) {
            // await supabase.from('chat_messages').insert(...)
        }
    },

    setActiveChannel: (channel) => set({ activeChannel: channel }),
    setOnlineUsers: (count) => set({ onlineUsers: count })
}))
