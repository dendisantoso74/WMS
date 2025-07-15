import {getData} from '../utils/store';
import api from './api';

export const getTagBinList = async (
  tagcode: string = '*',
  pageSize: number = 10,
  pageNo: number = 1,
) => {
  const siteid = await getData('site');
  const url = `/maximo/oslc/os/WMS_MXBIN?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and tagcode="${tagcode}"&oslc.pageSize=${pageSize}&pageno=${pageNo}`;
  try {
    const response = await api.get(url, {
      headers: {
        // Add Cookie header if needed, e.g. 'Cookie': 'JSESSIONID=...'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
