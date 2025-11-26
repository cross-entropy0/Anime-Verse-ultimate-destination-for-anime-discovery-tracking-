import api from './api';

export const animeService = {
  // Get all anime with filters
  searchAnime: async (params = {}) => {
    try {
      const response = await api.get('/anime', { params });
      console.log('searchAnime response:', response.data);
      return response.data;
    } catch (error) {
      console.error('searchAnime error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  getAll: async (params = {}) => {
    try {
      const response = await api.get('/anime', { params });
      return response.data;
    } catch (error) {
      console.error('getAll error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Search anime
  search: async (query, params = {}) => {
    const response = await api.get('/anime/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Get anime by ID
  getById: async (id) => {
    const response = await api.get(`/anime/${id}`);
    return response.data;
  },

  // Get anime pictures
  getPictures: async (id) => {
    const response = await api.get(`/anime/${id}/pictures`);
    return response.data;
  },

  // Get anime characters
  getCharacters: async (id) => {
    const response = await api.get(`/anime/${id}/characters`);
    return response.data;
  },

  // Get anime staff
  getStaff: async (id) => {
    const response = await api.get(`/anime/${id}/staff`);
    return response.data;
  },

  // Get anime episodes
  getEpisodes: async (id) => {
    const response = await api.get(`/anime/${id}/episodes`);
    return response.data;
  },

  // Get anime recommendations
  getRecommendations: async (id) => {
    const response = await api.get(`/anime/${id}/recommendations`);
    return response.data;
  },

  // Get anime reviews (MAL)
  getReviews: async (id) => {
    const response = await api.get(`/anime/${id}/reviews`);
    return response.data;
  },

  // Get top anime
  getTop: async (params = {}) => {
    try {
      const response = await api.get('/anime/top', { params });
      console.log('getTop response:', response.data);
      return response.data;
    } catch (error) {
      console.error('getTop error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  getTopAnime: async (params = {}) => {
    try {
      const response = await api.get('/anime/top', { params });
      console.log('getTopAnime response:', response.data);
      return response.data;
    } catch (error) {
      console.error('getTopAnime error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get seasonal anime
  getSeasonal: async (year, season, params = {}) => {
    const response = await api.get(`/anime/seasonal/${year}/${season}`, { params });
    return response.data;
  },

  getSeasonalAnime: async (year, season, params = {}) => {
    try {
      const response = await api.get(`/anime/seasonal/${year}/${season}`, { params });
      return response.data;
    } catch (error) {
      console.error('getSeasonalAnime error:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get random anime
  getRandom: async () => {
    const response = await api.get('/anime/random');
    return response.data;
  },

  getRandomAnime: async () => {
    try {
      const response = await api.get('/anime/random');
      return response.data;
    } catch (error) {
      console.error('getRandomAnime error:', error);
      return { success: false, data: null, error: error.message };
    }
  },
};
