import {getData} from '../utils/store';
import api from './api';

export const tagInfo = async (id: string) => {
  const url =
    '/maximo/oslc/os/WMS_MXTAGINFO?lean=1&oslc.select=*&oslc.where=tagcode="' +
    id +
    '"';
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
