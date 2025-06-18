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
            <div className="flex items-center justify-between w-full h-32 max-w-2xl mx-auto">
                <EditorContent
                    className="h-full w-full bg-black rounded-md"
                    editor={editor}
                />
            </div>
        </footer>
    )
}