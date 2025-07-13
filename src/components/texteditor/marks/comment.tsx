import { Mark, mergeAttributes } from '@tiptap/core'

export interface CommentOptions {
    HTMLAttributes: Record<string, unknown>
}

interface CommentAttributes {
    threadId?: string
    inlineThread?: string
    status?: string
    statusAll?: string
    state?: string
    type?: string
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        comment: {
            /**
             * Set a comment mark
             */
            setComment: (attributes?: CommentAttributes) => ReturnType
            /**
             * Toggle a comment mark
             */
            toggleComment: (attributes?: CommentAttributes) => ReturnType
            /**
             * Unset a comment mark
             */
            unsetComment: () => ReturnType
            /**
             * Remove a specific comment by thread ID
             */
            removeComment: (threadId: string) => ReturnType
        }
    }
}

// Helper function to generate unique IDs
function generateThreadId(): string {
    return crypto.randomUUID()
}

export const CommentMark = Mark.create<CommentOptions>({
    name: 'comment',

    // Add this mark to a group of extensions, which can be referred to 
    // in the content attribute of the schema.
    // add this mark to the 'basic' group
    // group: 'basic',
    // add this mark to the 'basic' and the 'foobar' group
    // group: 'basic foobar',


    // If you don’t want the mark to be active when the cursor is at its end,
    // set inclusive to false. For example, that’s how it’s configured for Link marks:
    inclusive: false,

    //keepOnSplit: true,
    //group: 'inline',

    // By default all marks can be applied at the same time. With the excludes 
    // attribute you can define which marks must not coexist with the mark. 
    // For example, the inline code mark excludes any other mark (bold, italic, and all others).
    excludes: '',
    // must not coexist with the bold mark
    //excludes: 'bold',
    // exclude any other mark
    // excludes: '_',

    // By default a mark will "trap" the cursor, meaning the cursor can't get 
    // out of the mark except by moving the cursor left to right into text without
    //  a mark. If this is set to true, the mark will be exitable when the 
    // mark is at the end of a node. This is handy for example using code marks.
    // make this mark exitable - default is false
    //exitable: true,

    // By default marks can span multiple nodes when rendered as HTML. 
    // Set spanning: false to indicate that a mark must not span multiple nodes.
    //spanning: false,
    //spanning: false,


    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    addAttributes() {
        return {
            threadId: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute('data-thread-id'),
                renderHTML: attributes => {
                    if (!attributes.threadId) {
                        return {}
                    }
                    return {
                        'data-thread-id': attributes.threadId,
                    }
                },
            },
            inlineThread: {
                default: '',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-inline-thread'),
                renderHTML: attributes => {
                    return {
                        'data-inline-thread': attributes.inlineThread || '',
                    }
                },
            },
            status: {
                default: 'open',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-status'),
                renderHTML: attributes => {
                    return {
                        'data-status': attributes.status || 'open',
                    }
                },
            },
            statusAll: {
                default: 'open',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-status-all'),
                renderHTML: attributes => {
                    return {
                        'data-status-all': attributes.statusAll || 'open',
                    }
                },
            },
            state: {
                default: 'default',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-state'),
                renderHTML: attributes => {
                    return {
                        'data-state': attributes.state || 'default',
                    }
                },
            },
            type: {
                default: 'inline',
                parseHTML: (element: HTMLElement) => element.getAttribute('data-type'),
                renderHTML: attributes => {
                    return {
                        'data-type': attributes.type || 'inline',
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-thread-id]',
                getAttrs: (element: HTMLElement) => {
                    const threadId = element.getAttribute('data-thread-id')
                    const inlineThread = element.getAttribute('data-inline-thread')
                    const status = element.getAttribute('data-status')
                    const statusAll = element.getAttribute('data-status-all')
                    const state = element.getAttribute('data-state')
                    const type = element.getAttribute('data-type')

                    return {
                        threadId,
                        inlineThread: inlineThread || '',
                        status: status || 'open',
                        statusAll: statusAll || 'open',
                        state: state || 'default',
                        type: type || 'inline',
                    }
                },
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        // Create the nested span structure
        // Outer span with thread-id and inline-thread attributes
        const threadId = crypto.randomUUID()

        return [
            'comment',
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes, {
                'class': 'tiptap-thread tiptap-thread--inline tiptap-thread--unresolved',
            }),
            0
        ]

        return [
            'span',
            mergeAttributes(
                {
                    'data-thread-id': threadId, //HTMLAttributes.threadId,
                    'data-inline-thread': HTMLAttributes.inlineThread || '',
                    'class': 'tiptap-thread tiptap-thread--inline tiptap-thread--unresolved',
                },
                this.options.HTMLAttributes
            ),
            // [
            //     'span',
            //     {
            //         'data-status': HTMLAttributes.status || 'open',
            //         'data-status-all': HTMLAttributes.statusAll || 'open',
            //         'data-state': HTMLAttributes.state || 'default',
            //         'data-type': HTMLAttributes.type || 'inline',
            //         'class': 'tiptap-thread tiptap-thread--inline tiptap-thread--unresolved',
            //     },
            //     0, // This is where the content will be inserted
            // ],
        ]
    },

    addCommands() {
        return {
            setComment: (attributes: CommentAttributes = {}) => ({ commands }) => {
                return commands.setMark(this.name, {
                    threadId: generateThreadId(), //attributes.threadId || generateThreadId(),
                    inlineThread: attributes.inlineThread || '',
                    status: attributes.status || 'open',
                    statusAll: attributes.statusAll || 'open',
                    state: attributes.state || 'default',
                    type: attributes.type || 'inline',
                })
            },

            toggleComment: (attributes: CommentAttributes = {}) => ({ commands }) => {
                return commands.toggleMark(this.name, {
                    threadId: attributes.threadId || generateThreadId(),
                    inlineThread: attributes.inlineThread || '',
                    status: attributes.status || 'open',
                    statusAll: attributes.statusAll || 'open',
                    state: attributes.state || 'default',
                    type: attributes.type || 'inline',
                })
            },

            unsetComment: () => ({ commands }) => {
                return commands.unsetMark(this.name)
            },

            // Remove a specific comment by thread ID
            removeComment: (threadId: string) => ({ tr, state, dispatch }) => {
                const { doc } = state
                const newTr = tr

                doc.descendants((node, pos) => {
                    if (node.marks) {
                        node.marks.forEach(mark => {
                            if (mark.type.name === this.name && mark.attrs.threadId === threadId) {
                                newTr.removeMark(pos, pos + node.nodeSize, mark)
                            }
                        })
                    }
                })

                if (dispatch) {
                    dispatch(newTr)
                }

                return true
            },
        }
    },

    // This is crucial - it allows multiple instances of the same mark type
    // to be applied to overlapping ranges
    addGlobalAttributes() {
        return [
            {
                types: [this.name],
                attributes: {
                    // Enable multiple marks of the same type
                    excludes: {
                        default: '',
                    },
                },
            },
        ]
    },
})
