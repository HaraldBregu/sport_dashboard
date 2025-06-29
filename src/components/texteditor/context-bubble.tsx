import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

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

    React.useEffect(() => {
        setInternalPosition(position)
    }, [position])

    const contextValue = React.useMemo<ContextBubbleContextProps>(
        () => ({
            isOpen,
            position: internalPosition,
            setPosition: setInternalPosition,
            onClose,
            showSubmenu,
            setShowSubmenu,
            selectionRect
        }),
        [isOpen, internalPosition, onClose, showSubmenu, selectionRect]
    )

    if (!isOpen) return null

    return (
        <ContextBubbleContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    data-slot="context-bubble-wrapper"
                    className="fixed inset-0 z-50 pointer-events-none"
                    {...props}
                >
                    {children}
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
    'flex items-center justify-center h-8 w-8 p-0 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                ghost: 'bg-transparent hover:bg-accent',
                outline: 'border border-input bg-background hover:bg-accent'
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
            className={cn('bg-background border rounded-lg shadow-lg p-2 z-50 min-w-[140px]', className)}
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
    const { setShowSubmenu } = useContextBubble()

    return (
        <Comp
            ref={ref}
            data-slot="context-bubble-submenu-trigger"
            data-context-bubble="submenu-trigger"
            className={cn(
                'w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors',
                className
            )}
            onMouseEnter={() => setShowSubmenu(submenu)}
            onMouseLeave={() => setShowSubmenu(null)}
            {...props}
        >
            {children}
        </Comp>
    )
})

ContextBubbleSubmenuTrigger.displayName = 'ContextBubbleSubmenuTrigger'

export {
    ContextBubble,
    ContextBubbleProvider,
    ContextBubbleButton,
    ContextBubbleGroup,
    ContextBubbleSubmenu,
    ContextBubbleSubmenuTrigger,
    useContextBubble
}
