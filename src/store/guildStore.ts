import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Guild {
    id: string
    name: string
    description: string
    level: number
    xp: number
    created_by: string
    created_at: string
}

export interface GuildMember {
    id: string
    guild_id: string
    user_id: string
    username: string
    role: 'owner' | 'admin' | 'member'
    joined_at: string
}

interface GuildState {
    currentGuild: Guild | null
    members: GuildMember[]
    availableGuilds: Guild[]
    isLoading: boolean

    // Actions
    fetchCurrentGuild: (userId: string) => Promise<void>
    createGuild: (name: string, description: string, ownerId: string) => Promise<boolean>
    joinGuild: (guildId: string, userId: string) => Promise<boolean>
    leaveGuild: (guildId: string, userId: string) => Promise<boolean>
    fetchAvailableGuilds: () => Promise<void>

    // Helpers
    getLevelBuffs: () => { xpBonus: number, goldBonus: number, dropRateBonus: number }
}

export const useGuildStore = create<GuildState>()(
    persist(
        (set, get) => ({
            currentGuild: null,
            members: [],
            availableGuilds: [],
            isLoading: false,

            fetchCurrentGuild: async (_userId: string) => {
                set({ isLoading: false })
            },

            createGuild: async (name, description, ownerId) => {
                // Mock success
                const newGuild: Guild = {
                    id: crypto.randomUUID(),
                    name,
                    description,
                    level: 1,
                    xp: 0,
                    created_by: ownerId,
                    created_at: new Date().toISOString()
                }
                set({ currentGuild: newGuild, members: [{ id: 'mem_1', guild_id: newGuild.id, user_id: ownerId, username: 'Player', role: 'owner', joined_at: new Date().toISOString() }] })
                return true
            },

            joinGuild: async (guildId, userId) => {
                const guild = get().availableGuilds.find(g => g.id === guildId)
                if (guild) {
                    set({ currentGuild: guild, members: [{ id: 'mem_new', guild_id: guild.id, user_id: userId, username: 'Player', role: 'member', joined_at: new Date().toISOString() }] })
                    return true
                }
                return false
            },

            leaveGuild: async (_guildId, _userId) => {
                set({ currentGuild: null, members: [] })
                return true
            },

            fetchAvailableGuilds: async () => {
                // Mock
                set({
                    availableGuilds: [
                        { id: 'g1', name: 'Iron Legion', description: 'Hardcore miners only', level: 5, xp: 5000, created_by: 'u1', created_at: '' },
                        { id: 'g2', name: 'Forest Walkers', description: 'Casual gathering', level: 2, xp: 1200, created_by: 'u2', created_at: '' }
                    ]
                })
            },

            getLevelBuffs: () => {
                const guild = get().currentGuild
                if (!guild) return { xpBonus: 0, goldBonus: 0, dropRateBonus: 0 }

                return {
                    xpBonus: guild.level >= 1 ? 0.05 : 0,
                    goldBonus: guild.level >= 5 ? 0.05 : 0,
                    dropRateBonus: guild.level >= 10 ? 0.10 : 0
                }
            }
        }),
        {
            name: 'guild-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
