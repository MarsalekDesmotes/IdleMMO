import { useEffect, useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock, CheckCircle2 } from "lucide-react"

interface RewardConfig {
    id: string
    label: string
    interval: number // milliseconds
    xpMultiplier: number
    goldMultiplier: number
}

const REWARD_CONFIGS: RewardConfig[] = [
    { id: '10min', label: '10 Minutes', interval: 10 * 60 * 1000, xpMultiplier: 5, goldMultiplier: 10 },
    { id: '30min', label: '30 Minutes', interval: 30 * 60 * 1000, xpMultiplier: 15, goldMultiplier: 30 },
    { id: '3hour', label: '3 Hours', interval: 3 * 60 * 60 * 1000, xpMultiplier: 50, goldMultiplier: 100 },
    { id: '12hour', label: '12 Hours', interval: 12 * 60 * 60 * 1000, xpMultiplier: 200, goldMultiplier: 500 },
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

const saveRewardState = (state: RewardState) => {
    localStorage.setItem('nexus-protocol-periodic-rewards', JSON.stringify(state))
}

export function PeriodicRewards() {
    const { character, addXp, debugAddGold, addLog } = useGameStore()
    const [rewardStates, setRewardStates] = useState<RewardState>(getStoredRewardState())
    const [openDialog, setOpenDialog] = useState<string | null>(null)
    const [currentTime, setCurrentTime] = useState(() => Date.now())

    useEffect(() => {
        if (!character) return

        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            const stored = getStoredRewardState()
            setRewardStates(stored)
            // Debugging: Log every 10s if state is weird
            // if (Math.random() > 0.95) console.log('Checking rewards...', stored)
        }, 1000)

        return () => clearInterval(interval)
    }, [character])

    const handleClaim = (config: RewardConfig) => {
        if (!character) return

        // Always fetch fresh state
        const freshState = getStoredRewardState()
        const state = freshState[config.id]
        const now = Date.now() // Use immediate current time

        if (now < state.nextRewardTime) {
            console.log("Too early!", now, state.nextRewardTime)
            return
        }

        const xpReward = character.level * config.xpMultiplier
        const goldReward = character.level * config.goldMultiplier

        addXp(xpReward)
        debugAddGold(goldReward)
        addLog(`Claimed ${config.label} reward! +${xpReward} XP, +${goldReward} Gold`, 'success')

        const newState = {
            ...rewardStates,
            [config.id]: {
                lastClaimTime: currentTime,
                nextRewardTime: currentTime + config.interval
            }
        }

        saveRewardState(newState)
        setRewardStates(newState)
        setOpenDialog(null)
        // Force refresh UI
        setCurrentTime(Date.now())
    }

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        if (hours > 0) {
            return `${hours}h ${minutes}m`
        } else if (minutes > 0) {
            return `${minutes}m ${seconds}s`
        } else {
            return `${seconds}s`
        }
    }

    if (!character) return null

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Gift className="h-5 w-5 text-yellow-500" />
                        Periodic Rewards
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {REWARD_CONFIGS.map((config) => {
                        const state = rewardStates[config.id] || { lastClaimTime: 0, nextRewardTime: currentTime + config.interval }
                        const canClaim = currentTime >= state.nextRewardTime
                        const timeRemaining = Math.max(0, state.nextRewardTime - currentTime)

                        const xpReward = character.level * config.xpMultiplier
                        const goldReward = character.level * config.goldMultiplier

                        return (
                            <Dialog key={config.id} open={openDialog === config.id} onOpenChange={(open) => setOpenDialog(open ? config.id : null)}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant={canClaim ? "default" : "outline"}
                                        className={`w-full justify-between ${canClaim ? "animate-pulse border-yellow-500" : ""}`}
                                        disabled={!canClaim}
                                    >
                                        <div className="flex items-center gap-2">
                                            {canClaim ? (
                                                <Gift className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <Clock className="h-4 w-4" />
                                            )}
                                            <span>{config.label}</span>
                                        </div>
                                        {canClaim ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <span className="text-xs">{formatTime(timeRemaining)}</span>
                                        )}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Gift className="h-5 w-5 text-yellow-500" />
                                            {config.label} Reward
                                        </DialogTitle>
                                        <DialogDescription>
                                            Claim your periodic reward for staying active!
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm font-medium">Experience Points</span>
                                            <Badge variant="outline" className="text-sm">
                                                +{xpReward} XP
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm font-medium">Gold</span>
                                            <Badge variant="outline" className="text-sm">
                                                +{goldReward} Gold
                                            </Badge>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleClaim(config)}
                                            disabled={!canClaim}
                                        >
                                            Claim Reward
                                        </Button>
                                        {!canClaim && (
                                            <p className="text-xs text-center text-muted-foreground">
                                                Available in: {formatTime(timeRemaining)}
                                            </p>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}

