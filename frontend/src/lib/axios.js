import axios from 'axios'; // Import axios module

export const axiosInstance = axios.create({
     baseURL:import.meta.env.MODE==="development"? "http://localhost:5001/api":"/api",
     withCredentials: true, // Send cookies with each request
     
});