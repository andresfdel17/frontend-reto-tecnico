import { ISend, IApiResponse, IApiResponseWithPagination, IRouteWithVehicle, IDriver } from './general.types';

// ===== SENDS CONTROLLER =====

// Request bodies para envíos
export interface ISendCreateBody {
    reference: string;
    address: string;
    width: number;
    height: number;
    length: number;
}

export interface ISendUpdateBody {
    reference?: string;
    address?: string;
    width?: number;
    height?: number;
    length?: number;
    state?: number;
    units?: number;
    route_id?: number;
    driver_id?: number;
}

export interface ISendGetFilteredBody {
    user_id?: number;
    state?: number;
    page?: number;
    limit?: number;
}

// Respuestas del controlador de envíos
export type ISendCreateResponse = IApiResponse<ISend>;
export type ISendUpdateResponse = IApiResponse<ISend>;
export type ISendGetFilteredResponse = IApiResponseWithPagination<ISend[]>;

// ===== GENERAL CONTROLLER =====

// Respuestas del controlador general
export type IGetRoutesResponse = IApiResponse<IRouteWithVehicle[]>;
export type IGetDriversResponse = IApiResponse<IDriver[]>;

// ===== FORM DATA =====

// Datos de formularios (para useForm)
export interface ISendFormData {
    reference: string;
    address: string;
    width: string | number;
    height: string | number;
    length: string | number;
}

export interface ISendFilterFormData {
    state: string;
    user_id: string;
}
