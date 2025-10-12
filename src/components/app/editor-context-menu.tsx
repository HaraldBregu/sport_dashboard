import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { createPortal } from 'react-dom'
import { Editor } from '@tiptap/react'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'

// Constants
const EDITOR_CONTEXT_MENU_Z_INDEX = 100
const BUBBLE_MARGIN = 10

// Utility functions
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(val, max))
}

// Types
type EditorContextMenuContextProps = {
  editor: Editor | null
  isOpen: boolean
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
  onClose: () => void
  showSubmenu: string | null
  setShowSubmenu: (submenu: string | null) => void
  selectionRect?: DOMRect | null
  submenuPositions: Record<string, { x: number; y: number; width: number; height: number }>
  setSubmenuPosition: (
    submenu: string,
    position: { x: number; y: number; width: number; height: number }
  ) => void
  portalContainerRef: React.RefObject<HTMLDivElement | null>
}

export interface EditorContextMenuProps extends Omit<React.ComponentProps<'div'>, 'children'>, VariantProps<typeof editorContextMenuVariants> {
  editor: Editor
  tooltipDelayDuration?: number
  bubbleMargin?: number
  children?: React.ReactNode | ((editor: Editor) => React.ReactNode)
}

// Variants
const editorContextMenuVariants = cva(
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

const editorContextMenuButtonVariants = cva(
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

// Context
const EditorContextMenuContext = React.createContext<EditorContextMenuContextProps | null>(null)

function useEditorContextMenu() {
  const context = React.useContext(EditorContextMenuContext)
  if (!context) {
    throw new Error('useEditorContextMenu must be used within EditorContextMenu component.')
  }
  return context
}

// Main Component
function EditorContextMenu({
  editor,
  variant = 'default',
  size = 'default',
  className,
  children,
  tooltipDelayDuration = 100,
  bubbleMargin = BUBBLE_MARGIN,
  ...props
}: EditorContextMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [selectionRect, setSelectionRect] = React.useState<DOMRect | null>(null)
  const [showSubmenu, setShowSubmenu] = React.useState<string | null>(null)
  const [submenuPositions, setSubmenuPositions] = React.useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({})
  const portalContainerRef = React.useRef<HTMLDivElement | null>(null)
  const bubbleRef = React.useRef<HTMLDivElement>(null)
  const [adjustedPosition, setAdjustedPosition] = React.useState({ x: 0, y: 0 })

  const setSubmenuPosition = React.useCallback(
    (submenu: string, position: { x: number; y: number; width: number; height: number }) => {
      setSubmenuPositions((prev) => ({ ...prev, [submenu]: position }))
    },
    []
  )

  const handleClose = React.useCallback(() => {
    setShowSubmenu(null)
    setIsOpen(false)
  }, [])

  // Listen to editor's contextmenu event
  React.useEffect(() => {
    if (!editor) return

    const handleContextMenu = (event: MouseEvent) => {
      // Check if the event target is within the editor
      const editorElement = editor.view.dom
      if (!editorElement.contains(event.target as Node)) return

      event.preventDefault()

      const selection = window.getSelection()
      
      // Store selection rect for reference
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setSelectionRect(rect)
      } else {
        setSelectionRect(null)
      }

      // Position the context menu at the exact mouse click position
      setPosition({ x: event.clientX, y: event.clientY })
      setIsOpen(true)
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener('contextmenu', handleContextMenu)

    return () => {
      editorElement.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [editor])

  const contextValue = React.useMemo<EditorContextMenuContextProps>(
    () => ({
      editor,
      isOpen,
      position,
      setPosition,
      onClose: handleClose,
      showSubmenu,
      setShowSubmenu,
      selectionRect,
      submenuPositions,
      setSubmenuPosition,
      portalContainerRef
    }),
    [
      editor,
      isOpen,
      position,
      handleClose,
      showSubmenu,
      selectionRect,
      submenuPositions,
      setSubmenuPosition
    ]
  )

  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is inside the main bubble
      if (bubbleRef.current && bubbleRef.current.contains(target)) {
        return
      }

      // Check if click is inside any submenu content
      const submenuContents = document.querySelectorAll('[data-context-bubble="submenu-content"]')
      for (const submenuContent of submenuContents) {
        if (submenuContent.contains(target)) {
          return
        }
      }

      // If click is outside both main bubble and submenus, close
      handleClose()
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])

  // Position clamping to keep bubble within viewport
  React.useLayoutEffect(() => {
    if (!isOpen || !bubbleRef.current) return

    const bubbleRect = bubbleRef.current.getBoundingClientRect()

    let adjustedX = position.x
    let adjustedY = position.y

    // Check if there's enough space below the cursor
    const spaceBelow = window.innerHeight - position.y - bubbleMargin

    if (spaceBelow >= bubbleRect.height + bubbleMargin) {
      // Enough space below: position below the cursor
      adjustedY = position.y + bubbleMargin
    } else {
      // Not enough space below: position above the cursor
      adjustedY = position.y - bubbleRect.height - bubbleMargin
      
      // If still not enough space above, clamp to top
      if (adjustedY < bubbleMargin) {
        adjustedY = bubbleMargin
      }
    }

    // Clamp horizontal position to viewport
    adjustedX = clamp(
      adjustedX,
      bubbleMargin,
      window.innerWidth - bubbleRect.width - bubbleMargin
    )

    // Ensure vertical position doesn't overflow
    adjustedY = clamp(
      adjustedY,
      bubbleMargin,
      window.innerHeight - bubbleRect.height - bubbleMargin
    )

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }, [isOpen, position, bubbleMargin])

  if (!isOpen) return null

  return (
    <EditorContextMenuContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={tooltipDelayDuration}>
        <div
          data-slot="context-bubble-wrapper"
          className="fixed inset-0 z-50 pointer-events-none"
        >
    <div
      ref={bubbleRef}
      data-slot="context-bubble"
      data-context-bubble="bubble"
      data-variant={variant}
      data-size={size}
      className={cn(editorContextMenuVariants({ variant, size }), className)}
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: EDITOR_CONTEXT_MENU_Z_INDEX,
        maxWidth: 'calc(100vw - 20px)',
        maxHeight: 'calc(100vh - 20px)',
        overflow: 'auto',
        overscrollBehavior: 'contain'
      }}
      {...props}
    >
            {typeof children === 'function' ? children(editor) : children}
          </div>
          {/* Portal container for submenu content */}
          <div ref={portalContainerRef} className="pointer-events-none" />
    </div>
      </TooltipProvider>
    </EditorContextMenuContext.Provider>
  )
}

// Sub Components
function EditorContextMenuButton({
  asChild = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof editorContextMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button'

  const button = (
    <Comp
      data-slot="context-bubble-button"
      data-context-bubble="button"
      data-variant={variant}
      data-size={size}
      className={cn(editorContextMenuButtonVariants({ variant, size }), className)}
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

function EditorContextMenuGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
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

const EditorContextMenuSubmenu = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => {
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
  }
)

EditorContextMenuSubmenu.displayName = 'EditorContextMenuSubmenu'

const EditorContextMenuSubmenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean
    submenu: string
  }
>(({ asChild = false, submenu, className, children, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  const { showSubmenu, setShowSubmenu, setSubmenuPosition } = useEditorContextMenu()
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

EditorContextMenuSubmenuTrigger.displayName = 'EditorContextMenuSubmenuTrigger'

const EditorContextMenuSubmenuContent = forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    submenu: string
  }
>(({ className, children, submenu, ...props }, ref) => {

  const {
    showSubmenu,
    submenuPositions,
    portalContainerRef,
    setShowSubmenu,
    position
  } = useEditorContextMenu()

  const contentRef = useRef<HTMLDivElement>(null)
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 })

  useLayoutEffect(() => {
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

  useEffect(() => {
    if (showSubmenu !== submenu) return
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node

      // Don't close if clicking inside the submenu content
      if (contentRef.current && contentRef.current.contains(target)) {
        return
      }

      // Don't close if clicking on submenu items (let the main bubble handle it)
      const isSubmenuItem = (target as Element).closest('[data-context-bubble="submenu-item"]')
      if (isSubmenuItem) {
        return
      }

      // Don't close if clicking inside the main bubble (let the main bubble handle it)
      const mainBubble = document.querySelector('[data-context-bubble="bubble"]')
      if (mainBubble && mainBubble.contains(target)) {
        return
      }

      setShowSubmenu(null)
    }
    // Use 'click' instead of 'mousedown' to allow onClick handlers to fire first
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
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
        zIndex: EDITOR_CONTEXT_MENU_Z_INDEX + 1,
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
  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
})

EditorContextMenuSubmenuContent.displayName = 'EditorContextMenuSubmenuContent'

const EditorContextMenuSubmenuItem = React.forwardRef<
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

EditorContextMenuSubmenuItem.displayName = 'EditorContextMenuSubmenuItem'

export {
  EditorContextMenu,
  EditorContextMenuButton,
  EditorContextMenuGroup,
  EditorContextMenuSubmenu,
  EditorContextMenuSubmenuTrigger,
  EditorContextMenuSubmenuContent,
  EditorContextMenuSubmenuItem
}
