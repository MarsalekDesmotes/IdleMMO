import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export function AuthPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { signIn, signUp } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent, mode: 'login' | 'register') => {
        e.preventDefault()
        setLoading(true)
        try {
            if (mode === 'login') {
                const { error } = await signIn(email, password)
                if (error) {
                    if (error.message.includes("Email not confirmed")) {
                        toast.error("Please confirm your email address.", {
                            description: "Check your inbox for the confirmation link.",
                            duration: 5000,
                        })
                    } else {
                        toast.error(error.message || "Login failed")
                    }
                } else {
                    toast.success("Welcome back, Hero.")
                }
            } else {
                const { data, error } = await signUp(email, password)
                if (error) {
                    toast.error(error.message || "Registration failed")
                } else {
                    if (data?.user && !data?.session) {
                        toast.success("Account created! Confirmation required.", {
                            description: "Please check your email to verify your account.",
                            duration: 8000,
                        })
                    } else if (data?.user && data?.session) {
                        toast.success("Account created successfully!")
                    } else {
                        // Edge case or user already exists but Supabase obscured it
                        toast.success("Verification email sent.", {
                            description: "If this account exists, check your email.",
                            duration: 8000
                        })
                    }
                }
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-background bg-[url('/bg.jpg')] bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <Card className="w-[400px] z-10 border-primary/20 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-medieval text-primary">IdleAgeMMO</CardTitle>
                    <CardDescription className="text-muted-foreground font-body">Enter the realm of legends.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={(e) => handleSubmit(e, 'login')}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email-login">Email</Label>
                                        <Input
                                            id="email-login"
                                            type="email"
                                            placeholder="hero@idleagemmo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="font-sans" // Better readability for input
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password-login">Password</Label>
                                        <Input
                                            id="password-login"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button className="w-full mt-6 font-bold" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Login
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={(e) => handleSubmit(e, 'register')}>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="email-register">Email</Label>
                                        <Input
                                            id="email-register"
                                            type="email"
                                            placeholder="hero@idleagemmo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="font-sans"
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="password-register">Password</Label>
                                        <Input
                                            id="password-register"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/5 hover:text-primary" onClick={() => useAuthStore.getState().loginAsGuest()}>
                        Play as Guest
                    </Button>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-xs text-muted-foreground text-center opacity-50">
                        Protocol v0.2.0
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
