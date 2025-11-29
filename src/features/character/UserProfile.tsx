import { useGameStore } from "@/store/gameStore"
import { Progress } from "@/components/ui/progress"
import paladinMale from "@/assets/avatars/paladin_male.jpg"
import paladinFemale from "@/assets/avatars/paladin_female.png"
import archmageMale from "@/assets/avatars/archmage_male.jpg"
import archmageFemale from "@/assets/avatars/archmage_female.jpg"
import rangerMale from "@/assets/avatars/ranger_male.jpg"
import rangerFemale from "@/assets/avatars/ranger_female.jpg"

const AVATARS = {
    Paladin: { male: paladinMale, female: paladinFemale },
    Archmage: { male: archmageMale, female: archmageFemale },
    Ranger: { male: rangerMale, female: rangerFemale }
}

export function UserProfile() {
    const { character } = useGameStore()

    if (!character) return null

    const avatarSrc = AVATARS[character.class][character.gender]

    return (
        <div className="flex flex-col items-center p-4 border-b bg-card/20">
            <div className="relative mb-3">
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary shadow-lg shadow-primary/20">
                    <img
                        src={avatarSrc}
                        alt={character.name}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border border-background">
                    {character.level}
                </div>
            </div>
            <div className="text-center w-full space-y-1">
                <h3 className="font-semibold leading-none">{character.name}</h3>
                <p className="text-xs text-muted-foreground">{character.class}</p>

                <div className="mt-2 w-full space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>XP</span>
                        <span>{character.xp} / {character.max_xp}</span>
                    </div>
                    <Progress value={(character.xp / character.max_xp) * 100} className="h-1.5" />
                </div>
            </div>
        </div>
    )
}
