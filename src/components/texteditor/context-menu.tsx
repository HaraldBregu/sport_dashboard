import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight, Bold, ChevronRight, Code, Highlighter, Italic, LinkIcon, List, ListOrdered, Minus, Palette, Quote, Strikethrough, Type, UnderlineIcon, Unlink, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface ContextMenuProps {
    x: number
    y: number
    onClose: () => void
    editor: Editor
}

function ContextMenu({ x, y, onClose, editor }: ContextMenuProps) {
    const [showColorSubmenu, setShowColorSubmenu] = useState(false)
    const [showHighlightSubmenu, setShowHighlightSubmenu] = useState(false)
    const [showRemoveSubmenu, setShowRemoveSubmenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Calculate adjusted position to keep menu inside viewport
    const getAdjustedPosition = () => {
        const menuWidth = 200 // Approximate menu width
        const menuHeight = 400 // Approximate menu height
        const submenuWidth = 120 // Approximate submenu width

        let adjustedX = x
        let adjustedY = y

        // Check if menu would overflow right edge
        if (x + menuWidth + submenuWidth > window.innerWidth) {
            adjustedX = window.innerWidth - menuWidth - submenuWidth - 10
        }

        // Check if menu would overflow bottom edge
        if (y + menuHeight > window.innerHeight) {
            adjustedY = window.innerHeight - menuHeight - 10
        }

        // Ensure menu doesn't go off the left or top
        adjustedX = Math.max(10, adjustedX)
        adjustedY = Math.max(10, adjustedY)

        return { x: adjustedX, y: adjustedY }
    }

    const position = getAdjustedPosition()

    // Calculate submenu position to ensure it stays inside viewport
    const getSubmenuPosition = (submenuWidth: number, submenuHeight: number = 100) => {
        const menuWidth = 200
        const rightEdge = position.x + menuWidth
        const bottomEdge = position.y + submenuHeight

        // Check if submenu would overflow right edge
        const wouldOverflowRight = rightEdge + submenuWidth > window.innerWidth
        // Check if submenu would overflow bottom edge
        const wouldOverflowBottom = bottomEdge > window.innerHeight

        let submenuStyle: React.CSSProperties = {}

        if (wouldOverflowRight) {
            // Position submenu to the left of the main menu
            submenuStyle = {
                left: 'auto',
                right: '100%',
                marginLeft: '0',
                marginRight: '4px'
            }
        } else {
            // Position submenu to the right of the main menu
            submenuStyle = {
                left: '100%',
                right: 'auto',
                marginLeft: '4px',
                marginRight: '0'
            }
        }

        // Adjust vertical position if submenu would overflow bottom
        if (wouldOverflowBottom) {
            submenuStyle.top = 'auto'
            submenuStyle.bottom = '0'
        }

        return submenuStyle
    }

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

    const setLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        if (url === null) return
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
        onClose()
    }, [editor, onClose])

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
                    variant={editor.isActive("bold") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleBold().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Bold className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("italic") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleItalic().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Italic className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("underline") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleUnderline().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("strike") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleStrike().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("code") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleCode().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Code className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("highlight") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleHighlight().run()
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
                    variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setTextAlign("left").run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setTextAlign("center").run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setTextAlign("right").run()
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
                    variant={editor.isActive("link") ? "default" : "ghost"}
                    size="sm"
                    onClick={setLink}
                    className="h-8 w-8 p-0"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().unsetLink().run()
                        onClose()
                    }}
                    disabled={!editor.isActive("link")}
                    className="h-8 w-8 p-0"
                >
                    <Unlink className="h-4 w-4" />
                </Button>
            </div>

            <Separator className="my-1" />

            {/* Lists and Quotes */}
            <div className="flex items-center gap-1 p-1">
                <Button
                    variant={editor.isActive("bulletList") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleBulletList().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <List className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("orderedList") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleOrderedList().run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("blockquote") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleBlockquote().run()
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
                    variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                        onClose()
                    }}
                    className="h-8 w-8 p-0"
                >
                    <Heading3 className="h-4 w-4" />
                </Button>

                <Button
                    variant={editor.isActive("paragraph") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setParagraph().run()
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
                    variant={editor.isActive("textStyle", { fontSize: "8pt" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setMark("textStyle", { fontSize: "8pt" }).run()
                        onClose()
                    }}
                    className="h-8 px-2 text-xs"
                >
                    8pt
                </Button>

                <Button
                    variant={editor.isActive("textStyle", { fontSize: "26pt" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setMark("textStyle", { fontSize: "26pt" }).run()
                        onClose()
                    }}
                    className="h-8 px-2 text-sm"
                >
                    26pt
                </Button>

                <Button
                    variant={editor.isActive("textStyle", { fontSize: "90pt" }) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                        editor.chain().focus().setMark("textStyle", { fontSize: "90pt" }).run()
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
                            style={getSubmenuPosition(120)}
                        >
                            <div className="grid grid-cols-4 gap-1">
                                {textColors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run()
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
                            style={getSubmenuPosition(120)}
                        >
                            <div className="grid grid-cols-4 gap-1">
                                {highlightColors.map((color) => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().toggleHighlight({ color }).run()
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
                        editor.chain().focus().setHorizontalRule().run()
                        onClose()
                    }}
                >
                    <Minus className="mr-2 h-4 w-4" />
                    Insert Horizontal Rule
                </button>

                <button
                    className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent rounded-sm"
                    onClick={() => {
                        editor.chain().focus().clearNodes().unsetAllMarks().run()
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
                            style={getSubmenuPosition(160)}
                        >
                            <button
                                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                                onClick={() => {
                                    editor.chain().focus().unsetColor().run()
                                    onClose()
                                }}
                            >
                                Remove Text Color
                            </button>
                            <button
                                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                                onClick={() => {
                                    editor.chain().focus().unsetHighlight().run()
                                    onClose()
                                }}
                            >
                                Remove Highlight
                            </button>
                            <button
                                className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-accent"
                                onClick={() => {
                                    editor.chain().focus().unsetColor().unsetHighlight().run()
                                    onClose()
                                }}
                            >
                                Remove All Colors
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContextMenu;