import axios, { AxiosRequestConfig, Method } from "axios";

export async function getData<T>(
    url: string,
    headers?: AxiosRequestConfig["headers"]
): Promise<T> {
    try {
        const lsToken = localStorage.getItem("token");
        const response = await axios({
            method: "GET",
            url,
            withCredentials: true,
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Authorization: lsToken ? `Bearer ${lsToken}` : "",
            },
        });

        return response.data as T;
    } catch (error) {
        throw error?.response?.data;
    }
}

export async function sendData<T>(
    url: string,
    data,
    method: Method,
    headers?: AxiosRequestConfig["headers"]
): Promise<T> {
    try {
        const lsToken = localStorage.getItem("token");
        const response = await axios({
            data,
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Authorization: lsToken ? `Bearer ${lsToken}` : "",
            },
            method,
            url,
            withCredentials: true,
        }).catch();
        return response.data as T;
    } catch (error) {
        throw error?.response?.data;
    }
}

export function AppError(message: string, code: number) {
    this.message = message;
    this.code = code;
}
