// src/components/administration/Users/UsersTab.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  Tabs,
  Tab,
  Alert  // ← IMPORTANTE: Alert agregado
} from "react-bootstrap";
import {
  TrashFill,
  CheckCircleFill,
  XCircleFill,
  ThreeDotsVertical,
  Search,
  XCircle,
  StarFill,
  CalendarCheck
} from "react-bootstrap-icons";
import moment from "moment";
import "moment/locale/fr";
import { debounce } from 'lodash';

import { getDataAPI } from "../../../utils/fetchData";
import {
  deleteUser,
  toggleVerification,
  activatePro,
  deactivatePro,
  USER_TYPES
} from "../../../redux/actions/userAction";
import { MESS_TYPES } from "../../../redux/actions/messageAction";
import { GLOBALTYPES } from "../../../redux/actions/globalTypes";

import LoadMoreBtn from "../../LoadMoreBtn";
import UserCard from "../../UserCard";

const UsersTab = ({ filters = {}, token: propToken }) => {
  const { homeUsers, auth, socket, online } = useSelector((state) => state);
  const dispatch = useDispatch();
  
  const authToken = propToken || auth?.token;
  
  const [load, setLoad] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [activeTab, setActiveTab] = useState('all');

  // Modal para Usuario Pro
  const [showProModal, setShowProModal] = useState(false);
  const [selectedUserForPro, setSelectedUserForPro] = useState(null);
  const [proExpiryDate, setProExpiryDate] = useState("");
  const [proActionType, setProActionType] = useState('activate');

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);

  moment.locale('fr');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!socket || !auth?.user) return;

    socket.emit("checkUserOnline", auth.user);

    socket.on("checkUserOnlineToClient", (data) => {
      dispatch({ type: GLOBALTYPES.ONLINE, payload: data });
    });

    socket.on("CheckUserOffline", (data) => {
      dispatch({ type: MESS_TYPES.UPDATE_USER_STATUS, payload: data });
    });

    return () => {
      socket.off("checkUserOnlineToClient");
      socket.off("CheckUserOffline");
    };
  }, [socket, auth?.user, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoad(true);
        const res = await getDataAPI(`users?limit=9`, authToken);
        dispatch({
          type: USER_TYPES.GET_USERS,
          payload: { ...res.data, page: 1 },
        });
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoad(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad && authToken) {
      fetchUsers();
    }
  }, [authToken, dispatch, initialLoad]);

  const getFilteredUsers = () => {
    const users = search.trim() !== "" ? searchResults : homeUsers.users;
    
    switch (activeTab) {
      case 'pro':
        return users?.filter(user => user.isPro === true) || [];
      case 'non-pro':
        return users?.filter(user => !user.isPro || user.isPro === false) || [];
      default:
        return users || [];
    }
  };

  const searchUsers = useCallback(
    debounce(async (searchTerm, page = 1) => {
      if (!authToken) return;

      try {
        setIsSearching(true);
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();

        if (normalizedSearchTerm.length === 0) {
          setSearchResults([]);
          return;
        }

        const query = `users/search?username=${encodeURIComponent(normalizedSearchTerm)}&page=${page}&limit=9&caseInsensitive=true`;
        const res = await getDataAPI(query, authToken);

        if (page === 1) {
          setSearchResults(res.data.users || []);
        } else {
          setSearchResults(prev => [...prev, ...(res.data.users || [])]);
        }

        setSearchPage(page);
        setHasMoreSearch(res.data.users && res.data.users.length === 9);
      } catch (err) {
        console.error("Error searching users:", err);
        dispatch({
          type: GLOBALTYPES.ALERT,
          payload: { error: "Erreur lors de la recherche" }
        });
      } finally {
        setIsSearching(false);
      }
    }, 500),
    [authToken, dispatch]
  );

  useEffect(() => {
    if (search.trim() !== "") {
      searchUsers(search, 1);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [search, searchUsers]);

  const handleLoadMoreSearch = async () => {
    if (!authToken || search.trim() === "") return;
    try {
      setLoad(true);
      await searchUsers(search, searchPage + 1);
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoad(false);
    }
  };

  const handleLoadMore = async () => {
    setLoad(true);
    try {
      const res = await getDataAPI(
        `users?limit=9&page=${homeUsers.page + 1}`,
        authToken
      );
      dispatch({
        type: USER_TYPES.GET_USERS,
        payload: { ...res.data, page: homeUsers.page + 1 },
      });
    } catch (err) {
      console.error("Error loading more users:", err);
    } finally {
      setLoad(false);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser({ id: userToDelete, auth: { token: authToken } }));
      setShowDeleteModal(false);

      if (search.trim() !== "") {
        setSearchResults(prev => prev.filter(user => user._id !== userToDelete));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      await dispatch(toggleVerification(userId, authToken));
    } catch (err) {
      console.error("Error toggling verification:", err);
    }
  };

  const handleOpenProModal = (user, action) => {
    setSelectedUserForPro(user);
    setProActionType(action);
    if (action === 'activate') {
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      setProExpiryDate(defaultDate.toISOString().slice(0, 16));
    } else {
      setProExpiryDate("");
    }
    setShowProModal(true);
  };

  const handleConfirmProAction = async () => {
    if (proActionType === 'activate') {
      await dispatch(activatePro(selectedUserForPro._id, proExpiryDate || null, authToken));
    } else {
      await dispatch(deactivatePro(selectedUserForPro._id, authToken));
    }
    setShowProModal(false);
    setSelectedUserForPro(null);
    setProExpiryDate("");
  };

  const isProActive = (user) => {
    return user?.isPro && (!user?.proExpiryDate || new Date(user.proExpiryDate) > new Date());
  };

  const getDaysLeft = (user) => {
    if (!user?.proExpiryDate) return null;
    const daysLeft = Math.ceil((new Date(user.proExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const usersToShow = getFilteredUsers();
  const hasMore = search.trim() !== "" ? hasMoreSearch : homeUsers.result >= 9;

  if (initialLoad) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted fw-semibold">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm bg-gradient" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Card.Body className="py-4">
              <Row className="align-items-center g-3">
                <Col lg={8} md={7}>
                  <InputGroup size="lg">
                    <InputGroup.Text className="bg-white border-0">
                      <Search className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Rechercher un utilisateur par nom ou email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-0 shadow-sm"
                      style={{ fontSize: "1rem" }}
                    />
                    {search.trim() !== "" && (
                      <Button variant="light" onClick={() => setSearch("")} className="border-0">
                        <XCircle />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col lg={4} md={5} className="text-md-end">
                  <Badge bg="light" text="dark" className="py-2 px-3 fs-6">
                    <i className="bi bi-person-check me-2"></i>
                    {usersToShow.length} {search.trim() !== "" ? "résultats" : "utilisateurs"}
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab 
          eventKey="all" 
          title={
            <span>
              📋 Tous les utilisateurs
              <Badge bg="secondary" className="ms-2">{homeUsers.users?.length || 0}</Badge>
            </span>
          } 
        />
        <Tab 
          eventKey="pro" 
          title={
            <span>
              ⭐ Utilisateurs Pro
              <Badge bg="primary" className="ms-2">{homeUsers.users?.filter(u => u.isPro === true).length || 0}</Badge>
            </span>
          } 
        />
        <Tab 
          eventKey="non-pro" 
          title={
            <span>
              👤 Utilisateurs standard
              <Badge bg="secondary" className="ms-2">{homeUsers.users?.filter(u => !u.isPro || u.isPro === false).length || 0}</Badge>
            </span>
          } 
        />
      </Tabs>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-danger">
            <TrashFill className="me-2" />
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <p className="mb-0">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            <TrashFill className="me-2" />
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showProModal} onHide={() => setShowProModal(false)} centered>
        <Modal.Header closeButton className={proActionType === 'activate' ? "bg-primary text-white" : "bg-warning text-dark"}>
          <Modal.Title>
            {proActionType === 'activate' ? (
              <><StarFill className="me-2" /> Activer le compte Pro</>
            ) : (
              <><XCircleFill className="me-2" /> Désactiver le compte Pro</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Utilisateur :</strong> {selectedUserForPro?.username}
            <br />
            <strong>Email :</strong> {selectedUserForPro?.email}
          </p>
          
          {proActionType === 'activate' ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>
                  <CalendarCheck className="me-2" />
                  Date d'expiration (optionnelle)
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={proExpiryDate}
                  onChange={(e) => setProExpiryDate(e.target.value)}
                />
                <Form.Text className="text-muted">
                  Laissez vide pour un abonnement sans expiration (à vie)
                </Form.Text>
              </Form.Group>
              <Alert variant="info" className="mt-2">
                <StarFill className="me-2" />
                L'utilisateur bénéficiera de tous les avantages Pro.
              </Alert>
            </>
          ) : (
            <Alert variant="warning" className="mt-2">
              <XCircleFill className="me-2" />
              Êtes-vous sûr de vouloir désactiver le compte Pro de cet utilisateur ?
              Il perdra tous ses avantages.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProModal(false)}>
            Annuler
          </Button>
          <Button 
            variant={proActionType === 'activate' ? "primary" : "danger"}
            onClick={handleConfirmProAction}
          >
            {proActionType === 'activate' ? (
              <><StarFill className="me-2" /> Activer Pro</>
            ) : (
              <><XCircleFill className="me-2" /> Désactiver Pro</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {isSearching && search.trim() !== "" && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-4">
                <Spinner animation="border" variant="primary" className="mb-2" />
                <p className="mb-0 text-muted">Recherche...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {isMobile ? (
        <Row>
          <Col>
            {usersToShow.length === 0 ? (
              <Card className="border-0 shadow-sm text-center">
                <Card.Body className="py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  <p className="mt-3 mb-0 text-muted fs-5">
                    {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur disponible"}
                  </p>
                </Card.Body>
              </Card>
            ) : (
              <Accordion flush>
                {usersToShow.map((user, index) => (
                  <Accordion.Item key={user._id} eventKey={user._id} className="mb-3 border-0 shadow-sm rounded">
                    <Accordion.Header className="bg-white">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div className="d-flex align-items-center">
                          <Badge bg="primary" className="me-3 rounded-circle" style={{ width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {index + 1}
                          </Badge>
                          <UserCard user={user} />
                        </div>
                        {isProActive(user) && (
                          <StarFill className="text-warning me-2" size={18} />
                        )}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-light">
                      <Row className="g-3 mb-3">
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Statut</small>
                            {online.some((u) => u._id === user._id) ? (
                              <Badge bg="success" className="w-100">En ligne</Badge>
                            ) : user.lastDisconnectedAt ? (
                              <Badge bg="secondary" className="w-100">
                                Déconnecté {moment(user.lastDisconnectedAt).fromNow()}
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="w-100">Déconnecté</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Inscription</small>
                            <small className="text-dark fw-semibold">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Vérification</small>
                            {user.isVerified ? (
                              <Badge bg="success" className="w-100"><CheckCircleFill className="me-1" /> Vérifié</Badge>
                            ) : (
                              <Badge bg="danger" className="w-100"><XCircleFill className="me-1" /> Non vérifié</Badge>
                            )}
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="p-2 bg-white rounded">
                            <small className="text-muted d-block mb-1">Statut Pro</small>
                            {isProActive(user) ? (
                              <Badge bg="primary" className="w-100">
                                <StarFill className="me-1" size={12} /> PRO
                                {getDaysLeft(user) && getDaysLeft(user) <= 30 && (
                                  <small className="ms-1">({getDaysLeft(user)}j)</small>
                                )}
                              </Badge>
                            ) : user?.isPro ? (
                              <Badge bg="warning" text="dark" className="w-100">Expiré</Badge>
                            ) : (
                              <Badge bg="secondary" className="w-100">Standard</Badge>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Dropdown className="d-grid">
                        <Dropdown.Toggle variant="primary" size="sm" className="w-100">
                          <ThreeDotsVertical className="me-2" />
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100 shadow">
                          <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                            <TrashFill className="me-2" /> Supprimer
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            className={user.isVerified ? "text-danger" : "text-success"}
                            onClick={() => handleToggleVerification(user._id)}
                          >
                            {user.isVerified ? (
                              <XCircleFill className="me-2" />
                            ) : (
                              <CheckCircleFill className="me-2" />
                            )}
                            {user.isVerified ? "Dévérifier" : "Vérifier"}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          {!isProActive(user) && !user?.isPro ? (
                            <Dropdown.Item 
                              className="text-primary"
                              onClick={() => handleOpenProModal(user, 'activate')}
                            >
                              <StarFill className="me-2" /> Activer Pro
                            </Dropdown.Item>
                          ) : isProActive(user) || user?.isPro ? (
                            <Dropdown.Item 
                              className="text-warning"
                              onClick={() => handleOpenProModal(user, 'deactivate')}
                            >
                              <XCircleFill className="me-2" /> Désactiver Pro
                            </Dropdown.Item>
                          ) : null}
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
                    <th className="text-white border-0 py-3">Utilisateur</th>
                    <th className="text-white border-0 py-3">Statut</th>
                    <th className="text-white border-0 py-3">Inscription</th>
                    <th className="text-white border-0 py-3">Vérification</th>
                    <th className="text-white border-0 py-3">Statut Pro</th>
                    <th className="text-white border-0 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersToShow.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                        <p className="mt-3 mb-0 text-muted fs-5">
                          {search ? "Aucun utilisateur trouvé" : "Aucun utilisateur disponible"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    usersToShow.map((user, index) => (
                      <tr key={user._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td className="fw-bold text-primary">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <UserCard user={user} />
                            {isProActive(user) && (
                              <StarFill className="text-warning" size={16} title="Utilisateur Pro" />
                            )}
                          </div>
                        </td>
                        <td>
                          {online.some((u) => u._id === user._id) ? (
                            <Badge bg="success" className="px-3 py-2">En ligne</Badge>
                          ) : user.lastDisconnectedAt ? (
                            <Badge bg="secondary" className="px-3 py-2">
                              Déconnecté {moment(user.lastDisconnectedAt).fromNow()}
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="px-3 py-2">Déconnecté</Badge>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</small>
                        </td>
                        <td>
                          {user.isVerified ? (
                            <Badge bg="success" className="px-3 py-2"><CheckCircleFill className="me-1" /> Vérifié</Badge>
                          ) : (
                            <Badge bg="danger" className="px-3 py-2"><XCircleFill className="me-1" /> Non vérifié</Badge>
                          )}
                        </td>
                        <td>
                          {isProActive(user) ? (
                            <Badge bg="primary" className="px-3 py-2">
                              <StarFill className="me-1" size={12} /> PRO
                              {getDaysLeft(user) && getDaysLeft(user) <= 30 && (
                                <small className="ms-1 text-white-50">({getDaysLeft(user)}j)</small>
                              )}
                            </Badge>
                          ) : user?.isPro ? (
                            <Badge bg="warning" text="dark" className="px-3 py-2">Expiré</Badge>
                          ) : (
                            <Badge bg="secondary" className="px-3 py-2">Standard</Badge>
                          )}
                        </td>
                        <td className="text-center">
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-primary" size="sm" className="rounded-circle" style={{ width: "35px", height: "35px", padding: "0" }}>
                              <ThreeDotsVertical />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0">
                              <Dropdown.Item className="text-danger" onClick={() => confirmDelete(user._id)}>
                                <TrashFill className="me-2" /> Supprimer
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className={user.isVerified ? "text-danger" : "text-success"}
                                onClick={() => handleToggleVerification(user._id)}
                              >
                                {user.isVerified ? (
                                  <XCircleFill className="me-2" />
                                ) : (
                                  <CheckCircleFill className="me-2" />
                                )}
                                {user.isVerified ? "Dévérifier" : "Vérifier"}
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              {!isProActive(user) && !user?.isPro ? (
                                <Dropdown.Item 
                                  className="text-primary"
                                  onClick={() => handleOpenProModal(user, 'activate')}
                                >
                                  <StarFill className="me-2" /> Activer Pro
                                </Dropdown.Item>
                              ) : isProActive(user) || user?.isPro ? (
                                <Dropdown.Item 
                                  className="text-warning"
                                  onClick={() => handleOpenProModal(user, 'deactivate')}
                                >
                                  <XCircleFill className="me-2" /> Désactiver Pro
                                </Dropdown.Item>
                              ) : null}
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

      {load && (
        <Row className="my-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-3">
                <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                <span className="text-muted">Chargement...</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {hasMore && usersToShow.length > 0 && (
        <Row className="my-4">
          <Col className="d-flex justify-content-center">
            <LoadMoreBtn
              result={9}
              page={search.trim() !== "" ? searchPage : homeUsers.page}
              load={load}
              handleLoadMore={search.trim() !== "" ? handleLoadMoreSearch : handleLoadMore}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UsersTab;