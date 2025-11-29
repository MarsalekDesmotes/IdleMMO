import { useEffect, useState, useRef } from "react"
import { useChatStore } from "@/store/chatStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

export function ChatView() {
    const { messages, subscribe, unsubscribe, sendMessage } = useChatStore()
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        subscribe()
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        sendMessage(input)
        setInput("")
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader>
                <CardTitle>Global Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm text-primary">{msg.username}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm bg-muted/50 p-2 rounded-md">{msg.content}</p>
                            </div>
                        ))}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <form onSubmit={handleSend} className="mt-4 flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
