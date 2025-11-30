import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
    console.warn('Missing Supabase environment variables - running in offline mode')
}

export const supabase = isSupabaseConfigured 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const isSupabaseAvailable = () => isSupabaseConfigured && supabase !== null

export const safeSupabaseCall = async <T>(
    operation: (client: NonNullable<typeof supabase>) => Promise<T>,
    fallback?: T,
    errorMessage?: string
): Promise<T | null> => {
    if (!isSupabaseAvailable()) {
        if (errorMessage) {
            console.warn(errorMessage)
        }
        return fallback ?? null
    }
    
    try {
        return await operation(supabase!)
    } catch (error) {
        console.error('Supabase operation failed:', error)
        if (errorMessage) {
            console.warn(errorMessage)
        }
        return fallback ?? null
    }
}
