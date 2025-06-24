import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, Editor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import CodeBlock from '@tiptap/extension-code-block';
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { Button } from '../ui/button';

import { Plugin, PluginKey } from 'prosemirror-state'
import { Extension } from '@tiptap/core'


const MyCustomPlugin = Extension.create({
    name: 'customBubbleMenuPlugin',

    addStorage() {
        return {
            isRightClicked: false,
        }
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('customBubbleMenuPlugin'),
                props: {
                    handleDOMEvents: {
                        contextmenu: (view, event) => {
                            event.preventDefault();

                            // Get the click position in the editor
                            const clickPosition = view.posAtCoords({ left: event.clientX, top: event.clientY });

                            if (clickPosition !== null) {
                                this.storage.isRightClicked = true;
                                console.log('isRightClicked', this.storage.isRightClicked);
                                // const tr2 = view.state.tr;
                                // view.dispatch(tr2);

                                // Create a minimal selection at the click position
                                // const pos = clickPosition.pos;
                                // const vdf = TextSelection.near(view.state.doc.resolve(pos))
                                // const tr = view.state.tr.setSelection(vdf);
                                // console.log('vdf', tr);

                                // const pos = clickPosition.pos;
                                // const selection = TextSelection.near(view.state.doc.resolve(pos));
                                // const tr = view.state.tr.setSelection(selection);
                                // view.dispatch(tr);


                                view.dispatch(view.state.tr)
                                // this.editor.view.dispatch(tr3);

                                // const { from, to } = view.state.selection;
                                // const testSelection = TextSelection.create(view.state.doc, from, to);
                                // const tr3 = view.state.tr.setSelection(testSelection);
                                // view.dispatch(tr3);



                                // setTimeout(() => {
                                //     this.storage.isRightClicked = false;
                                //     const resetTr = view.state.tr;
                                //     view.dispatch(resetTr);
                                // }, 1000);
                            }

                            return true;
                        },
                        mousedown: (view) => {
                            if (this.storage.isRightClicked) {
                                this.storage.isRightClicked = false;
                                view.dispatch(view.state.tr);
                            }
                            return false;
                        }
                    }
                }
            })
        ]
    }
})

export interface TextEditorProps {
    content?: string;
    placeholder?: string;
    onChange?: (content: string) => void;
    editable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export interface TextEditorRef {
    editor: Editor | null;
    getHTML: () => string;
    getText: () => string;
    setContent: (content: string) => void;
    clear: () => void;
    focus: () => void;
    blur: () => void;
    isEditable: () => boolean;
    setEditable: (editable: boolean) => void;
}

export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(({
    content = '',
    placeholder = 'Start writing...',
    onChange,
    editable = true,
    className = '',
    style = {},
}, ref) => {
    const editor = useEditor({
        shouldRerenderOnTransaction: false,
        extensions: [
            MyCustomPlugin,
            StarterKit,
            Placeholder.configure({
                placeholder,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            FontFamily,
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 p-4 rounded-md font-mono text-sm',
                },
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
    });

    if (!editor) {
        throw new Error('Editor not initialized');
    }

    useImperativeHandle(ref, () => ({
        editor,
        getHTML: () => editor?.getHTML() || '',
        getText: () => editor?.getText() || '',
        setContent: (content: string) => editor?.commands.setContent(content),
        clear: () => editor?.commands.clearContent(),
        focus: () => editor?.commands.focus(),
        blur: () => editor?.commands.blur(),
        isEditable: () => editor?.isEditable || false,
        setEditable: (editable: boolean) => editor?.setEditable(editable),
    }), [editor]);

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    return (
        <>
            {editor && <BubbleMenu
                pluginKey="customBubbleMenuPlugin"
                editor={editor}
                shouldShow={({ editor }) => {
                    // Get the custom plugin extension
                    const customPlugin = editor.extensionManager.extensions.find(
                        ext => ext.name === 'customBubbleMenuPlugin'
                    );

                    // Check if right-click is active and there's a selection
                    // const { from, to } = editor.state.selection;
                    // const hasSelection = from !== to;
                    const isRightClicked = customPlugin?.storage?.isRightClicked || false;

                    console.log('isRightClicked', isRightClicked);
                    return isRightClicked;
                }}
                tippyOptions={{
                    duration: 100
                }}
            >
                <div className="flex gap-2 bg-gray-100 p-2 rounded-md">
                    <Button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                        onClick={() => {
                            editor.chain().focus().toggleBold().run();
                        }}
                    >
                        <BoldIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                        onClick={() => {
                            editor.chain().focus().toggleItalic().run();
                        }}
                    >
                        <ItalicIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                        onClick={() => {
                            editor.chain().focus().toggleStrike().run();
                        }}
                    >
                        <StrikethroughIcon className="w-4 h-4" />
                    </Button>
                </div>
            </BubbleMenu>
            }

            <EditorContent
                editor={editor}
                className={`prose prose-sm max-w-none focus:outline-none ${className}`}
                style={style}
            />
        </>
    );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;
