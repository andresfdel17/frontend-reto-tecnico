import "./styles.css";
import "./panel.css";
import { Sidebar } from "./Sidebar";
import type { ContextProps } from "@types";
export const BasePanel = ({ children }: ContextProps) => {
  return (
    <>
      <Sidebar>
        {children}
      </Sidebar>
    </>
  )
}
