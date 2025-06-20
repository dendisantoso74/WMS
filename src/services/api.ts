import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';

// Konfigurasi utama Axios
const api = axios.create({
  baseURL: Config.API_URL, // Ganti dengan base URL API kamu
  timeout: 10000, // Timeout request (dalam ms)
});

// Interceptor untuk menambahkan token (jika menggunakan autentikasi)
// api.interceptors.request.use(
//   async config => {
//     // Contoh mengambil token dari storage (AsyncStorage)
//     const token = await AsyncStorage.getItem('userToken');
//     // const token = null; // Gantilah dengan cara mendapatkan token

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   },
// );

api.interceptors.request.use(
  async config => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      // Encode userToken to Base64 if not already encoded
      // If userToken is "username:password", encode it:
      const base64Token = userToken.includes(':')
        ? typeof btoa === 'function'
          ? btoa(userToken)
          : Buffer.from(userToken).toString('base64')
        : userToken;
      config.headers.maxauth = base64Token;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Interceptor untuk menangani error response
api.interceptors.response.use(
  response => response,
  error => {
    // console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  },
);

export default api;
