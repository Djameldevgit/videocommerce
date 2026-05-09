// src/pages/channel/EditChannel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Tv, ArrowLeft, Building, InfoCircle, Save } from 'react-bootstrap-icons';
import { getChannelProfile, updateChannelProfile } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';

const EditChannel = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { channel, loading: channelLoading } = useSelector(state => state.channel);
  const { token } = useSelector(state => state.auth);
  const { categories, loading: loadingCategories } = useSelector(state => state.category);
  
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
    description: '',
    wilaya: '',
    commune: '',
    phone: '',
    email: '',
    website: '',
    avatar: '',
    cover: ''
  });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);

  // Cargar categorías si no están
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getMainCategories(1, 100, false));
    }
  }, [dispatch, categories]);

  // Cargar datos del canal
  useEffect(() => {
    if (!channel || channel._id !== channelId) {
      dispatch(getChannelProfile(channelId, token));
    } else {
      setFormData({
        name: channel.name || '',
        activity: channel.activity || '',
        description: channel.description || '',
        wilaya: channel.wilaya || '',
        commune: channel.commune || '',
        phone: channel.phone || '',
        email: channel.email || '',
        website: channel.website || '',
        avatar: channel.avatar || '',
        cover: channel.cover || ''
      });
    }
  }, [channelId, channel, dispatch, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await dispatch(updateChannelProfile(channelId, formData, token));
      if (res?.success) {
        history.push('/my-channels');
      } else {
        setError(res?.message || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Lista de wilayas (igual que en CreateChannel)
  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

  if (channelLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3 text-muted">Chargement du canal...</span>
      </div>
    );
  }

  return (
    <div className="bg-light" style={{ minHeight: '100vh', padding: '2rem 0' }}>
      <Container>
        <Button 
          variant="link" 
          className="text-decoration-none mb-3 d-inline-flex align-items-center gap-1"
          onClick={() => history.goBack()}
        >
          <ArrowLeft size={16} /> Retour
        </Button>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <div className="d-flex align-items-center gap-2">
                  <Tv size={28} className="text-primary" />
                  <h2 className="h4 fw-bold mb-0">Modifier la chaîne</h2>
                </div>
                <p className="text-muted mt-2">Mettez à jour les informations de votre chaîne commerciale</p>
              </Card.Header>
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nom de la chaîne <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="ex: Électroménager Ben Omar"
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir le nom.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Activité / Secteur <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="activity"
                          value={formData.activity}
                          onChange={handleChange}
                          required
                          disabled={loadingCategories}
                        >
                          <option value="">Sélectionnez un secteur</option>
                          {!loadingCategories && categories?.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Veuillez sélectionner un secteur.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Décrivez votre activité, vos produits, services..."
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Wilaya</Form.Label>
                        <Form.Select
                          name="wilaya"
                          value={formData.wilaya}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionnez une wilaya</option>
                          {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Commune</Form.Label>
                        <Form.Control
                          type="text"
                          name="commune"
                          value={formData.commune}
                          onChange={handleChange}
                          placeholder="Ex: Alger Centre"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Téléphone</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+213 5XX XX XX XX"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="contact@exemple.com"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Site web</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.monsite.com"
                        />
                      </Form.Group>
                    </Col>

                    {/* Campos opcionales de imagen (avatar, cover) – puedes añadirlos si deseas */}
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button variant="secondary" onClick={() => history.push('/my-channels')}>
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || loadingCategories}
                      className="d-flex align-items-center gap-2"
                    >
                      {loading ? <Spinner as="span" animation="border" size="sm" /> : <Save size={16} />}
                      {loading ? 'Mise à jour...' : 'Enregistrer'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-muted small pb-4">
                <InfoCircle size={14} className="me-1" />
                Les modifications seront visibles sur votre chaîne publique et dans vos vidéos.
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditChannel;