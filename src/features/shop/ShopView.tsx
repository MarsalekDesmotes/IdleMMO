import { useState } from "react"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, CreditCard, Sparkles, Gem } from "lucide-react"

export function ShopView() {
    const { character, addDiamonds, spendDiamonds, setPrimeStatus } = useGameStore()
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [selectedPackage, setSelectedPackage] = useState<{ amount: number, cost: number } | null>(null)
    const [cardNumber, setCardNumber] = useState("")

    const handleBuyDiamonds = () => {
        if (!selectedPackage) return
        // Simulate payment processing
        setTimeout(() => {
            if (cardNumber.replace(/\s/g, '').length === 16) {
                addDiamonds(selectedPackage.amount)
                setIsPaymentOpen(false)
                setSelectedPackage(null)
                setCardNumber("")
                // Log success is handled by store implicitly or we can add here if needed?
                // Store doesn't log addDiamonds, so maybe add a manual log?
                // useGameStore.getState().addLog(`Purchased ${selectedPackage.amount} Diamonds!`, 'success') 
            } else {
                alert("Invalid card number! (Use 16 digits)")
            }
        }, 1000)
    }

    const handleBuyPrime = () => {
        if (spendDiamonds(1000)) {
            setPrimeStatus(true)
        }
    }

    const diamondPackages = [
        { amount: 100, cost: 0.99 },
        { amount: 550, cost: 4.99 },
        { amount: 1200, cost: 9.99 },
        { amount: 3200, cost: 24.99 },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center bg-card p-6 rounded-lg border shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <ShoppingBag className="h-8 w-8" /> Nexus Store
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Enhance your capabilities and support the protocol.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-full border">
                        <Gem className="h-5 w-5 text-blue-400" />
                        <span className="text-xl font-bold font-mono text-blue-400">{character?.diamonds || 0}</span>
                    </div>
                </div>
            </div>

            {/* Nexus Prime Banner */}
            {!character?.isPrime && (
                <Card className="border-blue-500/50 bg-gradient-to-r from-blue-950/40 to-purple-950/40 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="h-48 w-48" />
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-blue-300">Nexus Prime Membership</CardTitle>
                                <CardDescription className="text-blue-200/80">Unlock the full potential of your neural link.</CardDescription>
                            </div>
                            <Badge className="bg-blue-500 hover:bg-blue-600">RECOMMENDED</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4 relative z-10">
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-blue-100">
                                <Sparkles className="h-4 w-4 text-yellow-400" /> Global Auto-Queue (All Actions)
                            </li>
                            <li className="flex items-center gap-2 text-blue-100">
                                <Sparkles className="h-4 w-4 text-yellow-400" /> +10% XP Gain
                            </li>
                        </ul>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-blue-100">
                                <Sparkles className="h-4 w-4 text-yellow-400" /> Golden Chat Name
                            </li>
                            <li className="flex items-center gap-2 text-blue-100">
                                <Sparkles className="h-4 w-4 text-yellow-400" /> Support Development
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleBuyPrime} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
                            Unlock for 1000 <Gem className="h-4 w-4 ml-1 inline" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Diamond Packages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {diamondPackages.map((pkg) => (
                    <Card key={pkg.amount} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="text-center">
                            <CardTitle className="flex justify-center items-center gap-2 text-2xl">
                                <Gem className="h-6 w-6 text-blue-400" /> {pkg.amount}
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            <Dialog open={isPaymentOpen && selectedPackage?.amount === pkg.amount} onOpenChange={(open) => {
                                setIsPaymentOpen(open)
                                if (!open) setSelectedPackage(null)
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant="outline" onClick={() => {
                                        setSelectedPackage(pkg)
                                        setIsPaymentOpen(true)
                                    }}>
                                        Buy ${pkg.cost}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Secure Payment Gateway</DialogTitle>
                                        <DialogDescription>
                                            Purchasing {pkg.amount} Diamonds for ${pkg.cost}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 p-2 border rounded bg-muted/50">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="text-sm font-mono">**** **** **** 4242</span>
                                            </div>
                                            <Input
                                                id="card"
                                                placeholder="0000 0000 0000 0000"
                                                className="font-mono"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                                maxLength={16}
                                            />
                                            <p className="text-xs text-muted-foreground">Mock Gateway: Enter any 16 digits.</p>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" onClick={handleBuyDiamonds} disabled={cardNumber.length !== 16}>
                                            Confirm Purchase
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Other Deals (Placeholder for Items) */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* We can add resource packs / speedups here later */}
            </div>
        </div>
    )
}
