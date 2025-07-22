import api from './api';

export const getListTransferInstructions = async () => {
  const url =
    '/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=invuseid%2Cwms_ponum%2Cinvusenum%2Cfromstoreloc%2Cstatusdate&oslc.where=siteid%3D%22TJB56%22%20and%20status%3D%22ENTERED%22%20and%20wms_status%3D%22Open%22%20and%20wms_isgenerated%3D1%20and%20wms_wonum%21%3D%22*%22%20and%20invowner%21%3D%22*%22';
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

export const getTransferInstructionByNum = async (invusenum: string) => {
  const url = `/maximo/oslc/os/MXINVUSE?lean=1&oslc.select=invuseid,wms_ponum,invusenum,fromstoreloc,statusdate,invuseline&oslc.where=siteid="TJB56" and invusenum="${invusenum}"`;
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
