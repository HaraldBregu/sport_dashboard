import { useEffect, useRef, useState } from 'react';
import { AlignCenter, AlignLeft, Bold, ChevronRight, Code, Heading1, Heading3, Highlighter, Italic, LinkIcon, List, ListOrdered, Minus, Palette, Quote, Strikethrough, Type, UnderlineIcon, Unlink } from 'lucide-react';
import { AlignRight, Heading2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface ContextContainerProps {
    x: number
    y: number
    onClose: () => void
}

function ContextContainer({ x, y, onClose }: ContextContainerProps) {
    const [showColorSubmenu, setShowColorSubmenu] = useState(false)
    const [showHighlightSubmenu, setShowHighlightSubmenu] = useState(false)
    const [showRemoveSubmenu, setShowRemoveSubmenu] = useState(false)
    const [clickedItemPosition, setClickedItemPosition] = useState({ x: 0, y: 0 })

    const menuRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x, y })

    // Calculate submenu position to ensure it stays inside viewport
    const getSubmenuPosition = (submenuWidth: number, submenuHeight: number = 100) => {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Use the clicked item's position for submenu positioning
        const itemLeft = clickedItemPosition.x
        const itemRight = clickedItemPosition.x + 200 // Approximate item width
        const itemTop = clickedItemPosition.y
        const itemBottom = clickedItemPosition.y + 40 // Approximate item height

        let submenuX = 0
        let submenuY = 0

        // Horizontal positioning - try right first, then left
        if (itemRight + submenuWidth + 4 <= viewportWidth) {
            // Position submenu to the right of the clicked item
            submenuX = itemRight + 4
        } else if (itemLeft - submenuWidth - 4 >= 0) {
            // Position submenu to the left of the clicked item
            submenuX = itemLeft - submenuWidth - 4
        } else {
            // If both sides overflow, try to fit by adjusting position
            const availableRightSpace = viewportWidth - itemRight
            const availableLeftSpace = itemLeft

            if (availableRightSpace >= submenuWidth * 0.8) {
                // Position to the right with reduced margin
                submenuX = itemRight + 2
            } else if (availableLeftSpace >= submenuWidth * 0.8) {
                // Position to the left with reduced margin
                submenuX = itemLeft - submenuWidth - 2
            } else {
                // If still can't fit, position it to the right but ensure it doesn't overflow
                submenuX = Math.max(10, viewportWidth - submenuWidth - 10)
            }
        }

        // Vertical positioning - try top first, then bottom
        if (itemTop + submenuHeight <= viewportHeight) {
            // Position submenu at the top of the clicked item
            submenuY = itemTop
        } else if (itemBottom - submenuHeight >= 0) {
            // Position submenu at the bottom of the clicked item
            submenuY = itemBottom - submenuHeight
        } else {
            // If both top and bottom overflow, try to fit by adjusting position
            const availableBottomSpace = viewportHeight - itemTop
            const availableTopSpace = itemBottom

            if (availableBottomSpace >= submenuHeight * 0.8) {
                submenuY = itemTop
            } else if (availableTopSpace >= submenuHeight * 0.8) {
                submenuY = itemBottom - submenuHeight
            } else {
                // Default to top positioning but ensure it doesn't overflow
                submenuY = Math.max(10, viewportHeight - submenuHeight - 10)
            }
        }

        // Ensure final position is within viewport bounds
        submenuX = Math.max(10, Math.min(submenuX, viewportWidth - submenuWidth - 10))
        submenuY = Math.max(10, Math.min(submenuY, viewportHeight - submenuHeight - 10))

        return {
            position: 'fixed' as const,
            left: submenuX,
            top: submenuY,
            zIndex: 60
        }
    }

    useEffect(() => {
        if (menuRef.current) {
            const menuElement = menuRef.current
            const menuRect = menuElement.getBoundingClientRect()

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

    const textColors = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]
    const highlightColors = ["#fef3c7", "#fecaca", "#fed7d7", "#e0e7ff", "#d1fae5", "#fce7f3", "#f3e8ff", "#e5e7eb"]

    return (
        <div
            ref={menuRef}
            className="fixed bg-background border rounded-lg shadow-lg p-1 z-50 min-w-48"
            style={{ left: position.x, top: position.y }}
        >
            {/* Text Formatting */}
            <div className="flex items-center gap-1 p-1">
                <Button
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                    variant={"ghost"}
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
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setClickedItemPosition({ x: rect.left, y: rect.top })
                            setShowColorSubmenu(true)
                        }}
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
                            className="bg-background border rounded-lg shadow-lg p-2 z-50 min-w-[140px]"
                            onMouseEnter={() => setShowColorSubmenu(true)}
                            onMouseLeave={() => setShowColorSubmenu(false)}
                            style={getSubmenuPosition(140, 100)}
                        >
                            <div className="grid grid-cols-4 gap-1.5">
                                {textColors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            // editor.chain().focus().setColor(color).run()
                                            onClose()
                                        }}
                                        title={`Set text color to ${color}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Highlight Colors */}
                <div className="relative">
                    <button
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setClickedItemPosition({ x: rect.left, y: rect.top })
                            setShowHighlightSubmenu(true)
                        }}
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
                            className="bg-background border rounded-lg shadow-lg p-2 z-50 min-w-[140px]"
                            onMouseEnter={() => setShowHighlightSubmenu(true)}
                            onMouseLeave={() => setShowHighlightSubmenu(false)}
                            style={getSubmenuPosition(140, 100)}
                        >
                            <div className="grid grid-cols-4 gap-1.5">
                                {highlightColors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            // editor.chain().focus().setHighlight(color).run()
                                            onClose()
                                        }}
                                        title={`Set highlight color to ${color}`}
                                    ></button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Remove Formatting */}
                <div className="relative">
                    <button
                        className="w-full flex items-center justify-between px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                        onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            setClickedItemPosition({ x: rect.left, y: rect.top })
                            setShowRemoveSubmenu(true)
                        }}
                        onMouseLeave={() => setShowRemoveSubmenu(false)}
                    >
                        <div className="flex items-center">
                            <Minus className="mr-2 h-4 w-4" />
                            Remove Formatting
                        </div>
                        <ChevronRight className="h-4 w-4" />
                    </button>

                    {showRemoveSubmenu && (
                        <div
                            className="bg-background border rounded-lg shadow-lg p-2 z-50 min-w-[140px]"
                            onMouseEnter={() => setShowRemoveSubmenu(true)}
                            onMouseLeave={() => setShowRemoveSubmenu(false)}
                            style={getSubmenuPosition(140, 100)}
                        >
                            <div className="grid grid-cols-4 gap-1.5">
                                <button
                                    className="w-7 h-7 rounded border border-gray-300 hover:scale-110 transition-transform"
                                    onClick={() => {
                                        // editor.chain().focus().reset().run()
                                        onClose()
                                    }}
                                    title="Remove all formatting"
                                ></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContextContainer