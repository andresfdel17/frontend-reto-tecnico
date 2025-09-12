import { useState, useEffect } from 'react';

/**
 * Hook personalizado para debounce
 * Retrasa la actualización de un valor hasta que haya pasado un tiempo determinado sin cambios
 * 
 * @param value - El valor a debounce
 * @param delay - El tiempo de espera en milisegundos (por defecto 300ms)
 * @returns El valor debouncificado
 * 
 * @example
 * const [searchText, setSearchText] = useState('');
 * const debouncedSearchText = useDebounce(searchText, 300);
 * 
 * // El filtrado solo se ejecuta 300ms después de que el usuario deje de escribir
 * useEffect(() => {
 *   if (debouncedSearchText) {
 *     performSearch(debouncedSearchText);
 *   }
 * }, [debouncedSearchText]);
 */
export const useDebounce = <T = any>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
