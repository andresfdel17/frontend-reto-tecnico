import type { JSX } from "react";
import { type ContextProps } from "@types";
import { useAuth } from "@contexts";
import axios from "axios";
import { API_URL, NODE_ENV } from "@utils";
import { AxiosContext } from "./AxiosContext";

const { Provider } = AxiosContext;

function AxiosProvider({ children }: ContextProps): JSX.Element {
    const { LogOut, prefix } = useAuth();
    const publicFetch = axios.create({
        baseURL: API_URL,
    });
    const privateFetch = axios.create({
        baseURL: API_URL,
    });
    privateFetch.interceptors.request.use(
        async config => {
            const token = localStorage.getItem(prefix('token'));
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });
    privateFetch.interceptors.response.use(
        response => {
            if(NODE_ENV === "testing") console.log(response)
            if (response.status === 401) LogOut();
            return response;
        },
        async error => {
            Promise.reject(error);
        }
    );
    return (
        <Provider value={{ publicFetch, privateFetch }}>
            {children}
        </Provider>
    );
}

export default AxiosProvider;