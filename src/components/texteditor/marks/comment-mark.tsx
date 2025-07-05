import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        comment: {
            /**
             * Set a comment mark
             */
            setComment: (attributes?: { comment?: string; author?: string; commentId?: string }) => ReturnType;
            /**
             * Unset a comment mark
             */
            unsetComment: () => ReturnType;
            /**
             * Toggle a comment mark
             */
            toggleComment: (attributes?: { comment?: string; author?: string; commentId?: string }) => ReturnType;
        };
    }
}

const CommentMark = Mark.create<CommentOptions>({
    name: 'CommentMark',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            comment: {
                default: null,
                parseHTML: element => element.getAttribute('data-comment'),
                renderHTML: attributes => {
                    if (!attributes.comment) {
                        return {};
                    }
                    return {
                        'data-comment': attributes.comment,
                    };
                },
            },
            author: {
                default: null,
                parseHTML: element => element.getAttribute('data-author'),
                renderHTML: attributes => {
                    if (!attributes.author) {
                        return {};
                    }
                    return {
                        'data-author': attributes.author,
                    };
                },
            },
            commentId: {
                default: null,
                parseHTML: element => element.getAttribute('data-comment-id'),
                renderHTML: attributes => {
                    if (!attributes.commentId) {
                        return {};
                    }
                    return {
                        'data-comment-id': attributes.commentId,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: 'comment-mark bg-yellow-200 cursor-pointer',
                title: HTMLAttributes.comment || 'Comment',
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setComment:
                (attributes = {}) =>
                ({ commands }) => {
                    return commands.setMark(this.name, attributes);
                },
            unsetComment:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name);
                },
            toggleComment:
                (attributes = {}) =>
                ({ commands }) => {
                    return commands.toggleMark(this.name, attributes);
                },
        };
    },
});

export default CommentMark; 