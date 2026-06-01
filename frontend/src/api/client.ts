import axios, { AxiosError, AxiosInstance } from "axios";
import { config } from "../config/env";

const client: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        data: error.response.data,
        message:
          (error.response.data as Record<string, unknown>)?.message ||
          (error.response.data as Record<string, unknown>)?.detail ||
          error.response.statusText ||
          "An error occurred",
      });
    }

    return Promise.reject({
      message: error.message || "Network error",
    });
  },
);

export default client;
