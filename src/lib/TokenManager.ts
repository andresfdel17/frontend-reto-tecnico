import { jwtDecode } from "jwt-decode";
import type { ITokenDecoded, IUserType } from "@types";


export class TokenManager {
    static decodeToken<T = IUserType>(token: string): ITokenDecoded<T> {
        try {
            const data = jwtDecode<ITokenDecoded<T>>(token);
            return data;
        } catch (error) {
            console.error(error);
            return {} as ITokenDecoded<T>;
        }
    }
}