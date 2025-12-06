import { useState, useEffect } from "react"
import { useGuildStore } from "@/store/guildStore"
import { useGameStore } from "@/store/gameStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Trophy, Coins, Star, Crown } from "lucide-react"
export function GuildView() {
    const { character } = useGameStore()
    const {
        currentGuild,
        members,
        availableGuilds,
        isLoading,
        fetchCurrentGuild,
        createGuild,
        joinGuild,
        leaveGuild,
        fetchAvailableGuilds
    } = useGuildStore()

    const [createName, setCreateName] = useState("")
    const [createDesc, setCreateDesc] = useState("")

    useEffect(() => {
        if (character) {
            fetchCurrentGuild(character.id)
            fetchAvailableGuilds()
        }
    }, [character?.id])

    const handleCreate = async () => {
        if (!character) return
        if (character.gold < 1000) {
            alert("Not enough gold! Need 1000g.")
            return
        }
        await createGuild(createName, createDesc, character.id)
        if (useGameStore.getState().character) {
            useGameStore.setState(state =>
                state.character ? { character: { ...state.character, gold: state.character.gold - 1000 } } : {}
            )
        }
    }

    if (isLoading) return <div>Loading Guild Data...</div>

    if (!currentGuild) {
        return (
            <div className="space-y-6">
                <Card className="border-amber-500/20 bg-amber-950/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-amber-500" />
                            Guild System
                        </CardTitle>
                        <CardDescription>Join a guild to unlock powerful buffs and rewards.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex flex-col items-center p-4 border rounded-lg bg-card text-center">
                                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                                <div className="font-bold">+XP Gain</div>
                                <div className="text-xs text-muted-foreground">Unlocks at Level 1</div>
                            </div>
                            <div className="flex flex-col items-center p-4 border rounded-lg bg-card text-center">
                                <Coins className="h-8 w-8 text-yellow-500 mb-2" />
                                <div className="font-bold">+Gold Gain</div>
                                <div className="text-xs text-muted-foreground">Unlocks at Level 5</div>
                            </div>
                            <div className="flex flex-col items-center p-4 border rounded-lg bg-card text-center">
                                <Star className="h-8 w-8 text-purple-500 mb-2" />
                                <div className="font-bold">+Drop Rate</div>
                                <div className="text-xs text-muted-foreground">Unlocks at Level 10</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="browse" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="browse">Browse Guilds</TabsTrigger>
                        <TabsTrigger value="create">Create Guild</TabsTrigger>
                    </TabsList>

                    <TabsContent value="browse">
                        <div className="grid gap-4">
                            {availableGuilds.map((guild) => (
                                <Card key={guild.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg">{guild.name}</CardTitle>
                                            <span className="text-xs font-bold bg-muted px-2 py-1 rounded">Lv {guild.level}</span>
                                        </div>
                                        <CardDescription>{guild.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter>
                                        <Button size="sm" onClick={() => joinGuild(guild.id, character!.id)}>Join Guild</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {availableGuilds.length === 0 && <div className="text-center p-8 text-muted-foreground">No open guilds found.</div>}
                        </div>
                    </TabsContent>

                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle>Found a New Guild</CardTitle>
                                <CardDescription>Cost: 1000 Gold</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label>Guild Name</label>
                                    <Input placeholder="Enter guild name..." value={createName} onChange={e => setCreateName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label>Description</label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="What is your guild about?"
                                        value={createDesc}
                                        onChange={e => setCreateDesc(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleCreate} disabled={!createName || character!.gold < 1000}>
                                    Create Guild (1000g)
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    }

    // View when in a Guild
    return (
        <div className="space-y-6">
            <Card className="border-primary/20">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                                <Shield className="h-6 w-6 text-primary" />
                                {currentGuild.name}
                            </CardTitle>
                            <CardDescription>{currentGuild.description}</CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground">Level</div>
                            <div className="text-2xl font-bold">{currentGuild.level}</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="border p-2 rounded flex flex-col items-center">
                            <span className="text-muted-foreground">XP Bonus</span>
                            <span className={currentGuild.level >= 1 ? "text-green-500 font-bold" : "text-gray-500"}>+5%</span>
                        </div>
                        <div className="border p-2 rounded flex flex-col items-center">
                            <span className="text-muted-foreground">Gold Bonus</span>
                            <span className={currentGuild.level >= 5 ? "text-green-500 font-bold" : "text-gray-500"}>+5%</span>
                        </div>
                        <div className="border p-2 rounded flex flex-col items-center">
                            <span className="text-muted-foreground">Drop Rate</span>
                            <span className={currentGuild.level >= 10 ? "text-green-500 font-bold" : "text-gray-500"}>+10%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="members">
                <TabsList className="w-full">
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="members">
                    <Card>
                        <CardHeader>
                            <CardTitle>Member List</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {members.map(member => (
                                <div key={member.id} className="flex justify-between items-center p-2 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        {member.role === 'owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                                        <span>{member.username}</span>
                                    </div>
                                    <span className="text-xs capitalize bg-muted px-2 py-1 rounded">{member.role}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="settings">
                    <Card>
                        <CardContent className="pt-6">
                            <Button variant="destructive" className="w-full" onClick={() => leaveGuild(currentGuild.id, character!.id)}>
                                Leave Guild
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
