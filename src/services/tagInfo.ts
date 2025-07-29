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
  cookie: string,
  xMethodOverride: string = 'PATCH',
  patchType: string = 'MERGE',
  lean: number = 1,
  body: any,
) => {
  try {
    const response = await axios.post(
      `http://192.168.77.43:9080/maximo/oslc/os/WMS_MXSERIALIZEDITEM/${wmsId}`,
      body,
      {
        params: {lean},
        headers: {
          Cookie: cookie,
          'X-Method-Override': xMethodOverride,
          'Patch-Type': patchType,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating remark and condition code:', error);
    throw error;
  }
};
