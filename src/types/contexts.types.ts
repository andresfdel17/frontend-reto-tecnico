import type { AxiosInstance } from "axios";
import type { IAllPermissionsSettings, INotifyProps } from "./hooks.types";
import React from "react";

export type ContextProps = {
    children: React.JSX.Element;
}

export interface IThemeContext {
    theme: string;
    setTheme: (theme: string) => void;
};

export type IUserType = {
    [key: string]: any;
    id: number;
    email?: string;
    name?: string;
    password?: string;
    address?: string;
    state_id?: number;
    city_id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    //Agregados
    types: number[]
};
export type ILoginData = {
    token: string;
    expiresAt: number;
}
export interface IAuthContext {
    isAutenticated(): boolean;
    LogOut(): void;
    user: IUserType | null;
    token: string | null;
    validateToken(): void;
    Login(data: ILoginData): void;
    prefix: (route: string) => string;
}

export interface IAxiosContext {
    publicFetch: AxiosInstance;
    privateFetch: AxiosInstance;
}

export interface IAxiosResponseMessage<T = any> extends INotifyProps {
    data?: T;
}

export interface ICacheContext {
    loaded: boolean;
    userPermissions: IAllPermissionsSettings[];
    cities: ICacheCity[];
    states: ICacheState[];
    reloadSettings: () => void;
}

export type ICacheCity = {
    id: number;
    name: string;
    state: {
        id: number;
        name: string;
    }
}
export type ICacheState = Omit<ICacheCity, 'state'>;

export interface IAllCaches {
    code: number;
    message: string;
    permissions: IAllPermissionsSettings[];
    cities: ICacheCity[];
    states: ICacheState[];
}