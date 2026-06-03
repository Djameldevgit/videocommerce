// frontend/src/components/adminitration/adminApove/AdminChannelPreview.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Image, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaCheck, FaTimes, FaClock, FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { getPendingChannelById } from '../../redux/actions/channelAction';

const AdminChannelPreview = () => {
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { pendingChannel, pendingLoading, error } = useSelector(state => state.channel);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Verificar que el usuario es admin
    const user = auth?.user;
    if (!user || user.role !== 'admin') {
      history.push('/');
      return;
    }
    
    if (id && auth?.token) {
      console.log('📺 Cargando canal pendiente ID:', id);
      console.log('🔑 Token disponible:', !!auth?.token);
      dispatch(getPendingChannelById(auth.token, id));
    }
  }, [id, auth?.token, dispatch, history]);

  const handleApprove = async () => {
    if (!window.confirm(`¿Aprobar el canal "${pendingChannel?.name}"?`)) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/channels/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Canal aprobado exitosamente');
        history.push('/admin/dashboard');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Razón del rechazo:');
    if (!reason) return;
    
    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/channels/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('❌ Canal rechazado');
        history.push('/admin/dashboard');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (pendingLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando detalles del canal...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error</h5>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => history.push('/admin/dashboard')}>
            <FaArrowLeft className="me-2" /> Volver al Dashboard
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!pendingChannel) return null;

  // Obtener URLs de imágenes
  const avatarUrl = pendingChannel.avatar?.[0]?.url || pendingChannel.avatar || 'https://via.placeholder.com/150';
  const coverUrl = pendingChannel.cover?.[0]?.url || pendingChannel.cover || 'https://via.placeholder.com/1200x300';

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="mb-4">
        <Button variant="outline-secondary" onClick={() => history.push('/admin/dashboard')} className="mb-3">
          <FaArrowLeft className="me-2" /> Volver al Dashboard
        </Button>
        
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="mb-2">
              {pendingChannel.name}
              <Badge bg="warning" text="dark" className="ms-3">
                <FaClock className="me-1" /> Pendiente de Aprobación
              </Badge>
            </h1>
            <p className="text-muted">
              <FaStore className="me-1" /> Canal en revisión - Solo visible para administradores
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <Button variant="success" size="lg" onClick={handleApprove} disabled={actionLoading}>
              <FaCheck className="me-2" /> Aprobar Canal
            </Button>
            <Button variant="danger" size="lg" onClick={handleReject} disabled={actionLoading}>
              <FaTimes className="me-2" /> Rechazar Canal
            </Button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="position-relative mb-5">
        <div 
          style={{
            height: '300px',
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '15px',
            backgroundColor: '#f0f0f0'
          }}
        />
        <div style={{ position: 'absolute', bottom: '-60px', left: '40px' }}>
          <Image
            src={avatarUrl}
            width="120"
            height="120"
            className="rounded-circle border border-4 border-white shadow"
            style={{ objectFit: 'cover', backgroundColor: 'white' }}
          />
        </div>
      </div>

      {/* Contenido */}
      <Row className="mt-5 pt-3">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h4 className="mb-3">Información del Canal</h4>
              
              <Row className="mb-3">
                <Col md={3}><strong>Nombre:</strong></Col>
                <Col md={9}>{pendingChannel.name}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={3}><strong>Slug:</strong></Col>
                <Col md={9}><code>/{pendingChannel.slug}</code></Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={3}><strong>Actividad:</strong></Col>
                <Col md={9}><Badge bg="info">{pendingChannel.activity}</Badge></Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={3}><strong>Descripción:</strong></Col>
                <Col md={9}>{pendingChannel.description || 'Sin descripción'}</Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={3}><strong>Ubicación:</strong></Col>
                <Col md={9}>
                  <FaMapMarkerAlt className="me-1 text-primary" />
                  {pendingChannel.wilaya}, {pendingChannel.commune}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Información de Contacto</h4>
              
              {pendingChannel.email && (
                <Row className="mb-3">
                  <Col md={3}><strong><FaEnvelope className="me-2" />Email:</strong></Col>
                  <Col md={9}>{pendingChannel.email}</Col>
                </Row>
              )}
              
              {pendingChannel.phone && (
                <Row className="mb-3">
                  <Col md={3}><strong><FaPhone className="me-2" />Teléfono:</strong></Col>
                  <Col md={9}>{pendingChannel.phone}</Col>
                </Row>
              )}
              
              {pendingChannel.website && (
                <Row className="mb-3">
                  <Col md={3}><strong>Sitio web:</strong></Col>
                  <Col md={9}>
                    <a href={pendingChannel.website} target="_blank" rel="noopener noreferrer">
                      {pendingChannel.website}
                    </a>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-primary bg-opacity-10">
              <h5 className="mb-0">
                <FaUser className="me-2" /> Propietario
              </h5>
            </Card.Header>
            <Card.Body className="text-center">
              <Image
                src={pendingChannel.owner?.avatar || 'https://via.placeholder.com/100'}
                width="80"
                height="80"
                className="rounded-circle mb-3"
              />
              <h5>{pendingChannel.owner?.username}</h5>
              <p className="text-muted">{pendingChannel.owner?.email}</p>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-warning bg-opacity-10">
              <h5 className="mb-0">Estado de la Solicitud</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                <Badge bg="warning" text="dark" className="p-2">
                  ⏳ Pendiente de Revisión
                </Badge>
              </div>
              
              <hr />
              
              <small className="text-muted d-block">
                <strong>Creado:</strong> {new Date(pendingChannel.createdAt).toLocaleDateString()}
              </small>
              <small className="text-muted d-block mt-2">
                <strong>ID:</strong> {pendingChannel._id}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminChannelPreview;