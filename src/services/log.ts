import api from './api';

export const getWmsErrorLog = async () => {
  const url = `/maximo/oslc/os/WMS_ERROR_LOG?lean=1&oslc.select=*`;

  try {
    const response = await api.get(url, {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });

    console.log('updateWmsErrorLog Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateWmsErrorLog:', error);
    throw error;
  }
};
