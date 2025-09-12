import { Sidebar } from "./Sidebar";
import "./styles.css";
import "./panel.css";

export const BasePanel = (props: any) => {
    const { children } = props;
    return (
        <>
            <Sidebar>
                {children}
            </Sidebar>
        </>
    )
}
