import React, { useEffect, forwardRef, useImperativeHandle, useState, useRef } from 'react'
import { useEditor, EditorContent, Editor, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'
import { Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Type } from 'lucide-react'
import { LemmaNode } from './apparatus/lemma'
import Apparatus from './apparatus/apparatus'
import SiglaNode from './apparatus/sigla'
import { AppButton } from '@/components/app/app-button'

export interface TextEditorRef {
  editor: Editor | null
  getHTML: () => string
  getText: () => string
  setContent: (content: string) => void
  clear: () => void
  focus: () => void
  blur: () => void
  isEditable: () => boolean
  setEditable: (editable: boolean) => void
}

export interface TextEditorProps {
  content?: unknown
  placeholder?: string
  onChange?: (content: string) => void
  onClick?: (event: MouseEvent) => void
  onContextMenu?: (event: React.MouseEvent) => void
  editable?: boolean
  className?: string
  style?: React.CSSProperties
}

export const TextEditorWithMenu = forwardRef<TextEditorRef, TextEditorProps>(
  (
    {
      content,
      placeholder = 'Start writing...',
      onChange,
      onClick,
      onContextMenu,
      editable = true,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [showBubbleMenu, setShowBubbleMenu] = useState(true)
    const hideBubbleMenuRef = useRef<(() => void) | null>(null)

    // Create custom extension for handling ESC key
    const EscapeKeyExtension = Extension.create({
      name: 'escapeKey',
      
      addKeyboardShortcuts() {
        return {
          Escape: () => {
            const { state } = this.editor
            if (!state.selection.empty) {
              // Call the hide function from the ref
              if (hideBubbleMenuRef.current) {
                hideBubbleMenuRef.current()
              }
              return true // Prevent default ESC behavior
            }
            return false
          }
        }
      }
    })

    // Set up the ref callback for hiding bubble menu
    useEffect(() => {
      hideBubbleMenuRef.current = () => {
        setShowBubbleMenu(false)
      }
    }, [])

    const editor = useEditor({
      shouldRerenderOnTransaction: false,
      extensions: [
        StarterKit.configure({}),
        Placeholder.configure({
          placeholder
        }),
        EscapeKeyExtension,
        Apparatus,
        LemmaNode,
        SiglaNode,
      ],
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 h-full'
        },
        handleDOMEvents: {
          contextmenu: (view, event) => {
            event.preventDefault()
            const { selection } = view.state
            if (selection.empty) return false

            console.log('contextmenu dom', event)

            // Hide bubble menu on right-click
            setShowBubbleMenu(false)

            onClick?.(event)
            return true
          },
          mousedown: () => {
            // Show bubble menu again on normal clicks
            setShowBubbleMenu(true)
            return false
          }
        },
      },
      content: content || '',
      editable,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        console.log(JSON.stringify(html))
        onChange?.(html)

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
        } catch (error) {
          void error
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
        } catch (error) {
          void error
        }

        console.log('selection', selection)
      }
    })

    if (!editor) {
      throw new Error('Editor not initialized')
    }

    useImperativeHandle(
      ref,
      () => ({
        editor,
        getHTML: () => editor.getHTML() || '',
        getText: () => editor.getText() || '',
        setContent: (content: string) => editor.commands.setContent(content),
        clear: () => editor.commands.clearContent(),
        focus: () => editor.commands.focus(),
        blur: () => editor.commands.blur(),
        isEditable: () => editor.isEditable || false,
        setEditable: (editable: boolean) => editor.setEditable(editable)
      }),
      [editor]
    )

    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content || '')
      }
    }, [content, editor])

    useEffect(() => {
      editor.setEditable(editable)
    }, [editable, editor])

    useEffect(() => {
      if (!editor) return
      try {
        const html = editor.getHTML()
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
        console.log('A4 content size (initial)', { width: rect.width, height: rect.height })
        document.body.removeChild(container)
      } catch (error) {
        void error
      }
    }, [editor])

    useEffect(() => {
      if (!editor) {
        return
      }

      const view = editor.view

      const measureSliceAndNodes = () => {
        try {
          const documentSize = editor.state.doc.content.size
          const from = 0
          const to = Math.min(4000, documentSize)

          const startDomPos = view.domAtPos(from)
          const endDomPos = view.domAtPos(to)
          const range = document.createRange()
          range.setStart(startDomPos.node, startDomPos.offset)
          range.setEnd(endDomPos.node, endDomPos.offset)
          const rect = range.getBoundingClientRect()
          console.log(`slice rect [${from}..${to}]`, { width: rect.width, height: rect.height })

          editor.state.doc.nodesBetween(from, to, (node, pos) => {
            const domNode = view.nodeDOM(pos)
            if (domNode instanceof Element) {
              const nodeRect = domNode.getBoundingClientRect()
              console.log('node rect', {
                pos,
                type: node.type.name,
                width: nodeRect.width,
                height: nodeRect.height
              })
            }
          })
        } catch (error) {
          void error
        }
      }

      measureSliceAndNodes()
      editor.on('update', measureSliceAndNodes)
      return () => {
        editor.off('update', measureSliceAndNodes)
      }
    }, [editor])

    return (
      <>
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'top' }}
          className="flex items-center gap-0.5 bg-white dark:bg-gray-800 border border-border rounded-lg shadow-lg p-1.5"
          shouldShow={({ state }) => {
            // Don't show if explicitly hidden (e.g., on right-click)
            if (!showBubbleMenu) return false
            
            // Show default behavior: only show when there's a selection
            const { selection } = state
            const { empty } = selection
            
            // Don't show if selection is empty
            if (empty) return false
            
            return true
          }}
        >
          <AppButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="icon"
            title="Bold"
          >
            <Bold />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="icon"
            title="Italic"
          >
            <Italic />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="icon"
            title="Strikethrough"
          >
            <Strikethrough />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="icon"
            title="Code"
          >
            <Code />
          </AppButton>
          <div className="w-px h-6 bg-border mx-1" />
          <AppButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="icon"
            title="Heading 1"
          >
            <Heading1 />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="icon"
            title="Heading 2"
          >
            <Heading2 />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
            size="icon"
            title="Heading 3"
          >
            <Heading3 />
          </AppButton>
          <AppButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            variant={editor.isActive('paragraph') ? 'default' : 'ghost'}
            size="icon"
            title="Paragraph"
          >
            <Type />
          </AppButton>
        </BubbleMenu>
        <EditorContent
          editor={editor}
          className={`prose prose-sm max-w-none focus:outline-none h-full ${className}`}
          style={style}
          onContextMenu={(event) => {
            onContextMenu?.(event)
          }}
          {...props}
        />
      </>
    )
  }
)

TextEditorWithMenu.displayName = 'TextEditorWithMenu'

export default TextEditorWithMenu
