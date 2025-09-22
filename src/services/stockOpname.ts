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
    // console.log('Response data:', response.data);
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
    // console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock opname detail:', error);
    throw error;
  }
};

export const getDetailBin = async (tagcode: string) => {
  const url = `/maximo/oslc/os/WMS_MXTAGINFO?lean=1&oslc.select=*&oslc.where=tagcode="${tagcode}"`;

  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment and set if needed
        // 'Cookie': 'JSESSIONID=...' // Uncomment and set if needed
      },
    });
    // console.log('Bin detail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching bin detail:', error);
    throw error;
  }
};

export const getDetailItem = async (tagcode: string) => {
  const siteid = await getData('site'); // Fetch siteid from storage if needed
  const url = `/maximo/oslc/os/WMS_MXSERIALIZEDITEM?lean=1&oslc.where=siteid="${siteid}" and tagcode="${tagcode}"&oslc.select=*`;

  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment and set if needed
        // 'Cookie': 'JSESSIONID=...' // Uncomment and set if needed
      },
      maxBodyLength: Infinity,
    });
    // console.log('Detail item api:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching detail item:', error);
    throw error;
  }
};

export const saveStockOpname = async (payload: {
  binnum: string;
  wms_opinid: number;
  physicalcount: number;
  serialnumber: string;
}) => {
  const {binnum, wms_opinid, physicalcount, serialnumber} = payload;
  const url = `/maxrest/oslc/script/WMS_OPINLINE_SCAN?binnum=${encodeURIComponent(binnum)}&wms_opinid=${wms_opinid}&physicalcount=${physicalcount}&serialnumber=${encodeURIComponent(serialnumber)}`;

  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment and set if needed
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
        // 'Cookie': 'JSESSIONID=...' // Uncomment and set if needed
      },
      data: JSON.stringify({
        wms_opinline: [{binnum, wms_opinid, physicalcount, serialnumber}],
      }),
      maxBodyLength: Infinity,
    });
    // console.log('Save stock opname response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving stock opname:', error);
    throw error;
  }
};

export const changeStatusOpname = async (
  opinid: string | number,
  status: 'WAPPR' | 'ENTERED',
) => {
  const url = `/maximo/oslc/os/WMS_MXOPIN/${opinid}`;
  const data = JSON.stringify({action: status});

  try {
    const response = await api.post(url, data, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment and set if needed
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
        // 'Cookie': 'JSESSIONID=...' // Uncomment and set if needed
      },
      maxBodyLength: Infinity,
    });
    // console.log('Set status WAPPR response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error setting status to WAPPR:', error);
    throw error;
  }
};
