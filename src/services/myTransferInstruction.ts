import {get} from 'lodash';
import api from './api';
import {getData} from '../utils/store';

export const fetchAssignedTransferInstructions = async (invowner: string) => {
  console.log('Fetching assigned transfer instructions for:', invowner);

  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=wms_ponum,invusenum,fromstoreloc,statusdate&oslc.where=status="ENTERED" and usetype="TRANSFER" and wms_status="Assigned" and wms_isgenerated=1 and invowner="${invowner}"`;
  // const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=invuseid%2Cwms_ponum%2Cinvusenum%2Cinvowner%2Cstatus%2Cfromstoreloc%2Cstatusdate%2Cinvuseline&oslc.where=siteid%3D%22TJB56%22%20and%20status%3D%22ENTERED%22%20and%20wms_status%3D%22Assigned%22%20and%20invowner%3D%22TAUFIQ%20MA%22`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('Response data:', response.data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeTransferInstruction = async (
  invuseid: string,
  memo: string = '',
) => {
  const url = `/maximo/oslc/os/mxinvuse/${invuseid}?action=CHANGESTATUS&lean=1&status=COMPLETE&memo=${encodeURIComponent(memo)}`;
  try {
    const response = await api.post(
      url,
      {},
      {
        headers: {
          'x-method-override': 'PATCH',
          // 'Cookie': 'JSESSIONID=...' // Add if needed
        },
      },
    );
    console.log('Complete response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error completing transfer instruction:', error);
    throw error;
  }
};

export const getTransferInstructionByPoNum = async (ponum: string) => {
  console.log('get detail po num:', ponum);

  const siteid = await getData('site'); // Uncomment if you need to fetch siteid dynamically
  console.log('Site ID:', siteid);

  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=*&oslc.where=siteid="${siteid}" and wms_ponum="${ponum}"`;
  try {
    const response = await api.get(url, {
      headers: {
        // 'maxauth': 'YW5kcm9tZWRpYTphbmRyb21lZGlh', // Add if needed
        // 'Cookie': 'JSESSIONID=...' // Add if needed
      },
    });
    console.log('Transfer instruction by PO number response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching transfer instruction by PO number:', error);
    throw error;
  }
};
