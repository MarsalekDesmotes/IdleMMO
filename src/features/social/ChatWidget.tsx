import { useRef, useEffect, useState } from 'react'
import { useChatStore } from '@/store/chatStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, X, Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatWidget() {
    const {
        messages,
        isOpen,
        toggleChat,
        fetchMessages,
        sendMessage,
        subscribeToMessages
    } = useChatStore()

    const [inputValue, setInputValue] = useState('')
    const [isMinimized, setIsMinimized] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [cooldown, setCooldown] = useState(0)

    useEffect(() => {
        fetchMessages()
        subscribeToMessages()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen, isMinimized])

    useEffect(() => {
        let interval: any
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown(c => Math.max(0, c - 1))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [cooldown])

    const handleSend = async () => {
        if (!inputValue.trim() || cooldown > 0) return

        const content = inputValue
        setInputValue('')
        setCooldown(3) // 3 seconds visual cooldown

        await sendMessage(content)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
                onClick={toggleChat}
            >
                <MessageSquare className="h-6 w-6" />
            </Button>
        )
    }

    return (
        <Card className={cn(
            "fixed bottom-4 right-4 z-50 shadow-xl transition-all duration-300 flex flex-col border-primary/20",
            isMinimized ? "w-72 h-14" : "w-80 h-96 md:w-96 md:h-[500px]"
        )}>
            <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Global Chat
                </CardTitle>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
                        {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleChat}>
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <>
                    <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-xs text-muted-foreground py-4">
                                        No messages yet. Say hello!
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div key={msg.id} className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-primary text-xs">{msg.username}</span>
                                                <span className="text-[10px] text-muted-foreground/50">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground break-words leading-snug">
                                                {msg.content}
                                            </p>
                                        </div>
                                    ))
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-3 border-t bg-muted/20">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Type a message..."}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={cooldown > 0}
                                    className="h-8 text-xs"
                                    maxLength={200}
                                />
                                <Button
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || cooldown > 0}
                                >
                                    <Send className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </>
            )}
        </Card>
    )
}
