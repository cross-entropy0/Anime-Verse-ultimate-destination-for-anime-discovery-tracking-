// Format date to relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format season and year
export const formatSeason = (season, year) => {
  if (!season || !year) return 'Unknown';
  return `${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get season from month
export const getSeasonFromMonth = (month) => {
  const seasons = {
    winter: [12, 1, 2],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    fall: [9, 10, 11],
  };

  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month)) return season;
  }
  return 'winter';
};

// Get current season
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  return getSeasonFromMonth(month);
};

// Get current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Format score (e.g., 8.5 → "8.50")
export const formatScore = (score) => {
  if (!score) return 'N/A';
  return Number(score).toFixed(2);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'Airing': 'text-accent-green',
    'Finished Airing': 'text-accent-blue',
    'Not yet aired': 'text-accent-orange',
    'Upcoming': 'text-accent-orange',
    'Completed': 'text-accent-blue',
    'Publishing': 'text-accent-green',
    'Discontinued': 'text-accent-red',
    'On Hiatus': 'text-accent-orange',
  };
  return colors[status] || 'text-gray-400';
};

// Get status badge color
export const getStatusBadgeColor = (status) => {
  const colors = {
    'watching': 'bg-accent-green',
    'completed': 'bg-accent-blue',
    'plan-to-watch': 'bg-accent-orange',
    'dropped': 'bg-accent-red',
    'on-hold': 'bg-accent-purple',
  };
  return colors[status] || 'bg-gray-500';
};

// Extract YouTube video ID from URL
export const extractYouTubeId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Scroll to top smoothly
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Generate random color for avatar
export const getRandomColor = () => {
  const colors = ['#ff6b6b', '#4ecdc4', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Format number with K, M notation
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
