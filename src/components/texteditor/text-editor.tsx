import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import CodeBlock from '@tiptap/extension-code-block';
import Paragraph from '@tiptap/extension-paragraph';
import Heading from '@tiptap/extension-heading';
import TextStyleExtended from './extensions/textstyle-extension';

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

export interface TextEditorProps {
    content?: unknown;
    placeholder?: string;
    onChange?: (content: string) => void;
    onClick?: (event: MouseEvent) => void;
    editable?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(({
    content,
    placeholder = 'Start writing...',
    onChange,
    onClick,
    editable = true,
    className = '',
    style = {},
}, ref) => {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
            }),
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
            TextStyleExtended,
            Color,
            FontFamily.configure({
                types: ['textStyle']
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 p-4 rounded-md font-mono text-sm',
                },
            }),
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Paragraph.configure({
                HTMLAttributes: {
                    class: 'mb-2',
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
            },
            handleDOMEvents: {
                contextmenu: (view, event) => {
                    event.preventDefault()

                    const { selection } = view.state
                    if (selection.empty) return false

                    onClick?.(event)
                    return true
                },
            },
        },
        content: content || '',
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const json = editor.getJSON();
            console.log(JSON.stringify(json, null, 2))
            onChange?.(html);
        },
    });

    if (!editor) {
        throw new Error('Editor not initialized');
    }

    useImperativeHandle(ref, () => ({
        editor,
        getHTML: () => editor.getHTML() || '',
        getText: () => editor.getText() || '',
        setContent: (content: string) => editor.commands.setContent(content),
        clear: () => editor.commands.clearContent(),
        focus: () => editor.commands.focus(),
        blur: () => editor.commands.blur(),
        isEditable: () => editor.isEditable || false,
        setEditable: (editable: boolean) => editor.setEditable(editable),
    }), [editor]);

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '');
        }
    }, [content, editor]);

    useEffect(() => {
        editor.setEditable(editable);
    }, [editable, editor]);

    return (
        <>
            <EditorContent
                editor={editor}
                className={`prose prose-sm max-w-none focus:outline-none ${className}`}
                style={style}
                onContextMenu={(event) => {
                    event.preventDefault();
                }}
            />
        </>
    );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;

