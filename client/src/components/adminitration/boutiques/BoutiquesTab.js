// src/components/administration/boutiques/BoutiquesTab.jsx
// VERSIÓN CORREGIDA - CON CARGA DIRECTA

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Table,
  Dropdown,
  Badge,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Card,
  Accordion,
  Form,
  InputGroup,
  Alert
} from "react-bootstrap";
import {
  PencilFill,
  TrashFill,
  LockFill,
  UnlockFill,
  ThreeDotsVertical,
  Search,
  XCircle,
  EyeFill,
  Shop,
  Person,
  
} from "react-bootstrap-icons";
import moment from "moment";
import { debounce } from 'lodash';

import { getDataAPI, patchDataAPI, deleteDataAPI } from "../../../utils/fetchData";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";
import LoadMoreBtn from "../../LoadMoreBtn";

const BoutiquesTab = ({ filters = {}, token: propToken }) => {
  const dispatch = useDispatch();
  const { auth, languageReducer } = useSelector((state) => state);
  
  // Estados locales (sin Redux para simplificar)
  const [boutiques, setBoutiques] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const authToken = propToken || auth?.token;
  const lang = languageReducer?.language || 'es';
  
  // Estados locales
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  
  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boutiqueToDelete, setBoutiqueToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [boutiqueToActivate, setBoutiqueToActivate] = useState(null);
  
  // Detectar pantalla móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cargar boutiques - VERSIÓN DIRECTA SIN REDUX
  const loadBoutiques = useCallback(async (pageNum = 1, searchTerm = "") => {
    if (!authToken) {
      console.log("⚠️ No hay token de autenticación");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Construir URL
      let url = `/admin/boutiques/aprobadas?page=${pageNum}&limit=10`;
      if (searchTerm && searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      
      console.log("📡 Llamando a API:", url);
      
      const res = await getDataAPI(url, authToken);
      
      console.log("📦 Respuesta completa:", res);
      console.log("📦 Datos:", res.data);
      
      if (res.data && res.data.success !== false) {
        const boutiquesData = res.data.boutiques || [];
        const totalData = res.data.total || 0;
        const totalPagesData = res.data.totalPages || 1;
        const hasMoreData = res.data.hasMore || false;
        
        console.log(`✅ Cargadas ${boutiquesData.length} boutiques (total: ${totalData})`);
        
        if (pageNum === 1) {
          setBoutiques(boutiquesData);
        } else {
          setBoutiques(prev => [...prev, ...boutiquesData]);
        }
        
        setTotal(totalData);
        setPage(pageNum);
        setTotalPages(totalPagesData);
        setHasMore(hasMoreData);
      } else {
        throw new Error(res.data?.message || "Error al cargar boutiques");
      }
      
    } catch (err) {
      console.error("❌ Error loading boutiques:", err);
      setError(err.response?.data?.message || err.message || "Error al cargar las boutiques");
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Carga inicial - SIMPLIFICADA
  useEffect(() => {
    console.log("🔥 useEffect de carga inicial - authToken presente:", !!authToken);
    if (authToken) {
      console.log("🚀 Ejecutando carga inicial de boutiques...");
      loadBoutiques(1, "");
    } else {
      console.log("⏳ Esperando authToken...");
    }
  }, [authToken]); // ← Dependencia solo authToken

  // Búsqueda con debounce
  const handleSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        loadBoutiques(1, "");
      } else {
        loadBoutiques(1, searchTerm);
      }
    }, 500),
    [loadBoutiques]
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value);
  };

  // Activar/Desactivar boutique
  const handleToggleActive = async () => {
    if (!authToken || !boutiqueToActivate) return;
    
    try {
      setLoading(true);
      const newStatus = !boutiqueToActivate.isActive;
      
      console.log(`🔄 Cambiando estado de ${boutiqueToActivate.nom_boutique} a ${newStatus ? "activo" : "inactivo"}`);
      
      const res = await patchDataAPI(`/admin/boutiques/status/${boutiqueToActivate._id}`, { isActive: newStatus }, authToken);
      
      console.log("📦 Respuesta cambio estado:", res.data);
      
      if (res.data && res.data.success !== false) {
        // Actualizar lista local
        setBoutiques(prev => 
          prev.map(b => b._id === boutiqueToActivate._id ? { ...b, isActive: newStatus } : b)
        );
        
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: `Boutique ${newStatus ? 'activée' : 'désactivée'} avec succès` }
        });
      }
      
      setShowActivateModal(false);
      setBoutiqueToActivate(null);
    } catch (err) {
      console.error("❌ Error toggling boutique status:", err);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.message || "Error al cambiar estado" }
      });
    } finally {
      setLoading(false);
    }
  };

  // Eliminar boutique
  const handleDeleteBoutique = async () => {
    if (!authToken || !boutiqueToDelete) return;
    
    try {
      setLoading(true);
      console.log(`🗑️ Eliminando boutique: ${boutiqueToDelete.nom_boutique}`);
      
      const res = await deleteDataAPI(`/boutique/${boutiqueToDelete._id}`, authToken);
      
      console.log("📦 Respuesta eliminación:", res.data);
      
      if (res.data && res.data.success !== false) {
        setBoutiques(prev => prev.filter(b => b._id !== boutiqueToDelete._id));
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { success: `Boutique "${boutiqueToDelete.nom_boutique}" éliminée` }
        });
      }
      
      setShowDeleteModal(false);
      setBoutiqueToDelete(null);
    } catch (err) {
      console.error("❌ Error deleting boutique:", err);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: err.response?.data?.message || "Error al eliminar boutique" }
      });
    } finally {
      setLoading(false);
    }
  };

  // Ver detalles
  const handleViewBoutique = (boutique) => {
    setSelectedBoutique(boutique);
    setShowStatusModal(true);
  };

  // Cargar más
  const handleLoadMore = async () => {
    if (!loading && hasMore) {
      await loadBoutiques(page + 1, search);
    }
  };

  // Obtener badge de estado
  const getActiveBadge = (boutique) => {
    if (boutique.isActive) {
      return <Badge bg="success">✅ Activa (Pública)</Badge>;
    }
    return <Badge bg="secondary">⭕ Inactiva (No pública)</Badge>;
  };

  const getApprovalBadge = (boutique) => {
    if (!boutique.pendiente) {
      return <Badge bg="info">✓ Aprobada</Badge>;
    }
    return <Badge bg="warning" text="dark">⏳ Pendiente</Badge>;
  };

  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (loading && boutiques.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Cargando boutiques...</p>
        </div>
      </div>
    );
  }

  // Vista móvil y desktop (igual que antes, pero usando el estado local `boutiques`)
  // ... el resto del código permanece igual, solo cambia `adminBoutiques` por `boutiques`
  // y `adminTotal` por `total`, etc.

  return (
    <Container fluid className="py-4">
      {/* Header con búsqueda */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Card.Body className="py-4">
              <Row className="align-items-center">
                <Col>
                  <h3 className="text-white mb-2">
                    <Shop className="me-2" /> Gestión de Boutiques
                  </h3>
                  <p className="text-white-50 mb-0">
                    Administra las boutiques aprobadas. Actívalas para hacerlas públicas en la plataforma.
                  </p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text className="bg-white border-0">
                      <Search />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar boutique por nombre o dominio..."
                      value={search}
                      onChange={onSearchChange}
                      className="border-0 shadow-sm"
                    />
                    {search && (
                      <Button variant="light" onClick={() => {
                        setSearch("");
                        loadBoutiques(1, "");
                      }}>
                        <XCircle />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md="auto" className="mt-2 mt-md-0">
                  <Badge bg="light" text="dark" className="py-2 px-3">
                    Total: {total} boutiques aprobadas
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Error */}
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Mostrar número de boutiques para depuración */}
      <Alert variant="info" className="mb-3">
        <strong>Depuración:</strong> {boutiques.length} boutiques cargadas, Total: {total}, Página: {page}, HasMore: {hasMore ? "Sí" : "No"}
      </Alert>

      {/* Vista según dispositivo - usa `boutiques` en lugar de `adminBoutiques` */}
      {isMobile ? (
        <Row>
          <Col>
            {boutiques.length === 0 ? (
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-5">
                  <Shop size={48} className="text-muted mb-3" />
                  <p className="text-muted">No hay boutiques aprobadas</p>
                  <small className="text-muted">Las boutiques aparecerán aquí después de ser aprobadas</small>
                </Card.Body>
              </Card>
            ) : (
              <Accordion flush>
                {boutiques.map((boutique, index) => (
                  <Accordion.Item key={boutique._id} eventKey={boutique._id} className="mb-3 border-0 shadow-sm rounded">
                    <Accordion.Header>
                      <div className="d-flex align-items-center w-100">
                        <Badge bg="primary" className="me-3 rounded-circle">
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="fw-bold">{boutique.nom_boutique}</div>
                          <small className="text-muted">{boutique.domaine_boutique}</small>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <small className="text-muted d-block">Propietario</small>
                          <div className="d-flex align-items-center mt-1">
                            <Person size={14} className="me-1" />
                            <span>{boutique.user?.username || "N/A"}</span>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Categoría</small>
                          <span>{boutique.categorie || "N/A"}</span>
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Estado</small>
                          {getActiveBadge(boutique)}
                        </Col>
                        <Col xs={6}>
                          <small className="text-muted d-block">Aprobación</small>
                          {getApprovalBadge(boutique)}
                        </Col>
                      </Row>
                      
                      <Dropdown className="d-grid">
                        <Dropdown.Toggle variant="primary" size="sm">
                          <ThreeDotsVertical className="me-2" /> Acciones
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleViewBoutique(boutique)}>
                            <EyeFill className="me-2" /> Ver detalles
                          </Dropdown.Item>
                          {!boutique.isActive ? (
                            <Dropdown.Item 
                              onClick={() => {
                                setBoutiqueToActivate(boutique);
                                setShowActivateModal(true);
                              }}
                              className="text-success"
                            >
                              <UnlockFill className="me-2" /> Activar (Hacer pública)
                            </Dropdown.Item>
                          ) : (
                            <Dropdown.Item 
                              onClick={() => {
                                setBoutiqueToActivate(boutique);
                                setShowActivateModal(true);
                              }}
                              className="text-warning"
                            >
                              <LockFill className="me-2" /> Desactivar
                            </Dropdown.Item>
                          )}
                          <Dropdown.Divider />
                          <Dropdown.Item 
                            className="text-danger"
                            onClick={() => {
                              setBoutiqueToDelete(boutique);
                              setShowDeleteModal(true);
                            }}
                          >
                            <TrashFill className="me-2" /> Eliminar
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Col>
        </Row>
      ) : (
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                  <tr>
                    <th className="text-white border-0 py-3">#</th>
                    <th className="text-white border-0 py-3">Boutique</th>
                    <th className="text-white border-0 py-3">Propietario</th>
                    <th className="text-white border-0 py-3">Categoría</th>
                    <th className="text-white border-0 py-3">Estado</th>
                    <th className="text-white border-0 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {boutiques.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <Shop size={48} className="text-muted mb-3" />
                        <p className="text-muted">No hay boutiques aprobadas</p>
                      </td>
                    </tr>
                  ) : (
                    boutiques.map((boutique, index) => (
                      <tr key={boutique._id}>
                        <td>{index + 1 + (page - 1) * 10}</td>
                        <td>
                          <div className="fw-bold">{boutique.nom_boutique}</div>
                          <small className="text-muted">{boutique.domaine_boutique}</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={boutique.user?.avatar}
                              alt="avatar"
                              className="rounded-circle me-2"
                              width="30"
                              height="30"
                              onError={(e) => e.target.src = "https://via.placeholder.com/30"}
                            />
                            <span>{boutique.user?.username || "Desconocido"}</span>
                          </div>
                        </td>
                        <td>{boutique.categorie || "N/A"}</td>
                        <td>{getActiveBadge(boutique)}</td>
                        <td className="text-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-circle">
                              <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewBoutique(boutique)}>
                                <EyeFill className="me-2" /> Ver detalles
                              </Dropdown.Item>
                              {!boutique.isActive ? (
                                <Dropdown.Item 
                                  onClick={() => {
                                    setBoutiqueToActivate(boutique);
                                    setShowActivateModal(true);
                                  }}
                                  className="text-success"
                                >
                                  <UnlockFill className="me-2" /> Activar
                                </Dropdown.Item>
                              ) : (
                                <Dropdown.Item 
                                  onClick={() => {
                                    setBoutiqueToActivate(boutique);
                                    setShowActivateModal(true);
                                  }}
                                  className="text-warning"
                                >
                                  <LockFill className="me-2" /> Desactivar
                                </Dropdown.Item>
                              )}
                              <Dropdown.Divider />
                              <Dropdown.Item 
                                className="text-danger"
                                onClick={() => {
                                  setBoutiqueToDelete(boutique);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <TrashFill className="me-2" /> Eliminar
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Load more */}
      {hasMore && boutiques.length > 0 && !loading && (
        <Row className="my-4">
          <Col className="d-flex justify-content-center">
            <LoadMoreBtn
              result={boutiques.length}
              page={page}
              load={loading}
              handleLoadMore={handleLoadMore}
            />
          </Col>
        </Row>
      )}

      {/* Modales (igual que antes) */}
      {/* Modal de activación */}
      <Modal show={showActivateModal} onHide={() => setShowActivateModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className={boutiqueToActivate?.isActive ? "text-warning" : "text-success"}>
            {boutiqueToActivate?.isActive ? "Desactivar Boutique" : "Activar Boutique"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Estás seguro de que deseas {boutiqueToActivate?.isActive ? "desactivar" : "activar"} la boutique 
            <strong> {boutiqueToActivate?.nom_boutique}</strong>?
          </p>
          {!boutiqueToActivate?.isActive ? (
            <Alert variant="success" className="mt-3">
              <UnlockFill className="me-2" />
              Al activar esta boutique, será <strong>visible para todos los usuarios</strong> en la plataforma.
            </Alert>
          ) : (
            <Alert variant="warning" className="mt-3">
              <LockFill className="me-2" />
              Al desactivar esta boutique, <strong>dejará de ser visible</strong> para los usuarios.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowActivateModal(false)}>Cancelar</Button>
          <Button 
            variant={boutiqueToActivate?.isActive ? "warning" : "success"} 
            onClick={handleToggleActive}
          >
            {boutiqueToActivate?.isActive ? "Desactivar" : "Activar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">Eliminar Boutique</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la boutique <strong>{boutiqueToDelete?.nom_boutique}</strong>?</p>
          <p className="text-danger small">Esta acción eliminará la boutique permanentemente.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteBoutique}>
            <TrashFill className="me-2" /> Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de detalles */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Boutique</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBoutique && (
            <Row>
              <Col md={6}>
                <h6>Información General</h6>
                <p><strong>Nombre:</strong> {selectedBoutique.nom_boutique}</p>
                <p><strong>Dominio:</strong> {selectedBoutique.domaine_boutique}</p>
                <p><strong>Categoría:</strong> {selectedBoutique.categorie}</p>
                <p><strong>Estado:</strong> {getActiveBadge(selectedBoutique)}</p>
                <p><strong>Creado:</strong> {moment(selectedBoutique.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              </Col>
              <Col md={6}>
                <h6>Propietario</h6>
                <p><strong>Usuario:</strong> {selectedBoutique.user?.username || "N/A"}</p>
                <p><strong>Email:</strong> {selectedBoutique.user?.email || "N/A"}</p>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BoutiquesTab;