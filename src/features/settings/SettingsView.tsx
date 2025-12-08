
import { useGameStore } from "@/store/gameStore"
import { useAuthStore } from "@/store/authStore"
import { useSettingsStore } from "@/store/settingsStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Volume2, VolumeX, Trash2, AlertTriangle, Save, User, Laptop } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SettingsView() {
    // Stores
    const { hardReset, saveToCloud } = useGameStore()
    const { user, isGuest, signOut, linkGuestAccount } = useAuthStore()
    const {
        sfxEnabled, setSfxEnabled,
        musicEnabled, setMusicEnabled,
        masterVolume, setMasterVolume,
        lowPerformanceMode, setLowPerformanceMode
    } = useSettingsStore()

    // Local State
    const [resetDialogOpen, setResetDialogOpen] = useState(false)
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [linkError, setLinkError] = useState<string | null>(null)
    const [linkSuccess, setLinkSuccess] = useState(false)

    const handleReset = () => {
        hardReset()
        window.location.reload()
    }

    const handleLinkAccount = async () => {
        setLinkError(null)
        const { error } = await linkGuestAccount(email, password)
        if (error) {
            setLinkError(error.message)
        } else {
            setLinkSuccess(true)
            setTimeout(() => setLinkDialogOpen(false), 2000)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Header Card */}
            <Card className="border-2 border-[#5c4033] bg-[#e8dcb9] text-[#2c241b] shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-medieval text-[#3e2723]">
                        <div className="p-2 border border-[#5c4033] rounded-full bg-[#d4af37]">
                            <Volume2 className="h-5 w-5" />
                        </div>
                        Game Settings
                    </CardTitle>
                    <CardDescription className="text-[#5c4033]">
                        Configure your audio, graphics, and account preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* AUDIO SETTINGS */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#3e2723] font-medieval border-b border-[#5c4033]/20 pb-2 flex items-center gap-2">
                            <Volume2 className="h-4 w-4" /> Audio
                        </h3>

                        {/* Master Volume */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Master Volume</Label>
                                <span className="text-xs text-muted-foreground">{Math.round(masterVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={masterVolume}
                                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-[#5c4033]/20 rounded-lg appearance-none cursor-pointer accent-[#8B4513]"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="flex items-center justify-between p-3 bg-[#f5e6c8]/50 rounded-lg border border-[#5c4033]/20">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Sound Effects</Label>
                                <p className="text-xs text-muted-foreground">Enable clicks and interaction sounds</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!sfxEnabled ? <VolumeX className="h-4 w-4 text-muted-foreground" /> : <Volume2 className="h-4 w-4 text-[#3e2723]" />}
                                <Switch checked={sfxEnabled} onCheckedChange={setSfxEnabled} className="data-[state=checked]:bg-[#3e2723]" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-[#f5e6c8]/50 rounded-lg border border-[#5c4033]/20">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Music</Label>
                                <p className="text-xs text-muted-foreground">Background ambience</p>
                            </div>
                            <Switch checked={musicEnabled} onCheckedChange={setMusicEnabled} className="data-[state=checked]:bg-[#3e2723]" />
                        </div>
                    </div>

                    {/* VISUAL SETTINGS */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#3e2723] font-medieval border-b border-[#5c4033]/20 pb-2 flex items-center gap-2">
                            <Laptop className="h-4 w-4" /> Visuals
                        </h3>
                        <div className="flex items-center justify-between p-3 bg-[#f5e6c8]/50 rounded-lg border border-[#5c4033]/20">
                            <div className="space-y-0.5">
                                <Label className="text-base font-semibold">Low Performance Mode</Label>
                                <p className="text-xs text-muted-foreground">Reduce particle effects and animations</p>
                            </div>
                            <Switch checked={lowPerformanceMode} onCheckedChange={setLowPerformanceMode} className="data-[state=checked]:bg-[#3e2723]" />
                        </div>
                    </div>

                    {/* ACCOUNT SETTINGS */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#3e2723] font-medieval border-b border-[#5c4033]/20 pb-2 flex items-center gap-2">
                            <User className="h-4 w-4" /> Account
                        </h3>

                        {isGuest ? (
                            <div className="p-4 bg-orange-100/50 rounded-lg border border-orange-200 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-orange-900">Guest Account</h4>
                                        <p className="text-sm text-orange-800/80">Your progress is saved locally. Clear your cache and you lose everything!</p>
                                    </div>
                                </div>
                                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="self-end bg-orange-600 hover:bg-orange-700 text-white">
                                            Link to Email
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Save Usage Progress</DialogTitle>
                                            <DialogDescription>Create an account to sync your progress across devices.</DialogDescription>
                                        </DialogHeader>
                                        {!linkSuccess ? (
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Email</Label>
                                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="hero@example.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Password</Label>
                                                    <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                                                </div>
                                                {linkError && <p className="text-sm text-red-500">{linkError}</p>}
                                                <Button onClick={handleLinkAccount} className="w-full">Link Account</Button>
                                            </div>
                                        ) : (
                                            <div className="py-8 text-center text-green-600 font-bold">
                                                Account Linked Successfully!
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-100/50 rounded-lg border border-green-200 flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-green-900">Cloud Connected</h4>
                                    <p className="text-sm text-green-800/80">Logged in as {user?.email}</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-2">
                            <div className="text-sm text-muted-foreground">Force Cloud Save</div>
                            <Button variant="ghost" size="sm" onClick={() => { saveToCloud(); alert('Saved!'); }}>
                                <Save className="h-4 w-4 mr-2" /> Save Now
                            </Button>
                        </div>
                    </div>

                    <Separator className="bg-[#5c4033]/20" />

                    {/* DANGER ZONE */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#b71c1c] font-medieval border-b border-[#b71c1c]/20 pb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Danger Zone
                        </h3>

                        <div className="p-4 bg-red-950/5 rounded-lg border border-red-900/20">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label className="text-base font-semibold text-red-900">Hard Reset</Label>
                                    <p className="text-xs text-red-800/70">Permanently delete character and local save.</p>
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
                                                This action cannot be undone. All progress will be lost.
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

                </CardContent>
            </Card>

            <div className="text-center text-xs text-muted-foreground pb-8">
                v0.2.3 (Beta) - Nexus Protocol
            </div>
        </div>
    )
}
