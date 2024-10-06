import axios from 'axios';

const app = axios.create({
    baseURL: "http://localhost:8000/api"
})

export default app;