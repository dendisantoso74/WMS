import {getData} from '../utils/store';
import api from './api';

export const generateInvUsageHeader = async (wonum: string) => {
  // const siteid = await getData('site');
  const siteid = 'TJB56';

  const url = `/maxrest/oslc/script/WMS_INVUSERETURN?siteid=${siteid}&wonum=${wonum}`;
  console.log('Generated URL:', url);

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scanWoForReturn = async (wonum: string) => {
  // const siteid = await getData('site');
  const siteid = 'TJB56';

  const url = `/maximo/oslc/os/WMS_MXRETURN?oslc.select=*&oslc.where=siteid="${siteid}" and wonum="${wonum}"&lean=1`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const receiveMaterial = async (invuseid: string, payload: any) => {
  const url = `/maximo/oslc/os/MXINVUSE/${invuseid}`;
  console.log('payload return', payload);

  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    console.log('Receive Material Response:', response?.data);

    return response.data;
  } catch (error) {
    console.error('Error in Return Material:', error);
    throw error;
  }
};

export const tagging = async (
  invuselineid: string,
  tagcode: string,
  serialnumber: string,
) => {
  const url = `/maxrest/oslc/script/WMS_INVUSELINERETURN?invuselineid=${invuselineid}&tagcode=${tagcode}&serialnumber=${serialnumber}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putAway = async (invuselineid: string, frombin: string) => {
  const url = `/maximo/oslc/os/MXINVUSELINE/${invuselineid}?_lean=1`;
  const payload = {
    frombin: frombin,
    wms_finalbin: frombin,
    wms_status: 'COMPLETE',
  };
  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findSuggestedBinReturn = async (
  itemnum: string,
  location: string,
) => {
  const siteid = await getData('site');

  const url = `/maximo/oslc/os/MXINVBAL?lean=1&oslc.select=*&oslc.orderBy=%20%2Bcurbal&oslc.where=siteid="${siteid}" and itemnum="${itemnum}" and location="${location}" and binnum="*"`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('Suggested Bin Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching suggested bin:', error);
    throw error;
  }
};

export const createInvUseReturnHeader = async (wonum: string) => {
  // const siteid = await getData('site');
  const siteid = 'TJB56';

  const url = `/maxrest/oslc/script/WMS_INVUSERETURN?siteid=${siteid}&wonum=${wonum}`;
  console.log('Generated URL:', url);

  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment if needed
        // 'Cookie': 'JSESSIONID=...' // Uncomment if needed
      },
    });
    console.log('fetchInvUseReturn Response:', response.data);
    return true;
  } catch (error) {
    console.error('Error in fetchInvUseReturn:', error);
    throw false;
  }
};

export const changeInvUseStatusComplete = async (
  invuseid: string,
  memo: string = '',
) => {
  const url = `/maximo/oslc/os/mxinvuse/${invuseid}?action=CHANGESTATUS&lean=1&memo=${encodeURIComponent(memo)}&status=COMPLETE`;
  try {
    const response = await api.post(
      url,
      {},
      {
        headers: {
          'x-method-override': 'PATCH',
          // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Uncomment if needed
        },
      },
    );
    console.log('Change InvUse Status Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error changing InvUse status to COMPLETE:', error);
    throw error;
  }
};
