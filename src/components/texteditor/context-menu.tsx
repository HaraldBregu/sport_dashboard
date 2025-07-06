import { useEffect, useRef, useState } from 'react'
import {
  AlignCenter,
  AlignLeft,
  Bold,
  ChevronRight,
  Code,
  Heading1,
  Heading3,
  Highlighter,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Strikethrough,
  Type,
  UnderlineIcon,
  Unlink
} from 'lucide-react'
import { AlignRight, Heading2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
}

function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  const [showColorSubmenu, setShowColorSubmenu] = useState(false)
  const [showHighlightSubmenu, setShowHighlightSubmenu] = useState(false)
  const [showRemoveSubmenu, setShowRemoveSubmenu] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })
  const [menuDimensions, setMenuDimensions] = useState({ width: 200, height: 0 })

  // Calculate submenu position to ensure it stays inside viewport
  const getSubmenuPosition = (submenuWidth: number, submenuHeight: number = 100) => {
    const { width: menuWidth, height: menuHeight } = menuDimensions
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Calculate potential positions
    const rightPosition = position.x + menuWidth + 4 // 4px margin
    const leftPosition = position.x - submenuWidth - 4 // 4px margin
    const bottomPosition = position.y + submenuHeight
    const topPosition = position.y - submenuHeight + menuHeight

    let submenuStyle: React.CSSProperties = {}

    // Horizontal positioning with fallback logic
    if (rightPosition + submenuWidth <= viewportWidth) {
      // Position submenu to the right of the main menu
      submenuStyle = {
        left: '100%',
        right: 'auto',
        marginLeft: '4px',
        marginRight: '0'
      }
    } else if (leftPosition >= 0) {
      // Position submenu to the left of the main menu
      submenuStyle = {
        left: 'auto',
        right: '100%',
        marginLeft: '0',
        marginRight: '4px'
      }
    } else {
      // If both sides overflow, try to fit the submenu by adjusting its position
      const availableRightSpace = viewportWidth - rightPosition
      const availableLeftSpace = leftPosition + submenuWidth

      if (availableRightSpace > availableLeftSpace && availableRightSpace > submenuWidth * 0.8) {
        // Position to the right but with reduced margin
        submenuStyle = {
          left: '100%',
          right: 'auto',
          marginLeft: '2px',
          marginRight: '0'
        }
      } else if (availableLeftSpace > submenuWidth * 0.8) {
        // Position to the left but with reduced margin
        submenuStyle = {
          left: 'auto',
          right: '100%',
          marginLeft: '0',
          marginRight: '2px'
        }
      } else {
        // Default to right positioning
        submenuStyle = {
          left: '100%',
          right: 'auto',
          marginLeft: '4px',
          marginRight: '0'
        }
      }
    }

    // Vertical positioning with fallback logic
    if (bottomPosition <= viewportHeight) {
      // Position submenu at the top of the main menu
      submenuStyle.top = '0'
      submenuStyle.bottom = 'auto'
    } else if (topPosition >= 0) {
      // Position submenu at the bottom of the main menu
      submenuStyle.top = 'auto'
      submenuStyle.bottom = '0'
    } else {
      // If both top and bottom overflow, try to fit by adjusting position
      const availableBottomSpace = viewportHeight - position.y
      const availableTopSpace = position.y + menuHeight

      if (availableBottomSpace > availableTopSpace && availableBottomSpace > submenuHeight * 0.8) {
        submenuStyle.top = '0'
        submenuStyle.bottom = 'auto'
      } else if (availableTopSpace > submenuHeight * 0.8) {
        submenuStyle.top = 'auto'
        submenuStyle.bottom = '0'
      } else {
        // Default to top positioning
        submenuStyle.top = '0'
        submenuStyle.bottom = 'auto'
      }
    }

    return submenuStyle
  }

  useEffect(() => {
    if (menuRef.current) {
      const menuElement = menuRef.current
      const menuRect = menuElement.getBoundingClientRect()

      // Store actual menu dimensions
      setMenuDimensions({
        width: menuRect.width,
        height: menuRect.height
      })

      let adjustedX = x
      let adjustedY = y

      if (x + menuRect.width > window.innerWidth) {
        adjustedX = window.innerWidth - menuRect.width - 10
      }

      if (y + menuRect.height > window.innerHeight) {
        adjustedY = window.innerHeight - menuRect.height - 10
      }

      adjustedX = Math.max(10, adjustedX)
      adjustedY = Math.max(10, adjustedY)

      setPosition({ x: adjustedX, y: adjustedY })
    }
  }, [x, y])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const textColors = [
    '#000000',
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899'
  ]
  const highlightColors = [
    '#fef3c7',
    '#fecaca',
    '#fed7d7',
    '#e0e7ff',
    '#d1fae5',
    '#fce7f3',
    '#f3e8ff',
    '#e5e7eb'
  ]

  return (
    <div
      ref={menuRef}
      className="fixed bg-background border rounded-lg shadow-lg p-1 z-50 min-w-48"
      style={{ left: position.x, top: position.y }}
    >
      {/* Text Formatting */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleBold().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleItalic().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleUnderline().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleStrike().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleCode().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleHighlight().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setTextAlign("left").run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setTextAlign("center").run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setTextAlign("right").run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Links */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // setLink()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // editor.chain().focus().unsetLink().run()
            onClose()
          }}
          // disabled={!editor.isActive("link")}
          className="h-8 w-8 p-0"
        >
          <Unlink className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Lists and Quotes */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleBulletList().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleOrderedList().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleBlockquote().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Headings */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleHeading({ level: 1 }).run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleHeading({ level: 2 }).run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().toggleHeading({ level: 3 }).run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setParagraph().run()
            onClose()
          }}
          className="h-8 w-8 p-0"
        >
          <Type className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Font Sizes */}
      <div className="flex items-center gap-1 p-1">
        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setMark("textStyle", { fontSize: "8pt" }).run()
            onClose()
          }}
          className="h-8 px-2 text-xs"
        >
          8pt
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setMark("textStyle", { fontSize: "26pt" }).run()
            onClose()
          }}
          className="h-8 px-2 text-sm"
        >
          26pt
        </Button>

        <Button
          variant={'ghost'}
          size="sm"
          onClick={() => {
            // editor.chain().focus().setMark("textStyle", { fontSize: "90pt" }).run()
            onClose()
          }}
          className="h-8 px-2 text-base"
        >
          90pt
        </Button>
      </div>

      <Separator className="my-1" />

      {/* Menu Items with Submenus */}
      <div className="space-y-1">
        {/* Text Colors */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
            onMouseEnter={() => setShowColorSubmenu(true)}
            onMouseLeave={() => setShowColorSubmenu(false)}
          >
            <div className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Text Color
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          {showColorSubmenu && (
            <div
              className="absolute left-full top-0 ml-1 bg-background border rounded-lg shadow-lg p-2 z-50"
              onMouseEnter={() => setShowColorSubmenu(true)}
              onMouseLeave={() => setShowColorSubmenu(false)}
              style={getSubmenuPosition(120, 80)}
            >
              <div className="grid grid-cols-4 gap-1">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // editor.chain().focus().setColor(color).run()
                      onClose()
                    }}
                    title={`Set text color to ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Highlight Colors */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
            onMouseEnter={() => setShowHighlightSubmenu(true)}
            onMouseLeave={() => setShowHighlightSubmenu(false)}
          >
            <div className="flex items-center">
              <Highlighter className="mr-2 h-4 w-4" />
              Highlight Color
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          {showHighlightSubmenu && (
            <div
              className="absolute left-full top-0 ml-1 bg-background border rounded-lg shadow-lg p-2 z-50"
              onMouseEnter={() => setShowHighlightSubmenu(true)}
              onMouseLeave={() => setShowHighlightSubmenu(false)}
              style={getSubmenuPosition(120, 80)}
            >
              <div className="grid grid-cols-4 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      // editor.chain().focus().toggleHighlight({ color }).run()
                      onClose()
                    }}
                    title={`Highlight with ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-1" />

        {/* Other Actions */}
        <button
          className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
          onClick={() => {
            // editor.chain().focus().setHorizontalRule().run()
            onClose()
          }}
        >
          <Minus className="mr-2 h-4 w-4" />
          Insert Horizontal Rule
        </button>

        <button
          className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
          onClick={() => {
            // editor.chain().focus().clearNodes().unsetAllMarks().run()
            onClose()
          }}
        >
          <Type className="mr-2 h-4 w-4" />
          Clear All Formatting
        </button>

        {/* Remove Colors Submenu */}
        <div className="relative">
          <button
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
            onMouseEnter={() => setShowRemoveSubmenu(true)}
            onMouseLeave={() => setShowRemoveSubmenu(false)}
          >
            <div className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              Remove Colors
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          {showRemoveSubmenu && (
            <div
              className="absolute left-full top-0 ml-1 bg-background border rounded-lg shadow-lg py-1 z-50 min-w-40"
              onMouseEnter={() => setShowRemoveSubmenu(true)}
              onMouseLeave={() => setShowRemoveSubmenu(false)}
              style={getSubmenuPosition(160, 120)}
            >
              <button
                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  // editor.chain().focus().unsetColor().run()
                  onClose()
                }}
              >
                Remove Text Color
              </button>
              <button
                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  // editor.chain().focus().unsetHighlight().run()
                  onClose()
                }}
              >
                Remove Highlight
              </button>
              <button
                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  // editor.chain().focus().unsetColor().unsetHighlight().run()
                  onClose()
                }}
              >
                Remove All Colors
              </button>
            </div>
          )}
        </div>
      </div>

      {/* <div className="flex items-center gap-1 p-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Highlighter className="h-4 w-4" />
                </Button>
            </div> */}
    </div>
  )
}

export default ContextMenu
