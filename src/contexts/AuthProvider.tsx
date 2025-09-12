import { TokenManager } from "@lib";
import React, { useEffect, useState, useMemo } from "react";
import { type ContextProps, type ILoginData, type IUserType } from "@types";
import { AuthContext } from "./AuthContext";

const { Provider } = AuthContext;

function AuthProvider({ children }: ContextProps): React.JSX.Element {
    const prefix = (route: string): string => `reto_${route}`;
    const savedToken = () => localStorage.getItem(prefix('token'));
    const savedExpiration = (token: string | null): number => {
        if (token) {
            const { exp } = TokenManager.decodeToken(token);
            return (exp ?? 0) * 1000;
        }
        return 0;
    };
    const savedUser = (token: string | null): IUserType | null => {
        if (token) {
            const { data: user } = TokenManager.decodeToken(token);
            return user;
        }
        return null;
    };
    const [token, setToken] = useState(savedToken());
    const [expiration, setExpiration] = useState<number | null>(savedExpiration(token));
    const [user, setUser] = useState(savedUser(token));
    useEffect(() => {
        const interval = setInterval(() => {
            validateAuth();
        }, 1000);
        return () => {
            clearInterval(interval)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const validateAuth = () => {
        const currentToken: string | null = savedToken();
        const currentExpiration: number = savedExpiration(currentToken);
        
        if(currentToken){
            // Solo actualizar si el token realmente cambió
            if (currentToken !== token) {
                setToken(currentToken);
            }
            // Solo actualizar si la expiración realmente cambió
            if (currentExpiration !== expiration) {
                setExpiration(currentExpiration);
            }
        } else {
            // Solo limpiar si hay algo que limpiar
            if (token !== null || expiration !== null || user !== null) {
                setToken(null);
                setExpiration(null);
                setUser(null);
            }
        }
        
        if (isAutenticated() && (savedToken() === null)) {
            LogOut();
        }
    }

    const isAutenticated = (): boolean => {
        if (!token || !expiration) {
            return false;
        }
        if (Date.now() >= expiration) {
            return false;
        }
        return true;
    }
    const validateToken = (): void => {
        if (isAutenticated() && (savedToken() === null)) {
            LogOut();
        }
    }
    const LogOut = () => {
        localStorage.removeItem(prefix('token'));
        setToken(null);
        setExpiration(null);
        setUser(null);
    }
    const Login = (data: ILoginData) => {
        localStorage.setItem(prefix('token'), data.token);
        setUser(savedUser(data.token));
        setToken(data.token);
        setExpiration(savedExpiration(data.token));
    }
    
    // Memoizar el valor del contexto para evitar re-renders innecesarios
    const contextValue = useMemo(() => ({
        isAutenticated,
        LogOut,
        user,
        token,
        validateToken,
        prefix,
        Login,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [user, token]); // Solo re-crear cuando user o token cambien
    
    return (
        <Provider value={contextValue}>
            {children}
        </Provider>
    )
}

export default AuthProvider;