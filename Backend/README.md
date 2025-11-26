# Anime Site Backend

Backend API for the Anime Site built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/anime-site
JWT_SECRET=your-super-secret-jwt-key-change-this
JIKAN_API_URL=https://api.jikan.moe/v4
FRONTEND_URL=http://localhost:5173
```

4. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (protected)
- `PUT /profile` - Update profile (protected)
- `PUT /change-password` - Change password (protected)

### Anime (`/api/anime`)
- `GET /` - Get all anime (with filters)
- `GET /search?q=query` - Search anime
- `GET /top` - Get top anime
- `GET /random` - Get random anime
- `GET /seasonal/:year/:season` - Get seasonal anime
- `GET /:id` - Get anime by ID
- `GET /:id/pictures` - Get anime pictures
- `GET /:id/characters` - Get anime characters
- `GET /:id/staff` - Get anime staff
- `GET /:id/episodes` - Get anime episodes
- `GET /:id/recommendations` - Get recommendations
- `GET /:id/reviews` - Get MAL reviews

### Characters (`/api/characters`)
- `GET /:id` - Get character details
- `GET /:id/pictures` - Get character pictures

### Manga (`/api/manga`)
- `GET /search?q=query` - Search manga
- `GET /top` - Get top manga
- `GET /random` - Get random manga
- `GET /:id` - Get manga by ID
- `GET /:id/pictures` - Get manga pictures
- `GET /:id/characters` - Get manga characters
- `GET /:id/recommendations` - Get recommendations

### Watchlist (`/api/watchlist`) - All Protected
- `GET /` - Get user's watchlist
- `GET /stats` - Get watchlist stats
- `POST /` - Add to watchlist
- `PUT /:id` - Update watchlist entry
- `DELETE /:id` - Remove from watchlist

### Reviews (`/api/reviews`)
- `GET /anime/:animeId` - Get reviews for anime
- `POST /` - Create review (protected)
- `PUT /:id` - Update review (protected)
- `DELETE /:id` - Delete review (protected)
- `POST /:id/like` - Like/unlike review (protected)

### Comments (`/api/comments`)
- `GET /anime/:animeId` - Get anime comments
- `GET /manga/:mangaId` - Get manga comments
- `POST /` - Create comment (protected)
- `PUT /:id` - Update comment (protected)
- `DELETE /:id` - Delete comment (protected)
- `POST /:id/like` - Like/unlike comment (protected)

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT secret key | Required |
| `JIKAN_API_URL` | Jikan API base URL | `https://api.jikan.moe/v4` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 📂 Project Structure

```
Backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── animeController.js
│   ├── characterController.js
│   ├── mangaController.js
│   ├── watchlistController.js
│   ├── reviewController.js
│   └── commentController.js
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # Input validation
├── models/
│   ├── User.js
│   ├── Anime.js
│   ├── Character.js
│   ├── Manga.js
│   ├── Watchlist.js
│   ├── Review.js
│   └── Comment.js
├── routes/
│   ├── authRoutes.js
│   ├── animeRoutes.js
│   ├── characterRoutes.js
│   ├── mangaRoutes.js
│   ├── watchlistRoutes.js
│   ├── reviewRoutes.js
│   └── commentRoutes.js
├── utils/
│   └── jikanApi.js        # Jikan API integration
├── .env.example
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## 🧪 Testing

Test endpoints using:
- **Postman**: Import the API collection
- **Thunder Client**: VS Code extension
- **curl**: Command line

Example:
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get top anime
curl http://localhost:5000/api/anime/top
```

## 🔒 Authentication

Protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Get token from `/api/auth/login` or `/api/auth/register`

## 📝 Notes

- **Jikan API**: Rate limit is 3 req/sec, 60 req/min. Built-in rate limiting with caching.
- **Caching**: Anime/manga data cached in MongoDB for 24 hours.
- **Validation**: All inputs validated with express-validator.
- **Security**: Helmet, CORS, rate limiting, bcrypt password hashing.

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Check if MongoDB is running locally
- Verify `MONGO_URI` in `.env`
- For Atlas, check network access and credentials

**Jikan API errors:**
- Rate limit exceeded: Wait 1 minute
- 404 errors: Invalid MAL ID
- Check API status: https://status.jikan.moe/

**JWT errors:**
- Verify `JWT_SECRET` is set in `.env`
- Check token expiration (default: 30 days)
- Ensure token is sent in `Authorization` header

## 📄 License

MIT

---

**Made with ❤️ for anime fans**
