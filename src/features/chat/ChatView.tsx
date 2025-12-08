import { useState, useEffect, useRef } from "react"
import { useChatStore, type ChatChannel } from "@/store/chatStore"
import { useGameStore } from "@/store/gameStore"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Globe, Shield, Minimize2, Maximize2 } from "lucide-react"
import { SoundManager } from "@/lib/audio/SoundManager"
import { cn } from "@/lib/utils"

export function ChatView() {
    const { character } = useGameStore()
    const {
        messages,
        activeChannel,
        onlineUsers,
        sendMessage,
        setActiveChannel,
        initialize
    } = useChatStore()

    const [inputValue, setInputValue] = useState("")
    const [isCollapsed, setIsCollapsed] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const lastMessageCountRef = useRef(messages.length)
    const isFirstRender = useRef(true)

    // Auto-scroll and Sound on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
        }

        // Play sound for new messages (skip on init and self-messages if desired, but self-feedback is good too)
        // We only play if count increased to avoid noise on re-renders
        if (!isFirstRender.current && messages.length > lastMessageCountRef.current) {
            const lastMsg = messages[messages.length - 1]
            // Play distinct sound for others vs self
            if (lastMsg.userId !== character?.id) {
                // Gentle pop for received
                SoundManager.getInstance().playClick(1.5)
            }
        }

        lastMessageCountRef.current = messages.length
        isFirstRender.current = false
    }, [messages, character?.id])

    // Initialize chat on mount
    useEffect(() => {
        initialize()
    }, [])

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim() || !character) return

        SoundManager.getInstance().playClick(1.0) // Click feedback
        await sendMessage(
            { id: character.id, name: character.name },
            inputValue.trim()
        )
        setInputValue("")
    }

    const toggleCollapse = () => {
        SoundManager.getInstance().playClick()
        setIsCollapsed(!isCollapsed)
    }

    const displayMessages = messages.filter(m =>
        m.channel === activeChannel || (m.channel === 'system' && activeChannel === 'global')
    )

    return (
        <Card className={cn(
            "flex flex-col border-2 border-[#5c4033] shadow-xl bg-[#f5e6c8]/95 backdrop-blur transition-all duration-300 ease-in-out",
            isCollapsed ? "h-14 w-64 absolute bottom-4 right-4 z-50" : "h-[500px] w-full md:w-[350px] relative" // Adjust width/position handling
        )}>
            <CardHeader className="py-2 px-3 border-b border-[#5c4033]/20 bg-[#e8dcb9] rounded-t-lg flex flex-row items-center justify-between space-y-0 cursor-pointer" onClick={toggleCollapse}>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#5c4033] rounded-md">
                        <MessageSquare className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <CardTitle className="text-sm font-medieval text-[#3e2723]">
                        Global Chat
                    </CardTitle>
                </div>

                <div className="flex items-center gap-2">
                    {/* Online Count Indicator */}
                    {!isCollapsed && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#5c4033]/10 rounded-full text-[10px] font-bold text-[#5c4033] border border-[#5c4033]/20" title="Active Players">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span>{onlineUsers}</span>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-[#5c4033] hover:bg-[#5c4033]/10">
                        {isCollapsed ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </Button>
                </div>
            </CardHeader>

            {!isCollapsed && (
                <>
                    <div className="px-2 pt-2 bg-[#f5e6c8]">
                        <Tabs value={activeChannel} onValueChange={(v) => setActiveChannel(v as ChatChannel)} className="w-full">
                            <TabsList className="w-full grid grid-cols-2 h-8 bg-[#5c4033]/10 border border-[#5c4033]/20">
                                <TabsTrigger value="global" className="text-xs data-[state=active]:bg-[#e8dcb9] data-[state=active]:text-[#3e2723] font-bold">
                                    <Globe className="h-3 w-3 mr-1" /> Global
                                </TabsTrigger>
                                <TabsTrigger value="guild" className="text-xs data-[state=active]:bg-[#e8dcb9] data-[state=active]:text-[#3e2723] font-bold">
                                    <Shield className="h-3 w-3 mr-1" /> Guild
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <CardContent className="flex-1 p-0 overflow-hidden relative bg-[#f5e6c8]">
                        <div className="absolute inset-0 p-3 overflow-y-auto space-y-3 custom-scrollbar" ref={scrollRef}>
                            {displayMessages.length === 0 ? (
                                <div className="text-center text-[#5c4033]/50 text-xs py-8 italic font-medieval">
                                    The scroll is empty... Speak up, traveler!
                                </div>
                            ) : (
                                displayMessages.map((msg) => (
                                    <div key={msg.id} className={`flex flex-col ${msg.userId === character?.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                        <div className="flex items-baseline gap-1.5 mb-0.5 px-1">
                                            {msg.isSystem ? (
                                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">System</span>
                                            ) : (
                                                <span className={`text-[10px] font-bold ${msg.userId === character?.id ? 'text-[#3e2723]' : 'text-[#8B4513]'}`}>
                                                    {msg.username}
                                                </span>
                                            )}
                                            <span className="text-[9px] text-[#5c4033]/60 font-mono">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div
                                            className={cn(
                                                "px-3 py-1.5 text-xs shadow-sm border bg-opacity-90 max-w-[90%] break-words relative",
                                                msg.isSystem
                                                    ? "bg-blue-50/80 text-blue-900 border-blue-200 w-full text-center italic rounded-sm"
                                                    : msg.userId === character?.id
                                                        ? "bg-[#d4af37] text-white border-[#b8962e] rounded-l-lg rounded-br-lg rounded-tr-sm"
                                                        : "bg-[#e8dcb9] text-[#2c241b] border-[#d6cba8] rounded-r-lg rounded-bl-lg rounded-tl-sm"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-2 border-t border-[#5c4033]/20 bg-[#e8dcb9]">
                        <form onSubmit={handleSend} className="flex gap-2 w-full">
                            <Input
                                placeholder={activeChannel === 'guild' ? "Whisper to guild..." : "Shout to the world..."}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="h-8 bg-[#f5e6c8] border-[#5c4033]/30 focus-visible:ring-[#5c4033] text-xs placeholder:text-[#5c4033]/50"
                                maxLength={200}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-8 w-8 bg-[#5c4033] hover:bg-[#3e2723] text-[#d4af37]"
                                disabled={!inputValue.trim()}
                            >
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                        </form>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}
