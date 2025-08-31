export interface StorageData {
  favorites: string[];
  recentlyUsed: { id: string; timestamp: number }[];
  copyCount: Record<string, number>;
  lastVisit: number;
  achievements: string[];
  totalSessions: number;
  firstVisit: number;
  longestSession: number;
  dailyStreak: number;
  lastStreakDate: string;
  funStats: {
    totalClicks: number;
    easterEggsFound: string[];
    favoriteHour: number;
    mostUsedDay: string;
  };
}

class LocalStorage {
  private readonly STORAGE_KEY = 'prompt-library-data';

  private getDefaultData(): StorageData {
    const now = Date.now();
    return {
      favorites: [],
      recentlyUsed: [],
      copyCount: {},
      lastVisit: now,
      achievements: [],
      totalSessions: 0,
      firstVisit: now,
      longestSession: 0,
      dailyStreak: 0,
      lastStreakDate: new Date().toDateString(),
      funStats: {
        totalClicks: 0,
        easterEggsFound: [],
        favoriteHour: new Date().getHours(),
        mostUsedDay: new Date().toLocaleDateString('en-US', { weekday: 'long' })
      }
    };
  }

  getData(): StorageData {
    if (typeof window === 'undefined') return this.getDefaultData();
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return this.getDefaultData();
      return { ...this.getDefaultData(), ...JSON.parse(data) };
    } catch {
      return this.getDefaultData();
    }
  }

  setData(data: Partial<StorageData>) {
    if (typeof window === 'undefined') return this.getDefaultData();
    
    try {
      const currentData = this.getData();
      const newData = { ...currentData, ...data, lastVisit: Date.now() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
      return newData;
    } catch (e) {
      console.error('Failed to save to localStorage', e);
      return this.getData();
    }
  }

  toggleFavorite(promptId: string): boolean {
    const data = this.getData();
    const index = data.favorites.indexOf(promptId);
    if (index > -1) {
      data.favorites.splice(index, 1);
      this.setData({ favorites: data.favorites });
      return false;
    } else {
      data.favorites.push(promptId);
      this.setData({ favorites: data.favorites });
      return true;
    }
  }

  isFavorite(promptId: string): boolean {
    const data = this.getData();
    return data.favorites.includes(promptId);
  }

  addRecentlyUsed(promptId: string) {
    const data = this.getData();
    const recentlyUsed = data.recentlyUsed.filter(item => item.id !== promptId);
    recentlyUsed.unshift({ id: promptId, timestamp: Date.now() });
    this.setData({ recentlyUsed: recentlyUsed.slice(0, 10) });
  }

  incrementCopyCount(promptId: string) {
    const data = this.getData();
    data.copyCount[promptId] = (data.copyCount[promptId] || 0) + 1;
    this.setData({ copyCount: data.copyCount });
    this.addRecentlyUsed(promptId);
  }

  getCopyCount(promptId: string): number {
    const data = this.getData();
    return data.copyCount[promptId] || 0;
  }

  getRecentlyUsed(): string[] {
    const data = this.getData();
    return data.recentlyUsed.map(item => item.id);
  }

  getFavorites(): string[] {
    const data = this.getData();
    return data.favorites;
  }

  // Achievement tracking
  addAchievement(achievementId: string) {
    const data = this.getData();
    if (!data.achievements.includes(achievementId)) {
      data.achievements.push(achievementId);
      this.setData({ achievements: data.achievements });
      return true;
    }
    return false;
  }

  hasAchievement(achievementId: string): boolean {
    const data = this.getData();
    return data.achievements.includes(achievementId);
  }

  getAchievements(): string[] {
    const data = this.getData();
    return data.achievements;
  }

  // Session tracking
  startSession() {
    if (typeof window === 'undefined') return;
    
    const data = this.getData();
    const now = Date.now();
    const todayString = new Date().toDateString();
    
    // Update daily streak
    if (data.lastStreakDate !== todayString) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (data.lastStreakDate === yesterday.toDateString()) {
        data.dailyStreak += 1;
      } else {
        data.dailyStreak = 1;
      }
      
      data.lastStreakDate = todayString;
    }
    
    data.totalSessions += 1;
    this.setData({ 
      totalSessions: data.totalSessions, 
      dailyStreak: data.dailyStreak,
      lastStreakDate: data.lastStreakDate,
      lastVisit: now 
    });
  }

  // Fun statistics
  incrementClicks() {
    const data = this.getData();
    data.funStats.totalClicks += 1;
    this.setData({ funStats: data.funStats });
  }

  addEasterEgg(eggId: string) {
    const data = this.getData();
    if (!data.funStats.easterEggsFound.includes(eggId)) {
      data.funStats.easterEggsFound.push(eggId);
      this.setData({ funStats: data.funStats });
      return true;
    }
    return false;
  }

  updateFavoriteHour() {
    const data = this.getData();
    data.funStats.favoriteHour = new Date().getHours();
    this.setData({ funStats: data.funStats });
  }

  // Get fun statistics for display
  getFunStats() {
    const data = this.getData();
    const totalCopies = Object.values(data.copyCount).reduce((sum, count) => sum + count, 0);
    const daysSinceFirst = Math.floor((Date.now() - data.firstVisit) / (1000 * 60 * 60 * 24));
    
    return {
      totalPrompts: Object.keys(data.copyCount).length,
      totalCopies,
      totalFavorites: data.favorites.length,
      totalSessions: data.totalSessions,
      dailyStreak: data.dailyStreak,
      daysSinceFirst: Math.max(1, daysSinceFirst),
      totalClicks: data.funStats.totalClicks,
      easterEggsFound: data.funStats.easterEggsFound.length,
      achievements: data.achievements.length,
      favoriteHour: data.funStats.favoriteHour,
      mostUsedDay: data.funStats.mostUsedDay
    };
  }

  // Get personalized insights
  getInsights() {
    const stats = this.getFunStats();
    const insights = [];
    
    if (stats.dailyStreak > 7) {
      insights.push(`🔥 You're on a ${stats.dailyStreak}-day streak!`);
    }
    
    if (stats.totalCopies > 50) {
      insights.push(`🚀 You've copied ${stats.totalCopies} prompts - you're a power user!`);
    }
    
    if (stats.easterEggsFound > 3) {
      insights.push(`🕵️ Secret hunter! You've found ${stats.easterEggsFound} easter eggs!`);
    }
    
    if (stats.totalFavorites > 10) {
      insights.push(`❤️ Collector! You've favorited ${stats.totalFavorites} prompts!`);
    }
    
    return insights;
  }
}

export const storage = new LocalStorage();

// Initialize session tracking when module loads (only in browser)
if (typeof window !== 'undefined') {
  storage.startSession();
}