import {get} from 'lodash';
import {getData} from '../utils/store';
import api from './api';

export const getWorkOrderDetails = async (workOrderId: string) => {
  const site = await getData('site');
  const url = `/maximo/oslc/os/WMS_MXWOISSUE?lean=1&oslc.select=*&oslc.where=siteid="${site}" and wonum="${workOrderId}"`;
  try {
    const response = await api.get(url);
    console.log('Work Order Details Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error in getWorkOrderDetails:', error);
    throw error;
  }
};

export const pickItem = async (invuseId: string, itemDetails: any) => {
  const url = `/maximo/oslc/os/MXINVUSE/${invuseId}`;
  const payload = {
    invuseline: itemDetails,
  };
  console.log('service pick item, payload ', payload);

  try {
    const response = await api.post(url, payload, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });
    console.log('Pick Item Response:', response?.data);

    return response.data;
  } catch (error) {
    console.error('Error in pickItem:', error);
    throw error;
  }
};

export const completeIssue = async (invuseId: string) => {
  const url = `/maximo/oslc/os/mxinvuse/${invuseId}?action=CHANGESTATUS&status=COMPLETE`;
  try {
    const response = await api.post(url, null, {
      headers: {
        'x-method-override': 'PATCH',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in completeIssue:', error);
    throw error;
  }
};

export const findSugestBin = async (
  itemnum: string,
  location: string,
  binnum: string = '*',
) => {
  const siteid = await getData('site');
  console.log(
    'siteid',
    siteid,
    'itemnum',
    itemnum,
    'location',
    location,
    'binnum',
    binnum,
  );

  const url = `/maximo/oslc/os/MXINVBAL?lean=1&oslc.select=*&oslc.orderBy=%20%2Bcurbal&oslc.where=siteid="${siteid}" and itemnum="${itemnum}" and location="${location}" and curbal>0 and binnum="*"`;
  try {
    const response = await api.get(url, {});

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findBinByTagCode = async (tagcode: string) => {
  const siteid = await getData('site');
  const pageSize = 10;
  const pageno = 1;
  const url = `/maximo/oslc/os/WMS_MXBIN?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and tagcode="${tagcode}"&oslc.pageSize=${pageSize}&pageno=${pageno}`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateIssueHeader = async (wonum: string) => {
  // const siteid = await getData('site');
  const siteid = 'TJB56';

  const url = `/maxrest/oslc/script/WMS_INVUSEISSUE?siteid=${siteid}&wonum=${wonum}`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('generateIssueHeader Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in generateIssueHeader:', error);
    throw error;
  }
};

export const getItemSNByTagCode = async (tagcode: string) => {
  // const url = `/maximo/oslc/os/WMS_MXRFID?lean=1&oslc.select=*&oslc.where=tagcode="${tagcode}"`;
  const url = `/maximo/oslc/os/WMS_MXSERIALIZEDITEM?lean=1&oslc.select=*&oslc.where=tagcode="${tagcode}"`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putToStage = async (invuseid: string, memo: string = '') => {
  const url = `/maximo/oslc/os/mxinvuse/${invuseid}?action=CHANGESTATUS&lean=1&memo=${encodeURIComponent(memo)}&status=STAGED`;
  try {
    const response = await api.post(
      url,
      {},
      {
        headers: {
          'x-method-override': 'PATCH',
          // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
          // 'Cookie': 'JSESSIONID=...' // Add if needed
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
