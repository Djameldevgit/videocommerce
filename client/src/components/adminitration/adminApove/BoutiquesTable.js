// components/admin/BoutiquesTable.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaStore, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBoutiquesPendientes, aprobarBoutique, rechazarBoutique, activatePaidBoutique } from '../../../redux/actions/boutiqueAproveAction';

const BoutiquesTable = ({ onLoadingChange, onPaginationUpdate }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { boutiques = [], loading = false, total = 0, page = 1, totalPages = 1 } = useSelector(state => state.boutiqueAprove || {});

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // ✅ Refs para evitar bucles
  const hasLoadedRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onPaginationUpdateRef = useRef(onPaginationUpdate);

  // ✅ Actualizar refs cuando cambian
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
    onPaginationUpdateRef.current = onPaginationUpdate;
  }, [onLoadingChange, onPaginationUpdate]);

  // ✅ Notificar loading sin causar bucles
  useEffect(() => {
    if (onLoadingChangeRef.current) {
      onLoadingChangeRef.current(loading);
    }
  }, [loading]);

  // ✅ Notificar paginación sin causar bucles
  useEffect(() => {
    if (onPaginationUpdateRef.current && total > 0) {
      onPaginationUpdateRef.current({ total, page, totalPages });
    }
  }, [total, page, totalPages]);

  // ✅ Cargar boutiques solo cuando cambia currentPage
  const loadBoutiques = useCallback((pageNum) => {
    if (auth?.token) {
      dispatch(getBoutiquesPendientes(auth.token, pageNum, limit));
    }
  }, [dispatch, auth?.token, limit]);

  // ✅ Efecto de carga inicial y cambio de página
  useEffect(() => {
    if (!hasLoadedRef.current || currentPage !== page) {
      loadBoutiques(currentPage);
      hasLoadedRef.current = true;
    }
  }, [currentPage, loadBoutiques, page]);

  // ✅ Reset selección cuando cambian los boutiques
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [boutiques.length]);

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(boutiques.map(b => b._id));
    }
    setSelectAll(!selectAll);
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  const handleApprove = async (boutique) => {
    if (!window.confirm(`Approuver la boutique "${boutique.nom_boutique}" ?`)) return;

    const result = await dispatch(aprobarBoutique(boutique._id, auth.token));
    if (result?.success) {
      showMessage('Boutique approuvée avec succès', 'success');
      loadBoutiques(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de l\'approbation', 'danger');
    }
  };

  const handleActivatePayment = async (boutique) => {
    if (!window.confirm(`Confirmer le paiement et activer la boutique "${boutique.nom_boutique}" ?`)) return;

    const result = await dispatch(activatePaidBoutique(boutique._id, auth.token));
    if (result?.success) {
      showMessage('Paiement confirmé. Boutique activée', 'success');
      loadBoutiques(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de l\'activation', 'danger');
    }
  };

  const handleDelete = async (boutique) => {
    if (!window.confirm(`Supprimer définitivement la boutique "${boutique.nom_boutique}" ?`)) return;

    const result = await dispatch(rechazarBoutique(boutique._id, auth.token));
    if (result?.success) {
      showMessage('Boutique supprimée', 'warning');
      loadBoutiques(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de la suppression', 'danger');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleViewBoutique = (boutiqueId) => {
    history.push(`/boutique/${boutiqueId}`);
  };

  if (loading && boutiques.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des boutiques en attente...</p>
      </Card>
    );
  }

  return (
    <>
      {message.show && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ show: false })}>
          {message.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaStore className="me-2" style={{ color: '#EC4899' }} />
                Boutiques en attente
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total: {total} boutique(s)
              </small>
            </div>
            {boutiques.length > 0 && (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label className="form-check-label small">Tout sélectionner</label>
              </div>
            )}
          </div>
        </Card.Header>

        {selectedItems.length > 0 && (
          <Card.Body className="bg-light py-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="fw-semibold">
                <FaCheck className="me-2 text-success" />
                {selectedItems.length} boutique(s) sélectionnée(s)
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const boutique = boutiques.find(b => b._id === id);
                      if (boutique) handleApprove(boutique);
                    });
                  }}
                >
                  <FaCheck className="me-1" /> Approuver sélection
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const boutique = boutiques.find(b => b._id === id);
                      if (boutique) handleActivatePayment(boutique);
                    });
                  }}
                >
                  <FaMoneyBillWave className="me-1" /> Activer paiement
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        {boutiques.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaStore className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucune boutique en attente</h5>
            <p className="small text-muted">Toutes les boutiques ont été vérifiées</p>
          </Card.Body>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th style={{ width: '80px' }}>Logo</th>
                    <th>Nom</th>
                    <th>Propriétaire</th>
                    <th>Plan</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {boutiques.map(boutique => (
                    <tr key={boutique._id} className={selectedItems.includes(boutique._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(boutique._id)}
                          onChange={() => handleSelectItem(boutique._id)}
                        />
                      </td>
                      <td>
                        <div onClick={() => handleViewBoutique(boutique._id)} style={{ cursor: 'pointer' }}>
                          {boutique.images?.[0]?.url ? (
                            <Image
                              src={boutique.images[0].url}
                              width="60"
                              height="40"
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px', cursor: 'pointer' }}>
                              <FaStore className="text-white opacity-50" size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{boutique.nom_boutique?.substring(0, 40)}</div>
                        <small className="text-muted">{boutique.domaine_boutique}</small>
                       </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small fw-medium">{boutique.user?.username || 'N/A'}</span>
                          <small className="text-muted">{boutique.user?.email}</small>
                        </div>
                       </td>
                      <td>
                        <Badge bg={boutique.plan === 'premium' ? 'warning' : 'primary'} className="rounded-pill">
                          {boutique.plan}
                        </Badge>
                       </td>
                      <td>
                        {boutique.pendiente ? (
                          <Badge bg="warning" className="rounded-pill">
                            <FaClock className="me-1" size={10} /> En attente
                          </Badge>
                        ) : boutique.isActive ? (
                          <Badge bg="success" className="rounded-pill">
                            Active
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="rounded-pill">
                            Attente paiement
                          </Badge>
                        )}
                       </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(boutique.createdAt)}
                        </small>
                       </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewBoutique(boutique._id)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(boutique)}
                            title="Approuver"
                            disabled={!boutique.pendiente}
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleActivatePayment(boutique)}
                            title="Activer paiement"
                            disabled={boutique.pendiente || boutique.isActive}
                          >
                            <FaMoneyBillWave />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(boutique)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={page === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    />
                  </Pagination>
                </div>
              </Card.Footer>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default BoutiquesTable;