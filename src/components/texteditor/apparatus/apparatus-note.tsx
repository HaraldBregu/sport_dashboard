import { mergeAttributes, Node, Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

interface NoteMentionAttributes {
  note?: string
  author?: string
  noteId?: string
  highlightColor?: string
  content?: string
}

const DEFAULT_HIGHLIGHT_COLOR = '#FFEB3B';
const NOTE_END_MARKER = '⌘';

interface NoteMentionItem {
  id: string
  label: string
  description?: string
}

const defaultNoteMentions: NoteMentionItem[] = [
  { id: '1', label: 'Important', description: 'Mark as important' },
  { id: '2', label: 'Todo', description: 'Add to todo list' },
  { id: '3', label: 'Question', description: 'Mark as a question' },
  { id: '4', label: 'Idea', description: 'Capture an idea' },
]

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    noteMention: {
      /**
       * Add a note mention
       */
      setNoteMention: (attributes?: { note?: string; author?: string; noteId?: string; highlightColor?: string; content?: string }) => ReturnType,
      /**
       * Remove a note mention
       */
      unsetNoteMention: () => ReturnType,
      /**
       * Toggle a note mention
       */
      toggleNoteMention: (attributes?: { note?: string; author?: string; noteId?: string; highlightColor?: string; content?: string }) => ReturnType
    }
  }
}

export interface NoteMentionOptions {
  HTMLAttributes: Record<string, unknown>
  suggestion: {
    char: string
    items: ({ id: string; label: string; description?: string })[]
    render: () => SuggestionRenderer
  }
}

interface SuggestionProps {
  items: NoteMentionItem[]
  command: (item: NoteMentionItem) => void
  selectedIndex: number
  clientRect: () => DOMRect
}

interface SuggestionComponent {
  props: SuggestionProps
  render: () => HTMLElement
}

const NoteMentionSuggestion = {
  items: ({ query }: { query: string }) => {
    return defaultNoteMentions
      .filter(item => 
        item.label.toLowerCase().startsWith(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
  },

  render: () => {
    let component: SuggestionComponent
    let popup: TippyInstance | undefined

    return {
      onStart: (props: SuggestionProps) => {
        component = {
          props,
          render() {
            const items = props.items
            
            const content = document.createElement('div')
            content.className = 'note-mention-suggestions'
            
            if (items.length) {
              items.forEach((item, index) => {
                const button = document.createElement('button')
                button.className = `note-mention-item ${index === props.selectedIndex ? 'selected' : ''}`
                button.onclick = () => props.command(item)
                
                const label = document.createElement('span')
                label.className = 'label'
                label.textContent = `${item.label}]`
                button.appendChild(label)
                
                if (item.description) {
                  const description = document.createElement('span')
                  description.className = 'description'
                  description.textContent = item.description
                  button.appendChild(description)
                }
                
                content.appendChild(button)
              })
            } else {
              const noResults = document.createElement('div')
              noResults.className = 'no-results'
              noResults.textContent = 'No note mentions found'
              content.appendChild(noResults)
            }

            return content
          },
        }

        const element = document.querySelector('body')
        if (!element) return

        const instances = tippy(element, {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.render(),
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
        
        popup = Array.isArray(instances) ? instances[0] : instances
      },

      onUpdate(props: SuggestionProps) {
        component.props = props
        
        if (popup) {
          popup.setContent(component.render())
        }
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          if (popup) {
            popup.hide()
          }
          return true
        }

        return false
      },

      onExit() {
        if (popup) {
          popup.destroy()
        }
      },
    }
  },
}

export const ApparatusNoteNode = Node.create<NoteMentionOptions>({
  name: 'apparatusNote',

  // Add to inline group and make it inline
  group: 'inline',
  inline: true,

  // Make it atomic (not editable internally)
  // atom: true,

  // Explicitly disable dragging
  draggable: false,

  // Define allowed attributes
  addAttributes() {
    return {
      id: {
        default: null,
      },
      label: {
        default: null,
      },
      description: {
        default: null,
      },
      content: {
        default: null,
      },
      note: {
        default: null,
      },
      author: {
        default: null,
      },
      noteId: {
        default: null,
      },
      highlightColor: {
        default: DEFAULT_HIGHLIGHT_COLOR,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="note-mention"]',
        getAttrs: element => {
          if (typeof element === 'string') {
            return false;
          }

          return {
            id: element.getAttribute('data-note-mention-id'),
            label: element.getAttribute('data-note-mention-label'),
            description: element.getAttribute('data-note-mention-description'),
            content: element.getAttribute('data-note-mention-content'),
            note: element.getAttribute('data-note-mention-note'),
            author: element.getAttribute('data-note-mention-author'),
            noteId: element.getAttribute('data-note-mention-noteId'),
            highlightColor: element.getAttribute('data-note-mention-highlightColor') || DEFAULT_HIGHLIGHT_COLOR,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const label = HTMLAttributes.label || '';
    const content = HTMLAttributes.content || '';
    const highlightColor = HTMLAttributes.highlightColor || DEFAULT_HIGHLIGHT_COLOR;
    return ['apparatus-note', mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { 
        'data-type': 'note-mention',
        'data-note-mention-id': HTMLAttributes.id,
        'data-note-mention-label': HTMLAttributes.label,
        'data-note-mention-description': HTMLAttributes.description,
        'data-note-mention-content': HTMLAttributes.content,
        'data-note-mention-note': HTMLAttributes.note,
        'data-note-mention-author': HTMLAttributes.author,
        'data-note-mention-noteId': HTMLAttributes.noteId,
        'data-note-mention-highlightColor': HTMLAttributes.highlightColor,
        class: 'inline-note-mention',
        style: 'user-select: none;'
      }
    ), ['span', { class: 'note-mention-label' }, `${label}`], ['span', { 
      class: 'note-mention-content',
      style: `background-color: ${highlightColor}; padding: 2px 4px; border-radius: 2px;`
    }, `${content}${NOTE_END_MARKER}`]];
  },

  addCommands() {
    return {
      setNoteMention:
        (attributes?: NoteMentionAttributes) => ({ chain, state }) => {
          const { from, to } = state.selection;
          const selectedText = state.doc.textBetween(from, to);
          
          return chain()
            .insertContentAt(from, {
              type: this.name,
              attrs: {
                ...attributes,
                content: selectedText || '',
                note: attributes?.note || '',
                noteId: attributes?.noteId || '',
                author: attributes?.author || '',
                highlightColor: attributes?.highlightColor || DEFAULT_HIGHLIGHT_COLOR
              }
            })
            .deleteRange({ from: from + 1, to: to + 1 })
            .run();
        },
      unsetNoteMention:
        () => ({ commands }) => {
          return commands.deleteSelection()
        },
      toggleNoteMention:
        (attributes?: NoteMentionAttributes) => ({ commands }) => {
          return commands.toggleNode(this.name, this.name, attributes || {
            note: '',
            noteId: '',
            author: '',
            highlightColor: DEFAULT_HIGHLIGHT_COLOR
          })
        },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...NoteMentionSuggestion,
      }),
      new Plugin({
        key: new PluginKey('apparatus-note-tooltip'),
        view: () => {
          let tooltips: TippyInstance[] = []

          return {
            update: (view) => {
              // Clean up existing tooltips
              tooltips.forEach(t => t.destroy())
              tooltips = []

              // Find all apparatus notes in the document
              const notes = view.dom.querySelectorAll('apparatus-note')

              // Create tooltips for each note
              notes.forEach(note => {
                const label = note.getAttribute('data-note-mention-label')
                const description = note.getAttribute('data-note-mention-description')
                const content = note.getAttribute('data-note-mention-content')

                const tooltip = tippy(note, {
                  content: `
                    <div class="apparatus-note-tooltip">
                      <strong>${label || ''}</strong>
                      ${description ? `<p>${description}</p>` : ''}
                      ${content ? `<p>Content: ${content}</p>` : ''}
                    </div>
                  `,
                  allowHTML: true,
                  placement: 'top',
                  arrow: true,
                  theme: 'light',
                  delay: [200, 0], // Show after 200ms, hide immediately
                })

                tooltips.push(tooltip)
              })
            },

            destroy: () => {
              tooltips.forEach(t => t.destroy())
            }
          }
        }
      })
    ]
  },
})

interface SuggestionOptions {
  editor: Editor
  char?: string
  items: (props: { query: string }) => NoteMentionItem[]
  render: () => SuggestionRenderer
}

interface SuggestionRenderer {
  onStart: (props: SuggestionProps) => void
  onUpdate: (props: SuggestionProps) => void
  onKeyDown: (props: { event: KeyboardEvent }) => boolean
  onExit: () => void
}

// Suggestion plugin
function Suggestion({
  editor,
  char = '@',
  items,
  render,
}: SuggestionOptions) {
  const pluginKey = new PluginKey('note-mention-suggestion')

  return new Plugin({
    key: pluginKey,

    view() {
      const renderer = render()

      return {
        update(view: EditorView, prevState) {
          const prev = pluginKey.getState(prevState)
          const next = pluginKey.getState(view.state)

          if (prev !== next) {
            if (next) {
              renderer.onStart(next)
            } else {
              renderer.onExit()
            }
          } else if (next) {
            renderer.onUpdate(next)
          }
        },

        destroy() {
          renderer.onExit()
        },
      }
    },

    state: {
      init() {
        return null
      },

      apply(tr) {
        const { selection } = tr;
        const { $from, from, to } = selection;
        const textBefore = $from.doc.textBetween(Math.max(0, from - 50), from, '\n', '\0');

        if (
          !textBefore.endsWith(char) ||
          tr.getMeta('note-mention-suggestion') ||
          tr.docChanged ||
          !editor.isEditable
        ) {
          return null;
        }

        const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;

        return {
          items: items({ query: '' }),
          clientRect: () => editor.view.coordsAtPos(from),
          selectedIndex: 0,
          decorationId,
          command: (item: NoteMentionItem) => {
            const selectedText = editor.state.doc.textBetween(from - char.length, to);
            editor
              .chain()
              .focus()
              .deleteRange({ from: from - char.length, to })
              .setNoteMention({
                note: item.label,
                noteId: item.id,
                author: item.description || '',
                highlightColor: DEFAULT_HIGHLIGHT_COLOR,
                content: selectedText || ''
              })
              .run();
          },
        };
      },
    },

    props: {
      handleKeyDown(view, event) {
        const state = pluginKey.getState(view.state)

        if (!state) {
          return false
        }

        if (event.key === 'ArrowUp') {
          const selectedIndex = (state.selectedIndex + state.items.length - 1) % state.items.length
          const newState = { ...state, selectedIndex }
          view.dispatch(view.state.tr.setMeta(pluginKey, newState))
          return true
        }

        if (event.key === 'ArrowDown') {
          const selectedIndex = (state.selectedIndex + 1) % state.items.length
          const newState = { ...state, selectedIndex }
          view.dispatch(view.state.tr.setMeta(pluginKey, newState))
          return true
        }

        if (event.key === 'Enter') {
          const item = state.items[state.selectedIndex]
          if (item) {
            state.command(item)
            return true
          }
        }

        return false
      },

      decorations(state) {
        const pluginState = pluginKey.getState(state)

        if (!pluginState) {
          return null
        }

        return DecorationSet.create(state.doc, [
          Decoration.inline(state.selection.from - 1, state.selection.from, {
            nodeName: 'span',
            class: 'note-mention-trigger',
          }),
        ])
      },
    },
  })
}

export default ApparatusNoteNode
