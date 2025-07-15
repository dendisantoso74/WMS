import {getData} from '../utils/store';
import api from './api';

export const getWorkOrderDetails = async (workOrderId: string) => {
  const site = await getData('site');
  const url = `/maximo/oslc/os/WMS_MXWOISSUE?lean=1&oslc.select=*&oslc.where=siteid="${site}" and wonum="${workOrderId}"`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pickItem = async (invuseId: string, itemDetails: any) => {
  const url = `/maximo/oslc/os/MXINVUSE/${invuseId}`;
  const payload = {
    invuseline: [itemDetails],
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
