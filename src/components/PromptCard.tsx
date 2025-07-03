import React from 'react';

interface PromptCardProps {
  number?: number;
  title: string;
  description: string;
  content: string | (() => string);
  tags?: string[];
  onClick: () => void;
}

const getPreview = (content: string | (() => string)) => {
  const text = typeof content === 'function' ? content() : content || '';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return trimmed.length > 50 ? trimmed.slice(0, 50) + '…' : trimmed;
};

const PromptCard: React.FC<PromptCardProps> = ({ number, title, description, content, tags = [], onClick }) => (
  <div
    className="bg-[#1e293b] border border-[#334155] rounded-xl shadow hover:shadow-lg transition cursor-pointer p-4 sm:p-6 mb-2 hover:border-[#38bdf8] flex items-start gap-3 sm:gap-6"
    onClick={onClick}
  >
    <div className="text-lg sm:text-2xl font-bold text-[#38bdf8] min-w-[2rem] sm:min-w-[2.5rem] text-right pr-2 pt-1 flex-shrink-0">
      {number !== undefined ? `${number}.` : ''}
    </div>
    <div className="flex-1 flex flex-col gap-1 min-w-0">
      <div className="text-base sm:text-lg font-semibold text-[#f1f5f9] break-words">{title}</div>
      <div className="text-[#f1f5f9] text-xs sm:text-sm mb-1 break-words">{description}</div>
      <div className="text-[#38bdf8] text-xs font-mono bg-[#0f172a] rounded px-2 py-1 break-words overflow-hidden">
        <span className="block truncate">{getPreview(content)}</span>
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
        {tags.map(tag => (
          <span
            key={tag}
            className="bg-[#334155] text-[#38bdf8] px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium border border-[#38bdf8] flex-shrink-0"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PromptCard;
