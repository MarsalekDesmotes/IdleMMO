import { useState } from "react"
import { useGameStore, type CharacterClass, type Gender } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sword, Scroll, Crosshair } from "lucide-react"
import { cn } from "@/lib/utils"
import avatarMale from "@/assets/avatar_male.jpg"
import avatarFemale from "@/assets/avatar_female.jpg"

export function AvatarSelection() {
    const [name, setName] = useState("")
    const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null)
    const [gender, setGender] = useState<Gender>('male')
    const { createCharacter } = useGameStore()

    const handleCreate = () => {
        if (name && selectedClass) {
            createCharacter(name, selectedClass, gender)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold tracking-tight text-primary">
                        Create Your Hero
                    </CardTitle>
                    <CardDescription>
                        Choose your destiny in the Realm.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Left Column: Avatar Preview */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative aspect-square w-64 overflow-hidden rounded-xl border-2 border-primary/50 shadow-2xl shadow-primary/20">
                                <img
                                    src={gender === 'male' ? avatarMale : avatarFemale}
                                    alt="Character Avatar"
                                    className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-lg font-bold text-white">{name || "Unknown Hero"}</p>
                                    <p className="text-sm text-gray-300">{selectedClass || "Classless"}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant={gender === 'male' ? "default" : "outline"}
                                    onClick={() => setGender('male')}
                                    className="w-32"
                                >
                                    Male
                                </Button>
                                <Button
                                    variant={gender === 'female' ? "default" : "outline"}
                                    onClick={() => setGender('female')}
                                    className="w-32"
                                >
                                    Female
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Hero Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-background/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Select Class</Label>
                                <div className="grid gap-4">
                                    <div
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent",
                                            selectedClass === "Paladin" && "border-primary bg-accent ring-1 ring-primary"
                                        )}
                                        onClick={() => setSelectedClass("Paladin")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                                <Sword className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Paladin</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Holy warrior with high strength and defense.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent",
                                            selectedClass === "Archmage" && "border-primary bg-accent ring-1 ring-primary"
                                        )}
                                        onClick={() => setSelectedClass("Archmage")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                                <Scroll className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Archmage</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Master of arcane arts with high intelligence.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent",
                                            selectedClass === "Ranger" && "border-primary bg-accent ring-1 ring-primary"
                                        )}
                                        onClick={() => setSelectedClass("Ranger")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                                                <Crosshair className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Ranger</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Agile sharpshooter and survivalist.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                disabled={!name || !selectedClass}
                                onClick={handleCreate}
                            >
                                Begin Adventure
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
