import { useAuth, useTheme } from "@contexts";
import { Link } from "react-router-dom";
import { Button, Collapse, Container, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { ContextProps, INavItemProps, ISideBarCollapsableNavItem } from "@types";
import { APP_NAME } from "@utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../general";
import iconImg from "@assets/img/profile.png";
import { useTranslation } from "react-i18next";
//import { usePermissions } from "@hooks";


export const Sidebar = ({ children }: ContextProps) => {
    const [fullWidth, setFullWidth] = useState<boolean>(false);
    const { theme, setTheme } = useTheme();
    const { user, LogOut } = useAuth();
    const { t } = useTranslation();
    //const { validatePermissions } = usePermissions();
    const [openCollapse, setOpenCollapse] = useState<boolean>(false);
    useEffect(() => {
        validateResponsive();     
     
    }, []);
    const CollapsableNavItem = (props: ISideBarCollapsableNavItem) => {
        const [opened, setOpened] = useState<boolean>(false);
        const { title, icon, children = null } = props;
        return (
            <li className={`has-dropdown ${opened ? 'opened' : ''}`}>
                <i className={icon}></i>
                <Link to={'#'} onClick={(e) => { e.preventDefault(); setOpened(!opened) }} >
                    {title}
                </Link>
                <ul className={`sidebar-dropdown list-unstyled ${opened ? 'active' : ''}`}>
                    {children}
                </ul>
            </li>
        );
    };
    const NavItem = (props: INavItemProps) => {
        const { title, link, external, icon } = props;
        const linkProps: any = external ? { to: link, target: '_blank' } : { to: link };
        return (
            <li>
                {icon && <i className={icon}></i>}
                <Link {...linkProps}>
                    {title}
                </Link>
            </li>
        );
    };
    const validateResponsive = () => {
        const size = window.innerWidth;
        if (size < 767) {
            setFullWidth(true);
            setOpenCollapse(false);
        } else {
            setFullWidth(false);
            setOpenCollapse(true);
        }
    }
    return (
        <>
            <aside className={`sidebar position-fixed top-0 left-0 overflow-auto h-100 float-left ${fullWidth ? 'show-sidebar' : ''}`}>
                <i className="uil-bars close-aside d-md-none d-lg-none" data-close="show-side-navigation1" onClick={() => setFullWidth(!fullWidth)}></i>
                <div className="sidebar-header d-flex justify-content-center align-items-center px-3 py-4">
                    <img src={iconImg} className="rounded-pill img-fluid border border-dark bg-white" width="65px" alt="img" />
                    <div className="ms-2">
                        <h5 className="fs-6 mb-0">
                            <Link className='text-decoration-none' to="#">{user?.name}</Link>
                        </h5>
                        <p className='mt-1'>{t(user?.rol_name ?? 'user')}</p>
                    </div>
                </div>
                <ul className="categories list-unstyled">
                    <NavItem title="Home" link="/home" icon="uil uil-estate fa-fw" />
                    <CollapsableNavItem eventKey="/test1" title="Asplicaciones" icon="uil-apps">
                        <NavItem title={"prueba"} link="/test" />
                    </CollapsableNavItem>
                    {/*{
                        validatePermissions(PANEL_ADMIN) && (<>
                            <CollapsableNavItem eventKey="/admin" title="Administración" icon="uil-apps">
                                {validatePermissions(GESTION_USUARIOS) && (
                                    <NavItem title={"Usuarios"} link="/users" />
                                )}
                                {validatePermissions(GESTION_SUCURSALES) && (
                                    <NavItem title={"Sucursales"} link="/sucursales" />
                                )}
                            </CollapsableNavItem>
                        </>)
                    }*/}
                    {/*<NavItem title={t('support')} link={SOPORTE_URL} external icon="uil-comment-question" />
                    <NavItem title={t('faq')} external link={FAQ_URL} icon="uil-question-circle" />*/}
                </ul>
            </aside>
            <section id="wrapper" className={`${fullWidth ? 'fullwidth' : ''}`}>
                <nav className="navbar navbar-expand-md">
                    <Container fluid className="mx-2">
                        <div className="navbar-header">
                            <Button type="button" className="navbar-toggler" onClick={() => setFullWidth(!fullWidth)}>
                                <i className="uil-bars" />
                            </Button>
                            <Link to="/home" className="navbar-brand">
                                <Logo width="100px" transparent className="img-fluid" />
                            </Link>
                        </div>
                        <Button type="button" className='navbar-toggler ml-auto' onClick={() => setOpenCollapse(!openCollapse)}
                            aria-controls="toggle-navbar"
                            aria-expanded={openCollapse}
                        >
                            <i className="uil-bars" />
                        </Button>
                        <Collapse className="navbar-collapse" in={openCollapse}>
                            <div id="toggle-navbar">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <Link to='#' className="nav-link" onClick={() => { setTheme(theme === "light" ? "dark" : "light") }}>
                                            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
                                        </Link>
                                    </li>
                                    <Dropdown placement="bottom-start" as={'li'} className="nav-item" id="toggle-navbar">
                                        <Dropdown.Toggle to={'#'} type="button" className="nav-link" id="dropdown-menu" as={Link} >
                                            Menù
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu as='ul'>
                                            <li>
                                                <Dropdown.Item className="dropdown-item" as={Link} to="/profile">Perfil</Dropdown.Item>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <Dropdown.Item onClick={LogOut} >Cerrar sesión</Dropdown.Item>
                                            </li>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <li className="nav-item">
                                        <Link to={'#'} type="button" className="nav-link" onClick={() => setFullWidth(!fullWidth)}>
                                            <i className="uil-bars fa-fw"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </Collapse>
                    </Container>
                </nav>
                <Container fluid className="wrapper-content">
                    {children}
                </Container>
                <footer>
                    &copy; {APP_NAME} <br /> 2025 - {new Date().getFullYear()} <br />
                </footer>
            </section>
        </>
    )
}