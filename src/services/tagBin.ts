import {getData} from '../utils/store';
import api from './api';

const siteid = 'TJB56';

export const getTagBinList = async (
  tagcode: string = '*',
  pageSize: number = 10,
  pageNo: number = 1,
  bin: string = '*',
) => {
  const url = `/maximo/oslc/os/WMS_MXBIN?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and tagcode="${tagcode}" and bin="${bin}"&oslc.pageSize=${pageSize}&pageno=${pageNo}`;
  console.log('payload getTagBinList:', tagcode, pageNo, pageSize, bin);
  try {
    const response = await api.get(url, {
      headers: {
        // Add Cookie header if needed, e.g. 'Cookie': 'JSESSIONID=...'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBinUntagList = async (
  bin: string = '*',
  pageSize: number = 100,
  pageNo: number = 1,
) => {
  // const siteid = await getData('site');
  const url = `/maximo/oslc/os/WMS_MXBIN?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and tagcode!="*" and bin="${bin}"&oslc.pageSize=${pageSize}&pageno=${pageNo}`;
  try {
    const response = await api.get(url, {
      headers: {
        // Add Cookie header if needed, e.g. 'Cookie': 'JSESSIONID=...'
      },
    });
    console.log('res getBinUntagList:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching untagged bins:', error);
    throw error;
  }
};

export const registerTagToBin = async (
  binId: string | number,
  tagcode: string,
  serialnumber: string,
) => {
  const data = JSON.stringify({
    tagcode,
    serialnumber,
  });

  try {
    const response = await api.post(
      `/maximo/oslc/os/WMS_MXBIN/${binId}`,
      data,
      {
        headers: {
          'x-method-override': 'PATCH',
          patchtype: 'MERGE',
          'Content-Type': 'application/json',
        },
        maxBodyLength: Infinity,
      },
    );
    console.log('Response from registerTagToBin:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error registering tag to bin:', error);
    throw error;
  }
};

// Add this utility function at the end of the file for local search by bin
export const localSearchByBin = (bins: any[], searchValue: string) => {
  if (!searchValue || searchValue === '*') return bins;
  const lowerSearch = searchValue.toLowerCase();
  return bins.filter(
    bin =>
      (bin.bin && bin.bin.toLowerCase().includes(lowerSearch)) ||
      (bin.tagcode && bin.tagcode.toLowerCase().includes(lowerSearch)),
  );
};
