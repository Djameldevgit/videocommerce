// components/boutique/modals/ViewersModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, Image, Spinner, Badge } from 'react-bootstrap';
import { FaEye, FaUser, FaClock } from 'react-icons/fa';

const ViewersModal = ({ show, onHide, boutiqueId, boutiqueName, token }) => {
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && boutiqueId) {
      loadViewers();
    }
  }, [show, boutiqueId]);

  const loadViewers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/boutique/${boutiqueId}/viewers`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setViewers(data.viewers || []);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger la liste des vues');
      console.error('Error loading viewers:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000 / 60 / 60); // horas
    
    if (diff < 1) return 'À l\'instant';
    if (diff < 24) return `Il y a ${diff} heure${diff > 1 ? 's' : ''}`;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="md"
      className="boutique-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-2">
          <div className="modal-icon bg-primary bg-opacity-10 p-2 rounded-circle">
            <FaEye className="text-primary" size={18} />
          </div>
          <div>
            <h5 className="mb-0">Vues de la boutique</h5>
            <small className="text-muted fw-normal">
              {boutiqueName} • {viewers.length} vue{viewers.length > 1 ? 's' : ''}
            </small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="sm" />
            <p className="text-muted small mt-2 mb-0">Chargement des vues...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-danger mb-2">⚠️</div>
            <p className="text-muted small mb-0">{error}</p>
            <Button 
              variant="link" 
              size="sm" 
              onClick={loadViewers}
              className="mt-2 p-0"
            >
              Réessayer
            </Button>
          </div>
        ) : viewers.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state-icon mb-3">👀</div>
            <p className="text-muted mb-0">Aucune vue pour le moment</p>
            <small className="text-muted">Les vues apparaîtront ici</small>
          </div>
        ) : (
          <ListGroup variant="flush" className="viewers-list">
            {viewers.map((viewer, idx) => (
              <ListGroup.Item 
                key={viewer._id || idx} 
                className="d-flex align-items-center gap-3 border-0 py-3 px-0 viewer-item"
              >
                <div className="flex-shrink-0">
                  {viewer.avatar ? (
                    <Image 
                      src={viewer.avatar} 
                      width={44} 
                      height={44} 
                      roundedCircle 
                      className="object-fit-cover"
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle bg-light"
                      style={{ width: 44, height: 44 }}
                    >
                      <FaUser className="text-secondary" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">
                    {viewer.name || viewer.username || 'Utilisateur'}
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-1">
                    <small className="text-muted">
                      @{viewer.username || 'utilisateur'}
                    </small>
                    {viewer.timestamp && (
                      <small className="text-muted d-flex align-items-center gap-1">
                        <FaClock size={10} />
                        {formatDate(viewer.timestamp)}
                      </small>
                    )}
                  </div>
                </div>
                <Badge 
                  bg="light" 
                  text="dark" 
                  className="rounded-pill px-3 py-1"
                  style={{ fontSize: '0.7rem' }}
                >
                  Visiteur
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button 
          variant="light" 
          onClick={onHide}
          className="px-4 rounded-pill"
        >
          Fermer
        </Button>
      </Modal.Footer>

      <style jsx>{`
        .viewer-item {
          transition: background-color 0.2s ease;
        }
        .viewer-item:hover {
          background-color: #f8f9fa;
        }
        .empty-state-icon {
          font-size: 3rem;
          opacity: 0.5;
        }
        .object-fit-cover {
          object-fit: cover;
        }
      `}</style>
    </Modal>
  );
};

export default ViewersModal;