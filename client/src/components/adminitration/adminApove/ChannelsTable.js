// frontend/src/components/adminitration/adminApove/ChannelsTable.jsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaUsers, FaStore, FaClock, FaTimes } from 'react-icons/fa';
import { getPendingChannels, approveChannel, rejectChannel } from '../../../redux/actions/channelAction';

const ChannelsTable = ({ onLoadingChange, onPaginationUpdate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state); // ✅ auth contiene la información del admin
  const { pendingChannels = { channels: [], total: 0, page: 1, totalPages: 1, loading: false } } = useSelector(state => state.channel || {});

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const limit = 10;

  // Refs para evitar bucles
  const hasLoadedRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onPaginationUpdateRef = useRef(onPaginationUpdate);

  // Actualizar refs cuando cambian
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
    onPaginationUpdateRef.current = onPaginationUpdate;
  }, [onLoadingChange, onPaginationUpdate]);

  // Notificar loading sin causar bucles
  useEffect(() => {
    if (onLoadingChangeRef.current) {
      onLoadingChangeRef.current(pendingChannels.loading);
    }
  }, [pendingChannels.loading]);

  // Notificar paginación
  useEffect(() => {
    if (onPaginationUpdateRef.current && pendingChannels.total > 0) {
      onPaginationUpdateRef.current({
        total: pendingChannels.total,
        page: pendingChannels.page,
        totalPages: pendingChannels.totalPages
      });
    }
  }, [pendingChannels.total, pendingChannels.page, pendingChannels.totalPages]);

  // Cargar canales pendientes
  const loadChannels = useCallback((pageNum) => {
    if (auth?.token) {
      dispatch(getPendingChannels(auth.token, pageNum, limit));
    }
  }, [dispatch, auth?.token, limit]);

  // Efecto de carga inicial y cambio de página
  useEffect(() => {
    if (!hasLoadedRef.current || currentPage !== pendingChannels.page) {
      loadChannels(currentPage);
      hasLoadedRef.current = true;
    }
  }, [currentPage, loadChannels, pendingChannels.page]);

  // Reset selección cuando cambian los canales
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [pendingChannels.channels?.length]);

  const channels = pendingChannels.channels || [];

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(channels.map(ch => ch._id));
    }
    setSelectAll(!selectAll);
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  // ✅ APROBAR CANAL - Pasando auth correctamente
  const handleApprove = async (channel) => {
    if (!window.confirm(`Approuver le canal "${channel.name}" ? Il sera visible sur le site.`)) return;

    // ✅ Pasar auth completo (contiene el _id del admin)
    const result = await dispatch(approveChannel(channel._id, auth.token, auth, socket));
    
    if (result?.success) {
      showMessage('Canal approuvé avec succès', 'success');
      loadChannels(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de l\'approbation', 'danger');
    }
  };

  // ✅ RECHAZAR CANAL - Nueva función con notificación
  const handleReject = async (channel, reason) => {
    if (!window.confirm(`Rejeter le canal "${channel.name}" ? Cette action est irréversible.`)) return;

    const result = await dispatch(rejectChannel(channel._id, reason, auth.token, auth, socket));
    
    if (result?.success) {
      showMessage('Canal rejeté avec succès', 'success');
      loadChannels(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors du rejet', 'danger');
    }
  };

  const openRejectModal = (channel) => {
    setSelectedChannel(channel);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedChannel) {
      handleReject(selectedChannel, rejectReason);
      setShowRejectModal(false);
      setSelectedChannel(null);
      setRejectReason('');
    }
  };

  const handleViewChannel = (channelId) => {
    // ✅ Navegar a la ruta de ADMIN (no a la pública)
    history.push(`/admin/channel-preview/${channelId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pendingChannels.totalPages && newPage !== currentPage) {
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

  if (pendingChannels.loading && channels.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des canaux en attente...</p>
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

      {/* Modal de rechazo */}
      {showRejectModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rejeter le canal</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Veuillez indiquer la raison du rejet pour <strong>{selectedChannel?.name}</strong> :</p>
                <textarea
                  className="form-control"
                  rows="3"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Raison du rejet..."
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                  Annuler
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmReject}>
                  Confirmer le rejet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaStore className="me-2" style={{ color: '#EC4899' }} />
                Canaux en attente d'approbation
              </h5>
              <small className="text-muted">
                Page {pendingChannels.page || 1} sur {pendingChannels.totalPages || 1} - Total: {pendingChannels.total || 0} canal(x)
              </small>
            </div>
            {channels.length > 0 && (
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
                {selectedItems.length} canal(x) sélectionné(s)
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={async () => {
                    for (const id of selectedItems) {
                      const channel = channels.find(ch => ch._id === id);
                      if (channel) {
                        await handleApprove(channel);
                      }
                    }
                  }}
                >
                  <FaCheck className="me-1" /> Approuver sélection
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    // Abrir modal para el primer canal seleccionado o mostrar modal masivo
                    if (selectedItems.length === 1) {
                      const channel = channels.find(ch => ch._id === selectedItems[0]);
                      if (channel) openRejectModal(channel);
                    } else {
                      // Opción: mostrar modal masivo o procesar uno por uno
                      if (window.confirm(`Rejeter ${selectedItems.length} canaux ?`)) {
                        selectedItems.forEach(id => {
                          const channel = channels.find(ch => ch._id === id);
                          if (channel) handleReject(channel, 'Rejeté par admin');
                        });
                      }
                    }
                  }}
                >
                  <FaTimes className="me-1" /> Rejeter sélection
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        {channels.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaStore className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucun canal en attente</h5>
            <p className="small text-muted">Tous les canaux ont été approuvés</p>
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
                    <th style={{ width: '80px' }}>Avatar</th>
                    <th>Nom du canal</th>
                    <th>Activité</th>
                    <th>Propriétaire</th>
                    <th>Localisation</th>
                    <th>Abonnés</th>
                    <th>Date création</th>
                    <th style={{ width: '140px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map(channel => (
                    <tr key={channel._id} className={selectedItems.includes(channel._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(channel._id)}
                          onChange={() => handleSelectItem(channel._id)}
                        />
                      </td>
                      <td>
                        <div
                          onClick={() => handleViewChannel(channel._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {channel.avatar ? (
                            <Image
                              src={channel.avatar}
                              width="50"
                              height="50"
                              className="rounded-circle"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', cursor: 'pointer' }}>
                              <FaStore className="text-white opacity-50" size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{channel.name}</div>
                        <small className="text-muted">{channel.slug}</small>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {channel.activity || 'N/A'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small fw-medium">{channel.owner?.username || 'N/A'}</span>
                          <small className="text-muted">{channel.owner?.email || 'N/A'}</small>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          {channel.wilaya || 'N/A'}<br />
                          {channel.commune && `${channel.commune}`}
                        </small>
                      </td>
                      <td>
                        <Badge bg="secondary" className="rounded-pill">
                          <FaUsers className="me-1" size={10} />
                          {channel.followersCount || 0}
                        </Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          <FaClock className="me-1" size={10} />
                          {formatDate(channel.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewChannel(channel._id)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(channel)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => openRejectModal(channel)}
                            title="Rejeter"
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {pendingChannels.totalPages > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(pendingChannels.page - 1)}
                      disabled={pendingChannels.page === 1}
                    />
                    {[...Array(Math.min(pendingChannels.totalPages, 5))].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={pendingChannels.page === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(pendingChannels.page + 1)}
                      disabled={pendingChannels.page === pendingChannels.totalPages}
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

export default ChannelsTable;