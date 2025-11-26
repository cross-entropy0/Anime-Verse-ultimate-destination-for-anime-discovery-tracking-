import api from './api';

export const commentService = {
  // Get comments for an anime
  getAnimeComments: async (animeId, params = {}) => {
    const response = await api.get(`/comments/anime/${animeId}`, { params });
    return response.data;
  },

  // Get comments for manga
  getMangaComments: async (mangaId, params = {}) => {
    const response = await api.get(`/comments/manga/${mangaId}`, { params });
    return response.data;
  },

  // Create comment
  createComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Update comment
  updateComment: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Like/unlike comment
  likeComment: async (id) => {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  },
};
