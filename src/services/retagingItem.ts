import {getData} from '../utils/store';
import api from './api';

export const fetchRetaggingItems = async (
  pageno: number = 1,
  pageSize: number = 10,
) => {
  const siteid = await getData('site'); // Uncomment if you need to fetch
  const url = `/maximo/oslc/os/WMS_MXBIN_ITEMS?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and wms_serializeditem.qtystored>0&oslc.pageSize=${pageSize}&pageno=${pageno}`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching retagging items:', error);
    throw error;
  }
};
