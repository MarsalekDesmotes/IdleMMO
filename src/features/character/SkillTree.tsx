import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Check, Star } from "lucide-react"
import { SKILLS } from "@/data/skills"

export function SkillTree() {
    const { character, unlockSkill } = useGameStore()

    if (!character) return null

    const skills = SKILLS[character.class] || []
    const unlockedSkills = character.unlockedSkills || []
    const skillPoints = character.skillPoints || 0

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Class Mastery: {character.class}</span>
                        <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            {skillPoints} Points Available
                        </span>
                    </CardTitle>
                    <CardDescription>Unlock new abilities and passives.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative flex flex-col items-center gap-8 py-8">
                        {/* Vertical Line Connector (Simplified) */}
                        <div className="absolute top-10 bottom-10 w-1 bg-border -z-10" />

                        {skills.map((skill) => {
                            const isUnlocked = unlockedSkills.includes(skill.id)
                            const isLocked = !isUnlocked && (skill.requiredSkill ? !unlockedSkills.includes(skill.requiredSkill) : false)
                            const canUnlock = !isUnlocked && !isLocked && character.level >= skill.requiredLevel && skillPoints >= skill.cost

                            return (
                                <div key={skill.id} className="relative bg-background p-2 rounded-full border-4 border-background">
                                    <Button
                                        variant={isUnlocked ? "default" : "outline"}
                                        className={`h-24 w-64 flex flex-col items-center justify-center gap-1 relative ${isLocked ? 'opacity-50' : ''}`}
                                        disabled={!canUnlock && !isUnlocked}
                                        onClick={() => canUnlock && unlockSkill(skill.id)}
                                    >
                                        <span className="font-bold">{skill.name}</span>
                                        <span className="text-[10px] text-muted-foreground text-center whitespace-normal px-2">{skill.description}</span>
                                        <span className="text-xs font-mono mt-1 text-primary">
                                            {skill.type === 'passive' ? 'Passive' : 'Active'}
                                        </span>

                                        {isUnlocked && <div className="absolute top-2 right-2"><Check className="h-4 w-4 text-green-400" /></div>}
                                        {isLocked && <div className="absolute top-2 right-2"><Lock className="h-4 w-4 text-muted-foreground" /></div>}
                                        {!isUnlocked && !isLocked && <div className="absolute bottom-2 text-[10px] text-yellow-500">{skill.cost} SP</div>}
                                    </Button>
                                    {/* Level Requirement Badge */}
                                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                                        Lvl {skill.requiredLevel}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
