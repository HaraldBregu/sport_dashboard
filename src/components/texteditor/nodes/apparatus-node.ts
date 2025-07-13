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

  //  The content attribute defines exactly what kind of content the node can 
  // have. ProseMirror is really strict with that. That means, content
  //  which doesn’t fit the schema is thrown away. It expects a name 
  // or group as a string. Here are a few examples:
  // must have one or more blocks
  //  content: 'block+',
  // must have zero or more blocks
  //  content: 'block*',
  // allows all kinds of 'inline' content (text or hard breaks)
  //  content: 'inline*',
  // must not have anything else than 'text'
  //  content: 'text*',
  // can have one or more paragraphs, or lists (if lists are used)
  //  content: '(paragraph|list?)+',
  // must have exact one heading at the top, and one or more blocks below
  //  content: 'heading block+',

  // You can define which marks are allowed inside of a node with 
  // the marks setting of the schema. Add a one or more names 
  // or groups of marks, allow all or disallow all marks like this:
 // allows only the 'bold' mark
 //marks: 'bold',
 // allows only the 'bold' and 'italic' marks
 //marks: 'bold italic',
 // allows all marks
 //marks: '_',
 // disallows all marks
 //marks: '',

 // Add this node to a group of extensions, which can be referred 
 // to in the content attribute of the schema.
  // add to 'block' group
  // group: 'block',
  // add to 'inline' group
  // group: 'inline',
  // add to 'block' and 'list' group
  // group: 'block list',

  // Nodes can be rendered inline, too. When setting inline: true nodes 
  // are rendered in line with the text. That’s the case for mentions. 
  // The result is more like a mark, but with the functionality of a node. 
  // One difference is the resulting JSON document. Multiple marks are 
  // applied at once, inline nodes would result in a nested structure.
  //inline: true,

  // For some cases where you want features that aren’t available in
  // marks, for example a node view, try if an inline node would work:
  // Node.create({
  //   name: 'customInlineNode',
  //   group: 'inline',
  //   inline: true,
  //   content: 'text*',
  // })
  
  // Inline nodes can be tricky to select, especially at line edges.
  // A quick fix: add a zero-width space right after the element using CSS:
  // .customInlineNode::after {
  //   content: "\200B";
  // }
  
  





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