import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pickaxe, Leaf, Cpu, Coins, GraduationCap, Egg, PawPrint } from "lucide-react"
import { PETS } from "@/data/pets"

const ICONS: Record<string, any> = {
    Pickaxe, Leaf, Cpu, Coins, GraduationCap
}

export function PetView() {
    const { character, hatchPet, equipPet } = useGameStore()

    if (!character) return null

    const ownedPets = character.pets || []
    const equippedPet = character.equippedPet

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'legendary': return 'text-orange-500 border-orange-500/50 bg-orange-950/20'
            case 'epic': return 'text-purple-500 border-purple-500/50 bg-purple-950/20'
            case 'rare': return 'text-blue-500 border-blue-500/50 bg-blue-950/20'
            default: return 'text-stone-500 border-stone-500/50 bg-stone-950/20'
        }
    }

    return (
        <div className="h-full flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <PawPrint className="h-8 w-8 text-primary" />
                        Companions
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Hatch eggs to find companions that boost your productivity.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Gold</div>
                        <div className="text-xl font-bold text-amber-400">{character.gold}</div>
                    </div>
                    <Button
                        size="lg"
                        onClick={() => hatchPet()}
                        disabled={character.gold < 1000}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-none shadow-lg"
                    >
                        <Egg className="mr-2 h-5 w-5" />
                        Hatch Egg (1000g)
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                    {PETS.map(pet => {
                        const isOwned = ownedPets.includes(pet.id)
                        const isEquipped = equippedPet === pet.id
                        const Icon = ICONS[pet.icon] || PawPrint
                        const rarityStyle = getRarityColor(pet.rarity)

                        return (
                            <Card key={pet.id} className={`transition-all duration-200 ${isOwned ? 'opacity-100' : 'opacity-60 grayscale'} ${isEquipped ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <div className={`p-2 rounded-lg border ${rarityStyle}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        {pet.name}
                                    </CardTitle>
                                    <Badge variant="outline" className={`capitalize ${rarityStyle}`}>
                                        {pet.rarity}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                                        {pet.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs font-semibold px-2 py-1 rounded bg-secondary/50">
                                            {pet.bonus.type === 'resource' && `+${Math.floor(pet.bonus.multiplier * 100)}% ${pet.bonus.resourceId} Gain`}
                                            {pet.bonus.type === 'xp' && `+${Math.floor(pet.bonus.multiplier * 100)}% XP Gain`}
                                            {pet.bonus.type === 'gold' && `+${Math.floor(pet.bonus.multiplier * 100)}% Gold Gain`}
                                        </div>

                                        {isOwned ? (
                                            <Button
                                                variant={isEquipped ? "secondary" : "default"}
                                                size="sm"
                                                onClick={() => !isEquipped && equipPet(pet.id)}
                                                disabled={isEquipped}
                                            >
                                                {isEquipped ? "Equipped" : "Equip"}
                                            </Button>
                                        ) : (
                                            <div className="text-xs text-muted-foreground italic">
                                                Not Owned
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
