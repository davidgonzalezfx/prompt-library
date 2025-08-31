import React, { useState } from 'react';

interface PromptCardProps {
  id: string;
  number?: number;
  title: string;
  description: string;
  content: string | (() => string);
  tags?: string[];
  onClick: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (id: string, content: string) => void;
  copyCount?: number;
  isPopular?: boolean;
}

const getPreview = (content: string | (() => string)) => {
  const text = typeof content === 'function' ? content() : content || '';
  const trimmed = text.trim().replace(/\s+/g, ' ');
  return trimmed.length > 80 ? trimmed.slice(0, 80) + '…' : trimmed;
};

const PromptCard: React.FC<PromptCardProps> = ({ 
  id,
  number, 
  title, 
  description, 
  content, 
  tags = [], 
  onClick, 
  isFavorite,
  onToggleFavorite,
  onCopy,
  copyCount = 0,
  isPopular = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textContent = typeof content === 'function' ? content() : content;
    navigator.clipboard.writeText(textContent);
    onCopy(id, textContent);
    setCopied(true);
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  return (
    <div
      className={`
        relative group w-full prompt-card
        bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90
        backdrop-blur-xl backdrop-saturate-150
        border border-slate-700/50
        rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl
        transition-all duration-300 ease-out
        cursor-pointer p-3 sm:p-4 lg:p-6 mb-4
        hover:border-cyan-500/50 hover:translate-y-[-2px]
        ${isPopular ? 'ring-2 ring-purple-500/30 ring-offset-2 ring-offset-slate-900/50' : ''}
        will-change-transform overflow-hidden max-w-full
      `}
      onClick={onClick}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {isPopular && (
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap">
          <span className="hidden sm:inline">🔥 Popular</span>
          <span className="sm:hidden">🔥</span>
        </div>
      )}

      <div className="flex items-start gap-2 sm:gap-3 lg:gap-4">
        {number !== undefined && (
          <div className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent min-w-[1.5rem] sm:min-w-[2rem] lg:min-w-[2.5rem] text-right flex-shrink-0">
            {number}.
          </div>
        )}
        
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-3">
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors leading-tight break-words">
                {title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 break-words">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 button-group">
              <button
                onClick={handleFavorite}
                className={`
                  p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] lg:min-w-[40px] lg:min-h-[40px] flex items-center justify-center
                  ${isFavorite 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-pink-400 hover:bg-slate-700/50'
                  }
                  hover:scale-105 active:scale-95
                `}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button
                onClick={handleCopy}
                className={`
                  p-1 sm:p-1.5 lg:p-2 rounded-lg transition-all duration-200 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] lg:min-w-[40px] lg:min-h-[40px] flex items-center justify-center
                  ${copied 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50'
                  }
                  hover:scale-105 active:scale-95
                `}
                title="Copy prompt"
              >
                {copied ? (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="bg-slate-950/50 backdrop-blur border border-slate-700/30 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-2 sm:mb-3 overflow-hidden">
            <code className="text-cyan-400/90 text-xs font-mono block w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {getPreview(content)}
            </code>
          </div>

          <div className="flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="flex flex-wrap gap-1 sm:gap-2 order-2 sm:order-1 w-full sm:w-auto overflow-hidden tag-container">
              {/* Show only first 2 tags on mobile, all on desktop */}
              {tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`
                    px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-slate-800 to-slate-700 text-cyan-400 border border-cyan-500/30 cursor-pointer transition-all hover:border-cyan-400/50 flex-shrink-0 max-w-full truncate
                    ${index >= 2 ? 'hidden sm:inline-block' : ''}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Could trigger tag filter here
                  }}
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="sm:hidden px-1.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/50 text-slate-500 flex-shrink-0">
                  +{tags.length - 2}
                </span>
              )}
            </div>

            {copyCount > 0 && (
              <div className="flex items-center gap-1 text-slate-500 text-xs order-1 sm:order-2 flex-shrink-0">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="whitespace-nowrap">{copyCount} {copyCount === 1 ? 'use' : 'uses'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {copied && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-green-500 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg shadow-2xl text-xs sm:text-sm lg:text-base whitespace-nowrap">
            Copied to clipboard!
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptCard;