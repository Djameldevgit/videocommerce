// components/Navbar2.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import Card from 'react-bootstrap/Card';
import {
  FaPlusCircle,
  FaStore,
  FaTools,
  FaShieldAlt,
  FaUsers,
  FaUserCog,
  FaSignOutAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaShareAlt,
  FaGlobe,
  FaLanguage,
  FaRobot,
  FaBars,
  FaPlus,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaDownload,
  FaStar,
  FaInnosoft
} from 'react-icons/fa';

import { Navbar, Container, NavDropdown, Badge } from 'react-bootstrap';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';
import MultiCheckboxModal from './MultiCheckboxModal.';
import ShareAppModal from '../shareAppModal';
import Drawer from './Drawer';
import useComponentDirection from '../../pages/google/LanguageManager';

const Navbar2 = () => {
  const { auth, cart, notify, settings } = useSelector((state) => state);
  const dispatch = useDispatch();

  const { t } = useTranslation('navbar2');
  const history = useHistory();

  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasChannel, setHasChannel] = useState(false);

  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const notifyDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const { dir, textAlign, isRTL, shouldIgnoreRTL } = useComponentDirection('Navbar2');

  const handleDrawerOpen = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 700);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavbarVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // ✅ Verificar si el usuario tiene canal
  useEffect(() => {
    if (auth.user && auth.user.channels) {
      setHasChannel(auth.user.channels.length > 0);
    } else if (auth.user) {
      setHasChannel(false);
    }
  }, [auth.user]);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    const handleInstallAvailable = () => setShowInstallButton(true);
    const handleInstalled = () => {
      setIsPWAInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);
    window.addEventListener('pwaInstalled', handleInstalled);

    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
      window.removeEventListener('pwaInstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        if (!showInstallButton && !isPWAInstalled) {
          setShowInstallButton(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showInstallButton, isPWAInstalled]);

  useEffect(() => {
    const checkPWAInstallation = () => {
      const isInstalled =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        localStorage.getItem('pwaInstalled') === 'true';

      setIsPWAInstalled(isInstalled);
      return isInstalled;
    };

    const installed = checkPWAInstallation();

    if (!installed) {
      const handleInstallAvailable = () => setShowInstallButton(true);
      const handleInstalled = () => {
        setIsPWAInstalled(true);
        setShowInstallButton(false);
      };

      window.addEventListener('pwaInstallAvailable', handleInstallAvailable);
      window.addEventListener('pwaInstalled', handleInstalled);

      const installCheckInterval = setInterval(() => {
        if (checkPWAInstallation()) {
          clearInterval(installCheckInterval);
        } else if (window.deferredPrompt && !showInstallButton) {
          setShowInstallButton(true);
        }
      }, 2000);

      return () => {
        window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
        window.removeEventListener('pwaInstalled', handleInstalled);
        clearInterval(installCheckInterval);
      };
    }
  }, [showInstallButton]);

  const handleInstallPWA = async () => {
    try {
      if (window.installPWA) {
        const installed = await window.installPWA();
        if (installed) {
          setShowInstallButton(false);
          setIsPWAInstalled(true);
        }
      } else {
        window.open('/?install-pwa=true', '_blank');
      }
    } catch (error) {
      console.error('Error instalando PWA:', error);
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  const handleLogin = () => {
    setDropdownOpen(false);
    history.push('/login');
  };

  const handleRegister = () => {
    setDropdownOpen(false);
    history.push('/register');
  };

  // ✅ Manejador para crear video
  const handleCreateVideoClick = () => {
    if (hasChannel) {
      history.push('/create-video-page');
    } else {
      const confirmCreate = window.confirm(
        "⚠️ Vous n'avez pas encore de chaîne.\n\nPour publier des vidéos, vous devez d'abord créer une chaîne.\n\nCliquez sur OK pour créer votre chaîne."
      );
      if (confirmCreate) {
        history.push('/channel/new');
      }
    }
  };

  if (!settings || Object.keys(settings).length === 0) {
    return (
      <nav className="navbar navbar-light bg-light nb2-fallback" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1030 }}>
        <span className="navbar-brand">{t('loading') || 'Cargando...'}</span>
      </nav>
    );
  }

  const totalItems = (cart?.items && Array.isArray(cart.items))
    ? cart.items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;

  const unreadNotifications = notify?.data?.filter(n => n && !n.isRead).length || 0;

  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children, danger = false }) => {
    const handleClick = (e) => {
      if (onClick) {
        onClick(e);
      }
      setDropdownOpen(false);
      if (to) {
        history.push(to);
      }
    };

    return (
      <NavDropdown.Item
        as="button"
        onClick={handleClick}
        className={`custom-menu-item ${danger ? 'text-danger' : ''}`}
        style={{
          padding: '12px 16px',
          transition: 'all 0.2s ease',
          borderRadius: '8px',
          margin: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: '500',
          width: 'calc(100% - 16px)',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        <Icon className="me-2" style={{ color: iconColor, fontSize: '1rem', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span>
      </NavDropdown.Item>
    );
  };

  return (
    <>
      <Navbar
        className={`navbar2 ${!isNavbarVisible ? 'nb2-hidden' : ''}`}
        style={{
          zIndex: 1030,
          background: settings.style
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          padding: isMobile ? '6px 0' : '8px 0',
          boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
          minHeight: isMobile ? '56px' : '64px',
          transition: 'transform 0.3s ease-in-out',
          transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)'
        }}
        fixed="top"
        expand="lg"
      >
        <Container
          fluid
          className="align-items-center justify-content-between"
          style={{
            padding: isMobile ? '0 12px' : '0 20px',
            maxWidth: '100%'
          }}
        >
          <div className="d-flex align-items-center" style={{ minWidth: 0, flex: '0 1 auto' }}>
            <Link
              to="/"
              onDoubleClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              className="btn p-0"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                marginRight: isMobile ? '6px' : '10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0
              }}
              title="Click para ir al inicio - Doble click para recargar"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>

            {!isMobile && (
              <Link
                to="/"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Click para ir al inicio - Doble click para recargar"
              >
                <Navbar.Brand
                  className="py-0 mb-0"
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Card.Title
                    className="mb-0"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      letterSpacing: '0.3px',
                      margin: 0,
                      padding: 0,
                      lineHeight: '1.2',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {t('appName') || 'MarketPlace'}
                  </Card.Title>
                </Navbar.Brand>
              </Link>
            )}
          </div>

          <div
            className="d-flex align-items-center"
            style={{
              gap: isMobile ? '6px' : '10px',
              flexShrink: 0,
              marginLeft: 'auto'
            }}
          >
            <Link
              to="/search"
              className="icon-button"
              style={{
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                textDecoration: 'none'
              }}
            >
              <FaSearch
                size={isMobile ? 16 : 18}
                style={{ color: '#667eea' }}
                title={t('search') || 'Buscar'}
              />
            </Link>

            {showInstallButton && !isPWAInstalled && (
              <button
                className="icon-button nb2-btn--install"
                onClick={handleInstallPWA}
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(40, 167, 69, 0.1)',
                  border: '2px solid #28a745',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 2s infinite',
                  cursor: 'pointer'
                }}
                title={t('installPWA') || 'Instalar App'}
              >
                <FaDownload
                  size={isMobile ? 16 : 18}
                  style={{ color: '#28a745' }}
                />
              </button>
            )}

            {/* ✅ BOTÓN CREAR VIDEO (PLUS) */}
            {auth.user && (
              <button
                onClick={handleCreateVideoClick}
                className="icon-button"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.25)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title={t('createVideo') || 'Créer une vidéo'}
              >
                <FaPlus size={isMobile ? 14 : 16} style={{ color: 'white' }} />
              </button>
            )}

            {auth.user && (auth.user.role === "Super-utilisateur" || auth.user.role === "admin" || auth.user.role === "user") && (
              <Link
                to="/creer-annonce"
                className="icon-button"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                  textDecoration: 'none'
                }}
                title={t('addPost') || 'Créer une annonce'}
              >
                <FaPlusCircle size={isMobile ? 14 : 16} style={{ color: 'white' }} />
              </Link>
            )}

            {auth.user && (
              <div
                className="position-relative icon-button"
                ref={notifyDropdownRef}
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Link to={'/notify'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaBell
                    size={isMobile ? 18 : 20}
                    style={{ color: unreadNotifications > 0 ? '#f5576c' : '#667eea' }}
                  />
                </Link>

                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: isMobile ? '0.6rem' : '0.65rem',
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      padding: isMobile ? '3px 6px' : '4px 7px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(245, 87, 108, 0.4)',
                      minWidth: isMobile ? '18px' : '20px',
                      height: isMobile ? '18px' : '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </div>
            )}

            <NavDropdown
              align="end"
              show={dropdownOpen}
              onToggle={(isOpen) => setDropdownOpen(isOpen)}
              title={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {auth.user ? (
                    <div
                      style={{
                        width: isMobile ? '38px' : '42px',
                        height: isMobile ? '38px' : '42px',
                        borderRadius: '10px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Avatar
                        src={auth.user.avatar}
                        size="medium-avatar"
                        style={{
                          borderRadius: '8px',
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: isMobile ? '38px' : '42px',
                        height: isMobile ? '38px' : '42px',
                        borderRadius: '10px',
                        backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FaUserCircle size={isMobile ? 22 : 26} style={{ color: '#667eea' }} />
                    </div>
                  )}
                </div>
              }
              id="nav-user-dropdown"
              className="custom-dropdown"
            >
              <div className="dropdown-scroll-wrapper">
                {auth.user ? (
                  <>
                    <div className="user-header">
                      <div className="d-flex align-items-center gap-3">
                        <div className="user-avatar-wrapper">
                          <Avatar src={auth.user.avatar} size="medium-avatar" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold text-white user-name">
                            {auth.user.username || auth.user.name || 'Usuario'}
                          </div>
                          <div className="user-role-badge">
                            {auth.user.role === 'admin' ? `👑 ${t('admin') || 'Admin'}` :
                              auth.user.role === 'Moderateur' ? `🛡️ ${t('moderator') || 'Moderador'}` :
                                auth.user.role === 'Super-utilisateur' ? `⭐ ${t('superUser') || 'Super Usuario'}` :
                                  `👤 ${t('user') || 'Usuario'}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <NavDropdown.Divider />

                    {auth.user.role !== 'admin' && auth.user.role !== 'Moderateur' && (
                      <MenuItem
                        icon={FaUserPlus}
                        iconColor="#28a745"
                        onClick={() => history.push('/planes')}
                      >
                        🚀 Devenir Utilisateur Pro
                      </MenuItem>
                    )}
                    
                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/donation">
                      {t('donation') || 'donation'}
                    </MenuItem>

                    {auth.user.role !== 'admin' && auth.user.role !== 'Moderateur' && (
                      <MenuItem
                        icon={FaInnosoft}
                        iconColor="#28a745"
                        onClick={() => history.push('/userproinfoplans')}
                      >
                        🚀 Info Utilisateur Pro
                      </MenuItem>
                    )}
                    
                    {auth.user.role === 'userPro' && (
                      <div className="current-plan-badge" style={{ padding: '8px 16px', margin: '4px 8px', background: 'linear-gradient(135deg, #28a74520, #20c99720)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <FaStar style={{ color: '#ffc107' }} />
                        Plan actuel: {auth.user.plan || 'basic'}
                      </div>
                    )}

                    {/* ✅ MENU ITEM CREAR VIDEO */}
                    <MenuItem 
                      icon={FaPlus} 
                      iconColor="#28a745" 
                      onClick={handleCreateVideoClick}
                    >
                      Créer une vidéo
                    </MenuItem>

                    {auth.user.role === "admin" && (
                      <>
                        <MenuItem icon={FaShieldAlt} iconColor="#ffc107" to='/admin/posts'>
                          Approbation
                        </MenuItem>
                        <MenuItem icon={FaUsers} iconColor="#28a745" to='/admindashboard'>
                          Admin dashboard
                        </MenuItem>
                      </>
                    )}

                    <MenuItem icon={FaUserCircle} iconColor="#667eea" to={`/profile/${auth.user._id}`}>
                      {t('profile') || 'Mi Perfil'}
                    </MenuItem>

                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                      {t('appInfo') || 'Información'}
                    </MenuItem>

                    {auth.user.role === "admin" && (
                      <MenuItem icon={FaTools} iconColor="#6c757d" to="/users/roles">
                        {t('roles') || 'Roles'}
                      </MenuItem>
                    )}

                    <MenuItem icon={FaShareAlt} iconColor="#ffc107" onClick={() => setShowShareModal(true)}>
                      {t('shareApp') || 'Compartir App'}
                    </MenuItem>

                    {auth.user.role === "admin" && (
                      <>
                        <NavDropdown.Divider />
                        <div className="admin-panel-header">
                          <FaStore className="me-2" size={14} />
                          {t('storeManagement') || 'Gestión de Tiendas'}
                        </div>
                       
                        <MenuItem icon={FaPlusCircle} iconColor="#28a745" to="/create-boutique">
                          {t('createStore') || 'Crear tienda'}
                        </MenuItem>

                        <MenuItem icon={FaStore} iconColor="#667eea" to={`/boutique/${auth.user._id}`}>
                          {t('myStore') || 'Mi tienda'}
                        </MenuItem>

                        <MenuItem icon={FaStore} iconColor="#ffc107" to="/boutiques">
                          {t('allStores') || 'Todas las tiendas'}
                        </MenuItem>

                        <MenuItem icon={FaStore} iconColor="#28a745" to="/mes-boutiques">
                          {t('myStoresList') || 'Mis tiendas'}
                        </MenuItem>

                        <MenuItem icon={FaUsers} iconColor="#28a745" to="/users">
                          {t('users') || 'Usuarios'}
                        </MenuItem>

                        <MenuItem icon={FaUserCog} iconColor="#667eea" to="/usersactionn">
                          {t('userActions') || 'Acciones de usuario'}
                        </MenuItem>
                      </>
                    )}

                    <NavDropdown.Divider />

                    <MenuItem
                      icon={FaSignOutAlt}
                      iconColor="#dc3545"
                      onClick={handleLogout}
                      danger
                    >
                      <span className="fw-bold">{t('logout') || 'Cerrar Sesión'}</span>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem icon={FaSignInAlt} iconColor="#28a745" onClick={handleLogin}>
                      {t('login') || 'Iniciar Sesión'}
                    </MenuItem>

                    <MenuItem icon={FaUserPlus} iconColor="#667eea" onClick={handleRegister}>
                      {t('register') || 'Registrarse'}
                    </MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/donation">
                      {t('donation') || 'donation'}
                    </MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                      {t('appInfo') || 'Información'}
                    </MenuItem>

                    <MenuItem icon={FaShareAlt} iconColor="#ffc107" onClick={() => setShowShareModal(true)}>
                      {t('shareApp') || 'Compartir App'}
                    </MenuItem>
                  </>
                )}
              </div>
            </NavDropdown>

            <button
              onClick={handleDrawerOpen}
              className="icon-button"
              style={{
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                marginLeft: isMobile ? '4px' : '6px'
              }}
              title={t('menu') || "Menú"}
            >
              <FaBars
                size={isMobile ? 18 : 20}
                style={{
                  color: settings.style ? '#ffffff' : '#667eea'
                }}
              />
            </button>
          </div>
        </Container>
      </Navbar>

      <div style={{
        height: isMobile ? '56px' : '64px',
        minHeight: isMobile ? '56px' : '64px'
      }} />

      <style>{`
        .nb2-hidden {
          transform: translateY(-100%);
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .icon-button {
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .icon-button:hover,
        .icon-button:active {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.25) !important;
        }

        .custom-menu-item {
          color: ${settings.style ? '#ffffff' : '#333333'} !important;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          background: transparent !important;
        }

        .custom-menu-item:hover,
        .custom-menu-item:focus {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
          transform: translateX(4px);
        }

        .custom-menu-item.text-danger:hover,
        .custom-menu-item.text-danger:focus {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%) !important;
        }

        .dropdown-scroll-wrapper {
          max-height: 70vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 0;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar {
          width: 4px;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar-track {
          background: ${settings.style ? 'rgba(255,255,255,0.05)' : '#f1f1f1'};
          border-radius: 10px;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        .user-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 16px;
          margin: 0 0 8px 0;
          border-radius: 12px 12px 0 0;
        }

        .user-avatar-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid white;
          padding: 2px;
          background: white;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 1rem;
          word-break: break-word;
        }

        .user-role-badge {
          font-size: 0.8rem;
          background-color: rgba(255,255,255,0.2);
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 4px;
          color: white;
          font-weight: 600;
        }

        .admin-panel-header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          padding: 10px 16px;
          margin: 4px 12px 8px 12px;
          border-radius: 8px;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
        }

        #nav-user-dropdown + .dropdown-menu {
          position: absolute !important;
          right: 0 !important;
          left: auto !important;
          top: 100% !important;
          margin-top: 8px !important;
          width: 290px !important;
          min-width: 290px !important;
          max-width: 290px !important;
          transform: none !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
          background: ${settings.style ? '#2d3748' : '#ffffff'} !important;
          padding: 0 !important;
          overflow: hidden !important;
          z-index: 1050 !important;
        }

        .dropdown-divider {
          border-color: ${settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          margin: 8px 12px !important;
        }

        @media (max-width: 700px) {
          #nav-user-dropdown + .dropdown-menu {
            right: 8px !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }

          .user-header {
            padding: 14px;
          }

          .user-avatar-wrapper {
            width: 45px;
            height: 45px;
          }

          .user-name {
            font-size: 0.95rem;
          }

          .user-role-badge {
            font-size: 0.75rem;
            padding: 3px 8px;
          }

          .custom-menu-item {
            padding: 10px 14px !important;
            margin: 3px 6px !important;
            width: calc(100% - 12px) !important;
          }

          .admin-panel-header {
            padding: 8px 14px;
            margin: 4px 10px 6px 10px;
            font-size: 0.8rem;
          }
        }

        @media (min-width: 701px) {
          .custom-menu-item:hover {
            transform: translateX(4px);
          }
          
          .icon-button:hover {
            transform: translateY(-2px);
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .icon-button:hover {
            transform: none;
          }

          .icon-button:active {
            transform: scale(0.95);
            opacity: 0.8;
          }

          .custom-menu-item:hover {
            transform: none;
          }

          .custom-menu-item:active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
          }
        }

        * {
          touch-action: manipulation;
        }

        .navbar2 {
          transition: transform 0.3s ease-in-out !important;
        }
      `}</style>

      <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />
      <MultiCheckboxModal show={showFeaturesModal} onClose={() => setShowFeaturesModal(false)} />
      <ShareAppModal show={showShareModal} onClose={() => setShowShareModal(false)} />
      <Drawer show={showDrawer} onHide={handleDrawerClose} position="start" title={t('menu') || "Menú"} user={auth.user} />
    </>
  );
};

export default Navbar2;