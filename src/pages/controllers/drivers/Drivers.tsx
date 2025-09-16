import { FullLoader } from "@components"
import { useAxios } from "@contexts"
import { faPlus, faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Button, Col, FormControl, Modal, Row, Spinner } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { DriversTable } from "@components"
import { useForm, useNotify, usePermissions } from "@hooks"
import type { IDriver } from "@types"

export const Drivers = () => {
  const { serialize } = useForm();
  const { t } = useTranslation()
  const { notify } = useNotify();
  const [page, setPage] = useState(1);
  const { privateFetch } = useAxios();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [pendingPage, setPendingPage] = useState(false);
  const [drivers, setDrivers] = useState<IDriver[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  }
  const handleShowCreateModal = () => setShowCreateModal(true);
  const [loading, setLoading] = useState(false);
  const { validatePermissions } = usePermissions();
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    document.title = t("drivers");
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);


  const getAllData = async () => {
    setLoading(true);
    setPendingPage(true);
    const { data } = await privateFetch.get(`/drivers/drivers`);
    setDrivers(data.data || []);
    setTotal(data.data?.length || 0);
    setPendingPage(false);
    setLoading(false);
  }


  const onPageChange = (page: number) => {
    setPage(page);
  };

  const onChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };

  const addDriver = () => {
    handleShowCreateModal();
  }

  const saveDriver = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoadingSave(true);

    const formData = serialize(ev.target as HTMLFormElement);
    const { data } = await privateFetch.post(`/drivers/create`, formData);
    console.log(data);
    notify(data, true);
    if(data?.code !== 201){
      setLoadingSave(false);
      return;
    }
    handleCloseCreateModal();
    (ev.target as HTMLFormElement).reset();
    getAllData();
    setLoadingSave(false);
  }

  return (
    <>
      <Row className="mt-2 mb-2">
        <Col sm="auto">
          <Button size="sm" variant="primary" onClick={getAllData}>
            <FontAwesomeIcon icon={faSync} />
          </Button>
        </Col>

        {validatePermissions() && (
          <Col sm="auto">
            <Button size="sm" variant="primary" onClick={addDriver}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        )}
      </Row>

      <Row>
        <Col sm>
          {loading ? (<FullLoader fullSize />) : (
            <DriversTable
              data={drivers}
              total={total}
              page={page}
              rowsPerPage={rowsPerPage}
              pending={pendingPage}
              onPageChange={onPageChange}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          )}
        </Col>
      </Row>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{t('create-driver')}</Modal.Title>
        </Modal.Header>
        <form onSubmit={saveDriver} autoComplete="off">
          <Modal.Body>
            <Row>
              <Col sm>
                <label>{t('cifnif')}</label>
                <FormControl
                  size="sm"
                  name='cifnif'
                  required
                  className="mb-2"
                  placeholder={t('driver-cifnif')}
                />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>{t('name')}</label>
                <FormControl
                  size="sm"
                  name='name'
                  required
                  className="mb-2"
                  placeholder={t('driver-name')}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={handleCloseCreateModal}>
              {t('close')}
            </Button>
            <Button type="submit" size="sm" variant="primary" disabled={loadingSave}>
              {t('save-changes')} {loadingSave && <Spinner size="sm" animation="grow" variant="primary" />}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
