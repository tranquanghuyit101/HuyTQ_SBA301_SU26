import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllOrchids = () => {
    return api.get('/orchids/');
};

export const getOrchidById = (id) => {
    return api.get(`/orchids/${id}`);
};

export const createOrchid = (data) => {
    return api.post('/orchids/', data);
};

export const updateOrchid = (id, data) => {
    return api.put(`/orchids/${id}`, data);
};

export const deleteOrchid = (id) => {
    return api.delete(`/orchids/${id}`);
};

export default api;
