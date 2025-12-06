import { create } from 'zustand'
import { safeSupabaseCall } from '@/lib/supabase'

export interface LeaderboardEntry {
    id: string
    username: string
    honor: number
    rank: number
    class?: string
}

interface LeaderboardState {
    dailyLeaderboard: LeaderboardEntry[]
    weeklyLeaderboard: LeaderboardEntry[]
    lifetimeLeaderboard: LeaderboardEntry[]
    isLoading: boolean
    error: string | null

    fetchLeaderboards: () => Promise<void>
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
    dailyLeaderboard: [],
    weeklyLeaderboard: [],
    lifetimeLeaderboard: [],
    isLoading: false,
    error: null,

    fetchLeaderboards: async () => {
        set({ isLoading: true, error: null })

        // Fetch Daily
        const dailyData = await safeSupabaseCall(
            async (client) => {
                const { data, error } = await client
                    .from('profiles')
                    .select('id, username, honor_daily, game_state')
                    .order('honor_daily', { ascending: false })
                    .limit(50)

                if (error) throw error
                return data
            },
            [],
            'Failed to fetch daily leaderboard'
        )

        // Fetch Weekly
        const weeklyData = await safeSupabaseCall(
            async (client) => {
                const { data, error } = await client
                    .from('profiles')
                    .select('id, username, honor_weekly, game_state')
                    .order('honor_weekly', { ascending: false })
                    .limit(50)

                if (error) throw error
                return data
            },
            [],
            'Failed to fetch weekly leaderboard'
        )

        // Fetch Lifetime
        const lifetimeData = await safeSupabaseCall(
            async (client) => {
                const { data, error } = await client
                    .from('profiles')
                    .select('id, username, honor_lifetime, game_state')
                    .order('honor_lifetime', { ascending: false })
                    .limit(50)

                if (error) throw error
                return data
            },
            [],
            'Failed to fetch lifetime leaderboard'
        )

        // Process Data
        const processEntries = (data: any[], key: string): LeaderboardEntry[] => {
            if (!data) return []
            return data.map((entry, index) => ({
                id: entry.id,
                username: entry.username || 'Unknown',
                honor: entry[key] || 0,
                rank: index + 1,
                class: entry.game_state?.class || 'Unknown'
            }))
        }

        set({
            dailyLeaderboard: processEntries(dailyData || [], 'honor_daily'),
            weeklyLeaderboard: processEntries(weeklyData || [], 'honor_weekly'),
            lifetimeLeaderboard: processEntries(lifetimeData || [], 'honor_lifetime'),
            isLoading: false
        })
    }
}))
