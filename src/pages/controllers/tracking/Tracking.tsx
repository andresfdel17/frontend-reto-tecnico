import { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faCheck, faHourglass, faTruck, faBox, faBan, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useAxios } from "@contexts";
import { useSocket } from "@hooks";
import { APP_URL } from "@utils";
import type { ISend } from "@types";
import { SendState } from "@types";
import "./Tracking.css";

export const Tracking = () => {
  const { t, i18n } = useTranslation();
  const { publicFetch } = useAxios();
  const socket = useSocket(APP_URL);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<ISend | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSocketId, setCurrentSocketId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = t("tracking");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket && currentSocketId) {
      const eventName = `send-updated-${currentSocketId}`;
      const handleUpdate = (updatedSend: ISend) => {
        setShipment(updatedSend);
      };
      socket.on(eventName, handleUpdate);
      return () => {
        socket.off(eventName, handleUpdate);
      };
    }
  }, [socket, currentSocketId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      setError("tracking-number-required");
      return;
    }

    setLoading(true);
    setError(null);
    setShipment(null);

    try {
      const { data } = await publicFetch.get(`/home/tracking/${trackingNumber.trim()}`);
      
      if (data.code === 404) {
        setError("tracking-not-found");
        setShipment(null);
      } else if (data.code === 200) {
        setShipment(data.data);
        
        // Set current socket ID for event listening
        setCurrentSocketId(trackingNumber.trim());
      } else {
        setError("tracking-error");
        setShipment(null);
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setError("tracking-error");
      setShipment(null);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setTrackingNumber("");
    setShipment(null);
    setError(null);
    
    // Clear socket connection
    setCurrentSocketId(null);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const getStepStatus = (stepState: number, currentState: number, isCancelled: boolean) => {
    if (isCancelled) {
      return stepState <= currentState ? "cancelled" : "pending";
    }
    
    if (stepState < currentState) return "completed";
    if (stepState === currentState) return "current";
    return "pending";
  };

  const getStepIcon = (stepState: number, status: string) => {
    if (status === "cancelled") return faBan;
    if (status === "completed") return faCheck;
    if (status === "current") {
      switch (stepState) {
        case SendState.ON_WAIT: return faHourglass;
        case SendState.ON_TRANSIT: return faTruck;
        case SendState.DELIVERED: return faBox;
        default: return faHourglass;
      }
    }
    return faHourglass;
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return null;
    return new Date(dateTime).toLocaleString();
  };

  const renderTrackingSteps = () => {
    if (!shipment) return null;

    const isCancelled = shipment.state === SendState.CANCELLED;
    const steps = [
      {
        state: SendState.ON_WAIT,
        title: t("shipment-created"),
        datetime: shipment.create_datetime,
      },
      {
        state: SendState.ON_TRANSIT,
        title: t("shipment-in-transit"),
        datetime: shipment.transit_datetime,
      },
      {
        state: SendState.DELIVERED,
        title: t("shipment-delivered"),
        datetime: shipment.deliver_datetime,
      },
    ];

    return (
      <div className={`tracking-steps ${isCancelled ? "cancelled" : ""}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.state, shipment.state, isCancelled);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.state} className="tracking-step">
              <div className={`step-indicator ${status}`}>
                <FontAwesomeIcon icon={getStepIcon(step.state, status)} />
              </div>
              
              <div className="step-content">
                <h5 className={`step-title ${status}`}>{step.title}</h5>
                {step.datetime && (
                  <p className="step-datetime">{formatDateTime(step.datetime)}</p>
                )}
              </div>

              {!isLast && <div className={`step-line ${status}`}></div>}
            </div>
          );
        })}

        {isCancelled && (
          <div className="tracking-step">
            <div className="step-indicator cancelled">
              <FontAwesomeIcon icon={faBan} />
            </div>
            <div className="step-content">
              <h5 className="step-title cancelled">{t("shipment-cancelled")}</h5>
              <p className="step-datetime">{formatDateTime(shipment.create_datetime)}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Container className="tracking-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="tracking-card">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">{t("track-shipment")}</h2>
                <div className="language-selector">
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  <Form.Select 
                    size="sm" 
                    value={i18n.language} 
                    onChange={handleLanguageChange}
                    className="language-select"
                  >
                    <option value="es">{t("spanish")}</option>
                    <option value="en">{t("english")}</option>
                  </Form.Select>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("tracking-number")}</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      ref={inputRef}
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder={t("enter-tracking-number")}
                      disabled={loading}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={handleClear}
                      disabled={loading || !trackingNumber}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    {loading ? t("loading") : t("track")}
                  </Button>
                </div>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {t(error)}
                </Alert>
              )}

              {shipment && (
                <div className="tracking-results mt-4">
                  <Alert variant="info">
                    <strong>{t("tracking-status")}:</strong> {shipment.unique_id}
                  </Alert>

                  {renderTrackingSteps()}

                  {shipment.state === SendState.CANCELLED && (
                    <Alert variant="warning" className="mt-3">
                      <small>{t("cancelled-shipment-note")}</small>
                    </Alert>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
