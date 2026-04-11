"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = "Tell your story...", className = "" }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 bg-white text-black border border-gray-200 rounded-lg",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`tiptap-editor ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="Heading 2"
        >
          H2
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="Ordered List"
        >
          1.
        </button>
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Undo"
        >
          ↶
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Redo"
        >
          ↷
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="bg-white"
        placeholder={placeholder}
      />

      <style jsx global>{`
        .tiptap-editor .ProseMirror {
          outline: none;
          min-height: 200px;
          padding: 1rem;
          background: white;
          color: black;
        }

        .tiptap-editor .ProseMirror p {
          margin: 0.5rem 0;
        }

        .tiptap-editor .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }

        .tiptap-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }

        .tiptap-editor .ProseMirror ul, .tiptap-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-editor .ProseMirror li {
          margin: 0.25rem 0;
        }

        .tiptap-editor .ProseMirror strong {
          font-weight: bold;
        }

        .tiptap-editor .ProseMirror em {
          font-style: italic;
        }

        .tiptap-editor .ProseMirror s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
}