import { useTranslation } from 'react-i18next';
import type { IAlertProps, IConfirmProps, INotifyProps } from '../types';
import { APP_NAME, MySwal } from "@utils";
export const useNotify = () => {
    const { t } = useTranslation();
    const Alert = (props: IAlertProps) => {
        const {
            title = APP_NAME,
            type = "info",
            text = "Alert",
            callback = () => { },
        } = props;
        return MySwal.fire({
            title: title,
            text: text,
            icon: type,
            timer: 3000,
            timerProgressBar: true,
            didClose: callback,
            showConfirmButton: false,
            heightAuto: false
        });
    }
    const notify = (data: INotifyProps, translated = true) => {
        switch (data.code) {
            case 201:
            case 200:
                Alert({
                    title: t('success'),
                    text: translated ? t(data.text) : data.text,
                    type: "success",
                    callback: data.callback
                });
                break;
            default:
                Alert({
                    title: t('warning'),
                    text: translated ? t(data.text) : data.text,
                    type: "warning",
                    callback: data.callback
                });
                break;
        }
    }
    const DelAlert = async (props: IConfirmProps) => {
        const {
            title = process.env.REACT_APP_APP_NAME,
            text = "Alert",
            onConfirm = () => { },
            onCancel = () => { },
            confirmButtonText = "Eliminar",
            cancelButtonText = "Cancelar",
            icon = "error"
        } = props;
        const response = await MySwal.fire({
            title,
            text,
            icon,
            timerProgressBar: true,
            showConfirmButton: true,
            showCancelButton: true,
            heightAuto: false,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText,
            cancelButtonText,
        });
        if (response.isConfirmed) {
            onConfirm();
        } else {
            onCancel();
        }
    }
    return {
        Alert,
        notify,
        DelAlert
    }
}
