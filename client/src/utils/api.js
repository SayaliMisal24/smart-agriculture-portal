import axios from 'axios';

const api = axios.create({
  baseURL: 'https://smart-agriculture-portal-api.onrender.com/api',
});

export default api;