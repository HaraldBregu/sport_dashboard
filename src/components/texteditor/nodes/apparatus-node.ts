import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ApparatusNodeView from './apparatus-node-view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    apparatus: {
      /**
       * Set an apparatus entry
       */
      setApparatus: (attributes?: { id?: string; type?: ApparatusType }) => ReturnType
      /**
       * Toggle an apparatus entry
       */
      toggleApparatus: (attributes?: { id?: string; type?: ApparatusType }) => ReturnType
    }
  }
}

export type ApparatusType = 'CRITICAL' | 'PAGE_NOTES';

export interface ApparatusOptions {
  HTMLAttributes: Record<string, unknown>
}

export const ApparatusNode = Node.create<ApparatusOptions>({
  name: 'apparatus',
  
  group: 'block',
  
  // Allow text with note marks
  content: 'text*',
  marks: 'NoteMark',
  
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-apparatus-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {}
          }

          return {
            'data-apparatus-id': attributes.id,
          }
        },
      },
      type: {
        default: 'CRITICAL' as ApparatusType,
        parseHTML: element => {
          const type = element.getAttribute('data-apparatus-type');
          return type === 'PAGE_NOTES' ? type : 'CRITICAL';
        },
        renderHTML: attributes => {
          if (!attributes.type) {
            return {}
          }

          return {
            'data-apparatus-type': attributes.type,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="apparatus"]',
        getAttrs: element => {
          if (typeof element === 'string') {
            return false
          }
          
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
    return ['apparatus', mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { 'data-type': 'apparatus' },
      { class: `apparatus apparatus-${HTMLAttributes.type?.toLowerCase() || 'critical'}` }
    ), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ApparatusNodeView)
  },

  addCommands() {
    return {
      setApparatus:
        attributes => ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleApparatus:
        attributes => ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes)
        },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-a': () => this.editor.commands.toggleApparatus(),
    }
  },
}) 