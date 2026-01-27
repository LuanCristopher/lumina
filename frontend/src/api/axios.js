import axios from 'axios';
import { handleMockRequest } from './mock';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Interceptor to handle mock mode
api.interceptors.request.use(async (config) => {
    if (USE_MOCK) {
        // We throw a special error or return the mock data directly
        // In Axios, if we return a promise that resolves, it continues.
        // But we want to bypass the actual network call.
        // A trick is to use an adapter or handle it in the response interceptor.
        config.adapter = async (cfg) => {
            return await handleMockRequest(cfg);
        };
    }
    return config;
});

// Interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
