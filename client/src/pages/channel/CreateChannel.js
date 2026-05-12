// src/pages/channel/CreateChannel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Tv, ArrowLeft, Building, InfoCircle, CheckCircle } from 'react-bootstrap-icons';
import { createChannel } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';
import WilayaCommuneField from './WilayaCommuneField';

const CreateChannel = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { token ,auth,socket} = useSelector(state => state.auth);
  const { categories, loading: loadingCategories, error: categoriesError } = useSelector(state => state.category);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    activity: '',
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

  // Limpiar mensajes cuando el usuario empieza a escribir
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleWilayaChange = (wilaya) => {
    setFormData(prev => ({ ...prev, wilaya }));
    if (error) setError(null);
  };

  const handleCommuneChange = (commune) => {
    setFormData(prev => ({ ...prev, commune }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Validación del formulario HTML5
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    // Validación adicional del nombre
    if (!formData.name.trim()) {
      setError("Le nom de la chaîne est obligatoire");
      setValidated(true);
      return;
    }
  
    // Validación de categoría
    if (!formData.activity) {
      setError("Veuillez sélectionner une activité/secteur");
      setValidated(true);
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // ✅ Pasar auth y socket como parámetros
      const res = await dispatch(createChannel(formData, token, auth, socket));
      
      if (res?.success) {
        setSuccess(true);
        // Limpiar formulario después de éxito
        setFormData({
          name: '',
          activity: '',
          description: '',
          wilaya: '',
          commune: '',
          phone: '',
          email: '',
          website: ''
        });
        setValidated(false);
        
        // Redirigir después de 2 segundos para que el usuario vea el mensaje de éxito
        setTimeout(() => {
          history.push('/my-channels');
        }, 2000);
      } else {
        // Manejar diferentes tipos de errores
        const errorMsg = res?.message || "Erreur lors de la création de la chaîne";
        
        // Verificar si es error de nombre duplicado
        if (errorMsg.includes('déjà') || errorMsg.includes('existe') || errorMsg.includes('Ya tienes')) {
          setError(`❌ Un canal avec le nom "${formData.name}" existe déjà. Veuillez choisir un autre nom.`);
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error('❌ Error en createChannel:', err);
      
      // Manejar errores de red o servidor
      if (err.message?.includes('Network')) {
        setError("❌ Problème de connexion réseau. Vérifiez votre connexion internet.");
      } else if (err.response?.status === 400) {
        const serverMsg = err.response?.data?.message;
        if (serverMsg?.includes('nom') || serverMsg?.includes('name')) {
          setError(`❌ Le nom "${formData.name}" est déjà utilisé. Choisissez un autre nom.`);
        } else {
          setError(serverMsg || "❌ Données invalides. Vérifiez les champs.");
        }
      } else if (err.response?.status === 401) {
        setError("❌ Session expirée. Veuillez vous reconnecter.");
        setTimeout(() => history.push('/login'), 2000);
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
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
                        <strong>✅ Chaîne créée avec succès !</strong>
                        <br />
                        <small>Redirection vers vos chaînes...</small>
                      </div>
                    </div>
                  </Alert>
                )}
                
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* Nom de la chaîne */}
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

                    {/* Actividad / Secteur */}
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
                          {!loadingCategories && categories && categories.length > 0 ? (
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
                        {categoriesError && (
                          <Form.Text className="text-danger">
                            ⚠️ Erreur de chargement des catégories. Actualisez la page.
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
                          disabled={loading}
                        />
                        <Form.Text className="text-muted">
                          Une description claire aide vos clients à vous comprendre.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Wilaya y Commune */}
                    <Col xs={12}>
                      <WilayaCommuneField
                        postData={formData}
                        handleChangeInput={handleChange}
                      />
                    </Col>

                    {/* Teléfono */}
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
                          disabled={loading}
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
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Building size={16} />
                          Créer la chaîne
                        </>
                      )}
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