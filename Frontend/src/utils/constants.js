// List of all anime genres
export const GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

// Anime status options
export const ANIME_STATUS = [
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
];

// Watchlist status options
export const WATCHLIST_STATUS = [
  { value: 'watching', label: 'Watching', color: 'bg-accent-green' },
  { value: 'completed', label: 'Completed', color: 'bg-accent-blue' },
  { value: 'plan-to-watch', label: 'Plan to Watch', color: 'bg-accent-orange' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-accent-purple' },
  { value: 'dropped', label: 'Dropped', color: 'bg-accent-red' },
];

// Seasons
export const SEASONS = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
];

// Sort options for anime
export const SORT_OPTIONS = [
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'favorites', label: 'Favorites' },
  { value: 'title', label: 'Title' },
  { value: 'start_date', label: 'Start Date' },
];

// Comment sort options
export const COMMENT_SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'liked', label: 'Most Liked' },
  { value: 'oldest', label: 'Oldest First' },
];

// Review sort options
export const REVIEW_SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'liked', label: 'Most Liked' },
  { value: 'rating_high', label: 'Highest Rating' },
  { value: 'rating_low', label: 'Lowest Rating' },
];

// Anime types
export const ANIME_TYPES = [
  { value: 'tv', label: 'TV' },
  { value: 'movie', label: 'Movie' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

// Manga types
export const MANGA_TYPES = [
  { value: 'manga', label: 'Manga' },
  { value: 'novel', label: 'Novel' },
  { value: 'oneshot', label: 'One-shot' },
  { value: 'doujin', label: 'Doujinshi' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
];

// Rating options (1-10)
export const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

// Items per page
export const ITEMS_PER_PAGE = 20;

// Default placeholder image
export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

// Default avatar
export const DEFAULT_AVATAR = (name) => 
  `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`;

// API error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Please login to continue.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
