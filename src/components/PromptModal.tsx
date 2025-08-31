import React, { useState, useEffect } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: any;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (id: string, content: string) => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ 
  isOpen, 
  onClose, 
  prompt,
  isFavorite,
  onToggleFavorite,
  onCopy
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling

      
      // Add keyboard listener for ESC key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        // Restore body scrolling

        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !prompt) return null;

  const handleCopy = () => {
    const textContent = typeof prompt.content === 'function' ? prompt.content() : prompt.content;
    navigator.clipboard.writeText(textContent);
    onCopy(prompt.id, textContent);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    onToggleFavorite(prompt.id);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4 sm:px-6 py-4">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2 leading-tight">{prompt.title}</h2>
              <p className="text-sm sm:text-base text-slate-400 line-clamp-2 sm:line-clamp-none">{prompt.description}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={handleFavorite}
                className={`
                  modal-favorite-btn p-2 rounded-lg transition-all duration-200
                  ${isFavorite 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-pink-400'
                  }
                  hover:scale-105 active:scale-95
                `}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all hover:scale-105 active:scale-95"
                title="Close (ESC)"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-slate-950/50 backdrop-blur border border-slate-700/30 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4">
            <pre className="text-slate-100 text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words selection:bg-cyan-500/20">
              {typeof prompt.content === 'function' ? prompt.content()?.trim() : prompt.content?.trim()}
            </pre>
          </div>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {prompt.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-slate-800 to-slate-700 text-cyan-400 border border-cyan-500/30 cursor-pointer hover:border-cyan-400/50 transition-colors"
                  onClick={() => {
                    // Could trigger tag filter and close modal
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur border-t border-slate-700/50 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0">
            <div className="text-xs sm:text-sm text-slate-500 order-2 sm:order-1">
              Press ESC to close
            </div>
            <button
              onClick={handleCopy}
              className={`
                modal-copy-btn px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 order-1 sm:order-2 w-full sm:w-auto
                ${copied 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25'
                }
                hover:scale-105 active:scale-95
              `}
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm sm:text-base">Copied!</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm sm:text-base">Copy Prompt</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
