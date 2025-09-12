import  React, { useState, useEffect, useMemo } from 'react';
import type { ContextProps } from '@types';
import { ThemeContext } from './ThemeContext';

const { Provider } = ThemeContext;

function ThemeProvider({ children }: ContextProps): React.JSX.Element {
    const [theme, setTheme] = useState(localStorage.getItem('vm_theme') ?? "light");
    const setThemeData = (theme: string) => {
        localStorage.setItem('vm_theme', theme);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
        setTheme(theme);
    }
    useEffect(() => {
        localStorage.setItem('vm_theme', theme);
        document.getElementsByTagName("html")[0].setAttribute("data-theme", theme);
    }, [theme]);
    
    // Memoizar el valor del contexto para evitar re-renders innecesarios
    const contextValue = useMemo(() => ({
        theme,
        setTheme: (theme: string) => setThemeData(theme)
    }), [theme]); // Solo re-crear cuando theme cambie
    
    return (
        <Provider value={contextValue}>
            {children}
        </Provider>
    );
}

export default ThemeProvider;
