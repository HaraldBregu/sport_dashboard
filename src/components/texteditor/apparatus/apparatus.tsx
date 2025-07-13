import { mergeAttributes, Node, CommandProps } from '@tiptap/core'
import { ApparatusType } from '../nodes/apparatus-node'

export interface ApparatusOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    apparatus: {
      /**
       * Create a new apparatus
       */
      setApparatus: (attributes?: { id?: string; type?: ApparatusType }) => ReturnType,
      /**
       * Toggle an apparatus
       */
      toggleApparatus: (attributes?: { id?: string; type?: ApparatusType }) => ReturnType,
    }
  }
}

export const Apparatus = Node.create<ApparatusOptions>({
  name: 'apparatus',

  group: 'block',

  content: 'block',

  draggable: true,

  inline: false,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      type: {
        default: 'CRITICAL' as ApparatusType,
      },
    }
  },

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="apparatus"]',
        getAttrs: element => {
          if (typeof element === 'string') return false
          
          const type = element.getAttribute('data-apparatus-type');
          return {
            id: element.getAttribute('data-apparatus-id'),
            type: type === 'PAGE_NOTES' ? type : 'CRITICAL',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'apparatus',
      mergeAttributes(
        this.options.HTMLAttributes,
        HTMLAttributes,
        {
          'data-type': 'apparatus',
          'data-apparatus-id': HTMLAttributes.id,
          'data-apparatus-type': HTMLAttributes.type,
          'data-contextmenu': 'true',
          class: `apparatus apparatus-${(HTMLAttributes.type || 'CRITICAL').toLowerCase()}`
        }
      ),
      0,
    ]
  },

  addCommands() {
    return {
      setApparatus:
        (attributes?: { id?: string; type?: ApparatusType }) => ({ commands }: CommandProps) => {
          return commands.wrapIn(this.name, attributes)
        },
      toggleApparatus:
        (attributes?: { id?: string; type?: ApparatusType }) => ({ commands }: CommandProps) => {
          return commands.toggleWrap(this.name, attributes)
        },
    }
  },

  // Add handleContextMenu to ensure context menu events work
  handleContextMenu: false,
})

export default Apparatus
