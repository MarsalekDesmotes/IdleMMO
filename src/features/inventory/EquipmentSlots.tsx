import { useGameStore, type Equipment } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Sword, Shirt, HardHat } from "lucide-react"

export function EquipmentSlots() {
    const { character, unequipItem } = useGameStore()

    if (!character) return null

    const Slot = ({ slot, icon: Icon, label }: { slot: keyof Equipment, icon: any, label: string }) => {
        const item = character.equipment[slot]

        return (
            <div className="flex flex-col items-center gap-2">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10">
                    {item ? (
                        <div className="absolute inset-0 p-1 flex flex-col items-center justify-center">
                            {item.subtype === 'weapon' ? <Sword className="h-8 w-8 text-primary" /> :
                                item.subtype === 'head' ? <HardHat className="h-8 w-8 text-primary" /> :
                                    item.subtype === 'body' ? <Shirt className="h-8 w-8 text-primary" /> :
                                        <Icon className="h-8 w-8 text-primary" />}
                            <div className="mt-1 flex h-full w-full items-center justify-center rounded bg-accent/50 text-[10px] font-bold text-center p-1 truncate">
                                {item.name}
                            </div>
                        </div>
                    ) : (
                        <Icon className="h-8 w-8 text-muted-foreground/50" />
                    )}
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                {item && (
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" onClick={() => unequipItem(slot)}>
                        Unequip
                    </Button>
                )}
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Equipped Gear</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around py-4">
                <Slot slot="head" icon={HardHat} label="Head" />
                <Slot slot="body" icon={Shirt} label="Body" />
                <Slot slot="weapon" icon={Sword} label="Weapon" />
                <Slot slot="hands" icon={Shield} label="Hands" />
            </CardContent>
        </Card>
    )
}
