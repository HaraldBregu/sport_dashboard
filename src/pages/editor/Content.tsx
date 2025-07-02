import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { testContent } from './data'
import React from 'react'
import { useEditor } from './context'

export interface ContentRef {
  setBold: () => void
}

type ContentProps = {
  placeholder: string
}

const Content = forwardRef<ContentRef, ContentProps>(({ 
  placeholder 
}, ref) => {

  useImperativeHandle(ref, () => ({
    setBold: () => {
      console.log("setBold from Content")
      editorRef.current?.editor?.chain().focus().toggleBold().run()
    }
  }))

  const { state, setContextBubble, setSelectionRect, setBold, setItalic, setUnderline, setStrike, setCode, setHighlight, setTextAlign, setLink, setBulletList, setOrderedList, setBlockquote, setHeadingLevel } = useEditor()
  const { contextBubble, selectionRect, isBold, isItalic, isUnderline, isStrike, isCode, isHighlight, textAlign, isLink, isBulletList, isOrderedList, isBlockquote, headingLevel } = state

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
      setBold(editor.isActive('bold'))
      setItalic(editor.isActive('italic'))
      setUnderline(editor.isActive('underline'))
      setStrike(editor.isActive('strike'))
      setCode(editor.isActive('code'))
      setHighlight(editor.isActive('highlight'))
      setTextAlign(
        editor.isActive({ textAlign: 'left' }) ? 'left' :
          editor.isActive({ textAlign: 'center' }) ? 'center' :
            editor.isActive({ textAlign: 'right' }) ? 'right' :
              editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left'
      )
      setLink(editor.isActive('link'))
      setBulletList(editor.isActive('bulletList'))
      setOrderedList(editor.isActive('orderedList'))
      setBlockquote(editor.isActive('blockquote'))
      setHeadingLevel(
        editor.isActive('heading', { level: 1 }) ? 1 :
          editor.isActive('heading', { level: 2 }) ? 2 :
            editor.isActive('heading', { level: 3 }) ? 3 :
              editor.isActive('heading', { level: 4 }) ? 4 :
                editor.isActive('heading', { level: 5 }) ? 5 :
                  editor.isActive('heading', { level: 6 }) ? 6 : 0
      )
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
  }, [setBold, setItalic, setUnderline, setStrike, setCode, setHighlight, setTextAlign, setLink, setBulletList, setOrderedList, setBlockquote, setHeadingLevel])

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={70} minSize={20}>
          <TextEditor
            ref={editorRef}
            placeholder={placeholder}
            className="h-full w-full"
            content={testContent}
            onContextMenu={handleContextMenu}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20}>
          <TextEditor
            placeholder={placeholder}
            className="h-full w-full"
            content={testContent}
            onContextMenu={handleContextMenu}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

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
                variant={isBold ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBold().run()
                }}
              >
                <Bold className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Italic"
                variant={isItalic ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleItalic().run()
                }}
              >
                <Italic className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Underline"
                variant={isUnderline ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleUnderline().run()
                }}
              >
                <UnderlineIcon className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Strikethrough"
                variant={isStrike ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleStrike().run()
                }}
              >
                <Strikethrough className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Code"
                variant={isCode ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleCode().run()
                }}
              >
                <Code className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Highlight"
                variant={isHighlight ? "selected" : "default"}
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
                variant={textAlign === "left" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("left").run()
                }}
              >
                <AlignLeft className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Align Center"
                variant={textAlign === "center" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("center").run()
                }}
              >
                <AlignCenter className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Align Right"
                variant={textAlign === "right" ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().setTextAlign("right").run()
                }}
              >
                <AlignRight className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Justify"
                variant={textAlign === "justify" ? "selected" : "default"}
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
                variant={isLink ? "selected" : "default"}
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
                variant={isLink ? "selected" : "default"}
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
                variant={isBulletList ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBulletList().run()
                }}
              >
                <List className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Numbered List"
                variant={isOrderedList ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleOrderedList().run()
                }}
              >
                <ListOrdered className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Quote"
                variant={isBlockquote ? "selected" : "default"}
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
                variant={headingLevel === 1 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }}
              >
                <Heading1 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 2"
                variant={headingLevel === 2 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }}
              >
                <Heading2 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 3"
                variant={headingLevel === 3 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }}
              >
                <Heading3 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 4"
                variant={headingLevel === 4 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 4 }).run()
                }}
              >
                <Heading4 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 5"
                variant={headingLevel === 5 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 5 }).run()
                }}
              >
                <Heading5 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 6"
                variant={headingLevel === 6 ? "selected" : "default"}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 6 }).run()
                }}
              >
                <Heading6 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Paragraph"
                variant={headingLevel === 0 ? "selected" : "default"}
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
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu>

          </ContextBubble>
        </ContextBubbleProvider>
      )}
    </>
  )
})

export default Content
