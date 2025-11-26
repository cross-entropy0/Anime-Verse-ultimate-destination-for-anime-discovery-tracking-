import api from './api';

export const reviewService = {
  // Get reviews for an anime
  getAnimeReviews: async (animeId, params = {}) => {
    const response = await api.get(`/reviews/anime/${animeId}`, { params });
    return response.data;
  },

  // Create review
  createReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Update review
  updateReview: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Like/unlike review
  likeReview: async (id) => {
    const response = await api.post(`/reviews/${id}/like`);
    return response.data;
  },
};
