import { useCallback, useMemo, useState, memo } from "react";
import { Filter } from "./Filter";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Col, Row } from "react-bootstrap";
import type { ITableParams } from "@types";
import { useDebounce } from "@hooks";
import { useTranslation } from "react-i18next";

// Función optimizada para extraer texto buscable de las columnas
const getSearchableText = (item: any, columns: TableColumn<any>[]): string => {
  return columns
    .filter(col => col.selector && typeof col.selector === 'function') // Solo columnas con selector
    .map(col => {
      try {
        const value = col.selector!(item, 0); // Llamar al selector
        return value?.toString() || '';
      } catch {
        return '';
      }
    })
    .join(' ')
    .toLowerCase();
};

const GeneralDatatableComponent = <T = any>({ showFilters = true, showFilterId = true, columns, data, customProps, conditionalStyles = [] }: ITableParams<T>) => {
  const [filterText, setFilterText] = useState("");
  const [filterId, setFilterTextId] = useState("");
  const [resetPageToggle, setResetPageToggle] = useState(false);
  const { t } = useTranslation();
  // Debounce del texto de filtro para optimizar performance
  const debouncedFilterText = useDebounce(filterText, 300);
  const filteredItems = useMemo(() => {
    return data.filter(
      (item) => {
        // Filtro por ID específico tiene prioridad
        if (filterId !== "") {
          return (item as any)?.unique_id?.toString()?.includes(filterId);
        }
        
        // Si no hay texto de búsqueda, mostrar todo
        if (debouncedFilterText === "") {
          return true;
        }
        
        // Búsqueda optimizada solo en campos con selector
        const searchableText = getSearchableText(item, columns);
        return searchableText.includes(debouncedFilterText.toLowerCase());
      }
    );
  }, [data, debouncedFilterText, filterId, columns]);

  const handleClear = useCallback(() => {
    if (filterText) {
      setResetPageToggle(!resetPageToggle);
      setFilterText("");
    }
  }, [filterText, resetPageToggle]);

  const handleClearId = useCallback(() => {
    if (filterId) {
      setResetPageToggle(!resetPageToggle);
      setFilterTextId("");
    }
  }, [filterId, resetPageToggle]);

  const subHeaderComponent = useMemo(() => {
    return (
      <Row className="justify-content-around">
        {
          showFilterId && (
            <Col sm="auto">
              <Filter
                onFilter={(e) => setFilterTextId(e.target.value)}
                onClear={handleClearId}
                filterText={filterId}
                placeholder={"# Id"}
              />
            </Col>
          )
        }
        <Col sm="auto">
          <Filter
            onFilter={(e) => setFilterText(e.target.value)}
            onClear={handleClear}
            filterText={filterText}
            placeholder={ t("search") + "..."}
          />
        </Col>
      </Row>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterText, filterId, handleClear, handleClearId, showFilterId]);
  const paginationComponentOptions = useMemo(() => ({
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  }), []);
  return (
    <DataTable<T>
      responsive
      columns={columns}
      data={filteredItems}
      striped
      pagination
      paginationComponentOptions={paginationComponentOptions}
      paginationPerPage={20}
      subHeader
      {...(showFilters && ({ subHeaderComponent }))}
      conditionalRowStyles={conditionalStyles}
      {...customProps}
      customStyles={{
        cells: {
          style: {
            backgroundColor: 'var(--body-bg)',
            color: 'var(--text2-color)',
          },
        },
        headCells: {
          style: {
            backgroundColor: 'var(--body-bg)',
            color: 'var(--text2-color)',
          },
        },
        pagination: {
          style: {
            backgroundColor: 'var(--body-bg)',
            color: 'var(--text2-color)',
          },
        },
        subHeader: {
          style: {
            color: 'var(--text2-color)',
            backgroundColor: 'var(--body-bg)',
          },
        },
      }}
    />
  );
};

export const GeneralDatatable = memo(GeneralDatatableComponent) as typeof GeneralDatatableComponent;