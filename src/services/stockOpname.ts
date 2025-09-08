import {getData} from '../utils/store';
import api from './api';

export const getListStockOpname = async () => {
  const siteid = await getData('site'); // Uncomment if you need to fetch

  const url = `/maximo/oslc/os/WMS_MXOPIN?lean=1&oslc.select=wms_opinid,status_description,storeloc,description,wms_user,scanneddate,status,orgid&oslc.where=siteid="${siteid}" and status in ["ENTERED","WAPPR"]`;

  try {
    const response = await api.get(url, {
      headers: {
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock opname list:', error);
    throw error;
  }
};

export const getDetailStockOpname = async (wms_opinid: string | number) => {
  const siteid = await getData('site'); // Uncomment if you need to fetch

  const url = `/maximo/oslc/os/WMS_MXOPIN?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and wms_opinid=${wms_opinid}`;

  try {
    const response = await api.get(url, {
      headers: {
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock opname detail:', error);
    throw error;
  }
};
