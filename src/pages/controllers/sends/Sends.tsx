import { FullLoader } from "@components"
import { useAxios } from "@contexts"
import { faInfo, faInfoCircle, faPlus, faSync } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState, type ChangeEvent } from "react"
import { Button, Col, FormControl, FormSelect, Modal, OverlayTrigger, Popover, Row, Spinner } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { SendsTable } from "@components"
import { useAddressValidator, useDebounce, useForm, useNotify, usePermissions } from "@hooks"
import { GCP_TOKEN } from "@utils"

const states: { id: number, name: string }[] = [
  { id: 1, name: "on-wait" },
  { id: 2, name: "on-transit" },
  { id: 3, name: "delivered" },
  { id: 4, name: "cancelled" },
]

export const Sends = () => {
  const { serialize } = useForm();
  const { t } = useTranslation()
  const { notify, DelAlert, Alert } = useNotify();
  const { validateAddress, isValidating } = useAddressValidator(GCP_TOKEN);
  const [page, setPage] = useState(1);
  const { privateFetch } = useAxios();
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [pendingPage, setPendingPage] = useState(false);
  const [filter, setFilter] = useState<Record<string, string | number>>({ page });
  const [users, setUsers] = useState<{ id: number, name: string }[]>([]);
  const [sends, setSends] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setSuggestAddress('');
    setAddressString('');
    setConfidence('NONE');
  }
  const handleShowCreateModal = () => setShowCreateModal(true);
  const [validateLocation, setValidateLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { validatePermissions } = usePermissions();
  const [addressString, setAddressString] = useState('');
  const addressDebounced = useDebounce(addressString, 1000);
  const [confidence, setConfidence] = useState<string>('NONE');
  const [suggestAddress, setSuggestAddress] = useState('');
  const [loadingSave, setLoadingSave] = useState(false);
  useEffect(() => {
    document.title = t("sends");
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])
  useEffect(() => {
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);
  useEffect(() => {
    if (addressDebounced) {
      validateAddressString();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressDebounced]);
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
    setPendingPage(true);
    const [{ data: sends }, { data: users }] = await Promise.all([
      privateFetch.post(`/sends/getSendsFiltered`, requestData),
      privateFetch.get(`/users/getAllUsers`)
    ])
    setPendingPage(false);
    setSends(sends.data);
    setUsers(users.data);
    setTotal(sends.pagination?.total || sends.data?.length);
    setLoading(false);
  }
  const onPageChange = (page: number) => {
    setPage(page);
  };
  const onChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1); // Reset to first page when changing rows per page
  };
  const addSend = () => {
    handleShowCreateModal();
  }
  const validateAddressString = async () => {
    const result = await validateAddress({ address: addressDebounced ?? '', regionCode: 'CO' });
    // Actualizar el estado de validación basado en el resultado
    // Consideramos válida una dirección con confianza HIGH o MEDIUM
    const isAcceptable = (result?.confidence === 'HIGH' || result?.confidence === 'MEDIUM');
    setValidateLocation(isAcceptable || false);
    // Actualizar el nivel de confianza
    setConfidence(result?.confidence || 'NONE');

    // Opcional: mostrar errores si los hay
    if (result?.errors && result.errors.length > 0) {
      //console.warn('Address validation errors:', result.errors);
    }

    // Opcional: usar la dirección formateada si está disponible
    if (result?.formattedAddress && isAcceptable) {
      setSuggestAddress(result.formattedAddress);
      // Podrías actualizar el addressString con la dirección formateada si lo deseas
      // setAddressString(result.formattedAddress);
    }
  }
  const popover = (props: { address: string }) => {
    return (
      <Popover>
        <Popover.Header as="h3">{t('address-suggestion')}</Popover.Header>
        <Popover.Body>
          {props.address}
        </Popover.Body>
      </Popover>
    )
  };
  const saveSend = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setLoadingSave(true);
    const formData = serialize(ev.target as HTMLFormElement);
    const { data } = await privateFetch.post(`/sends/create`, formData);
    notify({
      ...data, callback: () => {
        handleCloseCreateModal();
        (ev.target as HTMLFormElement).reset();
        setAddressString('');
        setConfidence('NONE');
      }
    });
    setLoadingSave(false);
    getAllData();

  }
  const cancelSend = async (id: number) => {
    await DelAlert({
      text: t("cancel-warning"),
      confirmButtonText: t("cancel"),
      cancelButtonText: t("to-cancel"),
      onConfirm: async () => {
        const { data } = await privateFetch.put(`/sends/update/${id}`, { state: 4 });
        notify(data);
        getAllData();
      },
      onCancel: () => {
        Alert({
          type: "warning",
          text: t("cancel-cancelled"),
        });
      },
    });

  }
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
        {validatePermissions() && (
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
        )}
      </Row>
      {loading ? (<FullLoader />) : (
        <SendsTable
          data={sends}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          pending={pendingPage}
          onPageChange={onPageChange}
          onChangeRowsPerPage={onChangeRowsPerPage}
          onEdit={cancelSend}
        />
      )}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{t('create-send')}</Modal.Title>
        </Modal.Header>
        <form onSubmit={saveSend} autoComplete="off">
          <Modal.Body>
            <Row>
              <Col sm>
                <label>{t('reference')}</label>
                <FormControl size="sm" name='reference' required className="mb-2" />
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>{t('address')}</label>
                {suggestAddress !== '' && (
                  <OverlayTrigger trigger="click" placement="right" overlay={popover({ address: suggestAddress })}>
                    <Button className="border-0 ml-2" size="sm" variant="outline-primary">
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </Button>
                  </OverlayTrigger>
                )}
                <FormControl
                  as='textarea'
                  size="sm"
                  name='address'
                  required
                  className={`mb-2 ${['HIGH', 'MEDIUM'].includes(confidence) ? 'is-valid' : ['LOW'].includes(confidence) && addressString !== '' ? 'is-invalid' : ''}`}
                  value={addressString}
                  onChange={e => setAddressString(e.target.value)}
                />
                {addressString && (
                  <div className="d-flex justify-content-between align-items-center">
                    <small className={`text-${['HIGH', 'MEDIUM'].includes(confidence) ? 'success' : ['LOW'].includes(confidence) ? 'danger' : 'warning'}`}>
                      {['HIGH', 'MEDIUM'].includes(confidence) ? t('valid-address') : ['LOW'].includes(confidence) ? t('invalid-address') : ''}
                    </small>
                    {confidence !== 'NONE' && (
                      <small className={`text-${confidence === 'HIGH' ? 'success' : confidence === 'MEDIUM' ? 'warning' : 'danger'}`}>
                        {t('confidence')}: {t(confidence)}
                      </small>
                    )}
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              <Col sm>
                <label>{t('width')} cm</label>
                <FormControl type="number" step={0.01} size="sm" name='width' required className="mb-2" min={1} />
              </Col>
              <Col sm>
                <label>{t('height')} cm</label>
                <FormControl type="number" step={0.01} size="sm" name='height' required className="mb-2" min={1} />
              </Col>
              <Col sm>
                <label>{t('length')} cm</label>
                <FormControl type="number" step={0.01} size="sm" name='length' required className="mb-2" min={1} />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" variant="secondary" onClick={handleCloseCreateModal}>
              {t('close')}
            </Button>
            <Button type="submit" size="sm" variant="primary" disabled={!validateLocation || isValidating}>
              {t('save-changes')} {loadingSave && <Spinner size="sm" animation="grow" variant="primary" />}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
