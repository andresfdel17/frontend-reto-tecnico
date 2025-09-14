import { FullLoader } from "@components"
import { useAxios } from "@contexts"
import { faPlus, faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState, type ChangeEvent } from "react"
import { Button, Col, FormSelect, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { SendsTable } from "@components"

const states: { id: number, name: string }[] = [
  { id: 1, name: "on-wait" },
  { id: 2, name: "on-transit" },
  { id: 3, name: "delivered" },
  { id: 4, name: "cancelled" },
]

export const Sends = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState(1);
  const { privateFetch } = useAxios();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [pendingPage, setPendingPage] = useState(false);
  const [filter, setFilter] = useState<Record<string, string | number>>({ page });
  const [users, setUsers] = useState([]);
  const [sends, setSends] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = t("sends");
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])
  useEffect(() => {
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);
  const setFilterData = (ev: ChangeEvent<HTMLSelectElement>, key: string) => {
    if (key === 'id') setPage(1);
    if (ev.target?.value === "") {
      return setFilter((prev) => {
        const filtroActual: Record<string, string | number> = { ...prev };
        delete filtroActual[key];
        return filtroActual as Record<string, string | number>;
      });
    } else {
      setFilter(prev => ({ ...prev, [key]: parseInt(ev.target?.value ?? "0") }))
    }
  }
  const getAllData = async () => {
    if (page === 1) setLoading(true);
    const requestData = {
      ...filter,
      page,
      limit: rowsPerPage
    };
    const { data } = await privateFetch.post(`/sends/getSendsFiltered`, requestData)
    setSends(data.data);
    setTotal(data.pagination?.total || data.data?.length);
    setLoading(false);
  }
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const onChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };
  const addSend = () => { }
  return (
    <>
      <Row className="mt-2 mb-2">
        <Col sm="auto">
          <Button size="sm" variant="primary" onClick={getAllData}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
        </Col>

        <Col sm="auto">
          <Button size="sm" variant="primary" onClick={addSend}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Col>
        <Col sm="auto">
          <FormSelect size='sm' onChange={e => setFilterData(e, 'state')} defaultValue={filter?.state}>
            <option value="">{t('state')}</option>
            {states?.map((val, id) => (
              <option key={id} value={val.id}>
                {t(val.name)}
              </option>
            ))}
          </FormSelect>
        </Col>
        <Col sm={3}>
          <FormSelect size='sm' onChange={e => setFilterData(e, 'user_id')} defaultValue={filter?.user_id}>
            <option value="">{t('users')}</option>
            {users?.map((val, id) => (
              <option key={id} value={val.id}>
                {val.name}
              </option>
            ))}
          </FormSelect>
        </Col>
      </Row>
      {loading ? (<FullLoader fullSize />) : (
        <SendsTable
          data={sends}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          pending={pendingPage}
          onPageChange={onPageChange}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      )}
    </>
  )
}
