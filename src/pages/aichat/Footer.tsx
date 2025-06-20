import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'


export default function Footer() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Start typing...',
            }),
        ],
        // content: '<p>Hello World!</p>',
    })

    return (
        <footer className="relative mt-auto flex min-h-8 w-full items-center justify-center p-2">
            <div className="flex flex-col w-full max-w-2xl mx-auto rounded-3xl border-2 bg-gray-900">
                <EditorContent
                    className="h-24 w-full"
                    editor={editor}
                />
                <div className="flex items-center justify-end p-2 border-t border-border">
                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                        Send
                    </button>
                </div>
            </div>
        </footer>
    )
}