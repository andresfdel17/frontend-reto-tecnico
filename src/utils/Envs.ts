export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const APP_URL = import.meta.env.VITE_APP_URL ?? 'http://localhost:3000';
export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'MyApp';
export const TERM_URL = import.meta.env.VITE_TERM_URL ?? 'http://localhost:3000/term';
export const NODE_ENV = import.meta.env.VITE_NODE_ENV ?? 'development';

export const GCP_TOKEN = import.meta.env.VITE_GMAPS_KEY ?? '';
// Environment checks
export const isDevelopment = NODE_ENV === 'development' || import.meta.env.MODE === 'development';
export const isProduction = NODE_ENV === 'production' || import.meta.env.MODE === 'production';
export const isTesting = NODE_ENV === 'testing' || import.meta.env.MODE === 'testing';
// Development and debugging features
export const DEBUG_MODE = (import.meta.env.VITE_DEBUG_MODE ?? 'false') === 'true';
export const STRICT_MODE = (import.meta.env.VITE_STRICT_MODE ?? 'false') === 'true';
export const SHOW_GRID = (import.meta.env.VITE_SHOW_GRID ?? 'false') === 'true';
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL ?? 'info';
