export interface ISucursalDetailed {
    id: number;
    name: string;
    address: string;
    status: number;
    userCount: number;
}

export interface IPaginationSucursales {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ISucursalesResponse {
    code: number;
    text: string;
    sucursales: ISucursalDetailed[];
    total: number;
    pagination: IPaginationSucursales;
}

export interface ISucursalTableParams {
    data: ISucursalDetailed[];
    onEdit?: (id: number) => void;
    onToggleStatus?: (id: number, currentStatus: number) => void;
    // Server-side pagination props
    total?: number;
    page?: number;
    rowsPerPage?: number;
    pending?: boolean;
    onPageChange?: (page: number) => void;
    onChangeRowsPerPage?: (newRowsPerPage: number) => void;
}

export interface ICreateUpdateSucursalProps {
    edit?: boolean;
}
