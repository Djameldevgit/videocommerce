// components/Navbar2.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import { Navbar, Container, NavDropdown } from 'react-bootstrap';
import {
  FaPlusCircle, FaStore, FaTools, FaShieldAlt, FaUsers, FaUserCog,
  FaSignOutAlt, FaInfoCircle, FaSignInAlt, FaUserPlus, FaShareAlt,
  FaBars, FaSearch, FaBell, FaUserCircle, FaDownload /*, FaVideo (eliminado) */
} from 'react-icons/fa';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';
import MultiCheckboxModal from './MultiCheckboxModal.';
import ShareAppModal from '../shareAppModal';
import Drawer from './Drawer';
import useComponentDirection from '../../pages/google/LanguageManager';
import './Navbar2.css';

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

  // Estados para scroll del navbar
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const notifyDropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const { dir, textAlign, isRTL, shouldIgnoreRTL } = useComponentDirection('Navbar2');

  const handleDrawerOpen = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  // Resize
  useEffect(() => {
    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setIsMobile(window.innerWidth < 700), 100);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(tid); };
  }, []);

  // Efecto de scroll para ocultar/mostrar navbar
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

  // PWA detection
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) setIsPWAInstalled(true);
    const onAvail = () => setShowInstallButton(true);
    const onInstalled = () => { setIsPWAInstalled(true); setShowInstallButton(false); };
    window.addEventListener('pwaInstallAvailable', onAvail);
    window.addEventListener('pwaInstalled', onInstalled);
    return () => {
      window.removeEventListener('pwaInstallAvailable', onAvail);
      window.removeEventListener('pwaInstalled', onInstalled);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const t = setTimeout(() => {
        if (!showInstallButton && !isPWAInstalled) setShowInstallButton(true);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [showInstallButton, isPWAInstalled]);

  useEffect(() => {
    const checkPWA = () => {
      const installed =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        localStorage.getItem('pwaInstalled') === 'true';
      setIsPWAInstalled(installed);
      return installed;
    };
    if (!checkPWA()) {
      const onAvail = () => setShowInstallButton(true);
      const onInstalled = () => { setIsPWAInstalled(true); setShowInstallButton(false); };
      window.addEventListener('pwaInstallAvailable', onAvail);
      window.addEventListener('pwaInstalled', onInstalled);
      const iv = setInterval(() => {
        if (checkPWA()) { clearInterval(iv); }
        else if (window.deferredPrompt && !showInstallButton) { setShowInstallButton(true); }
      }, 2000);
      return () => {
        window.removeEventListener('pwaInstallAvailable', onAvail);
        window.removeEventListener('pwaInstalled', onInstalled);
        clearInterval(iv);
      };
    }
  }, [showInstallButton]);

  const handleInstallPWA = async () => {
    try {
      if (window.installPWA) {
        const installed = await window.installPWA();
        if (installed) { setShowInstallButton(false); setIsPWAInstalled(true); }
      } else {
        window.open('/?install-pwa=true', '_blank');
      }
    } catch (err) {
      console.error('Error instalando PWA:', err);
    }
  };

  const handleLogout = () => { setDropdownOpen(false); dispatch(logout()); setTimeout(() => { window.location.href = '/login'; }, 100); };
  const handleLogin = () => { setDropdownOpen(false); history.push('/login'); };
  const handleRegister = () => { setDropdownOpen(false); history.push('/register'); };

  if (!settings || Object.keys(settings).length === 0) {
    return (
      <nav className="navbar navbar-light bg-light nb2-fallback">
        <span className="navbar-brand">{t('loading') || 'Cargando...'}</span>
      </nav>
    );
  }

  const totalItems = (cart?.items && Array.isArray(cart.items)) ? cart.items.reduce((acc, item) => acc + (item?.quantity || 0), 0) : 0;
  const unreadNotifications = notify?.data?.filter(n => n && !n.isRead).length || 0;
  const isDark = !!settings.style;

  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children, danger = false }) => {
    const handleClick = (e) => {
      if (onClick) onClick(e);
      setDropdownOpen(false);
      if (to) history.push(to);
    };
    return (
      <NavDropdown.Item as="button" onClick={handleClick} className={`nb2-menu-item${danger ? ' danger' : ''}`}>
        <span className="nb2-item-icon" style={{ color: iconColor }}><Icon /></span>
        <span className="nb2-item-label">{children}</span>
      </NavDropdown.Item>
    );
  };

  const AvatarTrigger = (
    <div
      className={`nb2-avatar-trigger ${dropdownOpen ? 'open' : ''}`}
      onClick={() => setDropdownOpen(!dropdownOpen)}
      style={{
        width: isMobile ? '38px' : '42px',
        height: isMobile ? '38px' : '42px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
      aria-label={t('userMenu') || 'Menú de usuario'}
      aria-expanded={dropdownOpen}
      aria-haspopup="true"
    >
      {auth.user ? (
        <Avatar src={auth.user.avatar} size="small-avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <FaUserCircle size={isMobile ? 24 : 28} style={{ color: '#6c757d' }} />
      )}
    </div>
  );

  return (
    <>
      <style>
        {`
          /* ✅ Ajustes para móviles: estirar elementos a todo el ancho */
          @media (max-width: 700px) {
            .nb2-actions {
              flex: 1 !important;
              justify-content: space-evenly !important;
              gap: 4px !important;
              width: 100% !important;
            }
            .nb2-btn {
              flex: 1 !important;
              min-width: 38px !important;
              max-width: none !important;
              background: rgba(255,255,255,0.08);
              border-radius: 40px;
            }
            .nb2-container {
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            /* Ajustar logo para que no robe espacio */
            .nb2-logo-link {
              margin-right: 4px !important;
            }
          }
        `}
      </style>
      <Navbar
        className={`nb2-root${isDark ? ' dark' : ' light'} ${!isNavbarVisible ? 'nb2-hidden' : ''}`}
        fixed="top"
        expand="lg"
      >
        <Container fluid className="align-items-center justify-content-between nb2-container" style={{ padding: isMobile ? '0 8px' : '0 20px' }}>
          {/* Logo */}
          <div className="d-flex align-items-center" style={{ flex: '0 1 auto', minWidth: 0 }}>
            <Link to="/" onDoubleClick={e => { e.preventDefault(); window.location.reload(); }} className="nb2-logo-link" title="Accueil — Double-clic pour recharger">
              <div className="nb2-logo-box" style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px' }}>
                <img src="/images/logo.png" alt="Logo" onError={e => { e.target.style.display = 'none'; }} />
              </div>
            </Link>
            {!isMobile && (
              <Link to="/" onDoubleClick={e => { e.preventDefault(); window.location.reload(); }} className="nb2-brand-link">
                <Navbar.Brand className="nb2-brand py-0 mb-0">{t('appName') || 'MarketPlace'}</Navbar.Brand>
              </Link>
            )}
          </div>

          {/* Acciones derecha */}
          <div className="nb2-actions" style={{ gap: isMobile ? '12px' : '8px' }}>
            <Link to="/search" className="nb2-btn" style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }} title={t('search') || 'Rechercher'}>
              <FaSearch size={isMobile ? 15 : 16} />
            </Link>

            {/* Botón crear video: icono cambiado a FaPlusCircle */}
            <Link to="/create-video-page" className="nb2-btn" style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }} title={t('createVideo') || 'Crear video'}>
              <FaPlusCircle size={isMobile ? 18 : 20} style={{ color: '#34C759' }} />
            </Link>

            {showInstallButton && !isPWAInstalled && (
              <button className="nb2-btn nb2-btn--install" onClick={handleInstallPWA} style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }} title={t('installPWA') || 'Installer l\'app'}>
                <FaDownload size={isMobile ? 15 : 16} />
              </button>
            )}

            {auth.user && (
              <div className="nb2-btn nb2-btn--notify" ref={notifyDropdownRef} style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }}>
                <Link to="/notify" className="nb2-notify-link">
                  <FaBell size={isMobile ? 17 : 19} style={{ color: '#FFC107' }} className={unreadNotifications > 0 ? 'has-notif' : ''} />
                </Link>
                {unreadNotifications > 0 && <span className="nb2-badge">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>}
              </div>
            )}

            {/* Dropdown de usuario */}
            <NavDropdown
              align="end"
              show={dropdownOpen}
              onToggle={isOpen => setDropdownOpen(isOpen)}
              title={AvatarTrigger}
              id="nav-user-dropdown"
              className="nb2-dropdown-root"
              ref={dropdownRef}
              renderMenuOnMount
            >
              <div className="nb2-scroll-wrap">
                {auth.user ? (
                  <>
                    <div className="nb2-user-header">
                      <div className="nb2-user-avatar"><Avatar src={auth.user.avatar} size="medium-avatar" /></div>
                      <div className="nb2-user-info">
                        <div className="nb2-user-name">{auth.user.username || auth.user.name || 'Utilisateur'}</div>
                        <div className="nb2-user-role">
                          {auth.user.role === 'admin' ? `👑 ${t('admin') || 'Admin'}` :
                           auth.user.role === 'Moderateur' ? `🛡️ ${t('moderator') || 'Modérateur'}` :
                           auth.user.role === 'Super-utilisateur' ? `⭐ ${t('superUser') || 'Super Utilisateur'}` :
                           `👤 ${t('user') || 'Utilisateur'}`}
                        </div>
                      </div>
                    </div>
                    <NavDropdown.Divider />
                    <MenuItem icon={FaPlusCircle} iconColor="#34C759" to="/create-video-page">Créer une vidéo</MenuItem>
                    {auth.user.role === 'admin' && (
                      <>
                        <MenuItem icon={FaShieldAlt} iconColor="#FF9F0A" to="/admin/posts">Approbation</MenuItem>
                        <MenuItem icon={FaUsers} iconColor="#34C759" to="/admindashboard">Admin dashboard</MenuItem>
                      </>
                    )}
                    <MenuItem icon={FaUserCircle} iconColor="#0A84FF" to={`/profile/${auth.user._id}`}>{t('profile') || 'Mon profil'}</MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#7A7A86" to="/infoaplicacionn">{t('appInfo') || 'Informations'}</MenuItem>
                    {auth.user.role === 'admin' && (
                      <MenuItem icon={FaTools} iconColor="#7A7A86" to="/users/roles">{t('roles') || 'Rôles'}</MenuItem>
                    )}
                    <MenuItem icon={FaShareAlt} iconColor="#FF9F0A" onClick={() => setShowShareModal(true)}>{t('shareApp') || 'Partager l\'app'}</MenuItem>
                    {auth.user.role === 'admin' && (
                      <>
                        <NavDropdown.Divider />
                        <MenuItem icon={FaUsers} iconColor="#34C759" to="/users">{t('users') || 'Utilisateurs'}</MenuItem>
                        <MenuItem icon={FaUserCog} iconColor="#0A84FF" to="/usersactionn">{t('userActions') || 'Actions utilisateur'}</MenuItem>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <MenuItem icon={FaSignOutAlt} iconColor="#FF3B30" onClick={handleLogout} danger><strong>{t('logout') || 'Déconnexion'}</strong></MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem icon={FaSignInAlt} iconColor="#34C759" onClick={handleLogin}>{t('login') || 'Se connecter'}</MenuItem>
                    <MenuItem icon={FaUserPlus} iconColor="#0A84FF" onClick={handleRegister}>{t('register') || 'S\'inscrire'}</MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#7A7A86" to="/infoaplicacionn">{t('appInfo') || 'Informations'}</MenuItem>
                    <MenuItem icon={FaShareAlt} iconColor="#FF9F0A" onClick={() => setShowShareModal(true)}>{t('shareApp') || 'Partager l\'app'}</MenuItem>
                  </>
                )}
              </div>
            </NavDropdown>

            <button onClick={handleDrawerOpen} className="nb2-btn nb2-btn--menu" style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }} title={t('menu') || 'Drawer'}>
              <FaBars size={isMobile ? 17 : 19} />
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Espaciador: mantiene el mismo alto para que el contenido no salte al ocultar el navbar */}
      <div style={{ height: isMobile ? '56px' : '64px' }} />

      <VerifyModal show={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
      <DesactivateModal show={showDeactivatedModal} onClose={() => setShowDeactivatedModal(false)} />
      <MultiCheckboxModal show={showFeaturesModal} onClose={() => setShowFeaturesModal(false)} />
      <ShareAppModal show={showShareModal} onClose={() => setShowShareModal(false)} />
      <Drawer show={showDrawer} onHide={handleDrawerClose} position="start" title={t('menu') || 'Menu'} user={auth.user} />
    </>
  );
};

export default Navbar2;