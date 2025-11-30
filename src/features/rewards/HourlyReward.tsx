import { useEffect, useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gift, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const REWARD_INTERVAL = 3 * 60 * 60 * 1000 // 3 hours in milliseconds

interface HourlyRewardState {
    lastClaimTime: number
    nextRewardTime: number
}

const getStoredRewardState = (): HourlyRewardState => {
    const stored = localStorage.getItem('nexus-protocol-hourly-reward')
    if (stored) {
        return JSON.parse(stored)
    }
    return {
        lastClaimTime: 0,
        nextRewardTime: Date.now() + REWARD_INTERVAL
    }
}

const saveRewardState = (state: HourlyRewardState) => {
    localStorage.setItem('nexus-protocol-hourly-reward', JSON.stringify(state))
}

export function HourlyReward() {
    const { character, addXp, debugAddGold } = useGameStore()
    const [isOpen, setIsOpen] = useState(false)
    const [timeUntilReward, setTimeUntilReward] = useState(0)
    const [canClaim, setCanClaim] = useState(false)

    useEffect(() => {
        if (!character) return

        const checkReward = () => {
            const state = getStoredRewardState()
            const now = Date.now()

            if (now >= state.nextRewardTime) {
                setCanClaim(true)
                setIsOpen(true)
                setTimeUntilReward(0)
            } else {
                setCanClaim(false)
                setTimeUntilReward(Math.max(0, Math.floor((state.nextRewardTime - now) / 1000)))
            }
        }

        checkReward()
        const interval = setInterval(checkReward, 1000)

        return () => clearInterval(interval)
    }, [character])

    const handleClaim = () => {
        if (!character || !canClaim) return

        const xpReward = character.level * 50
        const goldReward = character.level * 100

        addXp(xpReward)
        debugAddGold(goldReward)
        const { addLog } = useGameStore.getState()
        addLog(`Claimed 3-hour reward! +${xpReward} XP, +${goldReward} Gold`, 'success')

        const newState: HourlyRewardState = {
            lastClaimTime: Date.now(),
            nextRewardTime: Date.now() + REWARD_INTERVAL
        }
        saveRewardState(newState)
        setCanClaim(false)
        setIsOpen(false)
        setTimeUntilReward(REWARD_INTERVAL / 1000)
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hours}h ${minutes}m ${secs}s`
    }

    if (!character) return null

    return (
        <>
            {canClaim && (
                <Card className="border-yellow-500/50 bg-yellow-950/20 animate-pulse">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <Gift className="h-4 w-4 text-yellow-500" />
                            Reward Available!
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => setIsOpen(true)}
                        >
                            Claim 3-Hour Reward
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-yellow-500" />
                            3-Hour Reward
                        </DialogTitle>
                        <DialogDescription>
                            You've been away! Claim your bonus rewards.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Experience Points</span>
                                <Badge variant="outline" className="text-sm">
                                    +{character.level * 50} XP
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Gold</span>
                                <Badge variant="outline" className="text-sm">
                                    +{character.level * 100} Gold
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                className="flex-1" 
                                onClick={handleClaim}
                                disabled={!canClaim}
                            >
                                Claim Reward
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {!canClaim && timeUntilReward > 0 && (
                            <p className="text-xs text-center text-muted-foreground">
                                Next reward in: {formatTime(timeUntilReward)}
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

