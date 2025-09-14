// Tipos para hooks de validación de direcciones
export interface IAddressValidationResult {
    isValid: boolean;
    formattedAddress?: string;
    components?: {
        streetNumber?: string;
        route?: string;
        locality?: string;
        administrativeArea?: string;
        country?: string;
        postalCode?: string;
    };
    confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
    errors?: string[];
}

export interface IAddressValidationRequest {
    address: string;
    regionCode?: string; // Código de país (ej: 'CO', 'US', 'MX')
    locality?: string;
    enableUspsCass?: boolean; // Para direcciones de Estados Unidos
}

// Tipos para notificaciones
export interface INotification {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    read: boolean;
    from?: string;
}

// Tipos para Socket.io
export interface ISocketAuthData {
    token: string;
}

export interface ISocketAuthResponse {
    message: string;
    email?: string;
    timestamp: string;
}

export interface ISocketLoginSuccess {
    message: string;
    userName: string;
    userEmail: string;
    timestamp: string;
}

export interface ISocketNotification {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    from: string;
}
