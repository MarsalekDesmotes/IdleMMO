
import { create } from 'zustand'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface FloatingText {
    id: string
    x: number
    y: number
    text: string
    color?: string
}

interface FloatingTextState {
    texts: FloatingText[]
    addText: (text: string, x: number, y: number, color?: string) => void
    removeText: (id: string) => void
}

export const useFloatingTextStore = create<FloatingTextState>((set) => ({
    texts: [],
    addText: (text, x, y, color) => {
        const id = Math.random().toString(36).substr(2, 9)
        set((state) => ({ texts: [...state.texts, { id, text, x, y, color }] }))

        // Auto remove after 1.5s
        setTimeout(() => {
            set((state) => ({ texts: state.texts.filter((t) => t.id !== id) }))
        }, 1500)
    },
    removeText: (id) => set((state) => ({ texts: state.texts.filter((t) => t.id !== id) })),
}))

export function FloatingTextManager() {
    const { texts } = useFloatingTextStore()

    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            <AnimatePresence>
                {texts.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: item.y, x: item.x, scale: 0.5 }}
                        animate={{ opacity: 1, y: item.y - 100, scale: 1 }}
                        exit={{ opacity: 0, y: item.y - 150 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="absolute text-xl font-bold font-medieval drop-shadow-md"
                        style={{ color: item.color || '#ffffff', left: 0, top: 0 }} // Positioning handled by motion initial/animate
                    >
                        {item.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
