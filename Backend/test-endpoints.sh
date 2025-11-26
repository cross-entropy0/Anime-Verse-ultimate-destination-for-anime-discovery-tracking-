#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}=== Testing Anime Site Backend API ===${NC}\n"

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check (GET /)${NC}"
response=$(curl -s $BASE_URL/)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Health check successful${NC}"
    echo "$response"
else
    echo -e "${RED}✗ Health check failed${NC}"
fi
echo ""

# Test 2: Register User
echo -e "${BLUE}2. Testing User Registration (POST /api/auth/register)${NC}"
response=$(curl -s -X POST $BASE_URL/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
        "username": "testuser'$RANDOM'",
        "email": "test'$RANDOM'@example.com",
        "password": "Test123456"
    }')
echo "$response"
TOKEN=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo ""

# Test 3: Login
echo -e "${BLUE}3. Testing User Login (POST /api/auth/login)${NC}"
response=$(curl -s -X POST $BASE_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test@example.com",
        "password": "Test123456"
    }')
echo "$response"
echo ""

# Test 4: Get Top Anime
echo -e "${BLUE}4. Testing Top Anime (GET /api/anime/top)${NC}"
response=$(curl -s "$BASE_URL/api/anime/top?limit=3")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 5: Search Anime
echo -e "${BLUE}5. Testing Anime Search (GET /api/anime/search?q=naruto)${NC}"
response=$(curl -s "$BASE_URL/api/anime/search?q=naruto&limit=2")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 6: Get Anime by ID
echo -e "${BLUE}6. Testing Get Anime by ID (GET /api/anime/1)${NC}"
response=$(curl -s "$BASE_URL/api/anime/1")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 7: Get Random Anime
echo -e "${BLUE}7. Testing Random Anime (GET /api/anime/random)${NC}"
response=$(curl -s "$BASE_URL/api/anime/random")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 8: Get Character
echo -e "${BLUE}8. Testing Get Character (GET /api/characters/1)${NC}"
response=$(curl -s "$BASE_URL/api/characters/1")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 9: Get Top Manga
echo -e "${BLUE}9. Testing Top Manga (GET /api/manga/top)${NC}"
response=$(curl -s "$BASE_URL/api/manga/top?limit=2")
echo "$response" | head -c 500
echo "..."
echo ""

# Test 10: Protected Route (Get Profile - should fail without token)
echo -e "${BLUE}10. Testing Protected Route without token (GET /api/auth/me)${NC}"
response=$(curl -s $BASE_URL/api/auth/me)
echo "$response"
echo ""

echo -e "${GREEN}=== All tests completed ===${NC}"
