import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { GlobalStyle, LoginImg, Logo, TimeLoader } from "@components";
import { Row, Col, Card, Button, Spinner, InputGroup, FormControl } from "react-bootstrap";
import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faEye, faEyeSlash, faKey, faMoon, faSun, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm, useNotify } from "@hooks";
import { useAuth, useAxios, useTheme } from "@contexts";
import type { IAxiosResponseMessage } from "@types";
import {  Navigate } from "react-router-dom";

export const Login = () => {
  const { Login, isAutenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [page, setPage] = useState('login');
  const { t, i18n } = useTranslation();
  const { serialize } = useForm();
  const { theme, setTheme } = useTheme();
  const { notify } = useNotify();
  const { publicFetch } = useAxios();
  useEffect(() => {
    document.title = page === 'login' ? t('login') : t('register');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const handleUpdateLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  }

  const handleLogin = async (ev: React.FormEvent): Promise<void> => {
    ev.preventDefault();
    setLoading(true);
    const formData = serialize(ev.target as HTMLFormElement);
    const { data } = await publicFetch.post('/login/login', formData);
    notify({
      ...data,
      callback: () => { if (data.code === 200) Login(data) }
    })
    setLoading(false);
  }
  const handleRegister = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    const formData = serialize(ev.target as HTMLFormElement);
    const { data } = await publicFetch.post<IAxiosResponseMessage>('/login/register',
      formData
    );
    data.callback = function (): any {
      if(data?.code !== 201) return;
      (ev.target as HTMLFormElement).reset();
      setPage('login');
      return;
    }
    notify(data, true);
    setLoading(false);
    return;
  }
  return isAutenticated() ? <Navigate to="/home" /> : (
    <>
      <GlobalStyle />
      <div className={`${styles.collapse} d-flex-ni flex-column flex-md-row align-items-center p-3 px-md-4 purple shadow-sm`}>
        <h5 style={{ fontSize: "3rem" }} className=" mt-0 mb-0 text-light text-center mb-0 align-middle">
          <Logo width='100px' />
        </h5>
      </div>
      <Row className="h-100 mx-0">
        <Col className={`${styles.purple} ${styles.left}`}>
          <Row style={{ height: "100%" }}>
            <Col className='my-auto'>
              <h5 style={{ fontSize: "3rem" }} className="mt-0 mb-0 text-light text-center mb-0 align-middle">
                <Logo width='300px' />
              </h5>
            </Col>
          </Row>
        </Col>
        <Col md className={`${styles.right} right`}>
          <div className="container h-100">
            <Row className="align-items-center h-100 justify-content-center">
              <Col sm="auto">
                <Card className={`${styles.card} ${styles.shadow} border-0 mx-auto`}>
                  <Card.Header className={`${styles.card_header}  p-4`}>
                    <h5 className='text-light text-center mb-0 align-middle'>
                      <Logo width='100px' />
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <h5 className={`${styles.text_grey} text-center mt-0 font-weight-bold`}>
                      {t("login")}
                    </h5>
                    <p className="text-center text-muted"></p>
                    <Row className="mb-3 text-center">
                      <LoginImg />
                    </Row>
                    <>
                      {
                        page === 'login' ? (
                          <form onSubmit={handleLogin} autoComplete="on">
                            <div className="form-froup p-1">
                              <label>
                                <h6 className='text-grey'>
                                  <FontAwesomeIcon icon={faUser} />&nbsp;
                                  {t("username")}
                                </h6 >
                              </label>
                              <input type="text" name="email" required className='form-control mb-2' />
                              <div className="invalid-feedback">{t('username')}</div>
                              <label className="mt-4">
                                <h6 className="text-grey">
                                  <FontAwesomeIcon icon={faKey} />&nbsp;
                                  {t("password")}
                                </h6>
                              </label>
                              <input name="password" minLength={6} required id="password" type="password" className="form-control" />
                              <div className="invalid-feedback">{t('password')}</div>
                            </div >
                            <Row className="m-3 justify-content-center">
                              <Col sm="auto">
                                <Button disabled={loading} size="sm" className={`${styles["btn-primary"]}`} variant="primary" type="submit" >
                                  {loading ? (<Spinner animation="grow" size="sm" variant="primary" />) : t("login")}
                                </Button>
                              </Col>
                              <Col sm="auto">
                                <Button disabled={loading} size="sm" className={`${styles["btn-primary"]}`} onClick={() => setPage('register')} variant="primary" >
                                  {t("register")}
                                </Button>
                              </Col>
                            </Row>
                          </form>
                        ) : (
                          <>
                            <form onSubmit={handleRegister} autoComplete="off">
                              <input hidden name="lang" defaultValue={i18n.language} />
                              <div className="form-froup p-1">
                                <label>
                                  <h6 className='text-grey'>
                                    <FontAwesomeIcon icon={faEnvelopeOpenText} />&nbsp;
                                    {t("email")}
                                  </h6 >
                                </label>
                                <FormControl type="email" size="sm" name="email" required />
                                <div className="invalid-feedback"> {t("email")}</div>
                                <label>
                                  <h6 className='text-grey'>
                                    <FontAwesomeIcon icon={faUser} />&nbsp;
                                    {t("full-name")}
                                  </h6 >
                                </label>
                                <FormControl size="sm" name='name' required className="mb-2" />
                                <label>
                                  <h6 className='text-grey'>
                                    <FontAwesomeIcon icon={faKey} />&nbsp;
                                    {t("password")}
                                  </h6 >
                                </label>
                                <InputGroup size="sm" className="mb-1">
                                  <FormControl type={showPass ? "text" : "password"} minLength={8} size="sm" name="password" required />
                                  <Button size="sm" variant="primary" onClick={() => setShowPass(prev => !prev)}>
                                    {
                                      showPass ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />
                                    }
                                  </Button>
                                </InputGroup>
                              </div >
                              <Row className="m-3 justify-content-center">
                                <Col sm="auto">
                                  <Button disabled={loading} size="sm" className={`${styles["btn-primary"]}`} variant="primary" type="submit" >
                                    {loading ? (<TimeLoader />) : t("register")}
                                  </Button>
                                </Col>
                                <Col sm="auto">
                                  <Button disabled={loading} size="sm" className={`${styles["btn-primary"]}`} onClick={() => setPage('login')} variant="primary" >
                                    {t("login")}
                                  </Button>
                                </Col>
                              </Row>
                            </form>
                          </>
                        )
                      }
                    </>
                    <Row className="mt-2">
                      <Col sm>
                        <select value={i18n.language} className="form-select form-select-sm" onChange={handleUpdateLang}>
                          <option value="en">{t("english")}</option>
                          <option value="es">{t("spanish")}</option>
                        </select>
                      </Col>
                      <Col sm="auto">
                        <Button size="sm" variant={theme === "light" ? "dark" : "primary"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row >
          </div >
        </Col >
      </Row >
    </>
  )
}
