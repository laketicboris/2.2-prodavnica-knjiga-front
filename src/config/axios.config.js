import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:5234/',
});

AxiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Niste autorizovani, molimo prijavite se ponovo.');
    }
    return Promise.reject(error);
  }
);

export default AxiosConfig;