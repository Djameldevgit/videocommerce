// 📂 components/common/Drawer.js - VERSIÓN FINAL CON IDIOMA ÁRABE POR DEFECTO
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { logout } from '../../redux/actions/authAction';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';
 
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

// ✅ IDIOMAS SOPORTADOS
const SUPPORTED_LANGUAGES = [
  { code: 'ar', name: 'العربية', label: 'AR', flag: '🇸🇦', dir: 'rtl' },
  { code: 'fr', name: 'Français', label: 'FR', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', label: 'EN', flag: '🇬🇧', dir: 'ltr' }
];

// ✅ IDIOMA POR DEFECTO: ÁRABE
const DEFAULT_LANG = 'ar';

// ✅ FUNCIONES DE GESTIÓN DE IDIOMA
const getStoredLanguage = () => {
  // 1. Verificar cookie de Google Translate
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'googtrans') {
      const match = value.match(/\/auto\/(.+)$/);
      if (match && match[1] && SUPPORTED_LANGUAGES.some(l => l.code === match[1])) {
        return match[1];
      }
    }
  }
  
  // 2. Verificar localStorage
  const savedLang = localStorage.getItem('appLanguage');
  if (savedLang && SUPPORTED_LANGUAGES.some(l => l.code === savedLang)) {
    return savedLang;
  }
  
  // 3. Idioma por defecto (ÁRABE)
  return DEFAULT_LANG;
};

const setStoredLanguage = (langCode) => {
  // Guardar en localStorage
  localStorage.setItem('appLanguage', langCode);
  localStorage.setItem('useGoogleTranslate', 'true');
  localStorage.setItem('targetTranslateLang', langCode);
  
  // Guardar cookie para Google Translate (expira en 1 año)
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `googtrans=/auto/${langCode}; path=/; expires=${expires.toUTCString()}`;
  
  // Disparar evento personalizado
  const event = new CustomEvent('languageChanged', {
    detail: { targetLang: langCode }
  });
  document.dispatchEvent(event);
};

// ✅ FUNCIÓN PARA TRADUCIR LA PÁGINA
const translatePage = (targetLang) => {
  try {
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = targetLang;
      selectElement.dispatchEvent(new Event('change'));
      
      // Aplicar dirección RTL/LTR
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === targetLang);
      if (langInfo) {
        document.documentElement.dir = langInfo.dir;
        document.documentElement.lang = targetLang;
      }
    } else {
      setTimeout(() => translatePage(targetLang), 500);
    }
  } catch (error) {
    console.error('Error traduciendo:', error);
  }
};

const Drawer = ({ 
  show, 
  onHide, 
  width = 280,
  height = '100vh'
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const [darkMode, setDarkMode] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  // ✅ ESTADO DEL IDIOMA (con árabe por defecto)
  const [currentLang, setCurrentLang] = useState(DEFAULT_LANG);
  const [translateReady, setTranslateReady] = useState(false);

 
 
  // ✅ Verificar si el usuario es Pro activo
  const isProActive = useMemo(() => {
    const user = auth?.user;
    if (!user?.isPro) return false;
    if (!user?.proExpiryDate) return true;
    return new Date(user.proExpiryDate) > new Date();
  }, [auth?.user]);

  // Estados para los dropdowns
  const [openDropdowns, setOpenDropdowns] = useState({
    monCompte: false,
    mesAnnonces: false,
    mesCommandes: false,
    
    mesTransactions: false,
    videos: false
  });

  // Obtener categorías desde Redux
  const { accordionCategories = [] } = useSelector((state) => ({
    accordionCategories: state.category?.accordionCategories || []
  }));

  useEffect(() => {
    if (accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length]);

  

  // ✅ INICIALIZAR GOOGLE TRANSLATE
  useEffect(() => {
    if (document.querySelector('#google-translate-script')) {
      setTranslateReady(true);
      const savedLang = getStoredLanguage();
      setCurrentLang(savedLang);
      const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === savedLang);
      if (langInfo) {
        document.documentElement.dir = langInfo.dir;
        document.documentElement.lang = savedLang;
      }
      return;
    }

    // Crear elemento oculto
    let translateElement = document.getElementById('google_translate_element');
    if (!translateElement) {
      translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.cssText = 'display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important;';
      document.body.appendChild(translateElement);
    }

    // Función de callback
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: SUPPORTED_LANGUAGES.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
        
        setTranslateReady(true);
        
        // ✅ Recuperar idioma guardado y aplicarlo (ÁRABE por defecto)
        const savedLang = getStoredLanguage();
        setCurrentLang(savedLang);
        
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === savedLang);
        if (langInfo) {
          document.documentElement.dir = langInfo.dir;
          document.documentElement.lang = savedLang;
        }
        
        // Traducir al idioma guardado
        if (savedLang !== 'fr') {
          setTimeout(() => translatePage(savedLang), 1000);
        }
      } catch (error) {
        console.error('Error inicializando Google Translate:', error);
        setTranslateReady(true);
      }
    };

    // Cargar script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = null;
      }
    };
  }, []);

  // ✅ OCULTAR ELEMENTOS DE GOOGLE TRANSLATE
  useEffect(() => {
    const hideGoogleElements = () => {
      const elements = document.querySelectorAll(
        '.goog-te-banner-frame, .goog-te-menu-frame, .goog-te-gadget, ' +
        '.goog-te-balloon-frame, .goog-te-banner, .skiptranslate'
      );
      elements.forEach(el => {
        if (el) {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
          el.style.width = '0';
        }
      });
      document.body.style.top = '0px';
      document.body.style.position = 'relative';
    };
    
    hideGoogleElements();
    const interval = setInterval(hideGoogleElements, 500);
    return () => clearInterval(interval);
  }, []);

  // ✅ ESTILOS GLOBALES PARA OCULTAR GOOGLE TRANSLATE
  useEffect(() => {
    if (!document.getElementById('google-translate-hide-styles')) {
      const style = document.createElement('style');
      style.id = 'google-translate-hide-styles';
      style.textContent = `
        .goog-te-banner-frame,
        .goog-te-menu-frame,
        .goog-te-gadget,
        .goog-te-balloon-frame,
        .goog-te-banner,
        .skiptranslate,
        iframe[src*="translate"],
        div[class*="goog-te"] {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        body {
          top: 0px !important;
          position: relative !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // ✅ FUNCIÓN PARA CAMBIAR IDIOMA (guarda cookie y traduce)
  const handleLanguageChange = (langCode) => {
    // Guardar idioma en cookie y localStorage
    setStoredLanguage(langCode);
    setCurrentLang(langCode);
    
    // Aplicar dirección RTL/LTR
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (langInfo) {
      document.documentElement.dir = langInfo.dir;
      document.documentElement.lang = langCode;
    }
    
    // Traducir la página
    translatePage(langCode);
    
    // Cerrar drawer y recargar después de un momento
    setTimeout(() => {
      onHide();
      window.location.reload();
    }, 300);
  };

  // 🔥 MAPA DE ICONOS POR DEFECTO
  const defaultCategoryIcons = useMemo(() => ({
    'vehicules': '🚗', 'immobilier': '🏠', 'telephones': '📱',
    'vetements': '👕', 'electromenager': '🔌', 'informatique': '💻',
    'loisirs': '🎮', 'meubles': '🛋️', 'sport': '⚽',
    'alimentaires': '🍎', 'santebeaute': '💄', 'services': '🛠️',
    'materiaux': '🧱', 'emploi': '💼', 'voyages': '✈️'
    
  }), []);

  // Paleta de colores
  const colorPalette = useMemo(() => [
    '#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#b5179e',
    '#7209b7', '#560bad', '#480ca8', '#3f37c9', '#4895ef',
    '#e63946', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51',
    '#6d597a', '#b56576', '#e56b6f', '#9c89b8', '#ef476f'
  ], []);

  const generateColorFromName = useCallback((name) => {
    if (!name) return colorPalette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
  }, [colorPalette]);

  const getFullImageUrl = useCallback((iconPath) => {
    if (!iconPath) return null;
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) return iconPath;
    if (iconPath.startsWith('/categories')) {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      return `${baseUrl}${iconPath}`;
    }
    if (iconPath.includes('.png') || iconPath.includes('.jpg') || iconPath.includes('.svg')) {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      return `${baseUrl}/categories/${iconPath}`;
    }
    return null;
  }, []);

  const getCategoryIcon = useCallback((category) => {
    const categorySlug = category.slug;
    const hasError = imageErrors[categorySlug];
    
    if (hasError) {
      return { type: 'emoji', value: defaultCategoryIcons[categorySlug] || defaultCategoryIcons.default };
    }
    
    if (category.icon) {
      const fullUrl = getFullImageUrl(category.icon);
      if (fullUrl) {
        return { type: 'image', value: fullUrl, alt: category.name };
      }
    }
    
    return { type: 'emoji', value: defaultCategoryIcons[categorySlug] || defaultCategoryIcons.default };
  }, [imageErrors, getFullImageUrl, defaultCategoryIcons]);

 

  const isDashboardPage = location.pathname.includes('/users/dashboard') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.startsWith('/mes-');

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const emojis = {
    home: '🏠', user: '👤', logout: '🚪', bell: '🔔', list: '📋',
    plus: '➕', dashboard: '📊', store: '🏪', categories: '📂',
    all: '📊', login: '🔑', register: '📝', question: '❓',
    mail: '✉️', shield: '🛡️', arrow: '➡️', globe: '🌍',
    sun: '☀️', moon: '🌙', fire: '🔥', chart: '📈',
    message: '💬', shopping: '🛒', megaphone: '📢', gear: '⚙️',
    verified: '✅', warning: '⚠️', star: '⭐', heart: '❤️',
    annonce: '📢', commande: '📦', voyage: '✈️', pub: '🎯',
    transaction: '💰', credit: '💳', video: '🎬', camera: '📹'
  };

  const handleImageError = useCallback((categorySlug) => {
    setImageErrors(prev => ({ ...prev, [categorySlug]: true }));
  }, []);

 

  const handleCategoryClick = (category) => {
    onHide();
    history.push(getCategoryPath(category.slug));
  };

  const handleLogout = () => {
    dispatch(logout());
    onHide();
    history.push('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

 
  const sectionColors = {
    monCompte: { primary: '#6366F1', light: '#EEF2FF' },
    mesAnnonces: { primary: '#3B82F6', light: '#EFF6FF' }, 
    mesCommandes: { primary: '#F59E0B', light: '#FFFBEB' },
    mesTransactions: { primary: '#10B981', light: '#ECFDF5' },
    videos: { primary: '#DC2626', light: '#FEF2F2' }
  };

  const CategoryIcon = ({ category }) => {
    const iconData = getCategoryIcon(category);
    const style = {
      width: '32px',
      height: '32px',
      borderRadius: '10px',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      flexShrink: 0
    };

    if (iconData.type === 'image') {
      return (
        <div style={style}>
          <img 
            src={iconData.value}
            alt={iconData.alt || category.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => handleImageError(category.slug)}
          />
        </div>
      );
    }

    return (
      <div style={style}>
        <span style={{ fontSize: '1rem', color: '#6b7280' }}>
          {iconData.value}
        </span>
      </div>
    );
  };

  const DropdownItem = ({ icon, emoji, name, path, onClick, color = '#667eea', badge = null, disabled = false }) => {
    const isActive = location.pathname === path;
    const finalColor = color;
    
   
    
    const content = (
      <div
        onClick={handleClick}
        style={{
          padding: '8px 16px 8px 48px',
          margin: '2px 0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'pointer' : 'pointer',
          backgroundColor: isActive ? `${finalColor}12` : 'transparent',
          borderLeft: isActive ? `3px solid ${finalColor}` : 'none',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1rem', color: isActive ? finalColor : '#6b7280' }}>{icon || emoji || '•'}</span>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: isActive ? '600' : '500',
            color: isActive ? finalColor : '#4b5563'
          }}>
            {name}
          </span>
        </div>
        
        {badge && (
          <span style={{
            backgroundColor: badge.color || '#ef4444',
            color: 'white',
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            {badge.text}
          </span>
        )}
      </div>
    );

    if (path && !onClick && !disabled) {
      return <Link to={path} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={onHide}>{content}</Link>;
    }
    return content;
  };

  const DropdownHeader = ({ title, emoji, icon, dropdownName, color = '#667eea', children }) => {
    const isOpen = openDropdowns[dropdownName];
    const sectionColor = sectionColors[dropdownName]?.primary || color;
    
    return (
      <div style={{ marginBottom: '4px' }}>
        <div
          onClick={() => toggleDropdown(dropdownName)}
          style={{
            padding: '10px 16px',
            margin: '2px 0',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: isOpen ? `${sectionColor}10` : 'transparent',
            transition: 'all 0.2s ease',
            fontWeight: '600'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.1rem', color: sectionColor }}>{icon || emoji}</span>
            <span style={{ color: '#1f2937', fontSize: '0.9rem' }}>{title}</span>
          </div>
          <div style={{ 
            color: sectionColor, 
            transition: 'transform 0.3s ease', 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            opacity: 0.7
          }}>
            <FaChevronDown size={11} />
          </div>
        </div>
        
        {isOpen && <div style={{ marginLeft: '8px' }}>{children}</div>}
      </div>
    );
  };

  const LinkItem = ({ emoji, icon, name, path, onClick, color = '#8b5cf6', badge = null, isDashboardLink = false }) => {
    const isActive = location.pathname === path || (isDashboardLink && location.pathname.startsWith('/dashboard'));
    const finalColor = color;
    
    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (path && !onClick) onHide();
    };
    
    const content = (
      <div
        onClick={handleClick}
        style={{
          padding: '10px 16px',
          margin: '2px 0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isActive ? `${finalColor}12` : 'transparent',
          borderLeft: isActive ? `3px solid ${finalColor}` : 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            backgroundColor: isActive ? `${finalColor}15` : '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>
            {emoji || '📁'}
          </div>
          <span style={{
            fontSize: '0.9rem',
            fontWeight: isActive ? '600' : '500',
            color: isActive ? finalColor : '#374151'
          }}>
            {name}
          </span>
        </div>
        
        {badge && (
          <span style={{
            backgroundColor: badge.color || '#ef4444',
            color: 'white',
            fontSize: '0.65rem',
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: '600'
          }}>
            {badge.text}
          </span>
        )}
      </div>
    );

    if (path && !onClick) {
      return <Link to={path} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={onHide}>{content}</Link>;
    }
    return content;
  };

  const renderVideosDropdown = () => {
    if (!isProActive) return null;
    
    return (
      <DropdownHeader title="Vidéos" icon="🎬" dropdownName="videos" color="#DC2626">
        <DropdownItem icon="🎬" name="Créer une vidéo" path="/creer-video" color="#DC2626" />
        <DropdownItem icon="📹" name="Mes vidéos" path="/mes-videos" color="#DC2626" />
        <DropdownItem icon="📊" name="Statistiques vidéos" path="/stats-videos" color="#F59E0B" />
      </DropdownHeader>
    );
  };

  const renderDashboardContent = () => (
    <>
      <div style={{
        padding: '20px 16px',
        margin: '0 16px 16px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>📊</div>
          <div style={{ fontWeight: '700', fontSize: '1rem' }}>Mon Espace</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{auth.user?.name || auth.user?.username}</div>
          
          {isProActive && (
            <div style={{ 
              fontSize: '0.65rem', marginTop: '8px', opacity: 0.9,
              display: 'inline-block', background: 'rgba(255,255,255,0.25)',
              padding: '2px 8px', borderRadius: '20px'
            }}>
              ⭐ Compte Pro
            </div>
          )}
          
       
        </div>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 1
        }} />
      </div>

      <DropdownHeader title="Mon Compte" emoji={emojis.user} dropdownName="monCompte" color="#6366F1">
        <DropdownItem icon="📊" name="Tableau de bord" path="/users/dashboard" color="#6366F1" />
        <DropdownItem icon="⚙️" name="Paramètres du profil" path="/profile/settings" color="#6b7280" />
        <DropdownItem icon={emojis.logout} name="Se déconnecter" onClick={handleLogout} color="#ef4444" />
      </DropdownHeader>

      {renderVideosDropdown()}

      <DropdownHeader title="Annonces" emoji={emojis.annonce} dropdownName="mesAnnonces" color="#3B82F6">
        <DropdownItem icon="📋" name="Mes annonces" path="/mes-annonces" color="#3B82F6" />
        <DropdownItem icon="🆕" name="Annonces actives" path="/mes-annonces?filter=active" color="#10b981" />
        <DropdownItem icon="⏳" name="Annonces en attente" path="/mes-annonces?filter=pending" color="#f59e0b" />
        <DropdownItem icon="✅" name="Annonces vendues" path="/mes-annonces?filter=sold" color="#6b7280" />
        <DropdownItem icon="📝" name="Ajouter une annonce" path="/creer-annonce" color="#10b981" />
      </DropdownHeader>

   
 

      <DropdownHeader title="Mes Commandes" emoji={emojis.commande} dropdownName="mesCommandes" color="#F59E0B">
        <DropdownItem icon="📦" name="Toutes mes commandes" path="/mes-commandes" color="#F59E0B" />
        <DropdownItem icon="🔄" name="Commandes en cours" path="/mes-commandes?filter=processing" color="#3b82f6" />
        <DropdownItem icon="✅" name="Commandes livrées" path="/mes-commandes?filter=delivered" color="#10b981" />
        <DropdownItem icon="🧾" name="Tickets de livraison" path="/mes-tickets" color="#ec4899" />
      </DropdownHeader>

      <DropdownHeader title="Transactions" emoji={emojis.transaction} dropdownName="mesTransactions" color="#10B981">
        <DropdownItem icon="💰" name="Mes crédits" path="/mes-credits" color="#10B981" />
        <DropdownItem icon="💳" name="Recharger" path="/recharger-credits" color="#8b5cf6" />
        <DropdownItem icon="📊" name="Historique" path="/historique-transactions" color="#6b7280" />
        <DropdownItem icon="📈" name="Statistiques" path="/stats-transactions" color="#f59e0b" />
      </DropdownHeader>
    </>
  );

  const renderLoggedInContent = () => (
    <>
      <LinkItem emoji={darkMode ? emojis.sun : emojis.moon} name={darkMode ? 'Mode Clair' : 'Mode Sombre'} onClick={toggleDarkMode} color={darkMode ? '#f59e0b' : '#4b5563'} />
      <LinkItem emoji={emojis.dashboard} name="Mon Tableau de bord" path="/users/dashboard" color="#8b5cf6" isDashboardLink={true} />
      <LinkItem emoji="👤" name="Mon profil" path={`/profile/${auth.user?._id}`} color="#8b5cf6" isDashboardLink={true} />
    </>
  );

  const renderGuestContent = () => (
    <>
      <LinkItem emoji={darkMode ? emojis.sun : emojis.moon} name={darkMode ? 'Mode Clair' : 'Mode Sombre'} onClick={toggleDarkMode} color={darkMode ? '#f59e0b' : '#4b5563'} />
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>{emojis.user} Compte</div>
      <LinkItem emoji={emojis.login} name="Se connecter" path="/login" color="#10b981" />
      <LinkItem emoji={emojis.register} name="S'inscrire" path="/register" color="#667eea" />
    </>
  );

 

  const renderMainContent = () => {
    if (isDashboardPage && auth.user) {
      return renderDashboardContent();
    }
    
  
    
  
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide}
      placement="start"
      className="drawer"
      style={{
        width: width,
        height: height,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{
        padding: '15px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {auth.user && (
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: '20px',
              fontWeight: '600'
            }}>
              {auth.user.name || auth.user.username}
            </span>
          )}
          {isProActive && (
            <span style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: '20px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⭐</span> PRO
            </span>
          )}
        </div>
        
        {/* ✅ SELECTOR DE IDIOMA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            marginRight: '10px',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '12px'
          }}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = currentLang === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isActive ? '#667eea' : 'transparent',
                    border: isActive ? '2px solid #10b981' : 'none',
                    color: isActive ? 'white' : '#6b7280',
                    fontWeight: '600',
                    fontSize: lang.code === 'ar' ? '1rem' : '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title={lang.name}
                  className="notranslate"
                  translate="no"
                >
                  <span className="notranslate" translate="no">{lang.label}</span>
                </button>
              );
            })}
          </div>
         
          <button
            onClick={onHide}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f3f4f6',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease'
            }}
            title="Fermer"
            className="notranslate"
            translate="no"
          >
            <span className="notranslate" translate="no">✕</span>
          </button>
        </div>
      </div>
      
      <Offcanvas.Body style={{ 
        overflowY: 'auto',
        padding: '10px 0',
        scrollbarWidth: 'thin'
      }}>
        {renderMainContent()}
        
        <div style={{ margin: '30px 0 15px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
          🔗 Liens utiles
        </div>
        <LinkItem emoji="❓" name="vidéos tutorielles sur YouTube" path="/https://www.youtube.com/channel/UC-dI7yrqBOSfL_g5-l01c4g" color="#6b7280" />
        <LinkItem emoji="❓" name="Comment annoncer ?" path="/bloginfo" color="#6b7280" />
        <LinkItem emoji="✉️" name="Contactez-nous" path="/users/contactt" color="#6b7280" />
        <LinkItem emoji="🛡️" name="Politique de confidentialité" path="/bloginfo" color="#6b7280" />
        
        <div style={{
          marginTop: '30px',
          padding: '15px 16px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.7rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '8px' }}>
            <span>🛡️</span>
            <span>Plateforme sécurisée</span>
          </div>
          © {new Date().getFullYear()} MarketPlace Djamel Tous droits réservés.
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;