import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import TextEditor, { TextEditorRef } from '@/components/texteditor/text-editor'
import {
  ContextBubble,
  ContextBubbleProvider,
  ContextBubbleSubmenu,
  ContextBubbleSubmenuTrigger,
  useContextBubble,
  ContextBubbleGroup,
  ContextBubbleButton,
} from '@/components/texteditor/context-bubble'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronRight,
  Code,
  Highlighter,
  Italic,
  LinkIcon,
  List,
  ListOrdered, Palette, Quote, Strikethrough, UnderlineIcon, Unlink, Heading1, Heading2, Heading3,
  Type,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { highlightColors, testContent, textColors } from './data'
import React from 'react'


export interface ContentRef {
  focus: () => void
}

type ContentProps = {
  placeholder: string
}

const Content = forwardRef<ContentRef, ContentProps>(({ placeholder }, ref) => {

  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log('focus')
    },
  }))

  const [contextBubble, setContextBubble] = useState<{ x: number; y: number } | null>(null)
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()

    // Check if there's selected text
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) {
      // Text is selected, show context bubble
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Store the selection rect for dynamic positioning
      setSelectionRect(rect)

      // Position bubble initially at a safe location
      const initialX = rect.left + rect.width / 2
      const initialY = rect.top - 10

      setContextBubble({ x: initialX, y: initialY })
    }
    // If no text is selected, don't show the context bubble
  }



  const editorRef = useRef<TextEditorRef>(null)
  // Add refs for submenu triggers
  const colorsTriggerRef = useRef<HTMLButtonElement>(null)
  const highlightTriggerRef = useRef<HTMLButtonElement>(null)
  const alignTriggerRef = useRef<HTMLButtonElement>(null)
  const listsTriggerRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div
            className="h-full"
            onContextMenu={handleContextMenu}
          >
            <TextEditor
              ref={editorRef}
              placeholder={placeholder}
              className="h-full"
              content={testContent}
            />
          </div>
          <div
            className="h-full"
            onContextMenu={handleContextMenu}
          >
            <TextEditor
              placeholder={placeholder}
              className="h-full"
              content={testContent}
            />
          </div>
        </div>
      </div>

      {contextBubble && (
        <ContextBubbleProvider
          isOpen={!!contextBubble}
          position={contextBubble}
          selectionRect={selectionRect}
          onClose={() => {
            setContextBubble(null)
            setSelectionRect(null)
          }}
        >
          <ContextBubble variant="floating">
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Bold"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBold().run()
                }}
              >
                <Bold className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Italic"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleItalic().run()
                }}
              >
                <Italic className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Underline"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleUnderline().run()
                }}
              >
                <UnderlineIcon className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Strikethrough"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleStrike().run()
                }}
              >
                <Strikethrough className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Code"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleCode().run()
                }}
              >
                <Code className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Highlight"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHighlight().run()
                }}
              >
                <Highlighter className="h-4 w-4" />
              </ContextBubbleButton>

            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Align Left"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("left").run()
                }}
              >
                <AlignLeft className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Align Center"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("center").run()
                }}
              >
                <AlignCenter className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Align Right"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("right").run()
                }}
              >
                <AlignRight className="h-4 w-4" />
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Add Link"
                onClick={() => {

                }}
              >
                <LinkIcon className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Remove Link"
                onClick={() => {

                }}
              >
                <Unlink className="h-4 w-4" />
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Bullet List"
                onClick={() => {
                }}
              >
                <List className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Numbered List"
                onClick={() => {
                }}
              >
                <ListOrdered className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Quote"
                onClick={() => {
                }}
              >
                <Quote className="h-4 w-4" />
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Heading 1"
                onClick={() => {
                }}
              >
                <Heading1 className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Heading 2"
                onClick={() => {
                }}
              >
                <Heading2 className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Heading 3"
                onClick={() => {
                }}
              >
                <Heading3 className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Paragraph"
                onClick={() => {
                }}
              >
                <Type className="h-4 w-4" />
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />

            {/* Menu Items with Submenus */}
            <div className="space-y-1">
              {/* Text Colors */}
              <ContextBubbleSubmenuTrigger submenu="colors" ref={colorsTriggerRef}>
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Text Color
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>

              {/* Highlight Colors */}
              <ContextBubbleSubmenuTrigger submenu="highlight" ref={highlightTriggerRef}>
                <div className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  Highlight Color
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
            </div>

            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={"my-1"}
            />

            {/* Clicking submenu */}
            <div className="space-y-1">
              <ContextBubbleSubmenuTrigger submenu="align" ref={alignTriggerRef}>
                <div className="flex items-center">
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Text Alignment
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>

              <ContextBubbleSubmenuTrigger submenu="lists" ref={listsTriggerRef}>
                <div className="flex items-center">
                  <List className="mr-2 h-4 w-4" />
                  Lists
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
            </div>


          </ContextBubble>

          {/* Submenus */}
          <ContextBubbleSubmenus
            textColors={textColors}
            highlightColors={highlightColors}
            colorsTriggerRef={colorsTriggerRef}
            highlightTriggerRef={highlightTriggerRef}
            alignTriggerRef={alignTriggerRef}
            listsTriggerRef={listsTriggerRef}
            editorRef={editorRef}
          />
        </ContextBubbleProvider>
      )}
    </>
  )
})

Content.displayName = 'Content'

function ContextBubbleSubmenus({
  textColors,
  highlightColors,
  colorsTriggerRef,
  highlightTriggerRef,
  alignTriggerRef,
  listsTriggerRef,
  editorRef
}: {
  textColors: string[]
  highlightColors: string[]
    colorsTriggerRef: React.RefObject<HTMLButtonElement | null>
    highlightTriggerRef: React.RefObject<HTMLButtonElement | null>
    alignTriggerRef: React.RefObject<HTMLButtonElement | null>
    listsTriggerRef: React.RefObject<HTMLButtonElement | null>
    editorRef: React.RefObject<TextEditorRef | null>
}) {
  const { showSubmenu, onClose, position } = useContextBubble()
  const colorsSubmenuRef = useRef<HTMLDivElement>(null)
  const highlightSubmenuRef = useRef<HTMLDivElement>(null)
  const alignSubmenuRef = useRef<HTMLDivElement>(null)
  const listsSubmenuRef = useRef<HTMLDivElement>(null)
  const [submenuStyles, setSubmenuStyles] = useState<{
    colors: React.CSSProperties
    highlight: React.CSSProperties
    align: React.CSSProperties
    lists: React.CSSProperties
  }>({
    colors: { position: 'fixed', left: 0, top: 0, zIndex: 60 },
    highlight: { position: 'fixed', left: 0, top: 0, zIndex: 60 },
    align: { position: 'fixed', left: 0, top: 0, zIndex: 60 },
    lists: { position: 'fixed', left: 0, top: 0, zIndex: 60 }
  })

  console.log('Submenu state:', { showSubmenu, position })

  // Calculate submenu position using actual DOM measurements
  const calculateSubmenuPosition = React.useCallback((triggerRef: React.RefObject<HTMLButtonElement | null>, submenuRef: React.RefObject<HTMLDivElement | null>) => {
    if (!triggerRef.current || !submenuRef.current) {
      console.warn('Trigger or submenu ref not found, using fallback positioning')
      return {
        position: 'fixed' as const,
        left: position.x + 320,
        top: position.y,
        zIndex: 60,
        maxHeight: '300px',
        overflowY: 'auto' as const
      }
    }

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const submenuRect = submenuRef.current.getBoundingClientRect()

    // Find the context bubble element to get its actual width
    const contextBubble = document.querySelector('[data-context-bubble="bubble"]') as HTMLElement
    const bubbleRect = contextBubble?.getBoundingClientRect()

    if (!bubbleRect) {
      console.warn('Context bubble not found, using fallback positioning')
      return {
        position: 'fixed' as const,
        left: triggerRect.right + 10,
        top: triggerRect.top + (triggerRect.height / 2) - (submenuRect.height / 2),
        zIndex: 60,
        maxHeight: '300px',
        overflowY: 'auto' as const
      }
    }

    // Calculate available space on both sides using actual bubble width
    const spaceOnRight = window.innerWidth - (bubbleRect.right + 10)
    const spaceOnLeft = bubbleRect.left - 10

    // Determine optimal position based on available space
    let left: number
    let top = triggerRect.top + (triggerRect.height / 2) - (submenuRect.height / 2) // Align with button center

    if (spaceOnRight >= submenuRect.width) {
      // Enough space on the right - position there
      left = bubbleRect.right + 10
    } else if (spaceOnLeft >= submenuRect.width) {
      // Enough space on the left - position there
      left = bubbleRect.left - submenuRect.width - 10
    } else {
      // Not enough space on either side - position where there's more space
      if (spaceOnRight > spaceOnLeft) {
        left = window.innerWidth - submenuRect.width - 10
      } else {
        left = 10
      }
    }

    // Check if submenu would overflow bottom edge
    if (top + submenuRect.height > window.innerHeight) {
      top = window.innerHeight - submenuRect.height - 10
    }

    // Check if submenu would overflow top edge
    if (top < 10) {
      top = 10
    }

    // Ensure minimum distance from edges
    left = Math.max(10, left)

    console.log('Dynamic submenu positioning:', {
      triggerRect,
      submenuRect,
      bubbleRect,
      spaceOnRight,
      spaceOnLeft,
      submenuPosition: { left, top },
      viewport: { width: window.innerWidth, height: window.innerHeight }
    })

    return {
      position: 'fixed' as const,
      left,
      top,
      zIndex: 60,
      maxHeight: '300px',
      overflowY: 'auto' as const
    }
  }, [position])

  // Update submenu positions when showSubmenu changes
  React.useLayoutEffect(() => {
    if (showSubmenu === 'colors' && colorsTriggerRef.current && colorsSubmenuRef.current) {
      const newStyles = calculateSubmenuPosition(colorsTriggerRef, colorsSubmenuRef)
      setSubmenuStyles(prev => ({ ...prev, colors: newStyles }))
    } else if (showSubmenu === 'highlight' && highlightTriggerRef.current && highlightSubmenuRef.current) {
      const newStyles = calculateSubmenuPosition(highlightTriggerRef, highlightSubmenuRef)
      setSubmenuStyles(prev => ({ ...prev, highlight: newStyles }))
    } else if (showSubmenu === 'align' && alignTriggerRef.current && alignSubmenuRef.current) {
      const newStyles = calculateSubmenuPosition(alignTriggerRef, alignSubmenuRef)
      setSubmenuStyles(prev => ({ ...prev, align: newStyles }))
    } else if (showSubmenu === 'lists' && listsTriggerRef.current && listsSubmenuRef.current) {
      const newStyles = calculateSubmenuPosition(listsTriggerRef, listsSubmenuRef)
      setSubmenuStyles(prev => ({ ...prev, lists: newStyles }))
    }
  }, [showSubmenu, calculateSubmenuPosition, colorsTriggerRef, highlightTriggerRef, alignTriggerRef, listsTriggerRef])

  if (!showSubmenu) {
    console.log('No submenu to show')
    return null
  }

  console.log('Rendering submenu:', showSubmenu)

  return (
    <>
      {showSubmenu === 'colors' && (
        <ContextBubbleSubmenu
          ref={colorsSubmenuRef}
          style={submenuStyles.colors}
        >
            <div className="grid grid-cols-4 gap-1.5">
              {textColors.map((color) => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    // editor.chain().focus().setColor(color).run()
                    console.log('Set text color:', color)
                    onClose()
                  }}
                  title={`Set text color to ${color}`}
                />
              ))}
            </div>
          </ContextBubbleSubmenu>
      )}
      {showSubmenu === 'highlight' && (
        <ContextBubbleSubmenu
          ref={highlightSubmenuRef}
          style={submenuStyles.highlight}
        >
            <div className="grid grid-cols-4 gap-1.5">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    // editor.chain().focus().setHighlight(color).run()
                    console.log('Set highlight color:', color)
                    onClose()
                  }}
                  title={`Set highlight color to ${color}`}
                />
              ))}
            </div>
          </ContextBubbleSubmenu>
      )}
      {showSubmenu === 'align' && (
        <ContextBubbleSubmenu
          ref={alignSubmenuRef}
          style={submenuStyles.align}
        >
          <div className="space-y-1">
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().setTextAlign("left").run()
                onClose()
              }}
            >
              <AlignLeft className="mr-2 h-4 w-4" />
              Align Left
            </button>
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().setTextAlign("center").run()
                onClose()
              }}
            >
              <AlignCenter className="mr-2 h-4 w-4" />
              Align Center
            </button>
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().setTextAlign("right").run()
                onClose()
              }}
            >
              <AlignRight className="mr-2 h-4 w-4" />
              Align Right
            </button>
          </div>
        </ContextBubbleSubmenu>
      )}
      {showSubmenu === 'lists' && (
        <ContextBubbleSubmenu
          ref={listsSubmenuRef}
          style={submenuStyles.lists}
        >
          <div className="space-y-1">
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().toggleBulletList().run()
                onClose()
              }}
            >
              <List className="mr-2 h-4 w-4" />
              Bullet List
            </button>
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().toggleOrderedList().run()
                onClose()
              }}
            >
              <ListOrdered className="mr-2 h-4 w-4" />
              Numbered List
            </button>
            <button
              className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().toggleBlockquote().run()
                onClose()
              }}
            >
              <Quote className="mr-2 h-4 w-4" />
              Quote
            </button>
          </div>
        </ContextBubbleSubmenu>
      )}
    </>
  )
}

export default Content
