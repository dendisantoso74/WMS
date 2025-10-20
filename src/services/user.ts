import api from './api';
import axios from 'axios';

/**
 * Get person data from Maximo OSLC API by loginId
 * @param loginId - The login ID to search for
 * @param jsessionId - The JSESSIONID cookie value
 */
export const getPersonByLoginId = async (loginId: string) => {
  const url =
    '/maximo/oslc/os/oslcwmsperson?lean=1&oslc.select=*&oslc.where=maxuser{loginid="' +
    loginId +
    '"}';
  try {
    // console.log(`Fetching person data for loginId: ${loginId}`);

    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update the default site for a user.
 * @param authId - The WMS_SITEAUTH ID for the user.
 * @param siteId - The new default site ID.
 */
export const updateDefaultSite = async (authId: string, siteId: string) => {
  const url = `/maximo/oslc/os/WMS_SITEAUTH/${authId}`;
  const payload = {
    defsite: siteId,
  };

  try {
    const response = await api.post(url, JSON.stringify(payload), {
      headers: {
        'x-method-override': 'PATCH',
        patchtype: 'MERGE',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating site:', error);

    throw error;
  }
};
