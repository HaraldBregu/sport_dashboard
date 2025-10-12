import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { Editor } from '@tiptap/react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  inline,
  type Placement,
  type Strategy
} from '@floating-ui/react'

export interface EditorBubbleMenuProps {
  editor: Editor
  children: React.ReactNode
  placement?: Placement
  strategy?: Strategy
  offsetDistance?: number
  shouldShow?: (props: { editor: Editor; state: Editor['state'] }) => boolean
  tippyOptions?: {
    duration?: number
    placement?: Placement
  }
  updateDelay?: number
  className?: string
  persistOnClick?: boolean // If true, clicking inside won't close the menu by default
}

export interface EditorBubbleMenuRef {
  show: () => void
  hide: () => void
}

export const EditorBubbleMenu = forwardRef<EditorBubbleMenuRef, EditorBubbleMenuProps>(({
  editor,
  children,
  placement = 'top',
  strategy = 'fixed',
  offsetDistance = 8,
  shouldShow,
  updateDelay,
  className = '',
  persistOnClick = false
}, ref) => {
  const [show, setShow] = useState(false)
  const [isPersistent, setIsPersistent] = useState(false)
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null)
  const rangeRef = useRef<Range | null>(null)

  const { refs, floatingStyles } = useFloating({
    placement,
    strategy,
    middleware: [
      inline(),
      offset(offsetDistance),
      flip({
        padding: 8,
        boundary: 'clippingAncestors'
      }),
      shift({
        padding: 8
      })
    ],
    whileElementsMounted: autoUpdate
  })

  // Expose show and hide methods via ref
  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true)
      if (persistOnClick) {
        setIsPersistent(true)
      }
    },
    hide: () => {
      setShow(false)
      setIsPersistent(false)
      lastSelectionRef.current = null
      rangeRef.current = null
    }
  }), [persistOnClick])

  // Handle clicks inside the bubble menu
  const handleBubbleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    const button = target.closest('button, [role="button"]')
    
    if (button) {
      // Check if button has data-close-menu attribute
      const shouldClose = button.getAttribute('data-close-menu')
      
      if (shouldClose === 'true') {
        setShow(false)
        setIsPersistent(false)
        lastSelectionRef.current = null
        rangeRef.current = null
      } else if (shouldClose === 'false' || persistOnClick) {
        // Keep menu open - make it persistent
        setIsPersistent(true)
      }
    }
  }

  // Prevent mousedown from affecting editor selection
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (persistOnClick) {
      event.preventDefault()
    }
  }

  useEffect(() => {
    const updatePosition = () => {
      const { state } = editor
      const { selection } = state
      const { empty } = selection

      // Clear any pending updates
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }

      const update = () => {
        // Check if we should show the menu
        const shouldShowMenu = shouldShow
          ? shouldShow({ editor, state })
          : !empty

        if (!shouldShowMenu) {
          setShow(false)
          setIsPersistent(false)
          lastSelectionRef.current = null
          rangeRef.current = null
          return
        }

        // Check if selection has changed
        const currentFrom = selection.from
        const currentTo = selection.to
        const selectionChanged = 
          lastSelectionRef.current === null ||
          lastSelectionRef.current.from !== currentFrom ||
          lastSelectionRef.current.to !== currentTo

        // If selection changed and menu was persistent, reset persistence
        if (selectionChanged && isPersistent) {
          setIsPersistent(false)
        }

        // Update last selection reference
        lastSelectionRef.current = { from: currentFrom, to: currentTo }

        // Get the DOM selection and create a virtual element for floating-ui
        const domSelection = window.getSelection()
        
        if (!domSelection || domSelection.rangeCount === 0) {
          setShow(false)
          setIsPersistent(false)
          lastSelectionRef.current = null
          rangeRef.current = null
          return
        }

        try {
          const range = domSelection.getRangeAt(0)
          rangeRef.current = range

          // Create a virtual element for floating-ui with dynamic rect
          const virtualElement = {
            getBoundingClientRect: () => {
              if (rangeRef.current) {
                return rangeRef.current.getBoundingClientRect()
              }
              return new DOMRect()
            },
            getClientRects: () => {
              if (rangeRef.current) {
                return rangeRef.current.getClientRects()
              }
              // Return empty DOMRectList-like object
              return {
                length: 0,
                item: () => null,
                [Symbol.iterator]: function* () {}
              } as unknown as DOMRectList
            }
          }

          refs.setReference(virtualElement as unknown as Element)
          setShow(true)
        } catch (error) {
          console.error('Error updating bubble menu position:', error)
          setShow(false)
          setIsPersistent(false)
          lastSelectionRef.current = null
          rangeRef.current = null
        }
      }

      // Apply delay if specified
      if (updateDelay !== undefined && updateDelay > 0) {
        updateTimerRef.current = setTimeout(update, updateDelay)
      } else {
        update()
      }
    }

    const handleBlur = () => {
      if (!isPersistent) {
        setShow(false)
        lastSelectionRef.current = null
        rangeRef.current = null
      }
    }

    // Update on selection changes
    editor.on('selectionUpdate', updatePosition)
    editor.on('transaction', updatePosition)
    editor.on('focus', updatePosition)
    editor.on('blur', handleBlur)

    // Initial update
    updatePosition()

    return () => {
      editor.off('selectionUpdate', updatePosition)
      editor.off('transaction', updatePosition)
      editor.off('focus', updatePosition)
      editor.off('blur', handleBlur)
      
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current)
      }
    }
  }, [editor, shouldShow, updateDelay, refs, offsetDistance, isPersistent])

  // Handle Escape key to close the bubble menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && show) {
        event.preventDefault()
        event.stopPropagation()
        setShow(false)
        setIsPersistent(false)
        lastSelectionRef.current = null
        rangeRef.current = null
      }
    }

    if (show) {
      // Use capture phase to ensure we catch the Escape key first
      document.addEventListener('keydown', handleKeyDown, true)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [show])

  // Handle right click to close the bubble menu
  useEffect(() => {
    const handleContextMenu = () => {
      if (show) {
        setShow(false)
        setIsPersistent(false)
        lastSelectionRef.current = null
        rangeRef.current = null
      }
    }

    if (show) {
      document.addEventListener('contextmenu', handleContextMenu)
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [show])

  if (!show) {
    return null
  }

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className={`z-50 ${className}`}
      onClick={handleBubbleMenuClick}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  )
})

EditorBubbleMenu.displayName = 'EditorBubbleMenu'

export default EditorBubbleMenu

