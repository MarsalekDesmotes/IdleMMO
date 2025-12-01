import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Loader2, AlertCircle, Link as LinkIcon } from "lucide-react"

export function GuestAccountLink() {
    const { isGuest, linkGuestAccount } = useAuthStore()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    if (!isGuest) return null

    const handleLink = async () => {
        if (!email || !password) {
            setError("Please enter email and password")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error } = await linkGuestAccount(email, password)
            if (error) {
                setError(error.message || "Failed to link account")
            } else {
                setOpen(false)
                setEmail("")
                setPassword("")
            }
        } catch (err: any) {
            setError(err.message || "Failed to link account")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Alert className="mb-4 border-yellow-500/50 bg-yellow-950/20">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-500">Guest Mode Active</AlertTitle>
            <AlertDescription className="mt-2">
                <p className="text-sm text-muted-foreground mb-3">
                    You're playing as a guest. Link your account to save your progress and access it from anywhere.
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Link Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Link Your Account</DialogTitle>
                            <DialogDescription>
                                Create an account to save your progress. Your current progress will be saved.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="link-email">Email</Label>
                                <Input
                                    id="link-email"
                                    type="email"
                                    placeholder="hero@idleagemmo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="link-password">Password</Label>
                                <Input
                                    id="link-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-red-500">{error}</div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleLink}
                                disabled={loading || !email || !password}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Link Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AlertDescription>
        </Alert>
    )
}

