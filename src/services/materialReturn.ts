import {getData} from '../utils/store';
import api from './api';

export const generateInvUsageHeader = async (wonum: string) => {
  const siteid = await getData('site');
  const url = `/maxrest/oslc/script/WMS_INVUSERETURN?siteid=${siteid}&wonum=${wonum}`;
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const scanWoForReturn = async (wonum: string) => {
  const siteid = await getData('site');
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
