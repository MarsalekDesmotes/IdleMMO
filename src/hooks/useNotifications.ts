import { useEffect, useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { SKILLS } from "@/data/skills"

const REWARD_CONFIGS = [
    { id: '10min', interval: 10 * 60 * 1000 },
    { id: '30min', interval: 30 * 60 * 1000 },
    { id: '3hour', interval: 3 * 60 * 60 * 1000 },
    { id: '12hour', interval: 12 * 60 * 60 * 1000 },
]

interface RewardState {
    [key: string]: {
        lastClaimTime: number
        nextRewardTime: number
    }
}

const getStoredRewardState = (): RewardState => {
    const stored = localStorage.getItem('nexus-protocol-periodic-rewards')
    if (stored) {
        return JSON.parse(stored)
    }
    const initialState: RewardState = {}
    REWARD_CONFIGS.forEach(config => {
        initialState[config.id] = {
            lastClaimTime: 0,
            nextRewardTime: Date.now() + config.interval
        }
    })
    return initialState
}

export function useAvailableRewards() {
    const { character } = useGameStore()
    const [hasAvailable, setHasAvailable] = useState(false)

    useEffect(() => {
        if (!character) {
            return
        }

        const checkRewards = () => {
            const states = getStoredRewardState()
            const now = Date.now()
            const available = REWARD_CONFIGS.some(config => {
                const state = states[config.id] || { lastClaimTime: 0, nextRewardTime: now + config.interval }
                return now >= state.nextRewardTime
            })
            setHasAvailable(available)
        }

        checkRewards()
        const interval = setInterval(checkRewards, 1000)
        return () => clearInterval(interval)
    }, [character])

    return hasAvailable
}

export function useAvailableSkills() {
    const { character } = useGameStore()
    const [hasAvailable, setHasAvailable] = useState(false)

    useEffect(() => {
        if (!character) {
            return
        }

        const skills = SKILLS[character.class] || []
        const unlockedSkills = character.unlockedSkills || []
        const skillPoints = character.skillPoints || 0

        const available = skills.some(skill => {
            if (unlockedSkills.includes(skill.id)) return false
            if (skill.requiredSkill && !unlockedSkills.includes(skill.requiredSkill)) return false
            if (character.level < skill.requiredLevel) return false
            if (skillPoints < skill.cost) return false
            return true
        })
        setHasAvailable(available)
    }, [character])

    return hasAvailable
}

export function useHasActiveJobs() {
    const { actionQueue } = useGameStore()
    return actionQueue.length > 0
}

