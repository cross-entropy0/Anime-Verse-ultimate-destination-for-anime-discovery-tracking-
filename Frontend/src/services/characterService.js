import api from './api';

export const characterService = {
  // Get character by ID
  getById: async (id) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  getCharacterById: async (id) => {
    try {
      const response = await api.get(`/characters/${id}`);
      return response.data;
    } catch (error) {
      console.error('getCharacterById error:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Get character pictures
  getPictures: async (id) => {
    const response = await api.get(`/characters/${id}/pictures`);
    return response.data;
  },

  getCharacterPictures: async (id) => {
    try {
      const response = await api.get(`/characters/${id}/pictures`);
      return response.data;
    } catch (error) {
      console.error('getCharacterPictures error:', error);
      return { success: false, data: [], error: error.message };
    }
  },
};
