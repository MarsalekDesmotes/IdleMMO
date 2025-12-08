import { useGameStore, type Item } from "@/store/gameStore"
import { ITEMS } from "@/data/items"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Sword, Hammer, Leaf, Circle } from "lucide-react"

export function CollectionLogView() {
    const { character } = useGameStore()

    if (!character) return null

    // Ensure unlockedItems exists (backwards compatibility)
    const unlockedIds = character.unlockedItems || []

    // Categorize Items
    const categorizedItems = {
        equipment: Object.values(ITEMS).filter(i => i.type === 'equipment'),
        resource: Object.values(ITEMS).filter(i => i.type === 'resource' || i.type === 'material'),
        consumable: Object.values(ITEMS).filter(i => i.type === 'consumable'),
        currency: Object.values(ITEMS).filter(i => i.type === 'currency'),
    }

    const allItems = Object.values(ITEMS)
    const totalItems = allItems.length
    const unlockedCount = allItems.filter(i => unlockedIds.includes(i.id)).length
    const startProgress = (unlockedCount / totalItems) * 100

    const renderItemGrid = (items: Item[]) => (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 p-4">
            {items.map(item => {
                const isUnlocked = unlockedIds.includes(item.id)
                return (
                    <div
                        key={item.id}
                        className={`
                            relative aspect-square flex flex-col items-center justify-center 
                            rounded-lg border-2 p-2 transition-all
                            ${isUnlocked
                                ? 'bg-card border-primary/20 hover:border-primary cursor-help'
                                : 'bg-muted/50 border-muted opacity-50 grayscale'
                            }
                        `}
                        title={isUnlocked ? `${item.name}\n${item.description}` : "Unknown Item"}
                    >
                        <div className="text-2xl mb-1">
                            {isUnlocked ? (item.icon || '📦') : '❓'}
                        </div>
                        {isUnlocked && (
                            <div className="text-[10px] text-center font-bold leading-tight line-clamp-2">
                                {item.name}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )

    return (
        <div className="space-y-6">
            <Card className="border-amber-900/40 bg-amber-950/10">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Book className="h-8 w-8 text-amber-500" />
                            <div>
                                <CardTitle>Item Compendium</CardTitle>
                                <CardDescription>Collection Log of all discovered items.</CardDescription>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold font-medieval">{unlockedCount} / {totalItems}</div>
                            <div className="text-xs text-muted-foreground">Items Found</div>
                        </div>
                    </div>
                    <Progress value={startProgress} className="h-2 w-full mt-4" />
                </CardHeader>
            </Card>

            <Tabs defaultValue="equipment" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="equipment" className="flex items-center gap-2">
                        <Sword className="h-4 w-4" />
                        <span className="hidden sm:inline">Equipment</span>
                    </TabsTrigger>
                    <TabsTrigger value="resource" className="flex items-center gap-2">
                        <Hammer className="h-4 w-4" />
                        <span className="hidden sm:inline">Resources</span>
                    </TabsTrigger>
                    <TabsTrigger value="consumable" className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        <span className="hidden sm:inline">Consumables</span>
                    </TabsTrigger>
                    <TabsTrigger value="currency" className="flex items-center gap-2">
                        <Circle className="h-4 w-4" />
                        <span className="hidden sm:inline">Currency</span>
                    </TabsTrigger>
                </TabsList>

                <Card className="mt-4 min-h-[400px]">
                    <ScrollArea className="h-[500px]">
                        <TabsContent value="equipment" className="m-0">
                            {renderItemGrid(categorizedItems.equipment)}
                        </TabsContent>
                        <TabsContent value="resource" className="m-0">
                            {renderItemGrid(categorizedItems.resource)}
                        </TabsContent>
                        <TabsContent value="consumable" className="m-0">
                            {renderItemGrid(categorizedItems.consumable)}
                        </TabsContent>
                        <TabsContent value="currency" className="m-0">
                            {renderItemGrid(categorizedItems.currency)}
                        </TabsContent>
                    </ScrollArea>
                </Card>
            </Tabs>
        </div>
    )
}
