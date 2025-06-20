import {storeData} from '../utils/store';
import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  login: async (username: string, password: string) => {
    console.log('authService login', username, password);
    storeData('userToken', btoa(`${username}:${password}`));

    try {
      const response = await api.get(
        `/maximo/oslc/os/oslcwmsperson?lean=1&oslc.select=*&oslc.where=maxuser{loginid="${username}"}`,
        {
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            maxauth: btoa(`${username}:${password}`),
          },
        },
      );
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
