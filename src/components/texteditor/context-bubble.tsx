import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const CONTEXT_BUBBLE_Z_INDEX = 50

type ContextBubbleContextProps = {
    isOpen: boolean
    position: { x: number; y: number }
    setPosition: (position: { x: number; y: number }) => void
    onClose: () => void
    showSubmenu: string | null
    setShowSubmenu: (submenu: string | null) => void
    selectionRect?: DOMRect | null
    submenuPositions: Record<string, { x: number; y: number; width: number; height: number }>
    setSubmenuPosition: (submenu: string, position: { x: number; y: number; width: number; height: number }) => void
    portalContainerRef: React.RefObject<HTMLDivElement | null>
}

const ContextBubbleContext = React.createContext<ContextBubbleContextProps | null>(null)

function useContextBubble() {
    const context = React.useContext(ContextBubbleContext)
    if (!context) {
        throw new Error('useContextBubble must be used within a ContextBubbleProvider.')
    }
    return context
}

function ContextBubbleProvider({
    isOpen = false,
    position = { x: 0, y: 0 },
    onClose,
    children,
    selectionRect = null,
    ...props
}: React.ComponentProps<'div'> & {
    isOpen?: boolean
    position?: { x: number; y: number }
    onClose: () => void
    selectionRect?: DOMRect | null
}) {
    const [internalPosition, setInternalPosition] = React.useState(position)
    const [showSubmenu, setShowSubmenu] = React.useState<string | null>(null)
    const [submenuPositions, setSubmenuPositions] = React.useState<Record<string, { x: number; y: number; width: number; height: number }>>({})
    const portalContainerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        setInternalPosition(position)
    }, [position])

    const setSubmenuPosition = React.useCallback((submenu: string, position: { x: number; y: number; width: number; height: number }) => {
        setSubmenuPositions(prev => ({ ...prev, [submenu]: position }))
    }, [])

    const contextValue = React.useMemo<ContextBubbleContextProps>(
        () => ({
            isOpen,
            position: internalPosition,
            setPosition: setInternalPosition,
            onClose,
            showSubmenu,
            setShowSubmenu,
            selectionRect,
            submenuPositions,
            setSubmenuPosition,
            portalContainerRef
        }),
        [isOpen, internalPosition, onClose, showSubmenu, selectionRect, submenuPositions, setSubmenuPosition, portalContainerRef]
    )

    if (!isOpen) return null

    return (
        <ContextBubbleContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={100}>
                <div
                    data-slot="context-bubble-wrapper"
                    className="fixed inset-0 z-50 pointer-events-none"
                    {...props}
                >
                    {children}
                    {/* Portal container for submenu content */}
                    <div ref={portalContainerRef} className="pointer-events-none" />
                </div>
            </TooltipProvider>
        </ContextBubbleContext.Provider>
    )
}

const contextBubbleVariants = cva(
    'bg-background border rounded-lg shadow-lg p-1 z-50 pointer-events-auto',
    {
        variants: {
            variant: {
                default: 'bg-background border-border',
                floating: 'bg-background/95 backdrop-blur-sm border-border/50 shadow-xl',
                minimal: 'bg-background/90 border-border/30 shadow-md'
            },
            size: {
                sm: 'p-1 min-w-40 max-w-80',
                default: 'p-1 min-w-48 max-w-96',
                lg: 'p-2 min-w-56 max-w-[500px]'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

const BUBBLE_MARGIN = 10
function clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(val, max))
}

function ContextBubble({
    variant = 'default',
    size = 'default',
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & VariantProps<typeof contextBubbleVariants>) {
    const { position, setPosition, onClose, selectionRect } = useContextBubble()
    const bubbleRef = React.useRef<HTMLDivElement>(null)
    const [positionAttempts, setPositionAttempts] = React.useState(0)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEscape)
        }
    }, [onClose])

    // Robust position clamping with multiple attempts
    React.useLayoutEffect(() => {
        if (bubbleRef.current && selectionRect) {
            const bubbleRect = bubbleRef.current.getBoundingClientRect()

            // Calculate available space from selection to window edges
            const spaceBelow = window.innerHeight - selectionRect.bottom
            const spaceAbove = selectionRect.top

            let adjustedX = position.x
            let adjustedY = position.y

            // Determine optimal vertical position based on available space
            if (spaceBelow >= bubbleRect.height || spaceBelow > spaceAbove) {
                // Position below the selection
                adjustedY = selectionRect.bottom + 10
            } else {
                // Position above the selection
                adjustedY = selectionRect.top - bubbleRect.height - 10
            }

            // Center horizontally on the selection
            adjustedX = selectionRect.left + selectionRect.width / 2 - bubbleRect.width / 2

            // Clamp to viewport
            adjustedX = clamp(
                adjustedX,
                BUBBLE_MARGIN,
                window.innerWidth - bubbleRect.width - BUBBLE_MARGIN
            )
            adjustedY = clamp(
                adjustedY,
                BUBBLE_MARGIN,
                window.innerHeight - bubbleRect.height - BUBBLE_MARGIN
            )

            // Update position if adjustments were made
            if (adjustedX !== position.x || adjustedY !== position.y) {
                console.log('Adjusting bubble position:', {
                    from: position,
                    to: { x: adjustedX, y: adjustedY },
                    bubbleSize: { width: bubbleRect.width, height: bubbleRect.height },
                    selectionRect,
                    spaceBelow,
                    spaceAbove
                })
                setPosition({ x: adjustedX, y: adjustedY })
                setPositionAttempts(prev => prev + 1)
            }
        }
    }, [position, setPosition, positionAttempts, selectionRect])

    return (
        <div
            ref={bubbleRef}
            data-slot="context-bubble"
            data-context-bubble="bubble"
            data-variant={variant}
            data-size={size}
            className={cn(contextBubbleVariants({ variant, size }), className)}
            style={{
                position: 'fixed',
                left: Math.max(BUBBLE_MARGIN, Math.min(position.x, window.innerWidth - 200)),
                top: Math.max(BUBBLE_MARGIN, Math.min(position.y, window.innerHeight - 200)),
                zIndex: CONTEXT_BUBBLE_Z_INDEX,
                maxWidth: 'calc(100vw - 20px)',
                maxHeight: 'calc(100vh - 20px)',
                overflow: 'auto',
                overscrollBehavior: 'contain'
            }}
            {...props}
        >
            {children}
        </div>
    )
}

const contextBubbleButtonVariants = cva(
    'flex items-center justify-center h-8 w-8 p-0 rounded-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                ghost: 'bg-transparent hover:bg-accent',
                outline: 'border border-input bg-background hover:bg-accent',
                selected: 'bg-primary text-primary-foreground hover:bg-primary/90 border border-primary'
            },
            size: {
                sm: 'h-6 w-6',
                default: 'h-8 w-8',
                lg: 'h-10 w-10'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

function ContextBubbleButton({
    asChild = false,
    variant = 'default',
    size = 'default',
    tooltip,
    className,
    ...props
}: React.ComponentProps<'button'> & {
    asChild?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof contextBubbleButtonVariants>) {
    const Comp = asChild ? Slot : 'button'

    const button = (
        <Comp
            data-slot="context-bubble-button"
            data-context-bubble="button"
            data-variant={variant}
            data-size={size}
            className={cn(contextBubbleButtonVariants({ variant, size }), className)}
            {...props}
        />
    )

    if (!tooltip) {
        return button
    }

    if (typeof tooltip === 'string') {
        tooltip = {
            children: tooltip
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="top" align="center" {...tooltip} />
        </Tooltip>
    )
}

function ContextBubbleGroup({
    className,
    children,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="context-bubble-group"
            data-context-bubble="group"
            className={cn('flex items-center gap-1 p-1', className)}
            {...props}
        >
            {children}
        </div>
    )
}

const ContextBubbleSubmenu = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-slot="context-bubble-submenu"
            data-context-bubble="submenu"
            className={cn('relative', className)}
            {...props}
        >
            {children}
        </div>
    )
})

ContextBubbleSubmenu.displayName = 'ContextBubbleSubmenu'

const ContextBubbleSubmenuTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> & {
        asChild?: boolean
        submenu: string
    }
>(({ asChild = false, submenu, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const { showSubmenu, setShowSubmenu, setSubmenuPosition } = useContextBubble()
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    const handleClick = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setSubmenuPosition(submenu, {
                x: rect.left,
                y: rect.bottom,
                width: rect.width,
                height: rect.height
            })
        }
        setShowSubmenu(showSubmenu === submenu ? null : submenu)
    }

    return (
        <Comp
            ref={(node) => {
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref) {
                    ref.current = node
                }
                triggerRef.current = node
            }}
            data-slot="context-bubble-submenu-trigger"
            data-context-bubble="submenu-trigger"
            className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors',
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Comp>
    )
})

ContextBubbleSubmenuTrigger.displayName = 'ContextBubbleSubmenuTrigger'

const ContextBubbleSubmenuContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
        submenu: string
    }
>(({ className, children, submenu, ...props }, ref) => {
    const { showSubmenu, submenuPositions, portalContainerRef, setShowSubmenu, position } = useContextBubble()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [contentPosition, setContentPosition] = React.useState({ x: 0, y: 0 })

    React.useLayoutEffect(() => {
        if (showSubmenu === submenu && contentRef.current && submenuPositions[submenu]) {
            const triggerPos = submenuPositions[submenu]
            const contentRect = contentRef.current.getBoundingClientRect()

            // Determine if the bubble is positioned above or below the selection
            // If the bubble's y position is less than the trigger's y position, it's above
            const isBubbleAbove = position.y < triggerPos.y

            let x = triggerPos.x + triggerPos.width + 5
            let y = triggerPos.y

            // If bubble is above, position submenu above the trigger
            if (isBubbleAbove) {
                y = triggerPos.y - contentRect.height - 5
            } else {
                // If bubble is below, position submenu below the trigger
                y = triggerPos.y + triggerPos.height + 5
            }

            // If there's not enough space to the right, position to the left
            if (x + contentRect.width > window.innerWidth - 10) {
                x = triggerPos.x - contentRect.width - 5
            }

            // If there's not enough space below, position above
            if (y + contentRect.height > window.innerHeight - 10) {
                y = triggerPos.y - contentRect.height - 5
            }

            // If there's not enough space above, position below
            if (y < 10) {
                y = triggerPos.y + triggerPos.height + 5
            }

            // Ensure it doesn't go off-screen
            x = Math.max(10, Math.min(x, window.innerWidth - contentRect.width - 10))
            y = Math.max(10, Math.min(y, window.innerHeight - contentRect.height - 10))

            setContentPosition({ x, y })
        }
    }, [showSubmenu, submenu, submenuPositions, position])

    React.useEffect(() => {
        if (showSubmenu !== submenu) return
        function handleClickOutside(event: MouseEvent) {
            if (
                contentRef.current &&
                !contentRef.current.contains(event.target as Node)
            ) {
                setShowSubmenu(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showSubmenu, submenu, setShowSubmenu])

    if (showSubmenu !== submenu) {
        return null
    }

    const content = (
        <div
            ref={(node) => {
                if (typeof ref === 'function') {
                    ref(node)
                } else if (ref) {
                    ref.current = node
                }
                contentRef.current = node
            }}
            data-slot="context-bubble-submenu-content"
            data-context-bubble="submenu-content"
            className={cn(
                'bg-background border rounded-lg shadow-lg p-1 z-50 min-w-[140px] pointer-events-auto',
                'max-h-[calc(100vh-20px)] overflow-y-auto',
                className
            )}
            style={{
                position: 'fixed',
                left: contentPosition.x,
                top: contentPosition.y,
                zIndex: CONTEXT_BUBBLE_Z_INDEX + 1,
                maxHeight: 'calc(100vh - 20px)',
                overflowY: 'auto'
            }}
            {...props}
        >
            {children}
        </div>
    )

    if (portalContainerRef.current) {
        return createPortal(content, portalContainerRef.current)
    }
    return typeof document !== 'undefined'
        ? createPortal(content, document.body)
        : content
})

ContextBubbleSubmenuContent.displayName = 'ContextBubbleSubmenuContent'

const ContextBubbleSubmenuItem = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> & {
        asChild?: boolean
    }
>(({ asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp
            ref={ref}
            data-slot="context-bubble-submenu-item"
            data-context-bubble="submenu-item"
            className={cn(
                'w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </Comp>
    )
})

ContextBubbleSubmenuItem.displayName = 'ContextBubbleSubmenuItem'

export {
    ContextBubble,
    ContextBubbleProvider,
    ContextBubbleButton,
    ContextBubbleGroup,
    ContextBubbleSubmenu,
    ContextBubbleSubmenuTrigger,
    ContextBubbleSubmenuContent,
    ContextBubbleSubmenuItem,
}