import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trees, Pickaxe, Book } from "lucide-react"

export function SkillView() {
    const { character } = useGameStore()

    if (!character) return null

    // Ensure skills exist (fallback for old saves if hydration logic hasn't run yet or strictly)
    const skills = character.skills || {
        woodcutting: { level: 1, xp: 0, max_xp: 100 },
        mining: { level: 1, xp: 0, max_xp: 100 },
        research: { level: 1, xp: 0, max_xp: 100 }
    }

    const skillList = [
        { id: 'woodcutting', name: 'Woodcutting', icon: Trees, data: skills.woodcutting, color: 'bg-green-600' },
        { id: 'mining', name: 'Mining', icon: Pickaxe, data: skills.mining, color: 'bg-stone-500' },
        { id: 'research', name: 'Research', icon: Book, data: skills.research, color: 'bg-blue-500' }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Gathering Skills</h2>
                <p className="text-muted-foreground">Master the art of resource collection to boost your efficiency.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {skillList.map((skill) => (
                    <Card key={skill.id}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className={`p-2 rounded-lg ${skill.color} bg-opacity-10`}>
                                <skill.icon className={`h-6 w-6 ${skill.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="flex-1">
                                <CardTitle>{skill.name}</CardTitle>
                                <CardDescription>Level {skill.data.level}</CardDescription>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono text-muted-foreground">{skill.data.xp} / {skill.data.max_xp} XP</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Progress value={(skill.data.xp / skill.data.max_xp) * 100} className="h-3" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col gap-2 mt-8">
                <h3 className="text-lg font-semibold">How to train?</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li><strong>Woodcutting:</strong> Assign workers to "Woodsman" role.</li>
                    <li><strong>Mining:</strong> Assign workers to "Miner" role.</li>
                    <li><strong>Research:</strong> Assign workers to "Researcher" role.</li>
                </ul>
            </div>
        </div>
    )
}
