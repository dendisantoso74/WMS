import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (payload: any) => {
    try {
      const response = await api.post('/token', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (payload: any) => {
    try {
      const response = await api.post('/auth/register', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/get-users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
