import type { IExpansableComponentParams, ITableUseParams } from "@types";
import type { ISend } from "@types";
import type { TableColumn } from "react-data-table-component";
import { GeneralDatatable } from "../../general";
import { Badge, Button, ButtonGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faEdit } from "@fortawesome/free-solid-svg-icons";
import { memo } from "react";
import { usePermissions } from "@hooks";
import { useTranslation } from "react-i18next";

const ExpandableComponent = memo((data: IExpansableComponentParams<any>) => {
    console.log(data);
    return (
        <div className='p-3'>
            hola
            <Row>

            </Row>
        </div>
    )
});

const SendsTableComponent = (props: ITableUseParams<ISend>) => {
    const { t } = useTranslation();
    const { validatePermissions } = usePermissions();
    const columns: TableColumn<any>[] = [
        {
            id: 'id',
            name: t("number"),
            width: "200px",
            selector: (row) => row?.unique_id,
            sortable: true,
        },
        {
            name: t("reference"),
            width: "300px",
            sortable: true,
            selector: (row) => row?.reference,
        },
        {
            name: t("address"),
            sortable: true,
            selector: (row) => row?.address,
        },
        {
            name: t("units"),
            sortable: true,
            width: "200px",
            selector: (row) => row?.units,
        },
        /*{
            name: t("creation_date"),
            sortable: true,
            selector: (row) => {
                const date = new Date(row?.create_datetime);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const second = date.getSeconds();
                return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
            },
        },*/
        {
            name: t("state"),
            width: "100px",
            cell: (row) => {
                let color = "info";
                let text = '';
                switch (row?.state) {
                    case 1:
                        color = "primary";
                        text = t("on-wait");
                        break;
                    case 2:
                        color = "warning";
                        text = t("on-transit");
                        break;
                    case 3:
                        color = "success";
                        text = t("delivered");
                        break;
                    case 4:
                        color = "danger";
                        text = t("cancelled");
                        break;
                    default:
                        color = "primary";
                        text = "N/A";
                        break;
                }
                return (
                    <Badge pill bg={color}>
                        {text}
                    </Badge>
                );
            },
        },
        {
            name: t("actions"),
            width: "100px",
            cell: (row) => {
                return (
                    <>
                        <ButtonGroup aria-label="Basic example">
                            {
                                !validatePermissions() && row?.state === 1 && (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => props?.onEdit && props?.onEdit(row.id)}
                                        title={t("cancel")}
                                    >
                                        <FontAwesomeIcon icon={faBan} />
                                    </Button>
                                )
                            }
                            {
                                validatePermissions() && ![4].includes(row?.state) && (
                                    <Button
                                        size="sm"
                                        variant={row?.state === 3 ? "success" : "warning"}
                                        title={row?.state !== 3 ? t("change-status") : t("delivered")}
                                        onClick={() => row?.state !== 3 ? (props?.onDelete &&  props?.onDelete(row.id)) : null}
                                    >
                                        <FontAwesomeIcon icon={row?.state === 3 ? faCheck : faEdit} />
                                    </Button>
                                )
                            }
                        </ButtonGroup>
                    </>
                );
            }
        },

    ];
    return (
        <GeneralDatatable
            columns={columns}
            data={props.data}
            showFilterId={true}
            customProps={{
                defaultSortFieldId: "id",
                defaultSortAsc: false,
                expandableRows: validatePermissions(),
                ...(validatePermissions() && { expandableRowsComponent: ExpandableComponent }),
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
                    progressPending: props.pending
                })
            }}
        />
    )
}

export const SendsTable = memo(SendsTableComponent);