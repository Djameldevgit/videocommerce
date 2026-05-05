// components/boutique/modals/FollowersModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup, Image, Spinner, Badge } from 'react-bootstrap';
import { FaUserFriends, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { followBoutique } from '../../../redux/actions/boutiqueAction';

const FollowersModal = ({ show, onHide, boutiqueId, boutiqueName, token, auth }) => {
  const dispatch = useDispatch();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followingUser, setFollowingUser] = useState({});

  const { user } = useSelector(state => state.auth || {});
  const isAuthenticated = !!user;

  useEffect(() => {
    if (show && boutiqueId) {
      loadFollowers();
    }
  }, [show, boutiqueId]);

  const loadFollowers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/boutique/${boutiqueId}/followers/list`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setFollowers(data.followers || []);
      } else {
        setError(data.message || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger la liste des followers');
      console.error('Error loading followers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUser = async (userId, currentFollowing) => {
    if (!isAuthenticated) {
      alert('Veuillez vous connecter pour suivre cet utilisateur');
      return;
    }

    // Simular seguimiento (esto requeriría un endpoint de usuario)
    // Por ahora solo mostramos feedback visual
    setFollowingUser(prev => ({
      ...prev,
      [userId]: !currentFollowing
    }));
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
          <div className="modal-icon bg-success bg-opacity-10 p-2 rounded-circle">
            <FaUserFriends className="text-success" size={18} />
          </div>
          <div>
            <h5 className="mb-0">Followers</h5>
            <small className="text-muted fw-normal">
              {boutiqueName} • {followers.length} follower{followers.length > 1 ? 's' : ''}
            </small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-2">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" size="sm" />
            <p className="text-muted small mt-2 mb-0">Chargement des followers...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-danger mb-2">⚠️</div>
            <p className="text-muted small mb-0">{error}</p>
            <Button 
              variant="link" 
              size="sm" 
              onClick={loadFollowers}
              className="mt-2 p-0"
            >
              Réessayer
            </Button>
          </div>
        ) : followers.length === 0 ? (
          <div className="text-center py-5">
            <div className="empty-state-icon mb-3">👥</div>
            <p className="text-muted mb-0">Aucun follower pour le moment</p>
            <small className="text-muted">Soyez le premier à suivre cette boutique !</small>
          </div>
        ) : (
          <ListGroup variant="flush" className="followers-list">
            {followers.map((follower) => (
              <ListGroup.Item 
                key={follower._id} 
                className="d-flex align-items-center gap-3 border-0 py-3 px-0 follower-item"
              >
                <div className="flex-shrink-0">
                  {follower.avatar ? (
                    <Image 
                      src={follower.avatar} 
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
                      <FaUserFriends className="text-secondary" size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-grow-1">
                  <div className="fw-semibold">
                    {follower.name || follower.username || 'Utilisateur'}
                  </div>
                  <small className="text-muted">
                    @{follower.username || 'utilisateur'}
                  </small>
                </div>
                {isAuthenticated && follower._id !== user?._id && (
                  <Button
                    variant={followingUser[follower._id] ? 'success' : 'outline-primary'}
                    size="sm"
                    className="rounded-pill px-3 follow-btn"
                    onClick={() => handleFollowUser(follower._id, followingUser[follower._id])}
                  >
                    {followingUser[follower._id] ? (
                      <><FaUserCheck size={12} className="me-1" /> Suivi</>
                    ) : (
                      <><FaUserPlus size={12} className="me-1" /> Suivre</>
                    )}
                  </Button>
                )}
                {follower._id === user?._id && (
                  <Badge 
                    bg="secondary" 
                    className="rounded-pill px-3 py-1"
                    style={{ fontSize: '0.7rem' }}
                  >
                    Vous
                  </Badge>
                )}
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
        .follower-item {
          transition: all 0.2s ease;
        }
        .follower-item:hover {
          background-color: #f8f9fa;
          transform: translateX(2px);
        }
        .follow-btn {
          transition: all 0.2s ease;
        }
        .follow-btn:hover {
          transform: scale(1.02);
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

export default FollowersModal;