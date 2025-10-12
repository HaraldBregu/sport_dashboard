import { EditorBubbleMenu, EditorBubbleMenuRef } from '../app/editor-bubble-menu'
import { Button } from '../ui/button'
import { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { LemmaNode } from './apparatus/lemma'
import Apparatus from './apparatus/apparatus'
import SiglaNode from './apparatus/sigla'
import {
  EditorContextMenu,
  EditorContextMenuSubmenuTrigger,
  EditorContextMenuGroup,
  EditorContextMenuButton,
  EditorContextMenuSubmenu,
  EditorContextMenuSubmenuContent,
  EditorContextMenuSubmenuItem
} from '../app/editor-context-menu'
import {
  Bold,
  ChevronRight,
  Code,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Bookmark,
  MessageCircle,
  Heading4,
  Heading5,
  Heading6,
  StickyNote,
  MoreHorizontal
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { AppPopup, AppPopupRef } from '../app/app-popup'
import { AppNavigatableListItem } from '../app/app-navigatable-list'


export interface TextEditorRef {
  getHTML: () => string
  getText: () => string
  setContent: (content: string) => void
  focus: () => void
  setEditable: (editable: boolean) => void
}

export interface TextEditorWithBubbleMenuProps {
  content?: unknown
  placeholder?: string
  onChange?: (content: string) => void
  editable?: boolean
  className?: string
}

export const TextEditorWithBubbleMenu = forwardRef<TextEditorRef, TextEditorWithBubbleMenuProps>(
  ({
    content,
    placeholder = 'Start writing...',
    onChange,
    editable = true,
    ...props
  }, ref) => {

    // Refs for controlling components
    const bubbleMenuRef = useRef<EditorBubbleMenuRef>(null)
    const popupRef = useRef<AppPopupRef>(null)

    // Editor state tracking
    const [isBold, setIsBold] = useState(false)
    const [isItalic, setIsItalic] = useState(false)
    const [isStrike, setIsStrike] = useState(false)
    const [isCode, setIsCode] = useState(false)
    const [headingLevel, setHeadingLevel] = useState(0)

    // Comment type options for the popup
    const annotationTypes: AppNavigatableListItem[] = [
      {
        id: 'comment-general',
        label: 'General Comment',
        description: 'Add a general comment or note',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'comment-question',
        label: 'Question',
        description: 'Ask a question about this text',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'comment-suggestion',
        label: 'Suggestion',
        description: 'Suggest an improvement or change',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'comment-issue',
        label: 'Issue',
        description: 'Report a problem or error',
        icon: <MessageCircle className="w-4 h-4" />,
      },
      {
        id: 'bookmark',
        label: 'Bookmark',
        description: 'Add a bookmark to this location',
        icon: <Bookmark className="w-4 h-4" />,
      },
      {
        id: 'note',
        label: 'Apparatus Note',
        description: 'Add a critical apparatus note',
        icon: <StickyNote className="w-4 h-4" />,
      },
      {
        id: 'highlight-yellow',
        label: 'Highlight (Yellow)',
        description: 'Highlight text in yellow',
        icon: <StickyNote className="w-4 h-4" />,
      },
      {
        id: 'highlight-green',
        label: 'Highlight (Green)',
        description: 'Highlight text in green',
        icon: <StickyNote className="w-4 h-4" />,
      },
      {
        id: 'highlight-blue',
        label: 'Highlight (Blue)',
        description: 'Highlight text in blue',
        icon: <StickyNote className="w-4 h-4" />,
      },
      {
        id: 'highlight-red',
        label: 'Highlight (Red)',
        description: 'Highlight text in red',
        icon: <StickyNote className="w-4 h-4" />,
      },
    ]

    const editor = useEditor({
      shouldRerenderOnTransaction: false,
      extensions: [
        StarterKit.configure({

        }),
        Placeholder.configure({
          placeholder
        }),
        Apparatus,
        LemmaNode,
        SiglaNode,
      ],
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 h-full'
        }
      },
      content: content || '',
      editable,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        // const json = editor.getJSON()
        console.log(JSON.stringify(html))
        onChange?.(html)

        // Measure content size when constrained to A4 width (210mm)
        try {
          const container = document.createElement('div')
          container.style.position = 'fixed'
          container.style.visibility = 'hidden'
          container.style.left = '-10000px'
          container.style.top = '0'
          container.style.width = '210mm'
          container.style.boxSizing = 'border-box'
          container.className = 'prose prose-sm max-w-none'
          container.innerHTML = html
          document.body.appendChild(container)
          const rect = container.getBoundingClientRect()
          console.log('A4 content size', { width: rect.width, height: rect.height })
          document.body.removeChild(container)
        } catch {
          // no-op
        }
      },
      onSelectionUpdate: ({ editor }) => {
        const { selection } = editor.state
        if (selection.empty) {
          return
        }

        try {
          const selectionApi = window.getSelection()
          if (selectionApi && selectionApi.rangeCount > 0) {
            const range = selectionApi.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            if (rect) {
              console.log('selection rect', { width: rect.width, height: rect.height })
            }
          }
        } catch {
          // no-op
        }

        console.log('selection', selection)
      }
    })

    if (!editor) {
      throw new Error('Editor not initialized')
    }

    useImperativeHandle(ref, () => ({
      getHTML: () => editor.getHTML() || '',
      getText: () => editor.getText() || '',
      setContent: (content: string) => editor.commands.setContent(content),
      focus: () => editor.commands.focus(),
      setEditable: (editable: boolean) => editor.setEditable(editable)
    }))

    useEffect(() => {
      if (!editor) return

      const updateEditorState = () => {
        setIsBold(editor.isActive('bold'))
        setIsItalic(editor.isActive('italic'))
        setIsStrike(editor.isActive('strike'))
        setIsCode(editor.isActive('code'))
        setHeadingLevel(
          editor.isActive('heading', { level: 1 })
            ? 1
            : editor.isActive('heading', { level: 2 })
              ? 2
              : editor.isActive('heading', { level: 3 })
                ? 3
                : editor.isActive('heading', { level: 4 })
                  ? 4
                  : editor.isActive('heading', { level: 5 })
                    ? 5
                    : editor.isActive('heading', { level: 6 })
                      ? 6
                      : 0
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
    }, [editor])

    // Handler to show popup and hide bubble menu
    const handleShowPopup = () => {
      // Get current mouse position or selection position
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        // Position popup near the selection
        popupRef.current?.show(rect.left + rect.width / 2, rect.top)
      } else {
        // Fallback to default position
        popupRef.current?.show()
      }
      // Hide the bubble menu
      bubbleMenuRef.current?.hide()
    }

    return (
      <>
        <EditorContent
          editor={editor}
          className={`prose prose-sm max-w-none focus:outline-none h-full`}
          {...props}
        />

        <EditorContextMenu
          editor={editor}
          variant="floating"
        >
          <EditorContextMenuGroup>
            <EditorContextMenuButton
              tooltip="Bold"
              variant={isBold ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleBold().run()
              }}
            >
              <Bold className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Italic"
              variant={isItalic ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleItalic().run()
              }}
            >
              <Italic className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Strikethrough"
              variant={isStrike ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleStrike().run()
              }}
            >
              <Strikethrough className="h-4 w-4" />
            </EditorContextMenuButton>

            <EditorContextMenuButton
              tooltip="Code"
              variant={isCode ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleCode().run()
              }}
            >
              <Code className="h-4 w-4" />
            </EditorContextMenuButton>
          </EditorContextMenuGroup>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <EditorContextMenuGroup>
            <EditorContextMenuButton
              tooltip="Apparatus"
              variant={'default'}
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setApparatus({
                    id: '123',
                    type: 'CRITICAL'
                  })
                  .run()
              }}>
              <StickyNote className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Comment"
              variant={'default'}
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setComment({
                    threadId: crypto.randomUUID(),
                    status: 'open',
                    state: 'default'
                  }).run()
              }}>
              <MessageCircle className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Apparatus Note"
              variant={'default'}
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setNoteMention({
                    note: 'This is a note',
                    author: 'John Doe',
                    noteId: '123',
                    highlightColor: 'yellow'
                  }).run()
              }}>
              <StickyNote className="h-4 w-4" />
            </EditorContextMenuButton>
          </EditorContextMenuGroup>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              editor?.chain().focus().setApparatus({
                id: '123',
                type: 'CRITICAL'
              }).run()
            }}
          >
            Add apparatus
          </Button>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              editor
                ?.chain()
                .focus()
                .setNoteMention({
                  note: 'This is a note',
                  author: 'John Doe',
                  noteId: '123',
                  highlightColor: 'pink'
                }).run()
            }}
          >
            Add lemma
          </Button>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              editor
                ?.chain()
                .focus()
                .setSigla('[##]', '#FFD700').run()
            }}
          >
            Add sigla
          </Button>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <EditorContextMenuGroup>
            <EditorContextMenuButton
              tooltip="Heading 1"
              variant={headingLevel === 1 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }}
            >
              <Heading1 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Heading 2"
              variant={headingLevel === 2 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }}
            >
              <Heading2 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Heading 3"
              variant={headingLevel === 3 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }}
            >
              <Heading3 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Heading 4"
              variant={headingLevel === 4 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 4 }).run()
              }}
            >
              <Heading4 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Heading 5"
              variant={headingLevel === 5 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 5 }).run()
              }}
            >
              <Heading5 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Heading 6"
              variant={headingLevel === 6 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().toggleHeading({ level: 6 }).run()
              }}
            >
              <Heading6 className="h-4 w-4" />
            </EditorContextMenuButton>
            <EditorContextMenuButton
              tooltip="Paragraph"
              variant={headingLevel === 0 ? 'selected' : 'default'}
              onClick={() => {
                editor?.chain().focus().setParagraph().run()
              }}
            >
              <Type className="h-4 w-4" />
            </EditorContextMenuButton>
          </EditorContextMenuGroup>
          <Separator
            data-slot="context-bubble-separator"
            data-context-bubble="separator"
            className={'my-1'}
          />
          <EditorContextMenuSubmenu>
            <EditorContextMenuSubmenuTrigger submenu="custom-style">
              <div className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Custom
              </div>
              <ChevronRight className="h-4 w-4" />
            </EditorContextMenuSubmenuTrigger>
            <EditorContextMenuSubmenuContent submenu="custom-style">
              <EditorContextMenuSubmenuItem onClick={() => {
                editor?.chain().focus().setComment({
                  threadId: '2c182121-d6c1-45a2-a151-60e0f2fd1d49',
                  status: 'open',
                  state: 'default'
                }).run()
              }}>Set comment</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem
                onClick={() => {
                  editor
                    ?.chain()
                    .focus()
                    .setDataMark(
                      'BOOKMARK_SDJFHBSKGRBEH4356JHBLKJHGBFD1',
                      'bookmark', {
                      bold: true,
                      italic: true,
                      fontSize: '16px',
                      fontFamily: 'Arial',
                      color: 'red',
                      backgroundColor: 'blue',
                      textDecoration: 'underline',
                      textTransform: 'uppercase'
                    })
                    .run()
                }}>
                Style one
              </EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .setDataMark(
                    'COMMENT_SDJFHBSKGRBEH4356JHBLKJHGBFD1',
                    'comment', {
                    bold: true,
                    italic: true,
                    fontSize: '28px',
                    fontFamily: 'Times New Roman',
                    color: 'blue',
                    backgroundColor: 'red',
                    textDecoration: 'underline',
                    textTransform: 'uppercase'
                  })
                  .run()
              }}>Style two</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem
                onClick={() => {
                  // Copy selected text logic
                }}>
                Copy selected text
              </EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem onClick={() => {
                // Paste copied text logic
              }}>Paste copied text</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem
                onClick={() => {
                  editor?.commands.setApparatus()
                }}>
                Set apparatus
              </EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem
                onClick={() => {
                  editor?.commands.setNote({
                    note: 'This is a note',
                    author: 'John Doe',
                    noteId: '123'
                  })
                }}>
                Set page notes
              </EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem
                onClick={() => {
                  editor?.commands.setSection()
                }}>
                Set section
              </EditorContextMenuSubmenuItem>
            </EditorContextMenuSubmenuContent>
          </EditorContextMenuSubmenu>
          <EditorContextMenuSubmenu>
            <EditorContextMenuSubmenuTrigger submenu="bookmarks">
              <div className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Add a bookmark
              </div>
              <ChevronRight className="h-4 w-4" />
            </EditorContextMenuSubmenuTrigger>
            <EditorContextMenuSubmenuContent submenu="bookmarks">
              <EditorContextMenuSubmenuItem onClick={() => {
                console.log('clicked bookmark')
              }}>Category 1</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem>Category 2</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem>Category 3</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem>Category 4</EditorContextMenuSubmenuItem>
              <EditorContextMenuSubmenuItem>Category 5</EditorContextMenuSubmenuItem>
            </EditorContextMenuSubmenuContent>
          </EditorContextMenuSubmenu>
        </EditorContextMenu>

        <EditorBubbleMenu
          ref={bubbleMenuRef}
          editor={editor}
          placement="top"
          persistOnClick={true}
          className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1 flex gap-1"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <strong>B</strong>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <em>I</em>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            <s>S</s>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-gray-100 dark:bg-gray-700' : ''}
          >
            {'</>'}
          </Button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShowPopup}
            title="More options"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </EditorBubbleMenu>

        <AppPopup
          ref={popupRef}
          editor={editor}
          title="Select Annotation Type"
          width={420}
          height={450}
          modal={false}
          enableKeyboardShortcut={true}
          keyboardShortcut="d"
          items={annotationTypes}
          onItemSelect={(item) => {
            // Handle different annotation types
            switch (item.id) {
              case 'comment-general':
              case 'comment-question':
              case 'comment-suggestion':
              case 'comment-issue':
                editor?.chain().focus().setComment({
                  threadId: crypto.randomUUID(),
                  status: 'open',
                  state: 'default'
                }).run()
                break

              case 'bookmark':
                editor?.commands.setBookmark({
                  bookmark: 'Bookmark',
                  author: 'User',
                  date: new Date().toISOString(),
                  color: 'blue'
                })
                break

              case 'note':
                editor?.chain().focus().setNoteMention({
                  note: 'Apparatus note',
                  author: 'User',
                  noteId: crypto.randomUUID(),
                  highlightColor: 'yellow'
                }).run()
                break

              case 'highlight-yellow':
              case 'highlight-green':
              case 'highlight-blue':
              case 'highlight-red':
                editor?.chain().focus().setMark('highlight').run()
                break
            }
          }}
          searchPlaceholder="Search annotation types..."
          emptyMessage="No annotation types found"
        />
      </>
    )
  }
)

TextEditorWithBubbleMenu.displayName = 'TextEditorWithBubbleMenu'

export default TextEditorWithBubbleMenu
