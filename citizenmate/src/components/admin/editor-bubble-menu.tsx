'use client';

import { type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
} from 'lucide-react';
import { useCallback } from 'react';

interface EditorBubbleMenuProps {
  editor: Editor | null;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const btnClass =
    'p-1.5 rounded text-slate-600 hover:bg-[#006d77]/10 hover:text-[#006d77] transition-colors';

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 rounded-[10px] bg-white border border-[#E9ECEF] shadow-lg px-1 py-1"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnClass} ${editor.isActive('bold') ? 'text-[#006d77] bg-[#006d77]/10' : ''}`}
        title="Bold"
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnClass} ${editor.isActive('italic') ? 'text-[#006d77] bg-[#006d77]/10' : ''}`}
        title="Italic"
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btnClass} ${editor.isActive('underline') ? 'text-[#006d77] bg-[#006d77]/10' : ''}`}
        title="Underline"
      >
        <UnderlineIcon size={14} />
      </button>
      <div className="w-px h-4 bg-[#E9ECEF] mx-0.5" />
      <button
        type="button"
        onClick={addLink}
        className={`${btnClass} ${editor.isActive('link') ? 'text-[#006d77] bg-[#006d77]/10' : ''}`}
        title="Add Link"
      >
        <LinkIcon size={14} />
      </button>
    </BubbleMenu>
  );
}
