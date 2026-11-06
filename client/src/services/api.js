import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Automatically attach the Bearer token to all outgoing requests if the user is logged in
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