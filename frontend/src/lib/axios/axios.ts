import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api