import type { SweetAlertIcon } from "sweetalert2";

export interface IAlertProps {
    title?: string;
    type?: SweetAlertIcon;
    text?: string;
    callback?<T = void>(): T;
}

export interface INotifyProps {
    code: number;
    text: string;
    callback?<T = void>(): T;
}

export interface IConfirmProps<TConfirmReturn = void, TCancelReturn = void> {
    title?: string;
    text?: string;
    onConfirm?: () => TConfirmReturn;
    onCancel?: () => TCancelReturn;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: SweetAlertIcon;
}

export interface IUseNotify {
    Alert: (props: IAlertProps) => void;
    notify: (data: INotifyProps) => void;
    DelAlert: (props: IConfirmProps) => void;
}

export type ISerialized<K extends string | number | symbol, T = string> = {
    [key in K]: T;
}

export interface ISerialize {
    serialize: (form: HTMLFormElement) => ISerialized<string, FormDataEntryValue>;
    serializeFiles: (form: HTMLFormElement) => FormData;
}

export interface IPermission {
    code: number;
    name: string;
    permission: boolean;
    placeholder: string;
}
export interface IAllPermissionsSettings {
    name: string;
    type: number;
    permissions: IPermission[];
}

export interface IExpansableComponentParams<T> {
    data: T
}
