
import axios from "axios";

const API = axios.create({
    baseURL: "https://bloodlink-backend-9jhe.onrender.com/api"
});

// Automatically attach the Bearer token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("bloodlinkToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;
