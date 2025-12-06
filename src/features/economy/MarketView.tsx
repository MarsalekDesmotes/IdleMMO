import { useEffect, useState } from "react"
import { useMarketStore } from "@/store/marketStore"
import { useGameStore, type Item } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Coins, ShoppingBag, Tag } from "lucide-react"

export function MarketView() {
    const { listings, fetchListings, buyItem, isLoading, createListing } = useMarketStore()
    const { character } = useGameStore()
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)

    useEffect(() => {
        fetchListings()
    }, [])

    if (!character) return null

    if (character.level < 5) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-20" />
                <h2 className="text-xl font-bold">Market Locked</h2>
                <p className="text-muted-foreground">Reach Level 5 to access the global marketplace.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
                    <p className="text-muted-foreground">Buy and sell items with other players.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-yellow-900/20 px-4 py-2 rounded-full border border-yellow-500/30">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-500">{character.gold} Gold</span>
                    </div>
                    <Button onClick={() => setIsSellModalOpen(true)}>
                        <Tag className="mr-2 h-4 w-4" /> Sell Item
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="browse" className="w-full">
                <TabsList>
                    <TabsTrigger value="browse">Browse Listings</TabsTrigger>
                    <TabsTrigger value="my-listings">My Listings</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="mt-4">
                    {isLoading ? (
                        <div className="text-center py-10">Loading market data...</div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {listings.filter(l => l.seller_name !== character.name).map((listing) => (
                                <Card key={listing.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base">{listing.item_data.name}</CardTitle>
                                            <span className="text-xs text-muted-foreground">{new Date(listing.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <CardDescription>Sold by {listing.seller_name}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg text-4xl mb-4">
                                            {listing.item_data.icon || '📦'}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Price</span>
                                            <span className="font-bold text-yellow-500 flex items-center gap-1">
                                                {listing.price} <Coins className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" onClick={() => buyItem(listing)} disabled={character.gold < listing.price}>
                                            Buy Now
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {listings.filter(l => l.seller_name !== character.name).length === 0 && (
                                <div className="col-span-full text-center py-10 text-muted-foreground">
                                    No items found. Be the first to list something!
                                </div>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="my-listings">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {listings.filter(l => l.seller_name === character.name).map((listing) => (
                            <Card key={listing.id} className="border-primary/20">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{listing.item_data.name}</CardTitle>
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">You</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <div className="flex items-center justify-center p-6 bg-muted/20 rounded-lg text-4xl mb-4">
                                        {listing.item_data.icon || '📦'}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Listed Price</span>
                                        <span className="font-bold text-yellow-500 flex items-center gap-1">
                                            {listing.price} <Coins className="h-3 w-3" />
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" disabled>
                                        Cancel (Coming Soon)
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                        {listings.filter(l => l.seller_name === character.name).length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                You haven't listed any items yet.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <SellItemModal open={isSellModalOpen} onOpenChange={setIsSellModalOpen} createListing={createListing} inventory={character.inventory} />
        </div>
    )
}

function SellItemModal({ open, onOpenChange, createListing, inventory }: { open: boolean, onOpenChange: (open: boolean) => void, createListing: any, inventory: any[] }) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null)
    const [price, setPrice] = useState("10")

    const handleSell = async () => {
        if (!selectedItem) return
        await createListing(selectedItem, parseInt(price))
        setSelectedItem(null)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sell Item</DialogTitle>
                    <DialogDescription>
                        Select an item from your inventory to list on the market.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Select Item</Label>
                        <ScrollArea className="h-[200px] border rounded-md p-2">
                            <div className="grid grid-cols-4 gap-2">
                                {inventory.map((slot, i) => (
                                    <button
                                        key={i}
                                        className={`flex flex-col items-center justify-center p-2 rounded border transition-colors ${selectedItem?.id === slot.item.id ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'}`}
                                        onClick={() => setSelectedItem(slot.item)}
                                    >
                                        <div className="text-2xl">{slot.item.icon || '📦'}</div>
                                        <span className="text-[10px] truncate w-full text-center mt-1">{slot.item.name}</span>
                                        <span className="text-[10px] text-muted-foreground">x{slot.count}</span>
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    {selectedItem && (
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (Gold)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="col-span-3"
                                />
                                <Coins className="h-4 w-4 text-yellow-500" />
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSell} disabled={!selectedItem || parseInt(price) <= 0}>List Item</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
