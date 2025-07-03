import React, { useRef, useState } from 'react';
import TextEditor, { TextEditorRef } from './text-editor';

const CommentExample: React.FC = () => {
    const editorRef = useRef<TextEditorRef>(null);
    const [commentText, setCommentText] = useState('');
    const [author, setAuthor] = useState('');

    const handleSetComment = () => {
        if (!editorRef.current?.editor) return;
        
        const editor = editorRef.current.editor;
        const { from, to } = editor.state.selection;
        
        if (from === to) {
            alert('Please select some text to add a comment');
            return;
        }

        editor.commands.setComment({
            comment: commentText,
            author: author,
            date: new Date().toISOString(),
        });
        
        setCommentText('');
    };

    const handleUnsetComment = () => {
        if (!editorRef.current?.editor) return;
        
        const editor = editorRef.current.editor;
        editor.commands.unsetComment();
    };

    const handleToggleComment = () => {
        if (!editorRef.current?.editor) return;
        
        const editor = editorRef.current.editor;
        const { from, to } = editor.state.selection;
        
        if (from === to) {
            alert('Please select some text to toggle a comment');
            return;
        }

        editor.commands.toggleComment({
            comment: commentText,
            author: author,
            date: new Date().toISOString(),
        });
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Comment Extension Example</h2>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    Comment Text:
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Enter comment text..."
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-md"
                    />
                </label>
                
                <label className="block text-sm font-medium">
                    Author:
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name..."
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-md"
                    />
                </label>
            </div>

            <div className="space-x-2">
                <button
                    onClick={handleSetComment}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Set Comment
                </button>
                
                <button
                    onClick={handleUnsetComment}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Unset Comment
                </button>
                
                <button
                    onClick={handleToggleComment}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Toggle Comment
                </button>
            </div>

            <div className="border border-gray-300 rounded-md">
                <TextEditor
                    ref={editorRef}
                    content="<p>Select some text and use the buttons above to add, remove, or toggle comments. Comments will appear with a yellow background.</p>"
                    placeholder="Start typing..."
                    className="min-h-[300px]"
                />
            </div>

            <div className="text-sm text-gray-600">
                <h3 className="font-semibold">Instructions:</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>Select some text in the editor</li>
                    <li>Enter comment text and author (optional)</li>
                    <li>Click "Set Comment" to add a comment mark</li>
                    <li>Click "Unset Comment" to remove comment marks from selected text</li>
                    <li>Click "Toggle Comment" to add/remove comment marks</li>
                </ul>
            </div>
        </div>
    );
};

export default CommentExample; 