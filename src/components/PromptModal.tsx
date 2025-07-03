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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl max-w-lg w-full p-4 sm:p-8 relative text-[#f1f5f9] max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 sm:top-4 right-2 sm:right-4 text-[#38bdf8] hover:text-[#f1f5f9] text-xl sm:text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#38bdf8] pr-8">{title}</h2>
        <pre className="whitespace-pre-wrap text-[#f1f5f9] bg-[#0f172a] rounded p-3 sm:p-4 overflow-x-auto text-xs sm:text-sm border border-[#334155]">
          {displayContent}
        </pre>
      </div>
    </div>
  );
};

export default PromptModal; 
