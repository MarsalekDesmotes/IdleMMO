import { useMemo } from "react"
import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Check, Star, Sparkles, Hammer } from "lucide-react"
import { SKILLS, type SkillDefinition } from "@/data/skills"
import { SkillView } from "./SkillView"

export function SkillTree() {
    const { character, unlockSkill } = useGameStore()

    if (!character) return null

    const skills = SKILLS[character.class] || []
    const unlockedSkills = character.unlockedSkills || []
    const skillPoints = character.skillPoints || 0

    // Build tree structure with branches
    const skillTree = useMemo(() => {
        // Find root skills (no requirement)


        // Get all unique skills in tree order
        const ordered: SkillDefinition[] = []
        const processed = new Set<string>()

        const addSkill = (skill: SkillDefinition) => {
            if (processed.has(skill.id)) return
            if (skill.requiredSkill) {
                const parent = skills.find(s => s.id === skill.requiredSkill)
                if (parent) addSkill(parent)
            }
            if (!processed.has(skill.id)) {
                ordered.push(skill)
                processed.add(skill.id)
            }
        }

        skills.forEach(skill => addSkill(skill))
        return ordered
    }, [skills])

    // Group by tier (requiredLevel)
    const tiers = useMemo(() => {
        const tierMap = new Map<number, SkillDefinition[]>()
        skillTree.forEach(skill => {
            const tier = skill.requiredLevel
            if (!tierMap.has(tier)) tierMap.set(tier, [])
            tierMap.get(tier)!.push(skill)
        })
        return Array.from(tierMap.entries()).sort((a, b) => a[0] - b[0])
    }, [skillTree])

    const renderSkill = (skill: SkillDefinition, hasParent: boolean) => {
        const isUnlocked = unlockedSkills.includes(skill.id)
        const isLocked = !isUnlocked && (skill.requiredSkill ? !unlockedSkills.includes(skill.requiredSkill) : false)
        const canUnlock = !isUnlocked && !isLocked && character.level >= skill.requiredLevel && skillPoints >= skill.cost
        const children = skills.filter(s => s.requiredSkill === skill.id)

        return (
            <div key={skill.id} className="relative flex flex-col items-center">
                {/* Connection line from parent */}
                {hasParent && (
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40" />
                )}

                {/* Skill Node */}
                <div className="relative z-10">
                    <Button
                        variant={isUnlocked ? "default" : "outline"}
                        className={`h-20 w-44 flex flex-col items-center justify-center gap-1 relative transition-all ${isLocked ? 'opacity-40 cursor-not-allowed' :
                            canUnlock ? 'hover:scale-105 border-primary shadow-lg shadow-primary/20' :
                                isUnlocked ? 'ring-2 ring-green-400/50 bg-green-950/20' : ''
                            }`}
                        disabled={!canUnlock && !isUnlocked}
                        onClick={() => canUnlock && unlockSkill(skill.id)}
                    >
                        <span className="font-bold text-xs">{skill.name}</span>
                        <span className="text-[9px] text-muted-foreground text-center line-clamp-2 px-1 leading-tight">
                            {skill.description}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${skill.type === 'passive' ? 'text-blue-400 bg-blue-950/30' : 'text-orange-400 bg-orange-950/30'}`}>
                                {skill.type === 'passive' ? 'P' : 'A'}
                            </span>
                            {!isUnlocked && !isLocked && (
                                <span className="text-[9px] text-yellow-500 font-bold">{skill.cost} SP</span>
                            )}
                        </div>

                        {isUnlocked && (
                            <div className="absolute top-1 right-1">
                                <Check className="h-3 w-3 text-green-400" />
                            </div>
                        )}
                        {isLocked && (
                            <div className="absolute top-1 right-1">
                                <Lock className="h-3 w-3 text-muted-foreground" />
                            </div>
                        )}
                    </Button>

                    {/* Level Badge */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                        Lvl {skill.requiredLevel}
                    </div>
                </div>

                {/* Connection line to children */}
                {children.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-primary/40 via-primary/60 to-primary/40" />
                )}
            </div>
        )
    }

    return (
        <Tabs defaultValue="combat" className="w-full">
            <div className="flex items-center justify-between mb-4">
                <TabsList>
                    <TabsTrigger value="combat" className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Combat Skills
                    </TabsTrigger>
                    <TabsTrigger value="gathering" className="flex items-center gap-2">
                        <Hammer className="h-4 w-4" />
                        Gathering Skills
                    </TabsTrigger>
                </TabsList>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {skillPoints} Points
                </span>
            </div>

            <TabsContent value="combat">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Skill Tree: {character.class}
                            </span>
                        </CardTitle>
                        <CardDescription>Unlock skills in a branching tree structure. Each skill requires the previous one.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto py-8">
                            <div className="flex flex-col items-center gap-20 min-w-max px-8">
                                {/* Skill Tiers (Tree Levels) */}
                                {tiers.map(([tierLevel, tierSkills]) => (
                                    <div key={tierLevel} className="relative flex gap-12 items-start justify-center">
                                        {tierSkills.map((skill) => {
                                            const hasParent = !!skill.requiredSkill
                                            return (
                                                <div key={skill.id} className="relative">
                                                    {renderSkill(skill, hasParent)}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="gathering">
                <SkillView />
            </TabsContent>
        </Tabs>
    )
}
