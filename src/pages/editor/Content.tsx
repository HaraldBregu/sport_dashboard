import { useRef, useState, useEffect } from 'react'
import TextEditor, { TextEditorRef } from '@/components/texteditor/text-editor'
import {
  ContextBubble,
  ContextBubbleProvider,
  ContextBubbleSubmenuTrigger,
  ContextBubbleGroup,
  ContextBubbleButton,
  ContextBubbleSubmenu,
  ContextBubbleSubmenuContent,
  ContextBubbleSubmenuItem,
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
  ListOrdered,
  Quote,
  Strikethrough,
  UnderlineIcon,
  Unlink,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Bookmark,
  MessageCircle,
  Sigma,
  AlignJustify,
  Heading4,
  Heading5,
  Heading6,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { testContent } from './data'
import React from 'react'

type ContentProps = {
  placeholder: string
}

const Content = ({ placeholder }: ContentProps) => {
  const [contextBubble, setContextBubble] = useState<{ x: number; y: number } | null>(null)
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)
  const [editorState, setEditorState] = useState({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrike: false,
    isCode: false,
    isHighlight: false,
    textAlign: 'left' as 'left' | 'center' | 'right' | 'justify',
    isLink: false,
    isBulletList: false,
    isOrderedList: false,
    isBlockquote: false,
    headingLevel: 0,
  })

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    const selection = window.getSelection()

    if (selection && !selection.isCollapsed) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setSelectionRect(rect)
      const initialX = rect.left + rect.width / 2
      const initialY = rect.top - 10
      setContextBubble({ x: initialX, y: initialY })
    } else if (selection) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      setSelectionRect(rect)
      const initialX = rect.left + rect.width / 2
      const initialY = rect.top - 10
      setContextBubble({ x: initialX, y: initialY })
    }
  }

  const editorRef = useRef<TextEditorRef>(null)

  // Track editor state changes
  useEffect(() => {
    const editor = editorRef.current?.editor
    if (!editor) return

    const updateEditorState = () => {
      setEditorState({
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isUnderline: editor.isActive('underline'),
        isStrike: editor.isActive('strike'),
        isCode: editor.isActive('code'),
        isHighlight: editor.isActive('highlight'),
        textAlign: editor.isActive({ textAlign: 'left' }) ? 'left' :
          editor.isActive({ textAlign: 'center' }) ? 'center' :
            editor.isActive({ textAlign: 'right' }) ? 'right' :
              editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left',
        isLink: editor.isActive('link'),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote: editor.isActive('blockquote'),
        headingLevel: editor.isActive('heading', { level: 1 }) ? 1 :
          editor.isActive('heading', { level: 2 }) ? 2 :
            editor.isActive('heading', { level: 3 }) ? 3 :
              editor.isActive('heading', { level: 4 }) ? 4 :
                editor.isActive('heading', { level: 5 }) ? 5 :
                  editor.isActive('heading', { level: 6 }) ? 6 : 0,
      })
    }

    // Update state on selection changes
    editor.on('selectionUpdate', updateEditorState)
    editor.on('update', updateEditorState)

    // Initial state
    updateEditorState()

    return () => {
      editor.off('selectionUpdate', updateEditorState)
      editor.off('update', updateEditorState)
    }
  }, [])

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="grid grid-cols-2 gap-4 h-full">
          <TextEditor
            ref={editorRef}
            placeholder={placeholder}
            className="h-full"
            content={testContent}
            onContextMenu={handleContextMenu}
          />
          <TextEditor
            placeholder={placeholder}
            className="h-full"
            content={testContent}
            onContextMenu={handleContextMenu}
          />
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
                variant={editorState.isBold ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBold().run()
                }}
              >
                <Bold className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Italic"
                variant={editorState.isItalic ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleItalic().run()
                }}
              >
                <Italic className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Underline"
                variant={editorState.isUnderline ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleUnderline().run()
                }}
              >
                <UnderlineIcon className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Strikethrough"
                variant={editorState.isStrike ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleStrike().run()
                }}
              >
                <Strikethrough className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Code"
                variant={editorState.isCode ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleCode().run()
                }}
              >
                <Code className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Highlight"
                variant={editorState.isHighlight ? "selected" : "default"}
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
                variant={editorState.textAlign === "left" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("left").run()
                }}
              >
                <AlignLeft className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Align Center"
                variant={editorState.textAlign === "center" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("center").run()
                }}
              >
                <AlignCenter className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Align Right"
                variant={editorState.textAlign === "right" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("right").run()
                }}
              >
                <AlignRight className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Justify"
                variant={editorState.textAlign === "justify" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("justify").run()
                }}
              >
                <AlignJustify className="h-4 w-4" />
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
                variant={editorState.isLink ? "selected" : "default"}
                onClick={() => {
                  const url = window.prompt('Enter URL:', 'https://')
                  if (!url) return
                  editorRef.current?.editor?.chain().focus().toggleLink({ href: url }).run()
                }}
              >
                <LinkIcon className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Remove Link"
                variant={editorState.isLink ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().unsetLink().run()
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
                variant={editorState.isBulletList ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBulletList().run()
                }}
              >
                <List className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Numbered List"
                variant={editorState.isOrderedList ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleOrderedList().run()
                }}
              >
                <ListOrdered className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Quote"
                variant={editorState.isBlockquote ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBlockquote().run()
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
                variant={editorState.headingLevel === 1 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }}
              >
                <Heading1 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 2"
                variant={editorState.headingLevel === 2 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }}
              >
                <Heading2 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 3"
                variant={editorState.headingLevel === 3 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }}
              >
                <Heading3 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 4"
                variant={editorState.headingLevel === 4 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 4 }).run()
                }}
              >
                <Heading4 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 5"
                variant={editorState.headingLevel === 5 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 5 }).run()
                }}
              >
                <Heading5 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 6"
                variant={editorState.headingLevel === 6 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 6 }).run()
                }}
              >
                <Heading6 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Paragraph"
                variant={editorState.headingLevel === 0 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setParagraph().run()
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
            <ContextBubbleSubmenu>
              <ContextBubbleSubmenuTrigger submenu="bookmarks">
                <div className="flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Add a bookmark
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
              <ContextBubbleSubmenuContent submenu="bookmarks">
                <ContextBubbleSubmenuItem>Category 1</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 2</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 3</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 4</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 5</ContextBubbleSubmenuItem>
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu>
            <ContextBubbleSubmenu>
              <ContextBubbleSubmenuTrigger submenu="comments">
                <div className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add a comment
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
              <ContextBubbleSubmenuContent submenu="comments">
                <ContextBubbleSubmenuItem>Category 1</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 2</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 3</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 4</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 5</ContextBubbleSubmenuItem>
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu>
            <ContextBubbleSubmenu>
              <ContextBubbleSubmenuTrigger submenu="sigla">
                <div className="flex items-center">
                  <Sigma className="mr-2 h-4 w-4" />
                  Add a siglum
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
              <ContextBubbleSubmenuContent submenu="sigla">
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>AL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>BG</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>DE</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>FR</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>IT</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>PL</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RO</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>RU</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>SK</ContextBubbleSubmenuItem>
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu>

          </ContextBubble>
        </ContextBubbleProvider>
      )}
    </>
  )
}

export default Content
