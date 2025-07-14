import { mergeAttributes, Node, Editor } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const DEFAULT_HIGHLIGHT_COLOR = '#FFEB3B'

interface SiglaItem {
    id: string
    text: string
    description?: string
    highlightColor?: string
}

interface SuggestionProps {
    items: SiglaItem[]
    command: (item: SiglaItem) => void
    selectedIndex: number
    clientRect: () => DOMRect
}

interface SuggestionComponent {
    props: SuggestionProps
    render: () => HTMLElement
}

interface SuggestionRenderer {
    onStart: (props: SuggestionProps) => void
    onUpdate: (props: SuggestionProps) => void
    onKeyDown: (props: { event: KeyboardEvent }) => boolean
    onExit: () => void
}

// Default sigla list - can be customized
const defaultSigla: SiglaItem[] = [
    { id: 'RT', text: 'RT', description: 'Recensio Textus' },
    { id: 'AL', text: 'AL', description: 'Altera Lectio' },
    { id: 'BG', text: 'BG', description: 'Bulgarus' },
    { id: 'DE', text: 'DE', description: 'Decretum' },
    { id: 'FR', text: 'FR', description: 'Fragmentum' },
    { id: 'IT', text: 'IT', description: 'Italicus' },
    { id: 'PL', text: 'PL', description: 'Palatinus' },
    { id: 'RO', text: 'RO', description: 'Romanus' },
    { id: 'RU', text: 'RU', description: 'Russicus' },
    { id: 'SK', text: 'SK', description: 'Slavicus' }
]

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    sigla: {
      /**
       * Add sigla text
       */
      setSigla: (text: string, highlightColor?: string) => ReturnType,
      /**
       * Remove sigla
       */
      unsetSigla: () => ReturnType,
    }
  }
}

export interface SiglaOptions {
    HTMLAttributes: Record<string, unknown>
    suggestion: {
        char: string
        items: SiglaItem[]
        render: () => SuggestionRenderer
    }
}

const SiglaSuggestion = {
    items: ({ query }: { query: string }) => {
        return defaultSigla
            .filter(item =>
                item.text.toLowerCase().startsWith(query.toLowerCase()) ||
                item.description?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 10)
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
                        content.className = 'sigla-suggestions bg-white border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto'

                        if (items.length) {
                            items.forEach((item, index) => {
                                const button = document.createElement('button')
                                button.className = `sigla-item w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${index === props.selectedIndex ? 'bg-blue-100 text-blue-600' : ''
                                    }`
                                button.onclick = () => props.command(item)

                                const label = document.createElement('span')
                                label.className = 'font-medium text-sm'
                                label.textContent = item.text
                                button.appendChild(label)

                                if (item.description) {
                                    const description = document.createElement('span')
                                    description.className = 'text-gray-500 text-xs ml-2'
                                    description.textContent = item.description
                                    button.appendChild(description)
                                }

                                content.appendChild(button)
                            })
                        } else {
                            const noResults = document.createElement('div')
                            noResults.className = 'text-gray-500 text-sm px-3 py-2'
                            noResults.textContent = 'No sigla found'
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
                    theme: 'sigla',
                    arrow: false,
                    maxWidth: 300,
                    zIndex: 9999,
                    offset: [0, 8], // Increased offset to create space below the "@"
                    hideOnClick: false,
                    allowHTML: true,
                })

                popup = Array.isArray(instances) ? instances[0] : instances
            },

            onUpdate(props: SuggestionProps) {
                component.props = props

                if (popup) {
                    popup.setContent(component.render())
                    popup.setProps({
                        getReferenceClientRect: props.clientRect,
                    })
                }
            },

            onKeyDown(props: { event: KeyboardEvent }) {
                if (props.event.key === 'Escape') {
                    if (popup) {
                        popup.hide()
                    }
                    return true
                }

                // Let the plugin handle other keys
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

export const SiglaNode = Node.create<SiglaOptions>({
  name: 'sigla',

  // Add to inline group and make it inline
  group: 'inline',
  inline: true,

  // Define allowed attributes
  addAttributes() {
    return {
      text: {
        default: null,
      },
      highlightColor: {
        default: DEFAULT_HIGHLIGHT_COLOR,
        parseHTML: element => element.getAttribute('data-sigla-highlight-color') || DEFAULT_HIGHLIGHT_COLOR,
        renderHTML: attributes => {
          return {
            'data-sigla-highlight-color': attributes.highlightColor,
            style: `background-color: ${attributes.highlightColor}`
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="sigla"]',
        getAttrs: element => {
          if (typeof element === 'string') {
            return false;
          }

          return {
            text: element.getAttribute('data-sigla-text'),
            highlightColor: element.getAttribute('data-sigla-highlight-color') || DEFAULT_HIGHLIGHT_COLOR,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const text = HTMLAttributes.text || '';
    const highlightColor = HTMLAttributes.highlightColor || DEFAULT_HIGHLIGHT_COLOR;
    
    return ['span', mergeAttributes(
      {
        'data-type': 'sigla',
        'data-sigla-text': text,
        'data-sigla-highlight-color': highlightColor,
        class: 'inline-sigla',
        style: `background-color: ${highlightColor} !important; padding: 2px 4px; border-radius: 2px;`
      },
      HTMLAttributes,
    ), text];
  },

  addCommands() {
    return {
      setSigla: (text: string, highlightColor?: string) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs: { 
              text,
              highlightColor: highlightColor || DEFAULT_HIGHLIGHT_COLOR
            }
          })
          .run();
      },
      unsetSigla: () => ({ commands }) => {
        return commands.deleteSelection()
      },
    }
  },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...SiglaSuggestion,
            }),
        ]
    },
})

interface SuglaPluginState {
    items: SiglaItem[]
    query: string
    triggerPos: number
    selectedIndex: number
    decorationId: string
    clientRect: () => DOMRect
    command: (item: SiglaItem) => void
}

interface SuggestionOptions {
    editor: Editor
    char?: string
    items: (props: { query: string }) => SiglaItem[]
    render: () => SuggestionRenderer
}

// Suggestion plugin
function Suggestion({
    editor,
    char = '@',
    items,
    render,
}: SuggestionOptions) {
    const pluginKey = new PluginKey('sigla-suggestion')

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

            apply(tr, value, oldState, newState) {
                const { selection } = newState;
                const { $from, from } = selection;

                // Check if there's a meta update for keyboard navigation
                const meta = tr.getMeta(pluginKey)
                if (meta) {
                    return meta
                }

                const textBefore = $from.doc.textBetween(Math.max(0, from - 50), from, '\n', '\0');

                // Find the trigger character and extract query
                const triggerIndex = textBefore.lastIndexOf(char);

                if (
                    triggerIndex === -1 ||
                    !editor.isEditable ||
                    selection.empty === false
                ) {
                    return null;
                }

                const query = textBefore.slice(triggerIndex + char.length);
                const triggerPos = from - query.length - char.length;

                // Only show suggestions if we have a space before the trigger or it's at the start
                const charBefore = triggerIndex > 0 ? textBefore[triggerIndex - 1] : ' ';
                if (charBefore !== ' ' && charBefore !== '\n' && triggerIndex !== 0) {
                    return null;
                }

                const decorationId = `id_${Math.floor(Math.random() * 0xffffffff)}`;
                const suggestionItems = items({ query });

                if (suggestionItems.length === 0) {
                    return null;
                }

                const currentState = value as SuglaPluginState | null;

                return {
                    items: suggestionItems,
                    query,
                    triggerPos,
                    selectedIndex: currentState?.selectedIndex ?? 0,
                    decorationId,
                    clientRect: () => {
                        // Get coordinates at the current cursor position (end of the query)
                        const currentPos = from;
                        const coords = editor.view.coordsAtPos(currentPos);

                        // Create a small rect at the cursor position for tippy to anchor to
                        return {
                            left: coords.left,
                            top: coords.top,
                            right: coords.left + 1,
                            bottom: coords.bottom,
                            width: 1,
                            height: coords.bottom - coords.top,
                            x: coords.left,
                            y: coords.top,
                            toJSON: () => ({})
                        } as DOMRect;
                    },
                    command: (item: SiglaItem) => {
                        const endPos = from;
                        editor
                            .chain()
                            .focus()
                            .deleteRange({ from: triggerPos, to: endPos })
                            .setSigla(item.text, item.highlightColor || DEFAULT_HIGHLIGHT_COLOR)
                            .run();

                        // Close the suggestion dropdown by clearing the plugin state
                        editor.view.dispatch(
                            editor.view.state.tr.setMeta(pluginKey, null)
                        );
                    },
                };
            },
        },

        props: {
            handleKeyDown(view, event) {
                const state = pluginKey.getState(view.state) as SuglaPluginState | null

                if (!state) {
                    return false
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    const selectedIndex = (state.selectedIndex + state.items.length - 1) % state.items.length
                    const newState = { ...state, selectedIndex }
                    view.dispatch(view.state.tr.setMeta(pluginKey, newState))
                    return true
                }

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    const selectedIndex = (state.selectedIndex + 1) % state.items.length
                    const newState = { ...state, selectedIndex }
                    view.dispatch(view.state.tr.setMeta(pluginKey, newState))
                    return true
                }

                if (event.key === 'Enter') {
                    event.preventDefault()
                    const item = state.items[state.selectedIndex]
                    if (item) {
                        state.command(item)
                        return true
                    }
                }

                if (event.key === 'Escape') {
                    view.dispatch(view.state.tr.setMeta(pluginKey, null))
                    return true
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
                        class: 'sigla-trigger',
                    }),
                ])
            },
        },
    })
}

export default SiglaNode
