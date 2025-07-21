import {getData} from '../utils/store';
import api from './api';

export const fetchPutawayMixed = async (
  invuselineid: string = '',
  pageSize: number = 10,
) => {
  const siteid = await getData('site'); // Uncomment if you need to fetch

  const url = `/maximo/oslc/os/WMS_MXWOISSUE?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and invuse.usetype="MIXED" and invuse.status!="COMPLETE" and invuse.invuseline.invuselineid="${invuselineid}"&oslc.pageSize=${pageSize}`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching putaway mixed:', error);
    throw error;
  }
};
