import api from './api';

export const registerRfid = async (payload: {
  orgid: string;
  siteid: string;
  receivedate: string;
  tagcode: string;
  status: string;
}) => {
  const url = '/maximo/oslc/os/WMS_MXRFID?lean=1';
  try {
    const response = await api.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        // Add Cookie header if needed, e.g. 'Cookie': 'JSESSIONID=...'
      },
    });
    // console.log('RFID registered successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering RFID:', error);
    throw error;
  }
};

export const getListRfid = async (
  pageSize: number = 10,
  pageNo: number = 1,
) => {
  const url = `/maximo/oslc/os/WMS_MXRFID?oslc.select=*&oslc.pageSize=${pageSize}&pageno=${pageNo}`;
  try {
    const response = await api.get(url, {
      headers: {
        // Add maxauth and Cookie headers if needed
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh',
        // 'Cookie': 'JSESSIONID=0000pHVoIFwvhhShfztbJwLi6Uf:-1'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
