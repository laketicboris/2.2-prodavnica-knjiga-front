import axios from 'axios';

let AxiosConfig = axios.create({
  baseURL: 'http://localhost:5234/',
  // Prostor za dodatnu konfiguraciju
});

export default AxiosConfig;