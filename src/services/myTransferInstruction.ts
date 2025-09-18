import {get} from 'lodash';
import api from './api';
import {getData} from '../utils/store';

export const fetchAssignedTransferInstructions = async (invowner: string) => {
  console.log('Fetching assigned transfer instructions for:', invowner);

  // to show list with assugned to user login
  // const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=wms_ponum,invusenum,fromstoreloc,statusdate&oslc.where=status="ENTERED" and usetype="TRANSFER" and wms_status="Assigned" and wms_isgenerated=1 and invowner="${invowner}"`;
  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=wms_ponum,invusenum,fromstoreloc,statusdate&oslc.where=status="ENTERED" and usetype="TRANSFER"`;

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
  // transfer instruction is must be in TJB56 site
  // const siteid = 'TJB56'; // Hardcoded for testing, remove in production
  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=*&oslc.where=siteid="TJB56" and wms_ponum="${ponum}"`;
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
