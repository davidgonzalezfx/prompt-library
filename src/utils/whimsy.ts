// Whimsical animations and effects utility

// Confetti animation
export const createConfetti = (element: HTMLElement) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 6 + 4;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 0.5;
    
    confetti.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${element.getBoundingClientRect().left + element.offsetWidth / 2}px;
      top: ${element.getBoundingClientRect().top + element.offsetHeight / 2}px;
      z-index: 9999;
      pointer-events: none;
      animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
      transform-origin: center center;
    `;
    
    document.body.appendChild(confetti);
    
    // Clean up after animation
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, (duration + delay) * 1000);
  }
};

// Particle burst effect
export const createParticleBurst = (element: HTMLElement, options = {}) => {
  const defaults = {
    count: 20,
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    size: 4,
    spread: 100
  };
  
  const settings = { ...defaults, ...options };
  
  for (let i = 0; i < settings.count; i++) {
    const particle = document.createElement('div');
    const color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
    const angle = (360 / settings.count) * i;
    const velocity = Math.random() * 50 + 30;
    const size = Math.random() * settings.size + 2;
    
    particle.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      left: ${element.getBoundingClientRect().left + element.offsetWidth / 2}px;
      top: ${element.getBoundingClientRect().top + element.offsetHeight / 2}px;
      z-index: 9999;
      pointer-events: none;
      animation: particle-burst-${i} 1.5s ease-out forwards;
    `;
    
    const keyframes = `
      @keyframes particle-burst-${i} {
        0% {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate(
            ${Math.cos(angle * Math.PI / 180) * velocity}px,
            ${Math.sin(angle * Math.PI / 180) * velocity}px
          ) scale(0);
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) particle.parentNode.removeChild(particle);
      if (styleSheet.parentNode) styleSheet.parentNode.removeChild(styleSheet);
    }, 1500);
  }
};

// Floating hearts effect
export const createFloatingHearts = (element: HTMLElement) => {
  const hearts = ['💖', '💕', '💗', '💓', '💝'];
  const heartCount = 8;
  
  for (let i = 0; i < heartCount; i++) {
    const heart = document.createElement('div');
    const emoji = hearts[Math.floor(Math.random() * hearts.length)];
    const duration = Math.random() * 2 + 3;
    const delay = Math.random() * 1;
    const xOffset = (Math.random() - 0.5) * 100;
    
    heart.textContent = emoji;
    heart.style.cssText = `
      position: fixed;
      font-size: 20px;
      left: ${element.getBoundingClientRect().left + element.offsetWidth / 2 + xOffset}px;
      top: ${element.getBoundingClientRect().top}px;
      z-index: 9999;
      pointer-events: none;
      animation: float-away ${duration}s ease-out ${delay}s forwards;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, (duration + delay) * 1000);
  }
};

// Success celebration with text
export const createSuccessCelebration = (element: HTMLElement, message: string) => {
  const celebration = document.createElement('div');
  celebration.textContent = message;
  celebration.style.cssText = `
    position: fixed;
    left: ${element.getBoundingClientRect().left + element.offsetWidth / 2}px;
    top: ${element.getBoundingClientRect().top - 30}px;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 14px;
    z-index: 9999;
    pointer-events: none;
    animation: success-bounce 2s ease-out forwards;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  `;
  
  document.body.appendChild(celebration);
  
  setTimeout(() => {
    if (celebration.parentNode) {
      celebration.parentNode.removeChild(celebration);
    }
  }, 2000);
};

// Random motivational messages
export const motivationalMessages = [
  "You're doing great! 🌟",
  "Keep exploring! 🚀",
  "Amazing choice! ✨",
  "You're unstoppable! 💪",
  "Brilliant work! 🎉",
  "You're on fire! 🔥",
  "Fantastic progress! 🎯",
  "You're crushing it! 💯",
  "Superb selection! 🏆",
  "You're a star! ⭐",
  "Excellent taste! 👌",
  "You're legendary! 🦄",
  "Outstanding! 🎪",
  "You're magical! ✨",
  "Incredible! 🌈"
];

export const getRandomMessage = () => {
  return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
};

// Shake animation for easter egg
export const addShakeAnimation = (element: HTMLElement) => {
  element.style.animation = 'shake 0.5s ease-in-out';
  setTimeout(() => {
    element.style.animation = '';
  }, 500);
};

// Bounce animation
export const addBounceAnimation = (element: HTMLElement) => {
  element.style.animation = 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  setTimeout(() => {
    element.style.animation = '';
  }, 600);
};

// Pulse glow effect
export const addPulseGlow = (element: HTMLElement, duration = 2000) => {
  element.classList.add('pulse-glow-effect');
  setTimeout(() => {
    element.classList.remove('pulse-glow-effect');
  }, duration);
};

// Achievement notification
export const showAchievement = (title: string, description: string, icon = '🏆') => {
  const existing = document.querySelector('.achievement-notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-icon">${icon}</div>
    <div class="achievement-content">
      <div class="achievement-title">${title}</div>
      <div class="achievement-desc">${description}</div>
    </div>
    <button class="achievement-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10000;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    animation: achievement-slide-in 0.5s ease-out;
    max-width: 350px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'achievement-slide-out 0.3s ease-in forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
};

// Copy count milestones
export const checkCopyMilestones = (copyCount: number) => {
  const milestones = [
    { count: 1, title: "First Copy!", desc: "You've made your first copy!", icon: "🎉" },
    { count: 5, title: "Getting Started", desc: "5 prompts copied!", icon: "🚀" },
    { count: 10, title: "Prompt Explorer", desc: "10 prompts copied!", icon: "🗺️" },
    { count: 25, title: "Power User", desc: "25 prompts copied!", icon: "⚡" },
    { count: 50, title: "Prompt Master", desc: "50 prompts copied!", icon: "🏆" },
    { count: 100, title: "Prompt Legend", desc: "100 prompts copied!", icon: "🌟" }
  ];
  
  const milestone = milestones.find(m => m.count === copyCount);
  if (milestone) {
    showAchievement(milestone.title, milestone.desc, milestone.icon);
  }
};

// Favorite count milestones
export const checkFavoriteMilestones = (favoriteCount: number) => {
  const milestones = [
    { count: 1, title: "First Favorite!", desc: "You've saved your first prompt!", icon: "💝" },
    { count: 5, title: "Collector", desc: "5 prompts favorited!", icon: "📚" },
    { count: 10, title: "Curator", desc: "10 prompts favorited!", icon: "🎭" },
    { count: 20, title: "Connoisseur", desc: "20 prompts favorited!", icon: "🍷" }
  ];
  
  const milestone = milestones.find(m => m.count === favoriteCount);
  if (milestone) {
    showAchievement(milestone.title, milestone.desc, milestone.icon);
  }
};

// Easter egg checker
export const checkEasterEggs = (sequence: string[]) => {
  const easterEggs = {
    'konami': ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    'dance': ['KeyD', 'KeyA', 'KeyN', 'KeyC', 'KeyE'],
    'magic': ['KeyM', 'KeyA', 'KeyG', 'KeyI', 'KeyC'],
    'party': ['KeyP', 'KeyA', 'KeyR', 'KeyT', 'KeyY']
  };
  
  for (const [name, code] of Object.entries(easterEggs)) {
    if (arraysEqual(sequence.slice(-code.length), code)) {
      triggerEasterEgg(name);
      return true;
    }
  }
  return false;
};

const arraysEqual = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((val, i) => val === b[i]);
};

const triggerEasterEgg = (type: string) => {
  switch (type) {
    case 'konami':
      document.body.style.animation = 'rainbow-bg 3s ease-in-out';
      showAchievement('Konami Code!', 'You found the secret!', '🎮');
      break;
    case 'dance':
      document.body.style.animation = 'dance 2s ease-in-out';
      showAchievement('Dance Party!', 'Let\'s boogie!', '💃');
      break;
    case 'magic':
      createConfetti(document.body);
      showAchievement('Magic Moment!', 'Abracadabra!', '✨');
      break;
    case 'party':
      createParticleBurst(document.body, { count: 50, colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'] });
      showAchievement('Party Time!', 'Let\'s celebrate!', '🎉');
      break;
  }
  
  setTimeout(() => {
    document.body.style.animation = '';
  }, 3000);
};

// Loading messages for better UX
export const loadingMessages = [
  "Brewing some magic... ☕",
  "Assembling awesomeness... 🔧",
  "Sprinkling fairy dust... ✨",
  "Loading brilliance... 🧠",
  "Preparing something special... 🎁",
  "Crafting excellence... 🎨",
  "Summoning creativity... 🪄",
  "Building dreams... 🏗️"
];

export const getRandomLoadingMessage = () => {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
};