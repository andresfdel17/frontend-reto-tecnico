import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBox, faTruck, faCheck, faBan, faSync } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useAxios } from "@contexts";
import { ShipmentsChart } from "@components";
import type { ChartData, User } from "@types";

export const Home = () => {
  const { t } = useTranslation();
  const { privateFetch } = useAxios();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState('7');

  useEffect(() => {
    document.title = t("dashboard");
    loadChartData();
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedUserId]);

  const loadChartData = async () => {
    setLoading(true);
    setError(null);
    let url = `/home/charts-data?period=${selectedPeriod}`;
    if (selectedUserId) {
      url += `&user_id=${selectedUserId}`;
    }
    const { data } = await privateFetch.get(url);
    if (data.code === 200) {
      setChartData(data.data);
    } else {
      setError(data.message || 'Error loading chart data');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const { data } = await privateFetch.get('/users/getAllUsers?limit=100');
      if (data.code === 200) {
        // Filtrar solo usuarios no-admin (rol_id != 1)
        const nonAdminUsers = data.data.filter((user: any) => user.rol_id !== 1);
        setUsers(nonAdminUsers);
      }
    } catch (error) {
      // Si no es admin o hay error, simplemente no mostramos el filtro
      console.log('No admin access or error loading users');
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    bgColor
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    bgColor: string;
  }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body className="d-flex align-items-center">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center me-3`}
          style={{
            width: '50px',
            height: '50px',
            backgroundColor: bgColor,
            color: color
          }}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
        </div>
        <div>
          <h6 className="text-muted mb-1 small">{title}</h6>
          <h4 className="mb-0 fw-bold">{value.toLocaleString()}</h4>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
                {t("dashboard")}
              </h2>
              <p className="text-muted mb-0">{t("shipments-overview")}</p>
            </div>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                onClick={loadChartData}
                disabled={loading}
                title={t("refresh")}
              >
                <FontAwesomeIcon
                  icon={faSync}
                  spin={loading}
                />
              </Button>
              <Form.Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                style={{ width: 'auto' }}
                size="sm"
              >
                <option value="7">{t("last-7-days")}</option>
                <option value="15">{t("last-15-days")}</option>
                <option value="30">{t("last-30-days")}</option>
              </Form.Select>
            </div>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <FontAwesomeIcon icon={faBan} className="me-2" />
              {t(error)}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title={t("created")}
            value={chartData?.stats.created || 0}
            icon={faBox}
            color="#007bff"
            bgColor="rgba(0, 123, 255, 0.1)"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title={t("in-transit")}
            value={chartData?.stats.inTransit || 0}
            icon={faTruck}
            color="#ffc107"
            bgColor="rgba(255, 193, 7, 0.1)"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title={t("delivered")}
            value={chartData?.stats.delivered || 0}
            icon={faCheck}
            color="#28a745"
            bgColor="rgba(40, 167, 69, 0.1)"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            title={t("cancelled")}
            value={chartData?.stats.cancelled || 0}
            icon={faBan}
            color="#dc3545"
            bgColor="rgba(220, 53, 69, 0.1)"
          />
        </Col>
      </Row>

      {/* Chart */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h5 className="mb-0">
                    <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
                    {t("shipments-timeline")}
                  </h5>
                  {chartData && (
                    <small className="text-muted">
                      {new Date(chartData.dateRange.start).toLocaleDateString()} - {new Date(chartData.dateRange.end).toLocaleDateString()}
                    </small>
                  )}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {/* Filtro de usuario (solo para admin) */}
                  {users.length > 0 && chartData?.filters?.isAdmin && (
                    <Form.Select
                      size="sm"
                      value={selectedUserId}
                      onChange={handleUserChange}
                      style={{ width: 'auto', minWidth: '150px' }}
                    >
                      <option value="">{t("all-users")}</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}

                  {/* Selector de período */}
                  <Form.Select
                    size="sm"
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    style={{ width: 'auto', minWidth: '120px' }}
                  >
                    <option value="7">{t("last-7-days")}</option>
                    <option value="15">{t("last-15-days")}</option>
                    <option value="30">{t("last-30-days")}</option>
                  </Form.Select>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <ShipmentsChart
                data={chartData?.chartData}
                loading={loading}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Total Summary */}
      {chartData && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body className="text-center">
                <h3 className="text-primary mb-1">{chartData.stats.total.toLocaleString()}</h3>
                <p className="text-muted mb-0">
                  {t("total-shipments")} - {t("last-7-days").toLowerCase()}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
