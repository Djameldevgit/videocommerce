import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, Button, Badge, Row, Col, 
  Accordion, ListGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionUser = ({ user, post = null }) => {
  const [showContact, setShowContact] = useState(false);
  const [showAllInfo, setShowAllInfo] = useState(false);
  
  const { auth, message } = useSelector(state => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation(['descripcion']);
  
  const isRTL = useSelector(state => state.languageReducer.language) === 'ar';

  if (!user) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center py-5">
          <span className="text-muted">👤 {t('descripcion:userNotFound')}</span>
        </Card.Body>
      </Card>
    );
  }

  // 📞 MANEJAR MOSTRAR CONTACTO
  const toggleShowContact = () => {
    setShowContact(!showContact);
  };

  // 💬 MANEJAR INICIO DE CHAT
  const handleStartChat = () => {
    if (!auth.user) {
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { error: t('descripcion:loginToChat') } 
      });
      return;
    }
    
    const chatPayload = {
      ...user,
      text: '',
      media: []
    };
    
    // Añadir info del post si existe
    if (post) {
      chatPayload.postTitle = post.title || 'Annonce';
      chatPayload.postId = post._id;
      chatPayload.postPrice = post.price;
      chatPayload.postImage = post.images?.[0]?.url;
    }
    
    dispatch({
      type: MESS_TYPES.ADD_USER,
      payload: chatPayload
    });
    
    history.push(`/message/${user._id}`);
  };

  // 📊 COMPONENTE DE LÍNEA DE INFO
  const UserInfoLine = ({ icon, label, value, badge = null, action = null }) => (
    <div className="d-flex align-items-center py-2 border-bottom">
      <div className="me-3" style={{ fontSize: '20px', width: '30px' }}>
        {icon}
      </div>
      <div className="flex-grow-1">
        <div className="fw-bold small text-muted mb-1">{label}</div>
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-medium">{value}</span>
          {badge && (
            <Badge bg={badge.color} className="ms-2 py-1">
              {badge.text}
            </Badge>
          )}
          {action && (
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="ms-2 py-0 px-2"
              onClick={action.onClick}
            >
              {action.icon} {action.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // 👤 HEADER DEL USUARIO
  const renderUserHeader = () => (
    <div className="d-flex align-items-start gap-3 mb-4">
      {/* AVATAR */}
      <div className="position-relative">
        <div 
          className="rounded-circle overflow-hidden border border-3 border-primary"
          style={{ width: '90px', height: '90px' }}
        >
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.fullname}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        {user.verified && (
          <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-white">
            <span className="text-white" style={{ fontSize: '12px' }}>✅</span>
          </div>
        )}
      </div>
      
      {/* INFO BÁSICA */}
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h4 className="fw-bold mb-1">
              {user.fullname || user.username}
              {user.verified && (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>{t('descripcion:verifiedUser')}</Tooltip>}
                >
                  <Badge bg="success" className="ms-2 py-1">
                    ✅
                  </Badge>
                </OverlayTrigger>
              )}
            </h4>
            <div className="text-muted small d-flex align-items-center gap-2">
              <span>@{user.username}</span>
              {user.memberSince && (
                <>
                  <span>•</span>
                  <span className="d-flex align-items-center gap-1">
                    🗓️ {t('descripcion:memberSince')} {new Date(user.memberSince).getFullYear()}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* BOTÓN DE CHAT */}
          {auth.user && auth.user._id !== user._id && (
            <Button 
              variant="primary" 
              className="d-flex align-items-center gap-2"
              onClick={handleStartChat}
            >
              💬 {t('descripcion:chat')}
            </Button>
          )}
        </div>
        
        {/* RATING Y ESTADÍSTICAS */}
        <div className="d-flex align-items-center gap-3 mb-2">
          {user.rating && (
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  {t('descripcion:rating')}: {user.rating}/5 ({user.ratingCount || 0} {t('descripcion:votes')})
                </Tooltip>
              }
            >
              <div className="d-flex align-items-center gap-1">
                <span className="text-warning fw-bold">⭐ {user.rating.toFixed(1)}</span>
                <span className="text-muted small">
                  ({user.ratingCount || 0})
                </span>
              </div>
            </OverlayTrigger>
          )}
          
          {user.postCount && (
            <div className="d-flex align-items-center gap-1">
              <span className="text-primary">📝</span>
              <span className="fw-bold">{user.postCount}</span>
              <span className="text-muted small">{t('descripcion:posts')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // 📱 INFORMACIÓN DE CONTACTO
  const renderContactInfo = () => {
    if (!showContact && !user.showPhonePublic) return null;

    return (
      <div className="mt-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <span className="text-primary">📞</span>
          {t('descripcion:contactInfo')}
        </h5>
        
        <Card className="border-0 bg-light">
          <Card.Body>
            <Row>
              {/* TELÉFONO */}
              {user.telephone && (
                <Col xs={12} md={6}>
                  <UserInfoLine
                    icon="📞"
                    label={t('descripcion:phone')}
                    value={user.telephonephone}
                    badge={{
                      color: 'success',
                      text: t('descripcion:verified')
                    }}
                    action={{
                      icon: '📲',
                      text: t('descripcion:call'),
                      onClick: () => window.location.href = `tel:${user.telephone}`
                    }}
                  />
                </Col>
              )}
              
              {/* EMAIL */}
              {user.email && (
                <Col xs={12} md={6}>
                  <UserInfoLine
                    icon="📧"
                    label={t('descripcion:email')}
                    value={user.email}
                    action={{
                      icon: '✉️',
                      text: t('descripcion:sendEmail'),
                      onClick: () => window.location.href = `mailto:${user.email}`
                    }}
                  />
                </Col>
              )}
              
              {/* UBICACIÓN */}
              {user.location && (
                <Col xs={12}>
                  <UserInfoLine
                    icon="📍"
                    label={t('descripcion:location')}
                    value={user.location}
                    action={{
                      icon: '🗺️',
                      text: t('descripcion:viewMap'),
                      onClick: () => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(user.location)}`;
                        window.open(mapsUrl, '_blank');
                      }
                    }}
                  />
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  };

  // ℹ️ INFORMACIÓN ADICIONAL DEL USUARIO
  const renderAdditionalInfo = () => {
    if (!showAllInfo) return null;

    return (
      <Accordion className="mt-4" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <span className="fw-bold d-flex align-items-center gap-2">
              ℹ️ {t('descripcion:moreInfo')}
            </span>
          </Accordion.Header>
          <Accordion.Body>
            {/* ABOUT */}
            {user.about && (
              <div className="mb-3">
                <h6 className="fw-bold mb-2">👤 {t('descripcion:about')}</h6>
                <p className="text-muted" style={{ lineHeight: '1.5' }}>
                  {user.about}
                </p>
              </div>
            )}
            
            {/* REDES SOCIALES */}
            {user.social && Object.keys(user.social).length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold mb-2">🌐 {t('descripcion:socialNetworks')}</h6>
                <div className="d-flex flex-wrap gap-2">
                  {user.social.facebook && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      href={user.social.facebook}
                      target="_blank"
                    >
                      👤 Facebook
                    </Button>
                  )}
                  
                  {user.social.instagram && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      href={user.social.instagram}
                      target="_blank"
                    >
                      📸 Instagram
                    </Button>
                  )}
                  
                  {user.social.twitter && (
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      href={user.social.twitter}
                      target="_blank"
                    >
                      🐦 Twitter
                    </Button>
                  )}
                  
                  {user.website && (
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      href={user.website}
                      target="_blank"
                    >
                      🌐 Website
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* ESTADÍSTICAS */}
            <div className="mt-3">
              <h6 className="fw-bold mb-2">📊 {t('descripcion:statistics')}</h6>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span className="d-flex align-items-center gap-2">
                    📅 {t('descripcion:memberSince')}
                  </span>
                  <Badge bg="light" text="dark">
                    {user.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'N/A'}
                  </Badge>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span className="d-flex align-items-center gap-2">
                    👁️ {t('descripcion:profileViews')}
                  </span>
                  <Badge bg="info">
                    {(user.profileViews || 0).toLocaleString()}
                  </Badge>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                  <span className="d-flex align-items-center gap-2">
                    ⭐ {t('descripcion:responseRate')}
                  </span>
                  <Badge bg="success">
                    {user.responseRate || '90'}%
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  // 🎯 BOTONES DE ACCIÓN
  const renderActionButtons = () => (
    <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
      {/* BOTÓN MOSTRAR CONTACTO */}
      {!showContact && (
        <Button 
          variant="outline-primary"
          className="d-flex align-items-center gap-2"
          onClick={toggleShowContact}
        >
          {showContact ? '👁️‍🗨️' : '📞'} 
          {showContact ? t('descripcion:hideContact') : t('descripcion:showContact')}
        </Button>
      )}
      
      {/* BOTÓN VER MÁS INFO */}
      <Button 
        variant="outline-secondary"
        className="d-flex align-items-center gap-2"
        onClick={() => setShowAllInfo(!showAllInfo)}
      >
        {showAllInfo ? '👆' : '👇'} 
        {showAllInfo ? t('descripcion:lessInfo') : t('descripcion:moreInfo')}
      </Button>
      
      {/* BOTÓN VER PERFIL COMPLETO */}
      <Button 
        variant="outline-info"
        className="d-flex align-items-center gap-2"
        href={`/user/${user._id}`}
      >
        👤 {t('descripcion:viewProfile')}
      </Button>
      
      {/* BOTÓN REPORTAR */}
      {auth.user && auth.user._id !== user._id && (
        <Button 
          variant="outline-danger"
          className="d-flex align-items-center gap-2"
          onClick={() => {/* Lógica para reportar usuario */}}
        >
          ⚠️ {t('descripcion:reportUser')}
        </Button>
      )}
    </div>
  );

  return (
    <Card className="border-0 shadow-sm mb-4" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Card.Body className="p-4">
        {/* HEADER */}
        {renderUserHeader()}
        
        {/* CONTACTO */}
        {renderContactInfo()}
        
        {/* INFO ADICIONAL */}
        {renderAdditionalInfo()}
        
        {/* BOTONES DE ACCIÓN */}
        {renderActionButtons()}
      </Card.Body>
      
      {/* FOOTER CON INFO RÁPIDA */}
      <Card.Footer className="bg-light d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          {user.postCount ? (
            <span className="d-flex align-items-center gap-1">
              📝 {user.postCount} {t('descripcion:postsActive')}
            </span>
          ) : (
            <span>👤 {t('descripcion:newUser')}</span>
          )}
        </div>
        
        <div className="text-muted small">
          {user.lastActive ? (
            <span className="d-flex align-items-center gap-1">
              🕐 {t('descripcion:lastActive')}: {new Date(user.lastActive).toLocaleDateString()}
            </span>
          ) : (
            <span>🟢 {t('descripcion:online')}</span>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default DescriptionUser;