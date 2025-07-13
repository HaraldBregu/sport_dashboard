import { mergeAttributes, Node } from '@tiptap/core'

const DEFAULT_HIGHLIGHT_COLOR = '#FFEB3B'

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

export const SiglaNode = Node.create({
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
})

export default SiglaNode
