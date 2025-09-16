import type { IDriver, IDriversTableProps } from "@types";
import type { TableColumn } from "react-data-table-component";
import { GeneralDatatable } from "../../general";
import { useTranslation } from "react-i18next";

const DriversTableComponent = (props: IDriversTableProps) => {
    const { t } = useTranslation();
    const columns: TableColumn<IDriver>[] = [
        {
            id: 'id',
            name: t("number"),
            width: "100px",
            selector: (row) => row?.id,
            sortable: true,
        },
        {
            name: t("cifnif"),
            width: "200px",
            sortable: true,
            selector: (row) => row?.cifnif,
        },
        {
            name: t("name"),
            sortable: true,
            selector: (row) => row?.name,
        },
    ];

    return (
        <GeneralDatatable
            columns={columns}
            data={props.data}
            customProps={{
                defaultSortFieldId: "id",
                defaultSortAsc: false,
                // Server-side pagination
                ...(props.total !== undefined && {
                    pagination: true,
                    paginationServer: true,
                    paginationTotalRows: props.total,
                    paginationDefaultPage: props.page || 1,
                    paginationPerPage: props.rowsPerPage || 10,
                    paginationComponentOptions: {
                        rowsPerPageText: t('records-by-page'),
                        rangeSeparatorText: t('range-separator'),
                        selectAllRowsItem: true,
                        selectAllRowsItemText: t('select-all-rows'),
                    },
                    onChangeRowsPerPage: props.onChangeRowsPerPage,
                    onChangePage: props.onPageChange,
                    progressPending: props.pending,
                    noDataComponent: <div className="p-3 text-center">{t('no-data')}</div>
                })
            }}
        />
    );
};

export const DriversTable = DriversTableComponent;
