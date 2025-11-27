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
      console.log('Checking watchlist for malId:', malId);
      console.log('Watchlist malIds:', watchlist.map(item => item.malId));
      // Ensure type consistency - convert both to numbers for comparison
      const numericMalId = parseInt(malId);
      const found = watchlist.find(item => parseInt(item.malId) === numericMalId);
      console.log('Found entry:', found ? 'YES' : 'NO');
      return found || null;
    } catch (error) {
      console.error('Error checking watchlist:', error);
      return null;
    }
  },
};
