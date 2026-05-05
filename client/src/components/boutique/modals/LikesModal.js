// components/boutique/modals/LikesModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, Image, Spinner, Badge } from 'react-bootstrap';
import { FaHeart, FaUser } from 'react-icons/fa';

const LikesModal = ({ show, onHide, boutiqueId, boutiqueName, token }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && boutiqueId) {
      loadLikes();
    }
  }, [show, boutiqueId]);

  const loadLikes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/boutique/${boutiqueId}/likes/list`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setLikes(data.likes || []);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger la liste des likes');
      console.error('Error loading likes:', err);
    } finally {
      setLoading(false);
    }
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
          <div className="modal-icon bg-danger bg-opacity-10 p-2 rounded-circle">
            <FaHeart className="text-danger" size={18} />
          </div>
          <div>
            <h5 className="mb-0">J'aime</h5>
            <small className="text-muted fw-normal">
              {boutiqueName} • {likes.length} {likes.length > 1 ? 'likes' : 'like'}
            </small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" size="sm" />
            <p className="text-muted small mt-2 mb-0">Chargement des likes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-danger mb-2">⚠️</div>
            <p className="text-muted small mb-0">{error}</p>
            <Button 
              variant="link" 
              size="sm" 
              onClick={loadLikes}
              className="mt-2 p-0"
            >
              Réessayer
            </Button>
          </div>
        ) : likes.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state-icon mb-3">💔</div>
            <p className="text-muted mb-0">Aucun like pour le moment</p>
            <small className="text-muted">Soyez le premier à aimer cette boutique !</small>
          </div>
        ) : (
          <ListGroup variant="flush" className="likes-list">
            {likes.map((like) => (
              <ListGroup.Item 
                key={like._id} 
                className="d-flex align-items-center gap-3 border-0 py-3 px-0 like-item"
              >
                <div className="flex-shrink-0">
                  {like.avatar ? (
                    <Image 
                      src={like.avatar} 
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
                    {like.name || like.username || 'Utilisateur'}
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <small className="text-muted">
                      @{like.username || 'utilisateur'}
                    </small>
                    {like.createdAt && (
                      <small className="text-muted d-flex align-items-center gap-1">
                        <FaHeart size={10} className="text-danger" />
                        {new Date(like.createdAt).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </small>
                    )}
                  </div>
                </div>
                <div className="heart-animation">
                  <FaHeart className="text-danger" size={16} />
                </div>
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
        .like-item {
          transition: all 0.2s ease;
        }
        .like-item:hover {
          background-color: #fff5f5;
          transform: translateX(2px);
        }
        .heart-animation {
          animation: pulse 1s ease;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
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

export default LikesModal;