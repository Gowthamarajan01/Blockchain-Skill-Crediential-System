import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor for token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
};

export const registerUser = async (name, email, password, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
};

export const issueCredential = async (userEmail, skillName) => {
    const { data } = await api.post('/credentials/issue', { userEmail, skillName });
    return data;
};

export const uploadCertificate = async (formData) => {
    const { data } = await api.post('/credentials/upload-certificate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const getMyCredentials = async () => {
    const { data } = await api.get('/credentials/my');
    return data;
};

export const getAllCredentials = async () => {
    const { data } = await api.get('/credentials');
    return data;
};

export const verifyCredential = async (idOrHash) => {
    const { data } = await api.get(`/credentials/verify/${idOrHash}`);
    return data;
};

export const deleteCredential = async (credentialId) => {
    const { data } = await api.delete(`/credentials/${credentialId}`);
    return data;
};

export default api;
