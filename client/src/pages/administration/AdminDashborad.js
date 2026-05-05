// src/pages/Administracion/AdminDashboard.jsx
import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Tabs,
  Tab,
  Spinner,
  Button,
  Row,
  Col,
  Badge,
  Nav
} from 'react-bootstrap';
import { 
  FilterLeft, 
  ArrowRepeat, 
  People, 
  BarChart, 
  FileText, 
  Shop, 
  Flag, 
  Lock, 
  Shield
} from 'react-bootstrap-icons';
import styles from './AdminDashboard.css';
import FilterDrawer from '../../components/adminitration/common/FilterDrawer';

// Lazy load de componentes de tabs - SOLO se cargan cuando se necesitan
const UsersTab = lazy(() => import('../../components/adminitration/users/UsersTab'));
const UsersActionTab = lazy(() => import('../../components/adminitration/usersaction/UsersActionTab'));
const PostsTab = lazy(() => import('../../components/adminitration/posts/PostsTab'));
const BoutiquesTab = lazy(() => import('../../components/adminitration/boutiques/BoutiquesTab'));
const ReportsTab = lazy(() => import('../../components/adminitration/reports/ReportsTab'));
const BlocksTab = lazy(() => import('../../components/adminitration/blocks/BlocksTab'));
const RolesTab = lazy(() => import('../../components/adminitration/roles/RolesTab'));

// Componente de carga
const TabLoader = () => (
  <div className="text-center py-5">
    <Spinner animation="border" variant="primary" />
    <p className="mt-3 text-muted">Cargando...</p>
  </div>
);

const AdminDashboard = () => {
  const { auth } = useSelector((state) => state);
  const [activeTab, setActiveTab] = useState('users');
  const [showDrawer, setShowDrawer] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stats, setStats] = useState({
    users: 0,
    usersAction: 0,
    posts: 0,
    boutiques: 0,
    reports: 0,
    blocked: 0
  });

  const isInitialMount = useRef(true);

  // Detectar pantalla móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Configuración de los tabs - TEXTO EN ESPAÑOL
  const tabsConfig = [
    { key: 'users', label: 'Usuarios', icon: <People size={18} />, count: stats.users },
    { key: 'usersAction', label: 'Estadísticas', icon: <BarChart size={18} />, count: stats.usersAction },
    { key: 'posts', label: 'Publicaciones', icon: <FileText size={18} />, count: stats.posts },
    { key: 'boutiques', label: 'Tiendas', icon: <Shop size={18} />, count: stats.boutiques },
    { key: 'reports', label: 'Reportes', icon: <Flag size={18} />, count: stats.reports },
    { key: 'blocks', label: 'Bloqueos', icon: <Lock size={18} />, count: stats.blocked },
    { key: 'roles', label: 'Roles', icon: <Shield size={18} />, count: null }
  ];

  // Cargar estadísticas iniciales - SOLO UNA VEZ
  useEffect(() => {
    if (auth?.token && isInitialMount.current) {
      isInitialMount.current = false;
      fetchStats();
    }
  }, [auth?.token]);

  const fetchStats = async () => {
    try {
      // Aquí llamas a tu API para obtener estadísticas
      // const res = await getDataAPI('admin/stats', auth.token);
      // setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    // Resetear filtros al cambiar de tab
    setFilters({});
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowDrawer(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setRefreshKey(prev => prev + 1);
  };

  // Función para renderizar el componente activo
  const renderActiveComponent = () => {
    const props = {
      key: `${activeTab}-${refreshKey}`,
      filters: filters,
      token: auth?.token
    };

    switch (activeTab) {
      case 'users':
        return <UsersTab {...props} />;
      case 'usersAction':
        return <UsersActionTab {...props} />;
      case 'posts':
        return <PostsTab {...props} />;
      case 'boutiques':
        return <BoutiquesTab {...props} />;
      case 'reports':
        return <ReportsTab {...props} />;
      case 'blocks':
        return <BlocksTab {...props} />;
      case 'roles':
        return <RolesTab {...props} />;
      default:
        return <UsersTab {...props} />;
    }
  };

  // Renderizado para móvil
  const renderMobileTabs = () => (
    <div className={styles.mobileTabsContainer}>
      <Nav variant="pills" className={styles.mobileNav}>
        {tabsConfig.map(tab => (
          <Nav.Item key={tab.key}>
            <Nav.Link
              active={activeTab === tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={styles.mobileNavLink}
            >
              <div className={styles.mobileTabContent}>
                {tab.icon}
                <span className={styles.mobileTabLabel}>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <Badge bg="secondary" className={styles.mobileBadge}>
                    {tab.count}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );

  // Renderizado para desktop
  const renderDesktopTabs = () => (
    <Tabs
      activeKey={activeTab}
      onSelect={handleTabChange}
      className={`mb-4 ${styles.tabs}`}
      fill
    >
      {tabsConfig.map(tab => (
        <Tab
          key={tab.key}
          eventKey={tab.key}
          title={
            <span className={styles.tabTitle}>
              <span className="me-2">{tab.icon}</span>
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <Badge bg="secondary" className="ms-2">
                  {tab.count}
                </Badge>
              )}
            </span>
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container fluid className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <Row className="align-items-center">
          <Col>
            <h1 className={styles.title}>
              Panel de Administración
              <Badge bg="info" className="ms-3">
                Admin
              </Badge>
            </h1>
            <p className={styles.subtitle}>
              Gestiona usuarios, publicaciones, tiendas y más
            </p>
          </Col>
          <Col xs="auto">
            <Button
              variant={showDrawer ? 'primary' : 'outline-primary'}
              onClick={() => setShowDrawer(true)}
              className="me-2"
              size={isMobile ? 'sm' : 'md'}
            >
              <FilterLeft className="me-2" />
              {!isMobile && 'Filtros'}
              {Object.keys(filters).length > 0 && (
                <Badge bg="danger" className="ms-2">
                  {Object.keys(filters).length}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleResetFilters}
              title="Resetear filtros"
              size={isMobile ? 'sm' : 'md'}
            >
              <ArrowRepeat />
            </Button>
          </Col>
        </Row>
      </div>

      {/* Tabs */}
      {isMobile ? renderMobileTabs() : renderDesktopTabs()}

      {/* Contenido del tab activo - SOLO UN componente se renderiza */}
      <Suspense fallback={<TabLoader />}>
        {renderActiveComponent()}
      </Suspense>

      {/* Drawer de filtros */}
      <FilterDrawer
        show={showDrawer}
        onHide={() => setShowDrawer(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        entityType={activeTab}
      />
    </Container>
  );
};

export default AdminDashboard;