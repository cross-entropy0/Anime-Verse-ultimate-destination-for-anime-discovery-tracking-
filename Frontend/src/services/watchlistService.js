import api from './api';

export const watchlistService = {
  // Get user's watchlist
  getWatchlist: async (params = {}) => {
    const response = await api.get('/watchlist', { params });
    return response.data;
  },

  // Add to watchlist
  addToWatchlist: async (data) => {
    const response = await api.post('/watchlist', data);
    return response.data;
  },

  // Update watchlist item
  updateWatchlistItem: async (id, data) => {
    const response = await api.put(`/watchlist/${id}`, data);
    return response.data;
  },

  // Remove from watchlist
  removeFromWatchlist: async (id) => {
    const response = await api.delete(`/watchlist/${id}`);
    return response.data;
  },

  // Get watchlist stats
  getStats: async () => {
    const response = await api.get('/watchlist/stats');
    return response.data;
  },

  // Check if anime is in watchlist
  checkInWatchlist: async (malId) => {
    try {
      const response = await api.get('/watchlist');
      const watchlist = response.data.data || [];
      return watchlist.find(item => item.malId === malId) || null;
    } catch (error) {
      return null;
    }
  },
};
