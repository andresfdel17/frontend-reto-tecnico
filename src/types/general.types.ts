// Interfaces generales para entidades de la base de datos (sincronizadas con backend)

export interface IRoute {
    id: number;
    vehicle_id: number | null;
    code: string;
    desc_route: string;
}

export interface IVehicle {
    id: number;
    code: string;
    brand: string;
    capacity: number;
}

export interface IDriver {
    id: number;
    cifnif: string;
    name: string;
}

export interface ISend {
    id: number;
    user_id: number | null;
    unique_id: string;
    route_id: number | null;
    driver_id: number | null;
    reference: string;
    address: string;
    units: number;
    state: number;
    create_datetime: string;
    transit_datetime?: string | null;
    deliver_datetime?: string | null;
    width: number;
    height: number;
    length: number;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    rol_id: number;
}

// Interfaces para respuestas de API
export interface IRouteWithVehicle {
    id: number;
    code: string;
    desc_route: string;
    vehicle_id: number | null;
    vehicle: IVehicle | null;
}

// Respuestas estándar de API
export interface IApiResponse<T = any> {
    code: number;
    data?: T;
    text?: string;
    message?: string;
}

export interface IApiResponseWithPagination<T = any> extends IApiResponse<T> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Estados de envío
export const SendState = {
    ON_WAIT: 1,
    ON_TRANSIT: 2,
    DELIVERED: 3,
    CANCELLED: 4,
} as const;

export type SendState = typeof SendState[keyof typeof SendState];

// Interfaces para Dashboard y Gráficos
export interface ChartStats {
    created: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
    total: number;
}

export interface ChartData {
    chartData: any;
    stats: ChartStats;
    period: number;
    dateRange: {
        start: string;
        end: string;
    };
    filters: {
        user_id: number | null;
        isAdmin: boolean;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    rol_id?: number;
}

// Mapeo de estados para mostrar en UI
export const SEND_STATES = {
    [SendState.ON_WAIT]: 'on-wait',
    [SendState.ON_TRANSIT]: 'on-transit', 
    [SendState.DELIVERED]: 'delivered',
    [SendState.CANCELLED]: 'cancelled',
} as const;
