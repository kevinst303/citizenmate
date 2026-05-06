'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { FileHandler } from '@tiptap/extension-file-handler';
import TextAlign from '@tiptap/extension-text-align';
import { FontSize } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { CharacterCount } from '@tiptap/extension-character-count';
import { EditorToolbar } from './editor-toolbar';
import { EditorBubbleMenu } from './editor-bubble-menu';
import { QuizCTAExtension } from './extensions/quiz-cta';
import { useEffect, useCallback, useRef, useState } from 'react';

interface BlogEditorProps {
  content: string;
  onChange: (html: string, wordCount: number) => void;
  postId?: string;
}

export function BlogEditor({ content, onChange, postId }: BlogEditorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const postIdRef = useRef(postId);
  postIdRef.current = postId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      const currentPostId = postIdRef.current;
      if (!currentPostId) throw new Error('Save post first to upload images');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('postId', currentPostId);

      const res = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const data = await res.json();
      return data.url;
    },
    []
  );

  const uploadImageRef = useRef(uploadImage);
  uploadImageRef.current = uploadImage;

  const editor = useEditor({
    extensions: [
      QuizCTAExtension,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        autolink: true,
        defaultProtocol: 'https',
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class:
            'text-[#006d77] underline decoration-[#006d77]/30 hover:decoration-[#006d77]',
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: false,
        inline: false,
        HTMLAttributes: {
          class: 'rounded-lg my-4 max-w-full h-auto',
        },
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDrop: (editor: any, files: File[]) => {
          if (!uploadImageRef.current) return;
          for (const file of files) {
            try {
              uploadImageRef.current(file).then((url) => {
                editor.chain().focus().setImage({ src: url }).run();
              });
            } catch { /* ignore */ }
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPaste: (editor: any, files: File[]) => {
          if (!uploadImageRef.current) return;
          for (const file of files) {
            try {
              uploadImageRef.current(file).then((url) => {
                editor.chain().focus().setImage({ src: url }).run();
              });
            } catch { /* ignore */ }
          }
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FontSize,
      Typography,
      CharacterCount,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-lg prose-slate max-w-none focus:outline-none min-h-[400px] px-6 py-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = editor.storage.characterCount?.words?.() ?? 0;
      onChange(html, words);
    },
  });

  if (!isMounted) {
    return (
      <div className="min-h-[400px] rounded-[10px] border border-[#E9ECEF] bg-white px-6 py-4 text-slate-400">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 rounded-[10px] border border-[#E9ECEF] bg-white overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
