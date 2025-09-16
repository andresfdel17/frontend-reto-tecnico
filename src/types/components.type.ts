import type { Color } from "react-bootstrap/esm/types";
import type { TableColumn } from "react-data-table-component";
import type { INotifyProps } from "./hooks.types";

export interface ISideBarCollapsableNavItem {
  eventKey: string;
  title: string;
  icon: any;
  children?: React.ReactNode;
}

export interface INavItemProps {
  title: string;
  link: string;
  external?: boolean;
  target?: string;
  icon?: any;
  image?: { image: string; width?: number; height?: number };
  badgeText?: string | number;
  badgeBg?: string;
  badgeColor?: Color;
}

export interface IFullLoaderParams {
  altText?: string;
  backgroundColor?: string;
  imageSize?: number; // tamaño en píxeles
  fullSize?: boolean; // si es true, ocupa toda la pantalla
}
//Tablas
export interface ITableFilterParams {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder: string;
}

// Solo envuelve con `IAllData<T>` si `T` no es `any`
export type ITableData = {
  [key: string]: any;
  id: number | null;
}

export interface ITableParams<T = any> {
  showFilters?: boolean;
  showFilterId?: boolean;
  columns: TableColumn<T>[];
  data: T[];
  customProps?: any;
  conditionalStyles?: any[];
}

export interface ITableUseParams<T = any> {
  data: T[];
  onEdit?: (row: number) => void;
  onDelete?: (row: number, disable?: boolean) => void;
  // Server-side pagination props
  total?: number;
  page?: number;
  rowsPerPage?: number;
  pending?: boolean;
  onPageChange?: (page: number) => void;
  onChangeRowsPerPage?: (newRowsPerPage: number) => void;
}

// usuarios
export interface ISucursal {
  id: number;
  name: string;
  address: string;
}
export interface IUserSaved {
  id: number;
  cifnif: string;
  email: string;
  name: string;
  sucursal: ISucursal | null;
  status: number;
  expire_date: string | null;
  telegram_enable: boolean;
  telegram: string | null;
  address: string | null;
  state_id: number | null;
  city_id: number | null;
  main_user_types: {
    id: number;
    type: number;
  }[] | null;
}

export interface IUsersNotifyData<T = any> extends INotifyProps {
  usuarios?: T[];
  total?: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICreateUpdateUserProps {
  edit?: boolean;
}

// Tipos para componentes de gráficas
export interface ShipmentsChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
    }[];
  };
  loading?: boolean;
}
