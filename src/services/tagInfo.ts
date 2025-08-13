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

export const postRemarkAndConditionCode = async (
  wmsId: string | number,
  body: any,
) => {
  console.log('Posting remark and condition code:', body);

  try {
    const response = await api.post(
      `/maximo/oslc/os/WMS_MXSERIALIZEDITEM/${wmsId}?lean=1`,
      body,
      {
        headers: {
          'x-method-override': 'PATCH',
          'Patch-Type': 'MERGE',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('Response from postRemarkAndConditionCode:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating remark and condition code:', error);
    throw error;
  }
};
