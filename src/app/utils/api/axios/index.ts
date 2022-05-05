import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Storage from "app/utils/storage/local";
import Cookies from "js-cookie";

const API = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 30_000,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config: AxiosRequestConfig | any) => {
        const token: string | null = Storage.get("access_token");
        const googleAnalytics: string | undefined = Cookies.get("_ga");

        if (!config?.headers) {
            throw new Error("Expected 'config' and 'config.headers' not to be undefined");
        }

        if (googleAnalytics) {
            config.headers = {
                common: {
                    _ga: googleAnalytics,
                },
            };
        }

        if (token) {
            config.headers = {
                Authorization: token && `Token ${token}`,
            };
        }

        config.headers["Content-Type"] = "application/json";
        config.withCredentials = true;
        axios.defaults.withCredentials = true;

        return config;
    },
    (error: AxiosError) => {
        Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            Storage.remove("access_token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default API;
