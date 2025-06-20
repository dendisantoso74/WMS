import api from './api';
import axios from 'axios';

/**
 * Get person data from Maximo OSLC API by loginId
 * @param loginId - The login ID to search for
 * @param jsessionId - The JSESSIONID cookie value
 */
export const getPersonByLoginId = async (loginId: string) => {
  const url =
    '/maximo/oslc/os/oslcwmsperson?lean=1&oslc.select=*&oslc.where=maxuser{loginid="' +
    loginId +
    '"}';
  try {
    console.log(`Fetching person data for loginId: ${url}`);

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
