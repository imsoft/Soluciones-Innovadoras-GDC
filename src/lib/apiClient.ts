import axios from 'axios';

// Configuración de Axios
export const apiClient = axios.create({
  baseURL: 'https://api.rappi.com',
  headers: {
    Authorization: `Bearer YOUR_API_TOKEN`,
  },
});
