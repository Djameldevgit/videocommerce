import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaVideo, FaClock } from 'react-icons/fa';
import { getVideosPendientes, aprobarVideo, eliminarVideo } from '../../../redux/actions/videoApproveAction';
import { getVideoByIdPrivate } from '../../../redux/actions/videoAction';

const VideosTable = ({ onLoadingChange, onPaginationUpdate }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { videos = [], loading = false, total = 0, page = 1, totalPages = 1 } = useSelector(state => state.videoApprove || {});

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
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
      onLoadingChangeRef.current(loading);
    }
  }, [loading]);

  // Notificar paginación sin causar bucles
  useEffect(() => {
    if (onPaginationUpdateRef.current && total > 0) {
      onPaginationUpdateRef.current({ total, page, totalPages });
    }
  }, [total, page, totalPages]);

  // Cargar videos solo cuando cambia currentPage
  const loadVideos = useCallback((pageNum) => {
    if (auth?.token) {
      dispatch(getVideosPendientes(auth.token, pageNum, limit));
    }
  }, [dispatch, auth?.token, limit]);

  // Efecto de carga inicial y cambio de página
  useEffect(() => {
    if (!hasLoadedRef.current || currentPage !== page) {
      loadVideos(currentPage);
      hasLoadedRef.current = true;
    }
  }, [currentPage, loadVideos, page]);

  // Reset selección cuando cambian los videos
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [videos.length]);

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(videos.map(v => v._id));
    }
    setSelectAll(!selectAll);
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  const handleApprove = async (video) => {
    if (!window.confirm(`Approuver la vidéo "${video.title}" ? Elle sera visible sur le site.`)) return;

    const result = await dispatch(aprobarVideo(video._id, auth.token, auth, socket, video));
    if (result?.success) {
      showMessage('Vidéo approuvée avec succès', 'success');
      loadVideos(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de l\'approbation', 'danger');
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`Supprimer définitivement la vidéo "${video.title}" ? Cette action est irréversible.`)) return;

    const result = await dispatch(eliminarVideo(video._id, auth.token, auth, socket, video));
    if (result?.success) {
      showMessage('Vidéo supprimée', 'warning');
      loadVideos(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de la suppression', 'danger');
    }
  };

  const handleViewVideo = async (videoId) => {
    try {
      const result = await dispatch(getVideoByIdPrivate(videoId, auth.token));
      if (result?.success) {
        history.push(`/video/${videoId}`);
      } else {
        showMessage('Impossible de voir la vidéo en attente', 'warning');
      }
    } catch (error) {
      console.error('Error viewing video:', error);
      showMessage('Erreur lors du chargement de la vidéo', 'danger');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (loading && videos.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des vidéos en attente...</p>
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
                <FaVideo className="me-2" style={{ color: '#EC4899' }} />
                Vidéos en attente  
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total: {total} vidéo(s)
              </small>
            </div>
            {videos.length > 0 && (
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
                {selectedItems.length} vidéo(s) sélectionnée(s)
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const video = videos.find(v => v._id === id);
                      if (video) handleApprove(video);
                    });
                  }}
                >
                  <FaCheck className="me-1" /> Approuver sélection
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const video = videos.find(v => v._id === id);
                      if (video) handleDelete(video);
                    });
                  }}
                >
                  <FaTrash className="me-1" /> Supprimer sélection
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        {videos.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaVideo className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucune vidéo en attente</h5>
            <p className="small text-muted">Toutes les vidéos ont été approuvées</p>
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
                    <th style={{ width: '80px' }}>Miniature</th>
                    <th>Titre</th>
                    <th>Propriétaire</th>
                    <th>Catégorie</th>
                    <th>Durée</th>
                    <th>Vues</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video._id} className={selectedItems.includes(video._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(video._id)}
                          onChange={() => handleSelectItem(video._id)}
                        />
                      </td>
                      <td>
                        <div 
                          onClick={() => handleViewVideo(video._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {video.thumbnail ? (
                            <Image
                              src={video.thumbnail}
                              width="60"
                              height="40"
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px', cursor: 'pointer' }}>
                              <FaVideo className="text-white opacity-50" size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{video.title?.substring(0, 40)}</div>
                        <small className="text-muted">{video.videoType}</small>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small fw-medium">{video.user?.username || 'N/A'}</span>
                          <small className="text-muted">{video.user?.email}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {video.category}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="secondary" className="rounded-pill">
                          <FaClock className="me-1" size={10} />
                          {formatDuration(video.duration)}
                        </Badge>
                      </td>
                      <td>
                        <small>{video.views || 0} vues</small>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(video.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewVideo(video._id)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(video)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(video)}
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

export default VideosTable;