import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Alert, Spinner, Image } from 'react-bootstrap';
import { FaBell, FaCheckDouble, FaTrash, FaEye, FaUserPlus, FaHeart, FaComment, FaStore, FaBox, FaVideo } from 'react-icons/fa';
import { getNotifies, isReadNotify, deleteAllNotifies, NOTIFY_TYPES } from '../../redux/actions/notifyAction';
import moment from 'moment';

const NotifyPage = () => {
  const dispatch = useDispatch();
  const { auth, notify, socket } = useSelector(state => state);
  const { data: notifies = [], loading = false } = notify;

  const [message, setMessage] = useState({ show: false, text: '', type: '' });

  // ✅ Cargar notificaciones
  const loadNotifies = useCallback(() => {
    if (auth?.token) {
      dispatch(getNotifies(auth.token));
    }
  }, [dispatch, auth?.token]);

  useEffect(() => {
    loadNotifies();
  }, [loadNotifies]);

  // ✅ ESCUCHAR NOTIFICACIONES EN TIEMPO REAL - TOTALMENTE BLINDADO
  useEffect(() => {
    // ✅ Validación completa
    if (!socket) return;
    if (!auth) return;
    if (!auth.user) return;
    if (!auth.user._id) return;

    const userId = auth.user._id; // Guardar en variable para evitar problemas

    const handleNewNotify = (newNotify) => {
      console.log('🔔 Nueva notificación recibida:', newNotify);
      
      // ✅ Validar que la notificación es para este usuario
      if (newNotify && newNotify.recipients && Array.isArray(newNotify.recipients)) {
        if (newNotify.recipients.includes(userId)) {
          dispatch({
            type: NOTIFY_TYPES.CREATE_NOTIFY,
            payload: newNotify
          });
          
          setMessage({ 
            show: true, 
            text: 'Nouvelle notification reçue', 
            type: 'info' 
          });
          setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
        }
      }
    };

    socket.on('createNotify', handleNewNotify);

    return () => {
      socket.off('createNotify', handleNewNotify);
    };
  }, [socket, dispatch, auth]);

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  // ✅ Marcar como leída
  const handleMarkAsRead = async (notify) => {
    if (!notify.isRead && auth?.token) {
      await dispatch(isReadNotify({ msg: notify, auth }));
    }
  };

  // ✅ Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    if (!auth?.token) return;
    
    const unreadNotifies = notifies.filter(n => !n.isRead);
    for (const notify of unreadNotifies) {
      await dispatch(isReadNotify({ msg: notify, auth }));
    }
    showMessage('Toutes les notifications ont été marquées comme lues', 'success');
  };

  // ✅ Eliminar todas las notificaciones
  const handleDeleteAll = async () => {
    if (!auth?.token) return;
    if (!window.confirm('Supprimer toutes les notifications ? Cette action est irréversible.')) return;
    
    await dispatch(deleteAllNotifies(auth.token));
    showMessage('Toutes les notifications ont été supprimées', 'warning');
  };

  // ✅ Obtener icono según tipo de notificación
  const getNotifyIcon = (type) => {
    switch (type) {
      case 'follow':
        return <FaUserPlus className="text-primary" size={18} />;
      case 'like':
        return <FaHeart className="text-danger" size={18} />;
      case 'comment':
        return <FaComment className="text-success" size={18} />;
      case 'boutique':
        return <FaStore className="text-warning" size={18} />;
      case 'product':
        return <FaBox className="text-info" size={18} />;
      case 'video':
        return <FaVideo className="text-purple" size={18} />;
      case 'post':
        return <FaBell className="text-primary" size={18} />;
      case 'post_pending':
        return <FaBell className="text-warning" size={18} />;
      default:
        return <FaBell className="text-secondary" size={18} />;
    }
  };

  // ✅ Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).fromNow();
  };

  // ✅ MOSTRAR LOADER MIENTRAS NO HAY USUARIO
  if (!auth || !auth.user || !auth.user._id) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de l'utilisateur...</p>
      </Card>
    );
  }

  if (loading && notifies.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des notifications...</p>
      </Card>
    );
  }

  // ✅ Estadísticas - Con validación
  const unreadCount = notifies.filter(n => n && !n.isRead).length;

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
                <FaBell className="me-2" style={{ color: '#EC4899' }} />
                Notifications
                {unreadCount > 0 && (
                  <Badge bg="danger" className="ms-2 rounded-pill">
                    {unreadCount} non lue(s)
                  </Badge>
                )}
              </h5>
              <small className="text-muted">
                {notifies.length} notification(s) au total
              </small>
            </div>
            <div className="d-flex gap-2">
              {notifies.length > 0 && unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={handleMarkAllAsRead}
                  title="Marquer tout comme lu"
                >
                  <FaCheckDouble className="me-1" /> Tout marquer lu
                </Button>
              )}
              {notifies.length > 0 && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={handleDeleteAll}
                  title="Supprimer toutes"
                >
                  <FaTrash className="me-1" /> Tout supprimer
                </Button>
              )}
            </div>
          </div>
        </Card.Header>

        {notifies.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaBell className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucune notification</h5>
            <p className="small text-muted">Vous serez notifié lorsqu'il y aura des activités</p>
          </Card.Body>
        ) : (
          <div className="list-group list-group-flush">
            {notifies.map(notify => {
              // ✅ Validar que notify existe
              if (!notify || !notify._id) return null;
              
              return (
                <Link
                  key={notify._id}
                  to={notify.url || '#'}
                  className={`list-group-item list-group-item-action border-0 ${!notify.isRead ? 'bg-light' : ''}`}
                  style={{
                    padding: '16px 20px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                  }}
                  onClick={() => handleMarkAsRead(notify)}
                >
                  <div className="d-flex gap-3 align-items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {notify.user?.avatar ? (
                        <Image
                          src={notify.user.avatar}
                          width="45"
                          height="45"
                          className="rounded-circle"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                          {getNotifyIcon(notify.type)}
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <span className="fw-bold">
                            {notify.user?.username || 'Utilisateur'}
                          </span>
                          <span className="text-muted ms-1">
                            {notify.text || 'Vous a envoyé une notification'}
                          </span>
                        </div>
                        <small className="text-muted flex-shrink-0">
                          {formatDate(notify.createdAt)}
                        </small>
                      </div>
                      
                      {/* Contenido adicional */}
                      {notify.content && (
                        <p className="mb-1 text-muted small">
                          "{notify.content.length > 50 
                            ? notify.content.substring(0, 50) + '...' 
                            : notify.content}"
                        </p>
                      )}
                      
                      {/* Imagen de la notificación */}
                      {notify.image && (
                        <Image 
                          src={notify.image} 
                          width="40" 
                          height="40" 
                          className="rounded mt-2"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                      
                      {/* Indicador de no leído */}
                      {!notify.isRead && (
                        <Badge bg="primary" pill className="mt-2">
                          Nouveau
                        </Badge>
                      )}
                    </div>

                    {/* Icono de acción */}
                    <div className="flex-shrink-0">
                      {getNotifyIcon(notify.type)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
};

export default NotifyPage;