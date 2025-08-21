import {getData} from '../utils/store';
import api from './api';

export const fetchRetaggingItems = async (
  bin: string = '*',
  tagCode: string = '*',
  pageno: number = 1,
  pageSize: number = 10,
) => {
  const siteid = await getData('site'); // Uncomment if you need to fetch
  const url = `/maximo/oslc/os/WMS_MXBIN_ITEMS?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and wms_serializeditem.qtystored>0 and bin="${bin}" and tagcode="${tagCode}"&oslc.pageSize=${pageSize}&pageno=${pageno}`;
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

export const retagSerializedItem = async (
  wmsId: string | number,
  tagcode: string,
) => {
  const url = `/maximo/oslc/os/WMS_MXSERIALIZEDITEM/${wmsId}?lean=1`;
  const payload = {
    STATUS: 'RETAG',
    tagcode: tagcode,
  };
  try {
    console.log('Retagging payload:', payload, wmsId);
    const response = await api.post(url, payload, {
      headers: {
        'Patch-Type': 'MERGE',
        'x-method-override': 'PATCH',
        'Content-Type': 'application/json',
      },
    });
    console.log('Retagging response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error retagging serialized item:', error);
    throw error;
  }
};

export const retagBIN = async (wmsId: string | number, tagcode: string) => {
  const url = `/maximo/oslc/os/WMS_MXBIN/${wmsId}?lean=1`;
  const payload = {
    status: 'RETAG',
    tagcode: tagcode,
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'Patch-Type': 'MERGE',
        'x-method-override': 'PATCH',
        'Content-Type': 'application/json',
      },
    });
    console.log('Retagging response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error retagging serialized item:', error);
    throw error;
  }
};
