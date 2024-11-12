import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

// Add Authorization token in headers if user is logged in
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export const register = (data) => API.post('/api/register', data);
export const login = (data) => API.post('/api/login', data);
export const submitPoem = (data) => API.post('/api/submitPoem', data);
export const getPoems = () => API.get('/api/poems');
