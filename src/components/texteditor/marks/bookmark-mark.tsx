import { Mark, mergeAttributes } from '@tiptap/core';

export interface BookmarkOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        bookmark: {
            /**
             * Set a bookmark mark
             */
            setBookmark: (attributes?: { bookmark?: string; author?: string; date?: string; color?: string }) => ReturnType;
            /**
             * Unset a bookmark mark
             */
            unsetBookmark: () => ReturnType;
            /**
             * Toggle a bookmark mark
             */
            toggleBookmark: (attributes?: { bookmark?: string; author?: string; date?: string; color?: string }) => ReturnType;
        };
    }
}

export const BookmarkMark = Mark.create<BookmarkOptions>({
    name: 'BookmarkMark',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            bookmark: {
                default: null,
                parseHTML: element => element.getAttribute('data-bookmark'),
                renderHTML: attributes => {
                    if (!attributes.bookmark) {
                        return {};
                    }
                    return {
                        'data-bookmark': attributes.bookmark,
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
            date: {
                default: null,
                parseHTML: element => element.getAttribute('data-date'),
                renderHTML: attributes => {
                    if (!attributes.date) {
                        return {};
                    }
                    return {
                        'data-date': attributes.date,
                    };
                },
            },
            color: {
                default: 'blue',
                parseHTML: element => element.getAttribute('data-color') || 'blue',
                renderHTML: attributes => {
                    return {
                        'data-color': attributes.color || 'blue',
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-bookmark]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const colorClass = HTMLAttributes.color === 'red' ? 'bg-red-200' :
                          HTMLAttributes.color === 'green' ? 'bg-green-200' :
                          HTMLAttributes.color === 'purple' ? 'bg-purple-200' :
                          HTMLAttributes.color === 'orange' ? 'bg-orange-200' :
                          'bg-blue-200';
        
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `bookmark-mark ${colorClass} cursor-pointer border-l-4 border-l-${HTMLAttributes.color || 'blue'}-500 px-1`,
                title: HTMLAttributes.bookmark || 'Bookmark',
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setBookmark:
                (attributes = {}) =>
                ({ commands }) => {
                    return commands.setMark(this.name, attributes);
                },
            unsetBookmark:
                () =>
                ({ commands }) => {
                    return commands.unsetMark(this.name);
                },
            toggleBookmark:
                (attributes = {}) =>
                ({ commands }) => {
                    return commands.toggleMark(this.name, attributes);
                },
        };
    },
});

export default BookmarkMark; 