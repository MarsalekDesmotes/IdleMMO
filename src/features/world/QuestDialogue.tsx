
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Scroll, Check, X } from "lucide-react"

interface QuestDialogueProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    quest: {
        id: string
        title: string
        description: string
        rewards: { gold: number, xp: number, [key: string]: number }
    } | null
    npcName: string
    onAccept: () => void
    onDecline: () => void
}

export function QuestDialogue({ open, onOpenChange, quest, npcName, onAccept, onDecline }: QuestDialogueProps) {
    if (!quest) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#e8dcb9] text-[#2c241b] border-[6px] border-[#5c4033] shadow-2xl font-medieval">
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")` }}>
                </div>

                <DialogHeader className="relative z-10 border-b border-[#5c4033]/30 pb-4">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-[#3e2723]">
                        <Scroll className="h-6 w-6 text-[#8b4513]" />
                        {quest.title}
                    </DialogTitle>
                    <DialogDescription className="text-[#5c4033] font-serif italic text-base">
                        {npcName} looks at you expectantly...
                    </DialogDescription>
                </DialogHeader>

                <div className="relative z-10 py-4">
                    <div className="p-4 bg-[#f5e6c8]/50 rounded border border-[#5c4033]/20 text-lg leading-relaxed text-[#2c241b]">
                        "{quest.description}"
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <span className="text-sm font-bold uppercase tracking-wider text-[#5c4033]">Rewards:</span>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 font-bold text-[#b8860b]">
                                <div className="h-2 w-2 rounded-full bg-[#ffd700] ring-1 ring-[#b8860b]" />
                                {quest.rewards.gold} Gold
                            </div>
                            <div className="flex items-center gap-1 font-bold text-[#1e88e5]">
                                <div className="h-2 w-2 rounded-full bg-[#64b5f6] ring-1 ring-[#1e88e5]" />
                                {quest.rewards.xp} XP
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="relative z-10 flex gap-2 sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={onDecline}
                        className="text-[#5c4033] hover:bg-[#5c4033]/10 hover:text-[#3e2723]"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Decline
                    </Button>
                    <Button
                        onClick={onAccept}
                        className="bg-[#3e2723] text-[#e8dcb9] hover:bg-[#2c241b] border border-[#5c4033]"
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Accept Quest
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
