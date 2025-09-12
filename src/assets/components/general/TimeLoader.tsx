import { Spinner } from "react-bootstrap"
import { Timer } from "./Timer"
import { useTranslation } from "react-i18next";

export const TimeLoader = () => {
    const { t } = useTranslation();
    return (
        <>
            <Spinner size="sm" animation="grow" variant={"warning"} /> &nbsp;
            <Timer /> {t('seconds')}
        </>
    )
}
