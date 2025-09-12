import type { JwtPayload } from "jwt-decode";

export interface ITokenDecoded<T = unknown> extends JwtPayload {
    data: T
}

export interface ITokenManager {
    decodetoken(token: string): JwtPayload | boolean;
}