import { createContext } from "react";
import type { IAxiosContext } from "@types";

export const AxiosContext = createContext<IAxiosContext>({} as IAxiosContext);
