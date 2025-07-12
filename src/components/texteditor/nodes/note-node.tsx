// import { mergeAttributes, Node } from '@tiptap/core'

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     note: {
//       /**
//        * Set a note
//        */
//       setNote: (attributes?: { id?: string; content?: string }) => ReturnType
//       /**
//        * Toggle a note
//        */
//       toggleNote: (attributes?: { id?: string; content?: string }) => ReturnType
//     }
//   }
// }

// export interface NoteOptions {
//   HTMLAttributes: Record<string, unknown>
// }

// export const NoteNode = Node.create<NoteOptions>({
//   name: 'note',
  
//   // This makes it an inline node
//   group: 'inline',
  
//   // This ensures it can only be placed inside apparatus nodes
//   content: 'text*',
//   inline: true,
//   selectable: true,
//   draggable: true,

//   defining: true,

//   addOptions() {
//     return {
//       HTMLAttributes: {},
//     }
//   },

//   addAttributes() {
//     return {
//       id: {
//         default: null,
//         parseHTML: element => element.getAttribute('data-note-id'),
//         renderHTML: attributes => {
//           if (!attributes.id) {
//             return {}
//           }

//           return {
//             'data-note-id': attributes.id,
//           }
//         },
//       },
//       content: {
//         default: '',
//         parseHTML: element => element.getAttribute('data-note-content'),
//         renderHTML: attributes => {
//           if (!attributes.content) {
//             return {}
//           }

//           return {
//             'data-note-content': attributes.content,
//           }
//         },
//       },
//     }
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'span[data-type="note"]',
//         getAttrs: element => {
//           if (typeof element === 'string') {
//             return false
//           }
          
//           return {
//             id: element.getAttribute('data-note-id'),
//             content: element.getAttribute('data-note-content'),
//           }
//         },
//       },
//     ]
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['span', mergeAttributes(
//       this.options.HTMLAttributes,
//       HTMLAttributes,
//       { 'data-type': 'note' },
//       { class: 'note-inline' }
//     ), 0]
//   },

//   addCommands() {
//     return {
//       setNote:
//         attributes => ({ commands }) => {
//           return commands.setNode(this.name, attributes)
//         },
//       toggleNote:
//         attributes => ({ commands }) => {
//           return commands.toggleNode(this.name, 'text', attributes)
//         },
//     }
//   },

//   addKeyboardShortcuts() {
//     return {
//       'Mod-Alt-n': () => this.editor.commands.toggleNote(),
//     }
//   },
// }) 