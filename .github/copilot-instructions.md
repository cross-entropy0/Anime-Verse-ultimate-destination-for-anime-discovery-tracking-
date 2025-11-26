# Anime Site - AI Agent Instructions

## Project Overview
Full-stack MERN anime streaming/information platform with separate Backend and Frontend architecture.

**Stack:**
- **Backend/**: Node.js + Express + MongoDB (Mongoose ODM)
- **Frontend/**: React (Vite) + React Router + Tailwind CSS
- **State Management**: Context API / Redux Toolkit
- **Authentication**: JWT (JSON Web Tokens)

## Architecture & Project Structure

### Monorepo Organization
```
Backend/
├── config/         # Database, environment configs
├── models/         # Mongoose schemas (User, Anime, Review, Watchlist)
├── routes/         # Express route handlers
├── controllers/    # Business logic
├── middleware/     # Auth, error handling, validation
├── utils/          # Helper functions, API clients
├── server.js       # Entry point
└── .env.example    # Environment template

Frontend/
├── public/         # Static assets
├── src/
│   ├── components/ # Reusable UI components
│   ├── pages/      # Route-based page components
│   ├── context/    # Context providers (Auth, Theme)
│   ├── hooks/      # Custom React hooks
│   ├── services/   # API service layer
│   ├── utils/      # Helper functions
│   ├── App.jsx     # Main app component
│   └── main.jsx    # Entry point
└── .env.example    # Environment template
```

### Development Workflow

**Initial Setup:**
1. Backend: `cd Backend && npm init -y && npm install express mongoose dotenv cors bcryptjs jsonwebtoken`
2. Frontend: `cd Frontend && npm create vite@latest . -- --template react && npm install`
3. Install dev tools: `nodemon` (Backend), `react-router-dom axios tailwindcss` (Frontend)
4. Configure MongoDB connection string in `Backend/.env`
5. Set up CORS in Backend to allow `http://localhost:5173`

**Running the Application:**
- Backend: `cd Backend && npm run dev` (port 3000)
- Frontend: `cd Frontend && npm run dev` (port 5173)
- MongoDB: Local instance or MongoDB Atlas cloud
- Use two terminal windows or `concurrently` for both servers

## Database Schema (MongoDB/Mongoose)

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed with bcrypt),
  avatar: String (URL),
  createdAt: Date,
  preferences: {
    favoriteGenres: [String],
    theme: String
  }
}
```

### Anime Model (cached from external APIs)
```javascript
{
  malId: Number (MyAnimeList ID),
  title: String,
  englishTitle: String,
  japaneseTitle: String,
  synopsis: String,
  background: String,
  imageUrl: String,
  trailerUrl: String,
  episodes: Number,
  duration: String (e.g., "24 min per ep"),
  status: String (Airing/Completed/Upcoming),
  aired: { from: Date, to: Date },
  broadcast: { day: String, time: String, timezone: String },
  rating: String,
  genres: [String],
  themes: [String],
  demographics: [String],
  studios: [String],
  producers: [String],
  licensors: [String],
  source: String (Manga/Light novel/Original/etc),
  score: Number,
  scoredBy: Number,
  rank: Number,
  popularity: Number,
  year: Number,
  season: String,
  lastUpdated: Date
}
```

### Character Model (cached from Jikan API)
```javascript
{
  malId: Number (MyAnimeList Character ID),
  name: String,
  nameKanji: String,
  nicknames: [String],
  about: String (long biography),
  imageUrl: String,
  favorites: Number,
  animeAppearances: [{ 
    malId: Number, 
    title: String, 
    role: String (Main/Supporting) 
  }],
  mangaAppearances: [{ malId: Number, title: String, role: String }],
  voiceActors: [{ 
    malId: Number, 
    name: String, 
    imageUrl: String, 
    language: String 
  }],
  lastUpdated: Date
}
```

### Manga Model (cached from Jikan API)
```javascript
{
  malId: Number (MyAnimeList Manga ID),
  title: String,
  englishTitle: String,
  japaneseTitle: String,
  synopsis: String,
  imageUrl: String,
  type: String (Manga/Manhwa/Manhua/Novel/One-shot/Doujinshi),
  chapters: Number,
  volumes: Number,
  status: String (Publishing/Completed/Discontinued/On Hiatus),
  published: { from: Date, to: Date },
  score: Number,
  scoredBy: Number,
  rank: Number,
  popularity: Number,
  genres: [String],
  themes: [String],
  demographics: [String],
  authors: [{ malId: Number, name: String, type: String }],
  serializations: [String],
  lastUpdated: Date
}
```

### Comment Model (user-generated comments)
```javascript
{
  userId: ObjectId (ref: 'User'),
  animeId: ObjectId (ref: 'Anime'),
  mangaId: ObjectId (ref: 'Manga', optional),
  text: String (required, 1-1000 chars),
  likes: [ObjectId] (ref: 'User'),
  parentId: ObjectId (ref: 'Comment', null for top-level, for nested replies),
  createdAt: Date,
  updatedAt: Date
}
```

### Watchlist Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  animeId: ObjectId (ref: 'Anime'),
  status: String (watching/completed/plan-to-watch/dropped),
  episodesWatched: Number,
  userRating: Number (1-10),
  favorite: Boolean,
  addedAt: Date,
  updatedAt: Date
}
```

### Review Model
```javascript
{
  userId: ObjectId (ref: 'User'),
  animeId: ObjectId (ref: 'Anime'),
  rating: Number (1-10),
  review: String,
  likes: [ObjectId] (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## Backend API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user (hash password with bcrypt)
- `POST /login` - Login user (return JWT token)
- `POST /logout` - Logout user
- `GET /me` - Get current user (protected, requires JWT)
- `PUT /profile` - Update user profile (protected)

### Anime Routes (`/api/anime`)
- `GET /` - Get all anime (paginated, with filters: genre, status, year, season)
- `GET /search?q=query` - Search anime by title
- `GET /:id` - Get single anime details (full data)
- `GET /:id/pictures` - Get anime pictures/screenshots
- `GET /:id/characters` - Get character list for anime
- `GET /:id/staff` - Get staff (producers, directors, etc.)
- `GET /:id/episodes` - Get episode list (if available)
- `GET /:id/recommendations` - Get recommended similar anime
- `GET /trending` - Get trending anime (current season)
- `GET /top` - Get top-rated anime
- `GET /seasonal/:season/:year` - Get seasonal anime
- `GET /random` - Get random anime

### Watchlist Routes (`/api/watchlist`) - All Protected
- `GET /` - Get user's watchlist
- `POST /` - Add anime to watchlist
- `PUT /:id` - Update watchlist entry (status, episodes watched, rating)
- `DELETE /:id` - Remove from watchlist
- `GET /stats` - Get user stats (total watched, avg rating, etc.)

### Review Routes (`/api/reviews`)
- `GET /anime/:animeId` - Get all reviews for an anime
- `POST /` - Create review (protected)
- `PUT /:id` - Update own review (protected)
- `DELETE /:id` - Delete own review (protected)
- `POST /:id/like` - Like a review (protected)

### Character Routes (`/api/characters`)
- `GET /:id` - Get character full details
- `GET /:id/anime` - Get anime appearances
- `GET /:id/manga` - Get manga appearances
- `GET /:id/voice-actors` - Get voice actor list
- `GET /:id/pictures` - Get character images
- `GET /search?q=name` - Search characters by name

### Manga Routes (`/api/manga`)
- `GET /` - Browse manga (paginated with filters: genre, type, status)
- `GET /search?q=query` - Search manga
- `GET /:id` - Get manga details
- `GET /:id/characters` - Get characters in manga
- `GET /:id/pictures` - Get manga artwork
- `GET /:id/recommendations` - Get recommended manga
- `GET /top` - Get top-rated manga
- `GET /random` - Get random manga

### Comment Routes (`/api/comments`)
- `GET /anime/:animeId` - Get all comments for anime (paginated, nested)
- `GET /manga/:mangaId` - Get all comments for manga (paginated, nested)
- `POST /` - Create comment (protected)
- `PUT /:id` - Update own comment (protected)
- `DELETE /:id` - Delete own comment (protected)
- `POST /:id/like` - Like/unlike comment (protected)
- `POST /:id/reply` - Reply to comment (protected, creates nested comment)

## Frontend Pages & Routes

### Public Pages
- `/` - **Home Page**: Hero section, trending anime carousel, top anime grid, seasonal picks, random anime
- `/browse` - **Browse Page**: Filterable anime grid (genre, year, status, rating), pagination
- `/anime/:id` - **Anime Details**: See detailed structure below ⬇️
- `/character/:id` - **Character Details**: Full bio, voice actors, anime/manga appearances
- `/manga` - **Manga Browse**: Filterable manga grid (genre, type, status), pagination
- `/manga/:id` - **Manga Details**: Similar to anime details (synopsis, pictures, characters, comments)
- `/search` - **Search Results**: Display search results with filters (anime + manga)
- `/random` - **Random Discover**: Random anime/manga with refresh button
- `/login` - **Login Page**: Email/password form
- `/register` - **Register Page**: Username, email, password form

### Protected Pages (require authentication)
- `/profile` - **User Profile**: Avatar, username, stats, preferences
- `/watchlist` - **My Watchlist**: Tabs for watching/completed/plan-to-watch/dropped
- `/dashboard` - **Dashboard**: User stats, recently watched, recommendations

---

## `/anime/:id` - Enhanced Anime Details Page Structure

**Modern, comprehensive layout with 8 main sections (inspired by AniList/MyAnimeList):**

### 1. Hero Header Section
- Full-width backdrop image (blurred anime banner with gradient overlay)
- Content overlay (left-aligned):
  - Poster thumbnail (200x300px, rounded corners, shadow)
  - Title (English - large, bold, white)
  - Japanese title (smaller, gray)
  - Quick stats row: ⭐ 8.5 | 📺 24 eps | 📅 Fall 2023 | 🎬 Status
  - Action buttons: [+ Add to List ▼] [♥ Favorite] [Share 🔗]

### 2. Two-Column Layout (Desktop) / Stacked (Mobile)

**Left Column (70% width):**

#### Synopsis Card
- Full synopsis with "Read More" expansion (collapse if > 300 chars)
- Background/Production info (if available from API)

#### Trailer Card
- Embedded YouTube player (16:9 aspect ratio)
- Fallback: "No trailer available" with placeholder

#### Pictures/Screenshots Section
- Section header: "Pictures & Artwork"
- Horizontal scrollable gallery (4-5 images visible, smooth scroll)
- Lightbox on click (full-screen view with navigation)
- Images from Jikan `/anime/{id}/pictures`
- Empty state: "No pictures available"

**Right Column (30% width - Sticky Sidebar):**

#### Information Card (sticky on scroll)
- **Type**: TV / Movie / OVA / Special / ONA
- **Episodes**: 24 / ? (if ongoing)
- **Status**: 🟢 Airing / 🔵 Completed / 🟠 Upcoming
- **Aired**: Oct 2023 - Mar 2024
- **Broadcast**: Sundays at 00:00 (JST)
- **Season**: Fall 2023
- **Duration**: 24 min per ep
- **Source**: Manga / Light novel / Original / Game
- **Studios**: Bones, MAPPA (linked)
- **Producers**: [List]
- **Licensors**: [List]
- **Rating**: PG-13 / R / R+ / Rx
- **Genres**: [Action] [Fantasy] [Shounen] (colored badges)
- **Themes**: [Martial Arts] [Super Power] (badges)
- **Demographic**: Shounen / Seinen / Josei / Kodomomuke
- **Score**: ⭐ 8.54/10
- **Scored by**: 123,456 users
- **Rank**: #42
- **Popularity**: #8

### 3. Characters Section
- Section header: "Characters" with "View All →" link
- Horizontal scrollable grid (5-6 character cards visible)
- Character card design:
  - Character image (150x220px, rounded)
  - Character name (bold, truncate if long)
  - Role badge: "Main" (blue bg) / "Supporting" (gray bg)
  - Voice actor name + flag (🇯🇵 Japanese, 🇺🇸 English)
  - Hover: scale animation, show "View Details" overlay
  - Click → Navigate to `/character/:id`
- Load from Jikan `/anime/{id}/characters`

### 4. Staff Section (Collapsible)
- Expandable accordion: "Staff & Production" (collapsed by default)
- Grid layout (2 columns):
  - Name (bold) | Position (Director, Script, Music, Character Design, etc.)
  - Small avatar (if available)
- Load from Jikan `/anime/{id}/staff`

### 5. Episodes Section (If Available)
- Expandable table: "Episodes (24)" (collapsed by default)
- Table columns:
  - # | Title | Aired Date | Filler (badge if applicable)
- Pagination if > 50 episodes (20 per page)
- Load from Jikan `/anime/{id}/episodes`
- Note: Not all anime have episode data in Jikan

### 6. Recommendations Section
- Section header: "You Might Also Like"
- Horizontal carousel (7-8 anime cards)
- Same card design as browse page (poster, title, score, year)
- Based on Jikan `/anime/{id}/recommendations`
- Fallback: Genre-based recommendations if API returns empty

### 7. MAL Reviews Section (External Reviews)
- Section header: "Reviews from MyAnimeList" with MAL icon
- Display 3-5 featured reviews from MAL API
- Review card design:
  - MAL username + small avatar
  - Date posted (e.g., "Jan 15, 2024")
  - Overall rating: ⭐⭐⭐⭐⭐ (1-10 scale)
  - Review text (truncated to 200 chars with "Read Full Review" expansion)
  - Helpful votes from MAL (👍 245 found helpful)
- "View All Reviews on MyAnimeList →" external link
- Load from Jikan `/anime/{id}/reviews`

### 8. User Comments Section (Bottom - Community Discussion)
- Section header: "Community Comments (142)"

#### Comment Input Box (Visible only if logged in)
- User avatar (left)
- Textarea: placeholder "Share your thoughts..." (max 1000 chars)
- Character counter: 0/1000 (red if > 1000)
- [Cancel] [Post Comment] buttons
- If not logged in: "Login to join the conversation" with login button

#### Comments Display
- **Sort Controls**: Dropdown - Recent | Top Liked | Oldest
- **Comment Thread** (nested structure):
  - Top-level comment:
    - User avatar (circular, 40px)
    - Username (bold, clickable to profile)
    - Time ago ("2 hours ago", "3 days ago")
    - Comment text (preserves line breaks)
    - Action bar: 👍 Like (count) | 💬 Reply | 🗑️ Delete (if own comment)
  - **Nested Replies** (indented 40px, max 1 level deep):
    - Same structure as parent
    - "@username" mention at start
    - "View 3 more replies ▼" if > 3 replies (expandable)
  - Reply input (appears on click "Reply", same as comment input)
- **Pagination**: Load More button (20 comments per load)
- **Empty State**: "No comments yet. Be the first to share your thoughts!" with illustration

### Mobile Optimization for Anime Details
- Stack all sections vertically (no sidebar)
- Info sidebar → Expandable accordion below synopsis
- Horizontal scrolls for characters/recommendations (touch-friendly)
- Sticky floating action button: [+ Add to List] (bottom-right)
- Collapse long sections by default (synopsis, staff, episodes)

### UI Components

**Reusable Components:**
- `Navbar` - Logo, search bar, navigation links, user menu/login button
- `AnimeCard` - Thumbnail, title, rating, quick actions (hover: add to watchlist)
- `AnimeGrid` - Responsive grid of AnimeCards with infinite scroll/pagination
- `FilterBar` - Dropdowns for genre, year, status, season filters
- `Hero` - Large featured anime with background image, CTA buttons
- `Carousel` - Horizontal scrolling anime cards (trending, seasonal)
- `ReviewCard` - User avatar, rating, review text, like button
- `WatchlistItem` - Anime info, progress bar, episode counter, status dropdown
- `SearchBar` - Autocomplete search input with suggestions
- `Footer` - Links, social media, copyright
- `ProtectedRoute` - Route wrapper for authentication check
- `Loader` - Loading spinner/skeleton screens
- `ErrorBoundary` - Error handling component
- `TabSection` - Tabbed content container (comments/reviews/stats)
- `ImageGallery` - Lightbox image viewer with thumbnails and navigation
- `CharacterCard` - Character thumbnail with VA info, role badge
- `CommentThread` - Nested comment display with replies and likes
- `CommentForm` - Comment input with character count and validation
- `MangaCard` - Similar to AnimeCard but for manga display
- `VoiceActorCard` - Voice actor info with language flag
- `InfoSidebar` - Sticky sidebar for anime/manga details
- `SectionHeader` - Consistent section titles with "View All" links
- `EmptyState` - Placeholder for no data scenarios with illustration
- `LikeButton` - Animated like/heart button with count
- `ShareButton` - Social share functionality (copy link, Twitter, etc.)
- `ExpandableText` - Text with "Read More/Less" functionality
- `Badge` - Genre/theme/status badges with color coding

**Layout:**
- Use Tailwind CSS for styling (responsive, dark mode support)
- Mobile-first responsive design
- Navbar always visible (sticky)
- Footer on all pages
- Consistent spacing and color scheme

## Authentication Flow

### JWT Implementation
1. **Registration**: Hash password with bcrypt (10 salt rounds) → Save user → Return JWT token
2. **Login**: Verify password → Generate JWT (expires in 30d) → Return token
3. **Frontend**: Store JWT in `localStorage` or `httpOnly cookie`
4. **Protected Routes**: Send token in `Authorization: Bearer <token>` header
5. **Middleware**: Verify JWT on protected routes, attach `req.user`
6. **Logout**: Clear token from frontend storage

### Frontend Auth Context
```javascript
AuthContext provides:
- user (current user object or null)
- login(credentials)
- register(userData)
- logout()
- isAuthenticated (boolean)
- loading (boolean)
```

## External API Integration

### Primary: Jikan API (MyAnimeList unofficial)
- Base URL: `https://api.jikan.moe/v4`
- **Rate Limit**: 3 requests/second, 60 requests/minute
- **Important**: Implement request queue with 334ms delays between calls

#### Anime Endpoints
- `GET /anime` - Search/browse anime (pagination, filters)
- `GET /anime/{id}/full` - Full anime data (recommended, single call)
- `GET /anime/{id}` - Basic anime details
- `GET /anime/{id}/characters` - Character list with VAs
- `GET /anime/{id}/staff` - Staff and production crew
- `GET /anime/{id}/episodes` - Episode list (may be incomplete)
- `GET /anime/{id}/episodes/{episode}` - Single episode details
- `GET /anime/{id}/pictures` - Pictures/screenshots
- `GET /anime/{id}/videos` - Trailers and promotional videos
- `GET /anime/{id}/recommendations` - Recommended anime
- `GET /anime/{id}/reviews` - MAL user reviews
- `GET /seasons/{year}/{season}` - Seasonal anime
- `GET /top/anime` - Top-rated anime
- `GET /random/anime` - Random anime

#### Character Endpoints
- `GET /characters/{id}/full` - Full character data
- `GET /characters/{id}` - Basic character info
- `GET /characters/{id}/anime` - Anime appearances
- `GET /characters/{id}/manga` - Manga appearances
- `GET /characters/{id}/voices` - Voice actors
- `GET /characters/{id}/pictures` - Character images

#### Manga Endpoints
- `GET /manga` - Browse/search manga
- `GET /manga/{id}/full` - Full manga data
- `GET /manga/{id}` - Basic manga info
- `GET /manga/{id}/characters` - Characters in manga
- `GET /manga/{id}/pictures` - Manga artwork
- `GET /manga/{id}/recommendations` - Recommended manga
- `GET /manga/{id}/reviews` - MAL manga reviews
- `GET /top/manga` - Top-rated manga
- `GET /random/manga` - Random manga

### Caching Strategy by Data Type
```javascript
// Backend: utils/jikanApi.js

// Cache durations
- Anime/Manga basic info: 24 hours (daily refresh)
- Characters: 7 days (rarely changes)
- Pictures/Images: Indefinite (URLs stable)
- Episodes: 1 day (updates during airing)
- Reviews: 3 days (new reviews come slowly)
- Recommendations: 7 days (fairly static)
- Seasonal/Trending: 6 hours (more dynamic)
- Top lists: 12 hours (rankings change)

// Implementation pattern
const fetchWithCache = async (endpoint, cacheDuration) => {
  // 1. Check MongoDB cache
  // 2. If fresh, return cached data
  // 3. If stale/missing, fetch from Jikan with rate limiting
  // 4. Update cache with lastUpdated timestamp
  // 5. Return fresh data
};

// Rate limiting queue
let lastRequestTime = Date.now();
const MIN_REQUEST_INTERVAL = 334; // ~3 req/sec

const rateLimitedFetch = async (url) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
  return axios.get(url);
};
```

## Key Conventions

### Error Handling
- **Backend**: Centralized error middleware, consistent JSON format
  ```javascript
  { success: false, message: "Error message", error: details }
  ```
- **Frontend**: Axios interceptor for global error handling, toast notifications

### API Response Format
```javascript
// Success
{ success: true, data: {...}, message: "Optional message" }

// Error
{ success: false, message: "Error description", error: {...} }
```

### Code Patterns
- **Controllers**: Extract business logic from routes
- **Async/Await**: Use try-catch blocks, avoid callback hell
- **Validation**: Use `express-validator` for input validation
- **Mongoose**: Use async/await with `.lean()` for read operations
- **React**: Functional components with hooks, avoid class components
- **State**: Use Context for global state (auth, theme), useState for local state

### Environment Variables
**Backend (.env):**
```
MONGO_URI=mongodb://localhost:27017/anime-site
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
JIKAN_API_URL=https://api.jikan.moe/v4
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000/api
```

## Performance Optimizations

### Backend
- Index frequently queried fields in MongoDB (malId, userId, genres)
- Implement Redis caching for frequently accessed data (trending, top anime)
- Paginate all list endpoints (default 20 items per page)
- Use `select()` to limit returned fields
- Compress responses with `compression` middleware

### Frontend
- Lazy load routes with React.lazy() and Suspense
- Implement infinite scroll for browse/search pages
- Optimize images: use WebP format, lazy loading with Intersection Observer
- Debounce search input (300ms delay)
- Cache API responses with React Query or SWR
- Use React.memo() for expensive components

## Modern UI/UX Patterns (Inspired by AniList/MyAnimeList)

### Design Principles
- **Card-based layout**: All content in rounded cards with subtle shadows (`shadow-lg`)
- **Generous whitespace**: Don't cram content - use padding (`p-6`, `gap-8`)
- **Smooth transitions**: 200-300ms on all interactions (`transition-all duration-300`)
- **Glass morphism**: Semi-transparent cards with backdrop blur (`bg-opacity-90 backdrop-blur-md`)
- **Gradient accents**: Subtle gradients on headers/buttons (`bg-gradient-to-r from-primary to-secondary`)
- **Depth with shadows**: Layer elements with varying shadow intensities
- **Consistent spacing**: Use 4px/8px grid system (Tailwind's spacing scale)

### Color System
```javascript
// Tailwind config theme extension
colors: {
  primary: '#ff6b6b',    // Coral red (CTA, accents)
  secondary: '#4ecdc4',  // Teal (highlights, links)
  dark: {
    100: '#0f0f23',      // Deep background
    200: '#1a1a2e',      // Card backgrounds
    300: '#2a2a3e',      // Hover states
  },
  accent: {
    blue: '#3498db',     // Info, Main character badges
    green: '#2ecc71',    // Success, Airing status
    orange: '#f39c12',   // Warning, Upcoming status
    purple: '#9b59b6',   // Special, Featured
  }
}
```

### Interaction Patterns
- **Skeleton loading**: Show content placeholders while loading (avoid blank screens)
- **Optimistic UI updates**: Update UI immediately, sync with server in background
- **Infinite scroll**: Auto-load more on scroll (browse pages) with loading indicator
- **Lazy image loading**: Use Intersection Observer, load as images enter viewport
- **Toast notifications**: Non-intrusive feedback (top-right, auto-dismiss in 3s)
- **Modal dialogs**: For login/quick actions (dark overlay, center aligned, ESC to close)
- **Hover animations**: 
  - Cards: `hover:scale-105 hover:shadow-2xl`
  - Buttons: `hover:brightness-110`
  - Images: Slight zoom on hover
- **Pull to refresh**: Mobile gesture to reload content (optional)
- **Keyboard shortcuts**: `/` to focus search, `ESC` to close modals

### Accessibility (WCAG AA Compliance)
- **Keyboard navigation**: Tab through all interactive elements
- **Focus indicators**: Clear visible focus outlines (`focus:ring-2 focus:ring-primary`)
- **ARIA labels**: Proper labeling for screen readers on all icons/buttons
- **Color contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Alt text**: All images have descriptive alt attributes
- **Semantic HTML**: Use `<nav>`, `<main>`, `<article>`, `<section>` properly
- **Error messages**: Clear, actionable error text (not just red borders)

### Responsive Breakpoints
```javascript
// Mobile-first approach
sm: '640px',   // Small tablets
md: '768px',   // Tablets
lg: '1024px',  // Laptops
xl: '1280px',  // Desktops
2xl: '1536px', // Large desktops

// Grid patterns
- Mobile (< 640px): 1 column, full width cards
- Tablet (640-1024px): 2-3 columns, stack sidebar below
- Desktop (> 1024px): 4+ columns, sidebar on right
```

### Performance Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)

### Performance Optimizations
- **Image optimization**: 
  - Use WebP format with JPG fallback
  - Responsive images with `srcset`
  - Lazy load below fold (`loading="lazy"`)
  - Blur placeholder while loading
- **Code splitting**: 
  - React.lazy() for routes
  - Dynamic imports for heavy components
- **Bundle optimization**:
  - Tree-shaking unused code
  - Minification and compression
  - Use production builds
- **API optimization**:
  - Debounce search (300ms)
  - Cache responses (React Query / SWR)
  - Pagination over loading all data

### Animation Library Recommendations
- **Framer Motion**: Complex animations, page transitions
- **React Spring**: Physics-based animations
- **CSS Transitions**: Simple hover/focus effects (preferred for performance)

## Common Development Patterns

### Adding a New Feature (Full Stack)
1. **Database**: Define Mongoose model/schema
2. **Backend**: Create controller → Define routes → Add middleware
3. **Backend**: Test with Postman/Thunder Client
4. **Frontend**: Create API service function in `services/`
5. **Frontend**: Build UI components
6. **Frontend**: Create page component, add route
7. **Integration**: Connect UI to API, handle loading/error states

### API Service Layer Pattern (Frontend)
```javascript
// src/services/animeService.js
import axios from './axios';

export const getAnimeById = async (id) => {
  const response = await axios.get(`/anime/${id}`);
  return response.data;
};
```

### Protected Route Pattern
```javascript
// Wrap protected pages with ProtectedRoute component
// Redirects to /login if not authenticated
<Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
```

## Testing Strategy

### Backend Testing
- Use Jest + Supertest for API endpoint testing
- Test authentication middleware
- Test database operations with MongoDB Memory Server
- Mock Jikan API calls

### Frontend Testing
- Use Vitest + React Testing Library
- Test critical user flows (login, add to watchlist)
- Test component rendering and interactions
- Mock API calls with MSW (Mock Service Worker)

## Deployment Considerations

### Backend Deployment (Render/Railway/Heroku)
- Set environment variables in hosting platform
- Use MongoDB Atlas for production database
- Enable CORS for production frontend URL
- Use PM2 or platform's process manager

### Frontend Deployment (Vercel/Netlify)
- Build with `npm run build`
- Configure environment variables
- Set up redirects for React Router (SPA)
- Enable gzip compression

### Security
- Never commit `.env` files
- Use `helmet` middleware for HTTP headers
- Implement rate limiting with `express-rate-limit`
- Sanitize user inputs to prevent XSS/injection
- Use HTTPS in production
- Set secure cookie flags for auth tokens

---

**Development Priority:**

**Phase 1: Foundation (Week 1-2)**
1. Set up Backend API structure + MongoDB connection
2. Create all Mongoose models (User, Anime, Character, Manga, Watchlist, Review, Comment)
3. Implement user authentication (register/login/JWT)
4. Set up Frontend with Vite + React + Tailwind + React Router
5. Create base layout (Navbar, Footer, Theme Provider)
6. Build authentication pages (Login, Register)

**Phase 2: Anime Core Features (Week 3-4)**
7. Integrate Jikan API with rate limiting and caching
8. Build Home page (hero, trending, top anime, random)
9. Build Browse page (filters, grid, pagination, infinite scroll)
10. **Build enhanced Anime Details page (all 8 sections)**
11. Implement search functionality (real-time, debounced)

**Phase 3: User Features (Week 5-6)**
12. Create watchlist system (add/update/delete/stats)
13. Build Watchlist page (tabs, progress tracking)
14. Build Profile page (avatar, stats, settings)
15. Build Dashboard page (continue watching, recommendations)
16. Implement Comments system (create, reply, like, delete)

**Phase 4: Extended Content (Week 7-8)**
17. Integrate Character endpoints and build Character Details page
18. Build Manga section (browse, details, comments)
19. Implement Random anime/manga discovery page
20. Add MAL Reviews display on anime/manga pages
21. Build Recommendations engine (genre-based initially)

**Phase 5: Polish & Deploy (Week 9-10)**
22. Implement all loading states and skeleton screens
23. Add error handling and retry logic
24. Mobile responsive optimization (all pages)
25. Performance optimization (lazy loading, image optimization, code splitting)
26. Accessibility audit and fixes
27. Write tests (critical user flows)
28. Deploy Backend (Render/Railway) + Frontend (Vercel/Netlify)
29. Monitor and fix production bugs
30. SEO optimization (meta tags, sitemap, robots.txt)
