import { useRef, useState } from 'react'
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
              <ContextBubbleButton
                tooltip="Justify"
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
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBulletList().run()
                }}
              >
                <List className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Numbered List"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleOrderedList().run()
                }}
              >
                <ListOrdered className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Quote"
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
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }}
              >
                <Heading1 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 2"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }}
              >
                <Heading2 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 3"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }}
              >
                <Heading3 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 4"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 4 }).run()
                }}
              >
                <Heading4 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 5"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 5 }).run()
                }}
              >
                <Heading5 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 6"
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 6 }).run()
                }}
              >
                <Heading6 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Paragraph"
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
