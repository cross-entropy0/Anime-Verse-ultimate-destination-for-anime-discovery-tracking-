# AnimeVerse Docker Setup

## 🐳 Docker Configuration

This project uses Docker for easy development and deployment.

### Services:
- **MongoDB** (Port 27018) - Database without authentication
- **Mongo Express** (Port 8081) - Database GUI (admin/admin123)
- **Backend API** (Port 3000) - Express server
- **Frontend** (Port 5173) - React app with Nginx

### Quick Start:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Access URLs:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Mongo Express: http://localhost:8081 (admin/admin123)
- MongoDB: localhost:27018

### MongoDB Connection:

**Local Development (Docker):**
```
MONGO_URI=mongodb://localhost:27018/anime-site
```

**Inside Docker containers:**
```
MONGO_URI=mongodb://mongodb:27017/anime-site
```

**MongoDB Atlas (works everywhere):**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/anime-site
```

> ✅ **Atlas works in Docker!** MongoDB Atlas connection strings work both locally and in Docker because they connect via internet, not localhost.

### Environment Variables:

Create `.env` in Backend folder:
```env
# For Atlas (recommended for production)
MONGO_URI=mongodb+srv://your_atlas_connection_string

# For local Docker MongoDB (development)
# MONGO_URI=mongodb://mongodb:27017/anime-site

JWT_SECRET=your_super_secret_jwt_key
PORT=3000
NODE_ENV=production
JIKAN_API_URL=https://api.jikan.moe/v4
FRONTEND_URL=http://localhost:5173
```

### Development Workflow:

```bash
# First time setup
docker-compose up -d

# Make code changes (auto-reload in dev mode)
# Backend: nodemon watches for changes
# Frontend: Vite HMR

# View database in Mongo Express
# Open http://localhost:8081

# Stop everything
docker-compose down

# Remove volumes (clean database)
docker-compose down -v
```

### Production Deployment:

For production, use MongoDB Atlas instead of Docker MongoDB:
1. Create MongoDB Atlas cluster (free tier available)
2. Get connection string
3. Update `MONGO_URI` in docker-compose.yml or .env
4. No need to run MongoDB container in production
