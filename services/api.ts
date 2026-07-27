import axios from "axios";

const api = axios.create({
  baseURL: "https://maizeguard-backend-s7ak.onrender.com" 
});

export default api;