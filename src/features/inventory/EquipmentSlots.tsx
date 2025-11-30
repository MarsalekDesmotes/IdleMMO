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
            <div className="flex flex-col items-center gap-1.5">
                <div className="relative w-16 h-16 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/10">
                    {item ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            {item.subtype === 'weapon' ? <Sword className="h-8 w-8 text-primary" /> :
                                item.subtype === 'head' ? <HardHat className="h-8 w-8 text-primary" /> :
                                    item.subtype === 'body' ? <Shirt className="h-8 w-8 text-primary" /> :
                                        item.subtype === 'hands' ? <Shield className="h-8 w-8 text-primary" /> :
                                            <Icon className="h-8 w-8 text-primary" />}
                        </div>
                    ) : (
                        <Icon className="h-8 w-8 text-muted-foreground/30" />
                    )}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                {item && (
                    <Button variant="ghost" size="sm" className="h-5 text-[9px] px-2" onClick={() => unequipItem(slot)}>
                        Remove
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
