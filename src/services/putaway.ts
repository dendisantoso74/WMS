import {getData} from '../utils/store';
import api from './api';

export const fetchPutawayMixed = async (
  invuselineid: string = '',
  pageSize: number = 100,
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

export const findSuggestedBinPutaway = async (
  itemnum: string,
  location: string,
  binnum: string = '*',
) => {
  const siteid = await getData('site'); // Uncomment if you need to fetch

  const url = `/maximo/oslc/os/MXINVBAL?lean=1&oslc.select=*&oslc.orderBy=%20%2Bcurbal&oslc.where=siteid="${siteid}" and itemnum="${itemnum}" and location="${location}" and binnum="${binnum}"`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error finding suggested bin:', error);
    throw error;
  }
};

export const tagItemPutaway = async (
  invuselineid: string,
  tagcode: string,
  serialnumber: string,
) => {
  const url = `/maxrest/oslc/script/WMS_INVUSELINERETURN?invuselineid=${invuselineid}&tagcode=${tagcode}&serialnumber=${serialnumber}`;
  try {
    const response = await api.post(url, '', {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error tagging item for putaway:', error);
    throw error;
  }
};

export const completePutaway = async (
  invuselineid: string,
  frombin: string,
  wms_finalbin: string,
  wms_status: string = 'COMPLETE',
) => {
  const url = `/maximo/oslc/os/MXINVUSELINE/${invuselineid}?_lean=1`;
  const payload = {
    frombin,
    wms_finalbin,
    wms_status,
  };
  try {
    const response = await api.post(url, JSON.stringify(payload), {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error completing putaway:', error);
    throw error;
  }
};
