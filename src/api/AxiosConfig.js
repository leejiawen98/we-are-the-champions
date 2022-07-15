import axios from 'axios';

const api = axios.create({
    baseURL: "https://we-are-the-champion-backend.herokuapp.com"
});

export default api;