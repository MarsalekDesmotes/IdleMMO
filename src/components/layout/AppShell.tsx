import { Sidebar } from "./Sidebar"
import { BackgroundShader } from "@/components/visuals/BackgroundShader"
import { GameLog } from "@/features/game/GameLog"
import { ChatWidget } from "@/features/social/ChatWidget"

interface AppShellProps {
    children: React.ReactNode
    rightPanel?: React.ReactNode
}

export function AppShell({ children, rightPanel }: AppShellProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans antialiased relative">
            <BackgroundShader />
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-8 z-10">
                {children}
            </main>
            {/* Right Panel (Optional) */}
            <aside className="w-80 border-l bg-card/30 hidden xl:flex flex-col z-10">
                <div className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
                    <GameLog />
                    {rightPanel}
                </div>
            </aside>

            {/* Global Overlays */}
            <ChatWidget />
        </div>
    )
}
