import axios from "axios";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

export default function AxiosAuth() {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5500/auth",
  });

  axiosInstance.interceptors.request.use((config) => {
    if (config.data) {
      const secretKey = "secret";
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(config.data.password),
        secretKey
      ).toString();
      config.data = {
        name: config.data.name,
        password: encryptedData,
      };
    }
    return config;
  });

  return axiosInstance;
}
