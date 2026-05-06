// 📂 pages/aprobacionAdministration/AprobacionContent.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spinner, Badge } from 'react-bootstrap';
import { FaVideo, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AprobacionContent = ({ selectedCategory }) => {
  const { auth } = useSelector(state => state);
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1
  });
  
  // Estados locales para manejar la aprobación/rechazo
  const [processingId, setProcessingId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const getTitle = () => {
    if (selectedCategory && selectedCategory.slug) {
      return `Vidéos pendantes - ${selectedCategory.name}`;
    }
    return 'Toutes les vidéos en attente d\'approbation';
  };
  
  // Función para aprobar video
  const handleApprove = async (video) => {
    if (!window.confirm(`Approuver la vidéo "${video.title}" ?`)) return;
    
    setProcessingId(video._id);
    try {
      // TODO: Conectar con tu backend de videos
      console.log('Aprobar video:', video._id);
      // const res = await fetch(`/api/videos/admin/aprobar/${video._id}`, {
      //   method: 'PUT',
      //   headers: { 'Authorization': `Bearer ${auth.token}` }
      // });
      // if (res.ok) {
      //   setVideos(prev => prev.filter(v => v._id !== video._id));
      // }
    } catch (error) {
      console.error('Error al aprobar:', error);
    } finally {
      setProcessingId(null);
    }
  };
  
  // Función para rechazar video
  const handleReject = async (video) => {
    if (!window.confirm(`Rejeter la vidéo "${video.title}" ?`)) return;
    
    setProcessingId(video._id);
    try {
      // TODO: Conectar con tu backend de videos
      console.log('Rechazar video:', video._id);
      // const res = await fetch(`/api/videos/admin/rechazar/${video._id}`, {
      //   method: 'DELETE',
      //   headers: { 'Authorization': `Bearer ${auth.token}` }
      // });
      // if (res.ok) {
      //   setVideos(prev => prev.filter(v => v._id !== video._id));
      // }
    } catch (error) {
      console.error('Error al rechazar:', error);
    } finally {
      setProcessingId(null);
    }
  };
  
  // Ver video
  const handleViewVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">{getTitle()}</h4>
          <p className="text-muted small mb-0">Validez les vidéos mises en ligne par les utilisateurs</p>
        </div>
        <Badge bg="primary" pill className="px-3 py-2">
          Total: {pagination.total} vidéos
        </Badge>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement des vidéos...</p>
        </div>
      ) : (
        <>
          {videos.length === 0 ? (
            <div className="text-center py-5">
              <FaVideo size={50} className="text-muted mb-3" />
              <h5>Aucune vidéo en attente</h5>
              <p className="text-muted">Toutes les vidéos ont été traitées</p>
            </div>
          ) : (
            <div className="videos-pendientes-grid">
              {videos.map(video => (
                <div key={video._id} className="video-card">
                  {/* Miniatura del video */}
                  <div className="video-thumbnail" onClick={() => handleViewVideo(video)}>
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} />
                    ) : (
                      <div className="video-placeholder">
                        <FaVideo size={40} />
                      </div>
                    )}
                    <div className="video-play-overlay">
                      <FaVideo />
                    </div>
                  </div>
                  
                  {/* Info del video */}
                  <div className="video-info">
                    <h6 className="video-title">{video.title}</h6>
                    <p className="video-description">{video.description?.substring(0, 80)}...</p>
                    <div className="video-meta">
                      <span>👤 {video.user?.name || video.user?.username}</span>
                      <span>📅 {new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Botones de acción */}
                  <div className="video-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(video)}
                      disabled={processingId === video._id}
                    >
                      {processingId === video._id ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <FaCheckCircle /> Approuver
                        </>
                      )}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(video)}
                      disabled={processingId === video._id}
                    >
                      <FaTimesCircle /> Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="pagination-container mt-4">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Précédent
              </button>
              <span>Page {pagination.page} sur {pagination.totalPages}</span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Modal para ver el video */}
      {showVideoModal && selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h5>{selectedVideo.title}</h5>
              <button onClick={() => setShowVideoModal(false)}>✕</button>
            </div>
            <div className="video-modal-body">
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                style={{ width: '100%', maxHeight: '70vh' }}
              />
              <div className="video-modal-info mt-3">
                <p><strong>Description:</strong> {selectedVideo.description}</p>
                <p><strong>Utilisateur:</strong> {selectedVideo.user?.name || selectedVideo.user?.username}</p>
                <p><strong>Mis en ligne:</strong> {new Date(selectedVideo.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="video-modal-footer">
              <button className="btn-approve" onClick={() => {
                handleApprove(selectedVideo);
                setShowVideoModal(false);
              }}>
                Approuver
              </button>
              <button className="btn-reject" onClick={() => {
                handleReject(selectedVideo);
                setShowVideoModal(false);
              }}>
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AprobacionContent;