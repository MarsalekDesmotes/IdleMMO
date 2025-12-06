import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Scroll, Pickaxe, Book } from "lucide-react"

export function OfflineProgressModal() {
    const offlineGains = useGameStore(state => state.offlineGains)
    const clearOfflineGains = useGameStore(state => state.clearOfflineGains)

    if (!offlineGains) return null

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        return `${h}h ${m}m`
    }

    return (
        <Dialog open={!!offlineGains} onOpenChange={(open) => !open && clearOfflineGains()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Welcome Back!</DialogTitle>
                    <DialogDescription>
                        While you were away for {formatTime(offlineGains.seconds)}, your workers continued to gather resources.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {offlineGains.wood > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-900/20">
                                <Scroll className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="font-medium">Wood</p>
                                <p className="text-sm text-muted-foreground">+{Math.floor(offlineGains.wood)}</p>
                            </div>
                        </div>
                    )}
                    {offlineGains.stone > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-stone-100 rounded-full dark:bg-stone-900/20">
                                <Pickaxe className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                            </div>
                            <div>
                                <p className="font-medium">Stone</p>
                                <p className="text-sm text-muted-foreground">+{Math.floor(offlineGains.stone)}</p>
                            </div>
                        </div>
                    )}
                    {offlineGains.tech > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-cyan-100 rounded-full dark:bg-cyan-900/20">
                                <Book className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <div>
                                <p className="font-medium">Tech</p>
                                <p className="text-sm text-muted-foreground">+{Math.floor(offlineGains.tech)}</p>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={clearOfflineGains}>Collect Resources</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
