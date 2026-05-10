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
  FaVideo
} from 'react-icons/fa';

import { Navbar, Container, NavDropdown, Badge } from 'react-bootstrap';
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

  const [isPWAInstalled,        setIsPWAInstalled]        = useState(false);
  const [showInstallButton,     setShowInstallButton]      = useState(false);
  const [showShareModal,        setShowShareModal]         = useState(false);
  const [showVerifyModal,       setShowVerifyModal]        = useState(false);
  const [showDeactivatedModal,  setShowDeactivatedModal]   = useState(false);
  const [isMobile,              setIsMobile]               = useState(window.innerWidth < 700);
  const [showFeaturesModal,     setShowFeaturesModal]      = useState(false);
  const [showDrawer,            setShowDrawer]             = useState(false);
  const [dropdownOpen,          setDropdownOpen]           = useState(false);

  const notifyDropdownRef = useRef(null);
  const dropdownRef       = useRef(null);
  const { dir, textAlign, isRTL, shouldIgnoreRTL } = useComponentDirection('Navbar2');

  // ── Drawer ───────────────────────────────────────────
  const handleDrawerOpen  = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  // ── Resize ───────────────────────────────────────────
  useEffect(() => {
    let tid;
    const onResize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => setIsMobile(window.innerWidth < 700), 100);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(tid); };
  }, []);

  // ── PWA detection ────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) setIsPWAInstalled(true);
    const onAvail    = () => setShowInstallButton(true);
    const onInstalled = () => { setIsPWAInstalled(true); setShowInstallButton(false); };
    window.addEventListener('pwaInstallAvailable', onAvail);
    window.addEventListener('pwaInstalled',        onInstalled);
    return () => {
      window.removeEventListener('pwaInstallAvailable', onAvail);
      window.removeEventListener('pwaInstalled',        onInstalled);
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
      const onAvail     = () => setShowInstallButton(true);
      const onInstalled = () => { setIsPWAInstalled(true); setShowInstallButton(false); };
      window.addEventListener('pwaInstallAvailable', onAvail);
      window.addEventListener('pwaInstalled',        onInstalled);
      const iv = setInterval(() => {
        if (checkPWA()) { clearInterval(iv); }
        else if (window.deferredPrompt && !showInstallButton) { setShowInstallButton(true); }
      }, 2000);
      return () => {
        window.removeEventListener('pwaInstallAvailable', onAvail);
        window.removeEventListener('pwaInstalled',        onInstalled);
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

  // ── Auth handlers ─────────────────────────────────────
  const handleLogout   = () => { setDropdownOpen(false); dispatch(logout()); setTimeout(() => { window.location.href = '/login'; }, 100); };
  const handleLogin    = () => { setDropdownOpen(false); history.push('/login'); };
  const handleRegister = () => { setDropdownOpen(false); history.push('/register'); };

  // ── Guard ─────────────────────────────────────────────
  if (!settings || Object.keys(settings).length === 0) {
    return (
      <nav className="navbar navbar-light bg-light nb2-fallback">
        <span className="navbar-brand">{t('loading') || 'Cargando...'}</span>
      </nav>
    );
  }

  const totalItems           = (cart?.items && Array.isArray(cart.items))
    ? cart.items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;
  const unreadNotifications  = notify?.data?.filter(n => n && !n.isRead).length || 0;
  const isDark               = !!settings.style;

  // ── MenuItem (unchanged) ──────────────────────────────
  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children, danger = false }) => {
    const handleClick = (e) => {
      if (onClick) onClick(e);
      setDropdownOpen(false);
      if (to) history.push(to);
    };
    return (
      <NavDropdown.Item
        as="button"
        onClick={handleClick}
        className={`nb2-menu-item${danger ? ' danger' : ''}`}
      >
        <span className="nb2-item-icon" style={{ color: iconColor }}>
          <Icon />
        </span>
        <span className="nb2-item-label">{children}</span>
      </NavDropdown.Item>
    );
  };

  // ── Three-dots trigger ────────────────────────────────
  const ThreeDotsTrigger = (
    <div
      className={`nb2-dots${dropdownOpen ? ' open' : ''}`}
      onClick={() => setDropdownOpen(!dropdownOpen)}
      style={{
        width:  isMobile ? '38px' : '42px',
        height: isMobile ? '38px' : '42px',
      }}
      aria-label={t('menu') || 'Menu'}
      aria-expanded={dropdownOpen}
      aria-haspopup="true"
    >
      <span className="nb2-dot" />
      <span className="nb2-dot" />
      <span className="nb2-dot" />
    </div>
  );

  return (
    <>
      <Navbar
        className={`nb2-root${isDark ? ' dark' : ' light'}`}
        fixed="top"
        expand="lg"
      >
        <Container
          fluid
          className="align-items-center justify-content-between nb2-container"
          style={{ padding: isMobile ? '0 12px' : '0 20px' }}
        >
          {/* ── Logo ── */}
          <div className="d-flex align-items-center" style={{ flex: '0 1 auto', minWidth: 0 }}>
            <Link
              to="/"
              onDoubleClick={e => { e.preventDefault(); window.location.reload(); }}
              className="nb2-logo-link"
              title="Accueil — Double-clic pour recharger"
            >
              <div className="nb2-logo-box" style={{ width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px' }}>
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
            </Link>

            {!isMobile && (
              <Link
                to="/"
                onDoubleClick={e => { e.preventDefault(); window.location.reload(); }}
                className="nb2-brand-link"
              >
                <Navbar.Brand className="nb2-brand py-0 mb-0">
                  {t('appName') || 'MarketPlace'}
                </Navbar.Brand>
              </Link>
            )}
          </div>

          {/* ── Right actions ── */}
          <div className="nb2-actions" style={{ gap: isMobile ? '6px' : '8px' }}>

            {/* Search */}
            <Link
              to="/search"
              className="nb2-btn"
              style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }}
              title={t('search') || 'Rechercher'}
            >
              <FaSearch size={isMobile ? 15 : 16} />
            </Link>

            {/* Install PWA */}
            {showInstallButton && !isPWAInstalled && (
              <button
                className="nb2-btn nb2-btn--install"
                onClick={handleInstallPWA}
                style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }}
                title={t('installPWA') || 'Installer l\'app'}
              >
                <FaDownload size={isMobile ? 15 : 16} />
              </button>
            )}

            {/* Notifications */}
            {auth.user && (
              <div
                className="nb2-btn nb2-btn--notify"
                ref={notifyDropdownRef}
                style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }}
              >
                <Link to="/notify" className="nb2-notify-link">
                  <FaBell size={isMobile ? 17 : 19} className={unreadNotifications > 0 ? 'has-notif' : ''} />
                </Link>
                {unreadNotifications > 0 && (
                  <span className="nb2-badge">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </div>
            )}

            {/* ── THREE DOTS DROPDOWN ── */}
            <NavDropdown
              align="end"
              show={dropdownOpen}
              onToggle={isOpen => setDropdownOpen(isOpen)}
              title={ThreeDotsTrigger}
              id="nav-user-dropdown"
              className="nb2-dropdown-root"
              ref={dropdownRef}
            >
              <div className="nb2-scroll-wrap">
                {auth.user ? (
                  <>
                    {/* User header */}
                    <div className="nb2-user-header">
                      <div className="nb2-user-avatar">
                        <Avatar src={auth.user.avatar} size="medium-avatar" />
                      </div>
                      <div className="nb2-user-info">
                        <div className="nb2-user-name">
                          {auth.user.username || auth.user.name || 'Utilisateur'}
                        </div>
                        <div className="nb2-user-role">
                          {auth.user.role === 'admin'              ? `👑 ${t('admin')     || 'Admin'}`
                          : auth.user.role === 'Moderateur'        ? `🛡️ ${t('moderator') || 'Modérateur'}`
                          : auth.user.role === 'Super-utilisateur' ? `⭐ ${t('superUser') || 'Super Utilisateur'}`
                          :                                          `👤 ${t('user')      || 'Utilisateur'}`}
                        </div>
                      </div>
                    </div>

                    <NavDropdown.Divider />

                    <MenuItem icon={FaVideo}     iconColor="#0A84FF" to="/create-video-page">
                      Créer une vidéo
                    </MenuItem>

                    {auth.user.role === 'admin' && (
                      <>
                        <MenuItem icon={FaShieldAlt} iconColor="#FF9F0A" to="/admin/posts">
                          Approbation
                        </MenuItem>
                        <MenuItem icon={FaUsers}     iconColor="#34C759" to="/admindashboard">
                          Admin dashboard
                        </MenuItem>
                      </>
                    )}

                    <MenuItem icon={FaUserCircle} iconColor="#0A84FF" to={`/profile/${auth.user._id}`}>
                      {t('profile') || 'Mon profil'}
                    </MenuItem>

                    <MenuItem icon={FaInfoCircle} iconColor="#7A7A86" to="/infoaplicacionn">
                      {t('appInfo') || 'Informations'}
                    </MenuItem>

                    {auth.user.role === 'admin' && (
                      <MenuItem icon={FaTools} iconColor="#7A7A86" to="/users/roles">
                        {t('roles') || 'Rôles'}
                      </MenuItem>
                    )}

                    <MenuItem icon={FaShareAlt} iconColor="#FF9F0A" onClick={() => setShowShareModal(true)}>
                      {t('shareApp') || 'Partager l\'app'}
                    </MenuItem>

                    {auth.user.role === 'admin' && (
                      <>
                        <NavDropdown.Divider />
                        <div className="nb2-section-label">
                          <FaStore size={11} />
                          {t('storeManagement') || 'Boutiques'}
                        </div>

                        <MenuItem icon={FaPlusCircle} iconColor="#34C759"  to="/create-boutique">{t('createStore')  || 'Créer une boutique'}</MenuItem>
                        <MenuItem icon={FaStore}      iconColor="#0A84FF"  to={`/boutique/${auth.user._id}`}>{t('myStore') || 'Ma boutique'}</MenuItem>
                        <MenuItem icon={FaStore}      iconColor="#FF9F0A"  to="/boutiques">{t('allStores')  || 'Toutes les boutiques'}</MenuItem>
                        <MenuItem icon={FaStore}      iconColor="#34C759"  to="/mes-boutiques">{t('myStoresList') || 'Mes boutiques'}</MenuItem>
                        <MenuItem icon={FaUsers}      iconColor="#34C759"  to="/users">{t('users')  || 'Utilisateurs'}</MenuItem>
                        <MenuItem icon={FaUserCog}    iconColor="#0A84FF"  to="/usersactionn">{t('userActions') || 'Actions utilisateur'}</MenuItem>
                      </>
                    )}

                    <NavDropdown.Divider />

                    <MenuItem icon={FaSignOutAlt} iconColor="#FF3B30" onClick={handleLogout} danger>
                      <strong>{t('logout') || 'Déconnexion'}</strong>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem icon={FaSignInAlt}  iconColor="#34C759" onClick={handleLogin}>
                      {t('login') || 'Se connecter'}
                    </MenuItem>
                    <MenuItem icon={FaUserPlus}   iconColor="#0A84FF" onClick={handleRegister}>
                      {t('register') || 'S\'inscrire'}
                    </MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#7A7A86" to="/infoaplicacionn">
                      {t('appInfo') || 'Informations'}
                    </MenuItem>
                    <MenuItem icon={FaShareAlt}   iconColor="#FF9F0A" onClick={() => setShowShareModal(true)}>
                      {t('shareApp') || 'Partager l\'app'}
                    </MenuItem>
                  </>
                )}
              </div>
            </NavDropdown>

            {/* Drawer hamburger */}
            <button
              onClick={handleDrawerOpen}
              className="nb2-btn nb2-btn--menu"
              style={{ width: isMobile ? '38px' : '42px', height: isMobile ? '38px' : '42px' }}
              title={t('menu') || 'Drawer'}
            >
              <FaBars size={isMobile ? 17 : 19} />
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Spacer */}
      <div style={{ height: isMobile ? '56px' : '64px' }} />

      {/* Modals — unchanged */}
      <VerifyModal       show={showVerifyModal}        onClose={() => setShowVerifyModal(false)} />
      <DesactivateModal  show={showDeactivatedModal}   onClose={() => setShowDeactivatedModal(false)} />
      <MultiCheckboxModal show={showFeaturesModal}     onClose={() => setShowFeaturesModal(false)} />
      <ShareAppModal     show={showShareModal}         onClose={() => setShowShareModal(false)} />
      <Drawer            show={showDrawer}             onHide={handleDrawerClose} position="start" title={t('menu') || 'Menu'} user={auth.user} />
    </>
  );
};

export default Navbar2;