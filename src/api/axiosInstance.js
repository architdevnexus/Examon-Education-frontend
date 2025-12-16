import axios from "axios";
import { decryptData } from "../utils/cryptoHelper";

const instance = axios.create({
  baseURL: "https://backend.mastersaab.co.in/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const encrypted = localStorage.getItem("app_token");
  if (encrypted) {
    const token = decryptData(encrypted);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
