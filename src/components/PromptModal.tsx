import React from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | (() => string);
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;
  // If content is a function, call it; then trim whitespace
  const displayContent = typeof content === 'function' ? content().trim() : (content || '').trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl max-w-lg w-full p-8 relative text-[#f1f5f9]">
        <button
          className="absolute top-4 right-4 text-[#38bdf8] hover:text-[#f1f5f9] text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#38bdf8]">{title}</h2>
        <pre className="whitespace-pre-wrap text-[#f1f5f9] bg-[#0f172a] rounded p-4 overflow-x-auto text-sm border border-[#334155]">
          {displayContent}
        </pre>
      </div>
    </div>
  );
};

export default PromptModal; 
