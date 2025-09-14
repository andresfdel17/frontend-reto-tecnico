import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import "bootstrap/dist/css/bootstrap.min.css";
import App from './App.tsx'
import { DEBUG_MODE, STRICT_MODE, isDevelopment, isProduction } from '@utils';

// Enhanced console for development - prevents StrictMode duplicates during debugging
const isDebugging = isDevelopment && DEBUG_MODE;

if (isDevelopment && !isDebugging) {
    // Create deduplication map for console methods
    const consoleCallTracker = new Map();
    
    // Helper to deduplicate console calls in StrictMode
    const createDedupedConsole = (originalMethod: any, methodName: string) => {
        return (...args: any[]) => {
            const key = `${methodName}-${JSON.stringify(args)}`;
            const now = Date.now();
            
            // Only show if it hasn't been called in the last 100ms (StrictMode gap)
            if (!consoleCallTracker.has(key) || now - consoleCallTracker.get(key) > 100) {
                consoleCallTracker.set(key, now);
                originalMethod(...args);
            }
        };
    };
    
    // Apply deduplication to main console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
    };
    
    console.log = createDedupedConsole(originalConsole.log, 'log');
    console.warn = createDedupedConsole(originalConsole.warn, 'warn');
    console.error = createDedupedConsole(originalConsole.error, 'error');
    console.info = createDedupedConsole(originalConsole.info, 'info');
}

// Filter out known noisy warnings
const originalWarn = console.warn;
console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('styled-components')) {
        return; // ignora warnings de styled-components
    }
    if (typeof args[0] === 'string' && args[0].includes('React Router Future')) {
        return; // ignora warnings de React Router
    }
    originalWarn(...args); // muestra los demás
};

// StrictMode configuration - Enable in production or when explicitly requested via env
const shouldUseStrictMode = isProduction || STRICT_MODE;

// Create app with conditional StrictMode
const createApp = () => {
  if (shouldUseStrictMode) {
      return (
          <StrictMode>
              <App />
          </StrictMode>
      );
  }
  return <App />;
};

createRoot(document.getElementById('root')!).render(createApp())