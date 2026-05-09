// src/pages/channel/MisChannel.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner, 
  Badge
} from 'react-bootstrap';
import { 
  Tv, 
  Plus, 
  Pencil, 
  Eye, 
  GeoAlt, 
  Telephone, 
  Envelope, 
  Briefcase,
  CheckCircle,
  Building
} from 'react-bootstrap-icons';
import { getUserChannels } from '../../redux/actions/channelAction';

const MisChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token, user } = useSelector(state => state.auth);
  const { userChannels, loading } = useSelector(state => state.channel);

  useEffect(() => {
    if (user) {
      dispatch(getUserChannels(token));
    }
  }, [dispatch, token, user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Chargement de vos chaînes...</span>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: '100vh', paddingBottom: '2rem' }}>
      <Container className="py-4">
        {/* En-tête */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
          <h1 className="h2 fw-bold text-dark d-flex align-items-center gap-2 mb-3 mb-sm-0">
            <Tv className="text-primary" size={32} />
            Mes chaînes
            {userChannels.length > 0 && (
              <Badge bg="secondary" pill className="ms-2">{userChannels.length}</Badge>
            )}
          </h1>
          <Button
            variant="primary"
            onClick={() => history.push('/channel/new')}
            className="rounded-pill px-4 d-flex align-items-center gap-2"
          >
            <Plus size={18} /> Nouvelle chaîne
          </Button>
        </div>

        {/* Liste des chaînes */}
        {userChannels.length === 0 ? (
          <Card className="text-center p-5 shadow-sm border-0">
            <Tv size={64} className="text-muted mx-auto mb-3" />
            <h5 className="text-muted">Vous n'avez encore aucune chaîne</h5>
            <p className="text-muted mb-4">Créez votre première chaîne pour commencer à publier des vidéos commerciales.</p>
            <Button variant="primary" onClick={() => history.push('/channel/new')} className="mx-auto rounded-pill px-4">
              <Plus size={18} className="me-2" /> Créer ma première chaîne
            </Button>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {userChannels.map(channel => (
              <Col key={channel._id}>
                <Card className="h-100 shadow-sm border-0 hover-shadow transition-all">
                  <div className="position-relative bg-gradient-primary text-white p-3 rounded-top" style={{ height: '100px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
                    <div className="position-absolute bottom-0 start-50 translate-middle">
                      <div className="bg-white rounded-circle p-1 shadow-sm">
                        {channel.avatar ? (
                          <img src={channel.avatar} alt={channel.name} width="70" height="70" className="rounded-circle object-fit-cover" />
                        ) : (
                          <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                            <Building size={32} className="text-secondary" />
                          </div>
                        )}
                      </div>
                    </div>
                    {channel.isVerified && (
                      <Badge bg="info" className="position-absolute top-0 end-0 m-2 rounded-pill d-flex align-items-center gap-1">
                        <CheckCircle size={12} /> Vérifié
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="pt-5 text-center">
                    <Card.Title className="fw-bold">{channel.name}</Card.Title>
                    <div className="d-flex justify-content-center gap-2 mb-2">
                      <Badge bg="light" text="dark" className="rounded-pill px-3 py-1">
                        <Briefcase size={12} className="me-1" /> {channel.activity || 'Activité'}
                      </Badge>
                    </div>
                    {channel.wilaya && (
                      <div className="text-muted small mb-1">
                        <GeoAlt size={12} className="me-1" /> {channel.wilaya}{channel.commune ? `, ${channel.commune}` : ''}
                      </div>
                    )}
                    {channel.phone && (
                      <div className="text-muted small mb-1">
                        <Telephone size={12} className="me-1" /> {channel.phone}
                      </div>
                    )}
                    {channel.email && (
                      <div className="text-muted small mb-2 text-truncate">
                        <Envelope size={12} className="me-1" /> {channel.email}
                      </div>
                    )}
                    {channel.description && (
                      <div className="text-muted small mt-2 text-start border-top pt-2">
                        {channel.description.length > 80 ? channel.description.substring(0, 80) + '…' : channel.description}
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 d-flex justify-content-between">
                    <Link to={`/channel/${channel._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                      <Eye size={14} className="me-1" /> Voir
                    </Link>
                    <Link to={`/channel/${channel._id}/settings`} className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                      <Pencil size={14} className="me-1" /> Modifier
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      <style jsx="true">{`
        .transition-all { transition: all 0.2s ease-in-out; }
        .hover-shadow:hover { transform: translateY(-4px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
        .object-fit-cover { object-fit: cover; }
      `}</style>
    </div>
  );
};

export default MisChannel;