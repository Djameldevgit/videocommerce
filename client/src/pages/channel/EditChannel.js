// src/pages/channel/EditChannel.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Tv, ArrowLeft, Building, InfoCircle, Save, CheckCircle } from 'react-bootstrap-icons';
import { getChannelProfile, updateChannelProfile } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';
import WilayaCommuneField from './WilayaCommuneField';

const EditChannel = () => {
  const { channelId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { channel, loading: channelLoading } = useSelector(state => state.channel);
  const { auth, socket, token } = useSelector(state => state.auth);
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
  const [success, setSuccess] = useState(false);

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
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      setError("Le nom de la chaîne est obligatoire");
      setValidated(true);
      return;
    }
    
    if (!formData.activity) {
      setError("Veuillez sélectionner une activité/secteur");
      setValidated(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const res = await dispatch(updateChannelProfile(
        channel._id, 
        formData, 
        token, 
        auth, 
        socket
      ));
      
      if (res?.success) {
        setSuccess(true);
        
        // Actualizar los datos del formulario con la respuesta
        if (res.channel) {
          setFormData(prev => ({
            ...prev,
            name: res.channel.name || prev.name,
            activity: res.channel.activity || prev.activity,
            description: res.channel.description || prev.description,
            wilaya: res.channel.wilaya || prev.wilaya,
            commune: res.channel.commune || prev.commune,
            phone: res.channel.phone || prev.phone,
            email: res.channel.email || prev.email,
            website: res.channel.website || prev.website
          }));
        }
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          history.push(`/channel/${channel._id}`);
        }, 2000);
      } else {
        const errorMsg = res?.message || "Erreur lors de la mise à jour";
        
        if (errorMsg.includes('déjà') || errorMsg.includes('existe')) {
          setError(`❌ Un canal avec le nom "${formData.name}" existe déjà.`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('❌ Error en updateChannel:', err);
      
      if (err.message?.includes('Network')) {
        setError("❌ Problème de connexion réseau. Vérifiez votre connexion internet.");
      } else if (err.response?.status === 401) {
        setError("❌ Session expirée. Veuillez vous reconnecter.");
        setTimeout(() => history.push('/login'), 2000);
      } else if (err.response?.status === 400) {
        const serverMsg = err.response?.data?.message;
        if (serverMsg?.includes('nom') || serverMsg?.includes('name')) {
          setError(`❌ Le nom "${formData.name}" est déjà utilisé. Choisissez un autre nom.`);
        } else {
          setError(serverMsg || "❌ Données invalides. Vérifiez les champs.");
        }
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (channelLoading && !channel) {
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
                {/* Mensaje de error */}
                {error && (
                  <Alert 
                    variant="danger" 
                    className="mb-4"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span>⚠️</span>
                      <div>
                        <strong>Erreur :</strong> {error}
                      </div>
                    </div>
                  </Alert>
                )}
                
                {/* Mensaje de éxito */}
                {success && (
                  <Alert 
                    variant="success" 
                    className="mb-4"
                    onClose={() => setSuccess(false)}
                    dismissible
                  >
                    <div className="d-flex align-items-center gap-2">
                      <CheckCircle size={20} />
                      <div>
                        <strong>✅ Chaîne mise à jour avec succès !</strong>
                        <br />
                        <small>Redirection vers votre chaîne...</small>
                      </div>
                    </div>
                  </Alert>
                )}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Nom de la chaîne <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="ex: Électroménager Ben Omar"
                          isInvalid={validated && !formData.name.trim()}
                          disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez saisir le nom de votre chaîne.
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Choisissez un nom unique pour votre chaîne.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>
                          Activité / Secteur <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="activity"
                          value={formData.activity}
                          onChange={handleChange}
                          required
                          disabled={loadingCategories || loading}
                          isInvalid={validated && !formData.activity}
                        >
                          <option value="">Sélectionnez un secteur</option>
                          {loadingCategories && (
                            <option value="" disabled>Chargement des catégories...</option>
                          )}
                          {!loadingCategories && categories?.length > 0 ? (
                            categories.map(cat => (
                              <option key={cat._id} value={cat._id}>
                                {cat.icon} {cat.name}
                              </option>
                            ))
                          ) : (
                            !loadingCategories && (
                              <option value="" disabled>Aucune catégorie disponible</option>
                            )
                          )}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Veuillez sélectionner un secteur d'activité.
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
                          disabled={loading}
                        />
                        <Form.Text className="text-muted">
                          Une description claire aide vos clients à vous comprendre.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Wilaya y Commune - COMPONENTE INTEGRADO (reemplaza el array fijo) */}
                    <Col xs={12}>
                      <WilayaCommuneField
                        postData={formData}
                        handleChangeInput={handleChange}
                      />
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
                          disabled={loading}
                        />
                        <Form.Text className="text-muted">
                          Format: +213 5XX XX XX XX
                        </Form.Text>
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
                          disabled={loading}
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
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => history.push('/my-channels')}
                      disabled={loading}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || loadingCategories}
                      className="d-flex align-items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" />
                          Mise à jour...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Enregistrer
                        </>
                      )}
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