import React, { useState, useEffect, useMemo } from 'react';
import PromptCard from './PromptCard';
import PromptModal from './PromptModal';
import { storage } from '../utils/storage';

// @ts-ignore
const promptImports = import.meta.glob('../pages/prompts/*.md', { eager: true });

const prompts = Object.entries(promptImports).map(([path, mod]: [string, any]) => {
  const filename = path.split('/').pop()?.replace('.md', '') || '';
  return {
    id: filename,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [copyCount, setCopyCount] = useState<Record<string, number>>({});
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const data = storage.getData();
    setFavorites(data.favorites);
    setRecentlyUsed(data.recentlyUsed.map(item => item.id));
    setCopyCount(data.copyCount);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !modalOpen) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      } else if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  const handleToggleFavorite = (promptId: string) => {
    storage.toggleFavorite(promptId);
    setFavorites(storage.getFavorites());
  };

  const handleCopy = (promptId: string, content: string) => {
    storage.incrementCopyCount(promptId);
    setCopyCount(storage.getData().copyCount);
    setRecentlyUsed(storage.getRecentlyUsed());
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tag
    if (activeTag) {
      filtered = filtered.filter(p => 
        Array.isArray(p.tags) ? p.tags.includes(activeTag) : p.tags === activeTag
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(p => favorites.includes(p.id));
    }

    return filtered;
  }, [searchQuery, activeTag, showFavoritesOnly, favorites]);

  // Get popular prompts (top 3 by copy count)
  const popularPrompts = useMemo(() => {
    return [...prompts]
      .sort((a, b) => (copyCount[b.id] || 0) - (copyCount[a.id] || 0))
      .slice(0, 3)
      .filter(p => (copyCount[p.id] || 0) > 10);
  }, [copyCount]);

  // Get recently used prompts (max 5)
  const recentPrompts = useMemo(() => {
    return recentlyUsed
      .slice(0, 5)
      .map(id => prompts.find(p => p.id === id))
      .filter(Boolean);
  }, [recentlyUsed]);

  const totalCopies = Object.values(copyCount).reduce((sum, count) => sum + count, 0);

  return (
    <>
      {/* Header Stats */}
      <div className="mb-8 p-6 bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {prompts.length}
            </div>
            <div className="text-sm text-slate-400">Total Prompts</div>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {allTags.length}
            </div>
            <div className="text-sm text-slate-400">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {totalCopies}
            </div>
            <div className="text-sm text-slate-400">Times Used</div>
          </div>
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              {favorites.length}
            </div>
            <div className="text-sm text-slate-400">Favorites</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            id="search-input"
            type="text"
            placeholder="Search prompts... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            showFavoritesOnly
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
          }`}
        >
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Favorites {favorites.length > 0 && `(${favorites.length})`}
          </span>
        </button>

        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
              tag === activeTag
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            {tag}
          </button>
        ))}
        
        {(activeTag || showFavoritesOnly || searchQuery) && (
          <button
            onClick={() => {
              setActiveTag(null);
              setShowFavoritesOnly(false);
              setSearchQuery('');
            }}
            className="px-3 py-2 rounded-full text-sm font-medium bg-slate-800/80 text-red-400 hover:bg-slate-700/80 border border-red-500/30 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Recently Used Section */}
      {recentPrompts.length > 0 && !searchQuery && !activeTag && !showFavoritesOnly && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recently Used
          </h2>
          <div className="grid gap-4">
            {recentPrompts.map((prompt: any) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                content={prompt.content}
                tags={prompt.tags}
                isFavorite={favorites.includes(prompt.id)}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopy}
                copyCount={copyCount[prompt.id]}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Popular Prompts Section */}
      {popularPrompts.length > 0 && !searchQuery && !activeTag && !showFavoritesOnly && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🔥</span>
            Most Popular
          </h2>
          <div className="grid gap-4">
            {popularPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description}
                content={prompt.content}
                tags={prompt.tags}
                isFavorite={favorites.includes(prompt.id)}
                onToggleFavorite={handleToggleFavorite}
                onCopy={handleCopy}
                copyCount={copyCount[prompt.id]}
                isPopular={true}
                onClick={() => {
                  setSelectedPrompt(prompt);
                  setModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Prompts Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          {searchQuery ? `Search Results (${filteredPrompts.length})` : 
           activeTag ? `${activeTag} Prompts` :
           showFavoritesOnly ? 'Your Favorites' :
           'All Prompts'}
        </h2>
        <div className="grid gap-4">
          {filteredPrompts.map((prompt, idx) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              number={idx + 1}
              title={prompt.title}
              description={prompt.description}
              content={prompt.content}
              tags={prompt.tags}
              isFavorite={favorites.includes(prompt.id)}
              onToggleFavorite={handleToggleFavorite}
              onCopy={handleCopy}
              copyCount={copyCount[prompt.id]}
              onClick={() => {
                setSelectedPrompt(prompt);
                setModalOpen(true);
              }}
            />
          ))}
          {filteredPrompts.length === 0 && (
            <div className="text-center text-slate-400 py-8">
              No prompts found. Try adjusting your filters.
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all hover:scale-110 z-40"
          title="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Modal - Rendered at root level */}
      <PromptModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        prompt={selectedPrompt}
        isFavorite={selectedPrompt ? favorites.includes(selectedPrompt.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCopy={handleCopy}
      />
    </>
  );
};

export default PromptLibrary;
