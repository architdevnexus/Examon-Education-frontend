import axios from "axios";
import { decryptData } from "../utils/cryptoHelper";

const instance = axios.create({
  baseURL: "http://194.238.18.1:3004/api",
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
