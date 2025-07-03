import React, { useState } from 'react';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';

// @ts-ignore
const promptImports = import.meta.glob('../pages/prompts/*.md', { eager: true });

const prompts = Object.values(promptImports).map((mod: any) => {
  return {
    title: mod.frontmatter.title,
    description: mod.frontmatter.description,
    tags: mod.frontmatter.tags || [],
    content: mod.rawContent,
  };
});

// Collect all unique tags
const allTags = Array.from(
  new Set(
    prompts.flatMap((p) => Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? [p.tags] : []))
  )
).sort();

const PromptLibrary: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPrompts = activeTag
    ? prompts.filter((p) => (Array.isArray(p.tags) ? p.tags.includes(activeTag) : p.tags === activeTag))
    : prompts;

  return (
    <>
      <div className="mb-6 sm:mb-8 flex flex-wrap gap-1.5 sm:gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow border transition cursor-pointer
              ${tag === activeTag
                ? 'bg-[#38bdf8] text-[#0f172a] border-[#38bdf8] font-bold'
                : 'bg-[#334155] text-[#38bdf8] border-[#38bdf8] hover:bg-[#0f172a]'}
            `}
          >
            {tag}
          </button>
        ))}
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow border border-[#38bdf8] bg-[#0f172a] text-[#38bdf8] hover:bg-[#334155] transition cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-col gap-4 sm:gap-6">
        {filteredPrompts.map((prompt, idx) => (
          <PromptCard
            key={idx}
            number={idx + 1}
            title={prompt.title}
            description={prompt.description}
            content={prompt.content}
            tags={prompt.tags}
            onClick={() => {
              setSelectedPrompt(prompt);
              setModalOpen(true);
            }}
          />
        ))}
        {filteredPrompts.length === 0 && (
          <div className="text-center text-[#38bdf8] text-sm mt-8">No prompts found for this tag.</div>
        )}
      </div>
      <PromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPrompt?.title || ''}
        content={selectedPrompt?.content || ''}
      />
    </>
  );
};

export default PromptLibrary;
