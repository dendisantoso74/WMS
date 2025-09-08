import {getData} from '../utils/store';
import api from './api';

export const getBinByTagCode = async (tagcode: string) => {
  const siteId = await getData('site');
  const url = `/maximo/oslc/os/WMS_MXBIN?lean=1&oslc.where=siteid="TJB56" and tagcode="${tagcode}"&oslc.select=*`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bin by tagcode:', error);
    throw error;
  }
};

export const getSerializedItemByTagCodes = async (tagcodes: string[]) => {
  const siteId = await getData('site');

  const tagcodeList = tagcodes.map(tc => `"${tc}"`).join(',');
  const url = `/maximo/oslc/os/WMS_MXSERIALIZEDITEM?lean=1&oslc.where=siteid="TJB56" and tagcode in [${tagcodeList}]&oslc.select=*`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching serialized items by tagcodes:', error);
    throw error;
  }
};

export const createMaterialMovement = async (payload: any) => {
  const url = `/maximo/oslc/os/MXINVUSE?lean=1`;
  try {
    const response = await api.post(url, payload, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        'Content-Type': 'application/json',
      },
    });
    console.log('Material movement created:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error creating material movement:', error);
    throw error;
  }
};
