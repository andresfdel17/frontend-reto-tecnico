import { Spinner } from "react-bootstrap"
import { Timer } from "./Timer"

export const TimeLoader = () => {
    return (
        <>
            <Spinner size="sm" animation="grow" variant={"warning"} /> &nbsp;
            <Timer /> segundos
        </>
    )
}
