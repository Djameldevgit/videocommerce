// 📁 src/components/post/UserInfo.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const UserInfo = ({ post }) => {
  const { auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  
  // Extraer datos del usuario
  const user = post?.user || {};
  
  // Extraer datos del post
  const postData = {
    username: user.username || 'Utilisateur',
    wilaya: post?.wilaya || post?.categorySpecificData?.wilaya || '',
    commune: post?.commune || post?.categorySpecificData?.commune || '',
    telephone: post?.telephone || post?.categorySpecificData?.telephone || ''
  };
  
  // Formatear teléfono
  const formatPhone = (phone) => {
    if (!phone) return 'Non spécifié';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return `+213 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }
    return phone;
  };
  
  // Manejar llamada
  const handleCall = () => {
    if (!postData.telephone) return;
    const cleanNumber = postData.telephone.replace(/\D/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };
  
  // Manejar mensaje
  const handleMessage = () => {
    if (!auth.user) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Connectez-vous pour envoyer un message' }
      });
      return;
    }
    
    if (!user._id || auth.user._id === user._id) return;
    
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: {
        ...user,
        text: '',
        media: [],
        postTitle: post?.title || 'Annonce',
        postId: post?._id,
        postPrice: post?.price,
        postImage: post?.images?.[0]?.url
      }
    });
    
    history.push(`/message/${user._id}`);
  };
  
  return (
    <Card className="border-0 shadow-sm mb-4">
      {/* Título del Card */}
      <Card.Header className="bg-white border-bottom py-3">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="fas fa-id-card text-primary me-2"></i>
          Contact & Coordonnées
        </h5>
      </Card.Header>
      
      <Card.Body className="p-0">
        {/* Fila 1: Usuario - MISMA LÍNEA */}
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                <i className="fas fa-user"></i>
              </div>
              <span className="text-muted me-2">Annonceur:</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold text-dark">{postData.username}</span>
              {user.verified && (
                <Badge bg="success" className="ms-2">
                  <i className="fas fa-check-circle me-1"></i>
                  Vérifié
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Fila 2: Localización - MISMA LÍNEA */}
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span className="text-muted me-2">Localisation:</span>
            </div>
            <span className="fw-bold text-dark">
              {postData.wilaya && postData.commune 
                ? `${postData.wilaya}, ${postData.commune}`
                : postData.wilaya || postData.commune || 'Non spécifié'
              }
            </span>
          </div>
        </div>
        
        {/* Fila 3: Teléfono - MISMA LÍNEA */}
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                <i className="fas fa-phone"></i>
              </div>
              <span className="text-muted me-2">Téléphone:</span>
            </div>
            <div className="d-flex align-items-center">
              <span className="fw-bold text-dark me-2">
                {formatPhone(postData.telephone)}
              </span>
              {postData.telephone && (
                <Button 
                  variant="success" 
                  size="sm" 
                  className="py-1 px-2"
                  onClick={handleCall}
                >
                  <i className="fas fa-phone"></i>
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Fila 4: Mensaje - MISMA LÍNEA */}
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                <i className="fas fa-comment"></i>
              </div>
              <span className="text-muted me-2">Message:</span>
            </div>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleMessage}
              disabled={!auth.user || auth.user._id === user._id}
              className="py-1"
            >
              <i className="fas fa-paper-plane me-1"></i>
              Envoyer
            </Button>
          </div>
          
          {/* Mensajes informativos debajo */}
          {!auth.user && (
            <div className="text-danger small mt-2 text-end">
              <i className="fas fa-info-circle me-1"></i>
              Connectez-vous
            </div>
          )}
          {auth.user && auth.user._id === user._id && (
            <div className="text-info small mt-2 text-end">
              <i className="fas fa-info-circle me-1"></i>
              Votre annonce
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserInfo;