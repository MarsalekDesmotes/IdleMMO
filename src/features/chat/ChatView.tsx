import { useEffect, useState, useRef } from "react"
import { useChatStore } from "@/store/chatStore"
import { isSupabaseAvailable } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertCircle } from "lucide-react"

export function ChatView() {
    const { messages, subscribe, unsubscribe, sendMessage } = useChatStore()
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const isOnline = isSupabaseAvailable()

    useEffect(() => {
        if (isOnline) {
            subscribe()
            return () => unsubscribe()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline])

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
                {!isOnline && (
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Chat is not available. Supabase is not configured. You can still play in Guest mode!
                        </AlertDescription>
                    </Alert>
                )}
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
                        placeholder={isOnline ? "Type a message..." : "Chat unavailable"}
                        className="flex-1"
                        disabled={!isOnline}
                    />
                    <Button type="submit" size="icon" disabled={!isOnline}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
