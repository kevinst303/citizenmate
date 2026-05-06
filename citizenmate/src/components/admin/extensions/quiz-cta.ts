import { Node, mergeAttributes } from '@tiptap/react';

export const QuizCTAExtension = Node.create({
  name: 'quizCta',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: {
        default: null,
      },
      text: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'quizcta' },
      { tag: 'QuizCTA' },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['quizcta', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      dom.className =
        'my-8 p-6 bg-teal-50 border-2 border-dashed border-teal-300 rounded-xl flex flex-col items-center justify-center text-teal-800 font-medium select-none cursor-grab active:cursor-grabbing hover:bg-teal-100 transition-colors';
      
      const title = document.createElement('strong');
      title.className = 'text-lg mb-1';
      title.innerText = node.attrs.title || 'Ready to Practice? (Default Title)';
      
      const subtitle = document.createElement('span');
      subtitle.className = 'text-sm text-teal-600/80 text-center max-w-md';
      subtitle.innerText = node.attrs.text || 'Default text will be used for the Call to Action.';

      const badge = document.createElement('div');
      badge.className = 'bg-teal-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-3 tracking-wider';
      badge.innerText = 'Quiz CTA Component';

      dom.appendChild(badge);
      dom.appendChild(title);
      dom.appendChild(subtitle);

      return {
        dom,
      };
    };
  },
});
