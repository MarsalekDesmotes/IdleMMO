import { Sidebar } from "./Sidebar"
import { BackgroundShader } from "@/components/visuals/BackgroundShader"

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
            {rightPanel && (
                <aside className="w-80 border-l bg-card/30 p-4 hidden xl:block z-10">
                    {rightPanel}
                </aside>
            )}
        </div>
    )
}
