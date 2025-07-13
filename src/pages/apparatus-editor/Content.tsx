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
  ContextBubbleSubmenuItem
} from '@/components/texteditor/context-bubble'
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
  StickyNote
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { testContent3 } from './data'
import { useEditor } from './context'
import { Button } from '@/components/ui/button'

export interface ContentRef {
  setBold: () => void
  setItalic: () => void
  setUnderline: () => void
  setStrike: () => void
  setImage: () => void
  setComment: () => void
  setBookmark: () => void
  setHorizontalRule: () => void
}

type ContentProps = {
  placeholder: string
}

const Content = forwardRef<ContentRef, ContentProps>(({ placeholder }, ref) => {
  useImperativeHandle(ref, () => ({
    setBold: () => {
      editorRef.current?.editor?.chain().focus().toggleBold().run()
    },
    setItalic: () => {
      editorRef.current?.editor?.chain().focus().toggleItalic().run()
    },
    setUnderline: () => {

    },
    setStrike: () => {
      editorRef.current?.editor?.chain().focus().toggleStrike().run()
    },
    setImage: () => {

    },
    setComment: () => {
      const editor = editorRef.current?.editor
      if (!editor) return
      const { from, to } = editor.state.selection

      if (from === to) {
        alert('Please select some text to add a comment')
        return
      }

      // editor.commands.setComment({
      //   comment: 'this is a text',
      //   author: 'John Doe',
      //   commentId: new Date().toISOString()
      // })
    },
    setBookmark: () => {
      const editor = editorRef.current?.editor
      if (!editor) return
      editor.commands.setBookmark({
        bookmark: 'this is a bookmark',
        author: 'John Doe',
        date: new Date().toISOString(),
        color: 'blue'
      })
    },
    setHorizontalRule: () => {
      const editor = editorRef.current?.editor
      if (!editor) return
      editor.commands.setHorizontalRule()
    }
  }))

  const {
    state,
    setContextBubble,
    setSelectionRect,
    setBold,
    setItalic,
    setUnderline,
    setStrike,
    setCode,
    setHighlight,
    setTextAlign,
    setLink,
    setBulletList,
    setOrderedList,
    setBlockquote,
    setHeadingLevel
  } = useEditor()
  const {
    contextBubble,
    selectionRect,
    isBold,
    isItalic,
    isStrike,
    isCode,
    headingLevel
  } = state

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    const selection = window.getSelection()

    console.log('selection', selection)
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
        editor.isActive({ textAlign: 'left' })
          ? 'left'
          : editor.isActive({ textAlign: 'center' })
            ? 'center'
            : editor.isActive({ textAlign: 'right' })
              ? 'right'
              : editor.isActive({ textAlign: 'justify' })
                ? 'justify'
                : 'left'
      )
      setLink(editor.isActive('link'))
      setBulletList(editor.isActive('bulletList'))
      setOrderedList(editor.isActive('orderedList'))
      setBlockquote(editor.isActive('blockquote'))
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
  }, [
    setBold,
    setItalic,
    setUnderline,
    setStrike,
    setCode,
    setHighlight,
    setTextAlign,
    setLink,
    setBulletList,
    setOrderedList,
    setBlockquote,
    setHeadingLevel
  ])

  return (
    <>
      <div className="h-full w-full overflow-hidden relative">
        <div className="h-10 w-full absolute top-0 z-10 bg-gradient-to-t from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-background/30 dark:to-background/70" />
        <TextEditor
          ref={editorRef}
          placeholder={placeholder}
          className="h-full w-full"
          content={testContent3}
          onClick={handleContextMenu}
        />
        <div className="h-10 w-full absolute bottom-0 z-10 bg-gradient-to-b from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-background/30 dark:to-background/70" />
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
                variant={isBold ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleBold().run()
                }}
              >
                <Bold className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Italic"
                variant={isItalic ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleItalic().run()
                }}
              >
                <Italic className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Strikethrough"
                variant={isStrike ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleStrike().run()
                }}
              >
                <Strikethrough className="h-4 w-4" />
              </ContextBubbleButton>

              <ContextBubbleButton
                tooltip="Code"
                variant={isCode ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleCode().run()
                }}
              >
                <Code className="h-4 w-4" />
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={'my-1'}
            />
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Apparatus"
                variant={'default'}
                onClick={() => {
                  editorRef.current
                    ?.editor
                    ?.chain()
                    .focus()
                    .setApparatus({
                      id: '123',
                      type: 'CRITICAL'
                    })
                    .run()
                }}>
                <StickyNote className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Comment"
                variant={'default'}
                onClick={() => {
                  editorRef.current
                    ?.editor
                    ?.chain()
                    .focus()
                    .setComment({
                      threadId: crypto.randomUUID(),
                      status: 'open',
                      state: 'default'
                    }).run()
                }}>
                <MessageCircle className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Apparatus Note"
                variant={'default'}
                onClick={() => {
                  editorRef.current
                    ?.editor
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
              </ContextBubbleButton>
            </ContextBubbleGroup>
            <Separator
              data-slot="context-bubble-separator"
              data-context-bubble="separator"
              className={'my-1'}
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                editorRef.current?.editor?.chain().focus().setApparatus({
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
                editorRef.current
                  ?.editor
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
                editorRef.current
                  ?.editor
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
            <ContextBubbleGroup>
              <ContextBubbleButton
                tooltip="Heading 1"
                variant={headingLevel === 1 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 1 }).run()
                }}
              >
                <Heading1 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 2"
                variant={headingLevel === 2 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }}
              >
                <Heading2 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 3"
                variant={headingLevel === 3 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }}
              >
                <Heading3 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 4"
                variant={headingLevel === 4 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 4 }).run()
                }}
              >
                <Heading4 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 5"
                variant={headingLevel === 5 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 5 }).run()
                }}
              >
                <Heading5 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Heading 6"
                variant={headingLevel === 6 ? 'selected' : 'default'}
                onClick={() => {
                  editorRef.current?.editor?.chain().focus().toggleHeading({ level: 6 }).run()
                }}
              >
                <Heading6 className="h-4 w-4" />
              </ContextBubbleButton>
              <ContextBubbleButton
                tooltip="Paragraph"
                variant={headingLevel === 0 ? 'selected' : 'default'}
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
              className={'my-1'}
            />
            <ContextBubbleSubmenu>
              <ContextBubbleSubmenuTrigger submenu="custom-style">
                <div className="flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Custom
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
              <ContextBubbleSubmenuContent submenu="custom-style">
                <ContextBubbleSubmenuItem onClick={() => {
                  editorRef.current?.editor?.chain().focus().setComment({
                    threadId: '2c182121-d6c1-45a2-a151-60e0f2fd1d49',
                    status: 'open',
                    state: 'default'
                  }).run()
                }}>Set comment</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem
                  onClick={() => {
                    editorRef.current?.editor
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
                </ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem onClick={() => {
                  editorRef.current?.editor
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
                }}>Style two</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem
                  onClick={() => {
                    // const editor = editorRef.current?.editor
                    // if (!editor) return
                    // const { from, to } = editor.state.selection;
                    // if (from === to) return

                    // const fragment = editor.state.selection.content();
                    // const domSerializer = editor.schema.cached.domSerializer;
                    // const temp = document.createElement('div');
                    // const slice = fragment.content;
                    // domSerializer.serializeFragment(slice, { document }, temp);
                    // const selectedHtml = temp.innerHTML;

                    // console.log('Selected HTML:', selectedHtml)

                    // const innerHtml = selectedHtml

                    // writeClipboardItem(innerHtml, editor.getText())
                    //   .then(() => {
                    //   })
                    //   .catch((err) => {
                    //     console.error('Clipboard write failed:', err);
                    //   });

                  }}>
                  Copy selected text
                </ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem onClick={() => {
                  // readClipboardItems()
                  //   .then((items) => {
                  //     const editor = editorRef.current?.editor
                  //     if (!editor) return

                  //     items.forEach(async (item) => {
                  //       if (item.types.includes('text/html')) {
                  //         const blob = await item.getType('text/html');
                  //         const html = await blob.text();
                  //         console.log('HTML pasted:', html)
                  //         editor.commands.insertContent(html)
                  //         editor.commands.focus()
                  //       } else if (item.types.includes('text/plain')) {
                  //         // const blob = await item.getType('text/plain');
                  //         // const text = await blob.text();
                  //         // editor.commands.insertContent(text)
                  //         // editor.commands.focus()
                  //       }
                  //     })
                  //   })
                }}>Paste copied text</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem
                  onClick={() => {
                    editorRef.current?.editor?.commands.setApparatus()
                  }}>
                  Set apparatus
                </ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem
                  onClick={() => {
                    editorRef.current?.editor?.commands.setNote({
                      note: 'This is a note',
                      author: 'John Doe',
                      noteId: '123'
                    })
                  }}>
                  Set page notes
                </ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem
                  onClick={() => {
                    editorRef.current?.editor?.commands.setSection()
                  }}>
                  Set section
                </ContextBubbleSubmenuItem>
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu>
            <ContextBubbleSubmenu>
              <ContextBubbleSubmenuTrigger submenu="bookmarks">
                <div className="flex items-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Add a bookmark
                </div>
                <ChevronRight className="h-4 w-4" />
              </ContextBubbleSubmenuTrigger>
              <ContextBubbleSubmenuContent submenu="bookmarks">
                <ContextBubbleSubmenuItem onClick={() => {
                  console.log('clicked bookmark')
                }}>Category 1</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 2</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 3</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 4</ContextBubbleSubmenuItem>
                <ContextBubbleSubmenuItem>Category 5</ContextBubbleSubmenuItem>
              </ContextBubbleSubmenuContent>
            </ContextBubbleSubmenu> 
          </ContextBubble>
        </ContextBubbleProvider>
      )}
    </>
  )
})

export default Content