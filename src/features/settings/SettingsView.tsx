
import { useGameStore } from "@/store/gameStore"
// import { useAudioStore } from "@/store/audioStore" 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Volume2, VolumeX, Trash2, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SoundManager } from "@/lib/audio/SoundManager"

export function SettingsView() {
    const { hardReset } = useGameStore()
    const [isMuted, setIsMuted] = useState(false)
    const [resetDialogOpen, setResetDialogOpen] = useState(false)

    const toggleSound = () => {
        const muted = SoundManager.getInstance().toggleMute()
        setIsMuted(muted)
    }

    const handleReset = () => {
        hardReset()
        window.location.reload()
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-2 border-[#5c4033] bg-[#e8dcb9] text-[#2c241b] shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-medieval text-[#3e2723]">
                        <div className="p-2 border border-[#5c4033] rounded-full bg-[#d4af37]">
                            <Volume2 className="h-5 w-5" />
                        </div>
                        Game Settings
                    </CardTitle>
                    <CardDescription className="text-[#5c4033]">
                        Configure your experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Audio Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#3e2723] font-medieval border-b border-[#5c4033]/20 pb-2">Audio</h3>
                        <div className="flex items-center justify-between p-4 bg-[#f5e6c8]/50 rounded-lg border border-[#5c4033]/20">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Sound Effects</Label>
                                <p className="text-xs text-muted-foreground">Enable or disable game sounds</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isMuted ? <VolumeX className="h-4 w-4 text-muted-foreground" /> : <Volume2 className="h-4 w-4 text-[#3e2723]" />}
                                <Switch
                                    checked={!isMuted}
                                    onCheckedChange={toggleSound}
                                    className="data-[state=checked]:bg-[#3e2723]"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#3e2723] font-medieval border-b border-[#5c4033]/20 pb-2">Account</h3>
                        <div className="p-4 bg-[#f5e6c8]/50 rounded-lg border border-[#5c4033]/20 flex justify-between items-center">
                            <div>
                                <Label className="text-base font-semibold">Sign Out</Label>
                                <p className="text-xs text-muted-foreground">Log out of your current session.</p>
                            </div>
                            <Button variant="outline" onClick={() => import("@/store/authStore").then(m => m.useAuthStore.getState().signOut())}>
                                Logout
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-[#5c4033]/20" />

                    {/* Data Settings */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#b71c1c] font-medieval border-b border-[#b71c1c]/20 pb-2">Danger Zone</h3>

                        <div className="p-4 bg-red-950/5 rounded-lg border border-red-900/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-semibold text-red-900">Reset Character</Label>
                                    <p className="text-xs text-red-800/70">Permanently delete your character and start over.</p>
                                </div>
                                <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            Reset Save
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                                <AlertTriangle className="h-5 w-5" />
                                                Confirm Reset
                                            </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. All progress, gold, and items will be lost forever.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="ghost" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
                                            <Button variant="destructive" onClick={handleReset}>Yes, Delete Everything</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <p className="text-xs text-muted-foreground italic">
                            Game version: v0.2.2 (Beta)
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
