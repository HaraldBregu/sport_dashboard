import React from 'react'
import {
    ContextBubble,
    ContextBubbleProvider,
    ContextBubbleButton,
    ContextBubbleGroup,
    ContextBubbleSubmenu,
    ContextBubbleSubmenuTrigger,
    ContextBubbleSubmenuContent,
    ContextBubbleSubmenuItem
} from './context-bubble'

export function ContextBubblePrototype() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [position] = React.useState({ x: 100, y: 100 })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Context Bubble Prototype</h1>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {isOpen ? 'Hide' : 'Show'} Context Bubble
            </button>

            <div className="mt-4 text-sm text-gray-600">
                {isOpen ? 'Context bubble is open. Hover over "Button with submenu" to see the submenu.' : 'Click the button above to open the context bubble.'}
            </div>

            <ContextBubbleProvider
                isOpen={isOpen}
                position={position}
                onClose={() => setIsOpen(false)}
            >
                <ContextBubble>
                    <ContextBubbleGroup>
                        <ContextBubbleButton
                            tooltip="Button one"
                        >
                            Button one
                        </ContextBubbleButton>
                        <ContextBubbleButton
                            tooltip="Button two"
                        >
                            Button two
                        </ContextBubbleButton>
                    </ContextBubbleGroup>
                    <ContextBubbleButton>Click me</ContextBubbleButton>
                    <ContextBubbleSubmenu>
                        <ContextBubbleSubmenuTrigger submenu="example">Button with submenu</ContextBubbleSubmenuTrigger>
                        {/* This should be a floating div but it should be positioned relative to the trigger */}
                        <ContextBubbleSubmenuContent submenu="example">
                            <ContextBubbleSubmenuItem>Item one</ContextBubbleSubmenuItem>
                            <ContextBubbleSubmenuItem>Item two</ContextBubbleSubmenuItem>
                        </ContextBubbleSubmenuContent>
                    </ContextBubbleSubmenu>
                </ContextBubble>
            </ContextBubbleProvider>
        </div>
    )
}
