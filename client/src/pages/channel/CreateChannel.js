// src/pages/channel/CreateChannel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Tv, ArrowLeft, Building, InfoCircle } from 'react-bootstrap-icons';
import { createChannel } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';
//import { getMainCategories } from '../../redux/actions/categoryActions';
 
const CreateChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useSelector(state => state.auth);
  const { categories, loading: loadingCategories, error: categoriesError } = useSelector(state => state.category);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    activity: '',        // Guardará el ID de la categoría seleccionada
    description: '',
    wilaya: '',
    commune: '',
    phone: '',
    email: '',
    website: ''
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(getMainCategories(1, 100, false));
    }
  }, [dispatch, categories]);

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

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
      const res = await dispatch(createChannel(formData, token));
      if (res?.success) {
        history.push('/my-channels');
      } else {
        setError(res?.message || "Erreur lors de la création de la chaîne");
      }
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

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
                  <h2 className="h4 fw-bold mb-0">Créer une nouvelle chaîne commerciale</h2>
                </div>
                <p className="text-muted mt-2">Créez votre vitrine professionnelle pour partager vos vidéos commerciales</p>
              </Card.Header>
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* Nom de la chaîne */}
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
                          Veuillez saisir le nom de votre chaîne.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    {/* Actividad / Secteur - SELECT OBLIGATORIO con categorías reales */}
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
                          {loadingCategories && (
                            <option value="" disabled>Chargement des catégories...</option>
                          )}
                          {!loadingCategories && categories && categories.length > 0 ? (
                            categories.map(cat => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
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
                        {categoriesError && (
                          <Form.Text className="text-danger">
                            Erreur de chargement des catégories. Actualisez la page.
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>

                    {/* Description */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Décrivez votre activité, vos produits, services, etc."
                        />
                        <Form.Text className="text-muted">
                          Une description claire aide vos clients à vous comprendre.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Wilaya */}
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

                    {/* Commune */}
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

                    {/* Téléphone */}
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

                    {/* Email */}
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

                    {/* Site web */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Site web (optionnel)</Form.Label>
                        <Form.Control
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          placeholder="https://www.monsite.com"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => history.push('/my-channels')}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={loading || loadingCategories}
                      className="d-flex align-items-center gap-2"
                    >
                      {loading ? <Spinner as="span" animation="border" size="sm" /> : <Building size={16} />}
                      {loading ? 'Création en cours...' : 'Créer la chaîne'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-muted small pb-4">
                <InfoCircle size={14} className="me-1" />
                Les informations de votre chaîne seront utilisées pour vos vidéos commerciales (contact, localisation, secteur).
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CreateChannel;