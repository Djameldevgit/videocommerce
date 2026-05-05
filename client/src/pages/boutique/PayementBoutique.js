// 📂 pages/PaymentBoutique.jsx
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Form, Badge, Spinner } from 'react-bootstrap';
import { FaStore, FaCcMastercard, FaMoneyBillWave, FaMobileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { getDataAPI, postDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const PaymentBoutique = () => {
  const { boutiqueId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('ccp');
  const [paymentStep, setPaymentStep] = useState(1); // 1: info, 2: instrucciones, 3: confirmacion
  const [boutique, setBoutique] = useState(null);
  const [formData, setFormData] = useState({
    nom_complet: '',
    telephone: '',
    montant: 5000, // Precio base
    reference: '',
    date_paiement: new Date().toISOString().split('T')[0]
  });

  // Planes de precios (en DZD)
  const plans = [
    { id: 'basic', name: 'Basique', price: 3000, duration: '1 mois', features: ['Boutique visible', 'Jusqu\'à 50 produits', 'Support email'] },
    { id: 'standard', name: 'Standard', price: 8000, duration: '3 mois', features: ['Boutique visible', 'Produits illimités', 'Support prioritaire', 'Statistiques'] },
    { id: 'premium', name: 'Premium', price: 15000, duration: '6 mois', features: ['Boutique visible', 'Produits illimités', 'Support 24/7', 'Statistiques avancées', 'Promotion en page d\'accueil'] }
  ];

  const [selectedPlan, setSelectedPlan] = useState(plans[1]);

  // Informations de paiement (Algérie)
  const paymentMethods = {
    ccp: {
      name: 'CCP (Compte Courrier Postal)',
      icon: <FaMoneyBillWave size={24} />,
      account: 'CP 12345678',
      cle: '01',
      titulaire: 'DJAMEL TASSILI',
      centre: 'ALGER CENTRE',
      instructions: 'Effectuez le virement à ce CCP et envoyez-nous la référence'
    },
    baridimob: {
      name: 'BaridiMob',
      icon: <FaMobileAlt size={24} />,
      number: '07XX XX XX XX',
      titulaire: 'DJAMEL TASSILI',
      instructions: 'Effectuez le transfert BaridiMob et notez le code de transaction'
    },
    edahabia: {
      name: 'Carte Edahabia',
      icon: <FaCcMastercard size={24} />,
      instructions: 'Paiement sécurisé par carte bancaire (Prochainement disponible)',
      disabled: true
    }
  };

  useEffect(() => {
    if (auth?.token && boutiqueId) {
      fetchBoutique();
    }
  }, [auth, boutiqueId]);

  const fetchBoutique = async () => {
    try {
      const res = await getDataAPI(`boutique/${boutiqueId}`, auth.token);
      setBoutique(res.data.boutique);
    } catch (err) {
      console.error('Error fetching boutique:', err);
    }
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setFormData(prev => ({ ...prev, montant: plan.price }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Veuillez sélectionner un plan" } });
      return;
    }

    setPaymentStep(2);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    
    try {
      // Enviar notificación al admin
      const paymentData = {
        boutiqueId: boutique._id,
        boutiqueNom: boutique.nom_boutique,
        plan: selectedPlan.name,
        montant: selectedPlan.price,
        methode: selectedMethod,
        reference: formData.reference,
        telephone: formData.telephone,
        nom_complet: formData.nom_complet,
        date_paiement: formData.date_paiement
      };
      
      // Enviar notificación al admin (puede ser por email o guardar en DB)
      await postDataAPI('notifications/payment', paymentData, auth.token);
      
      dispatch({ 
        type: GLOBALTYPES.ALERT, 
        payload: { success: "Votre demande a été envoyée. L'administrateur activera votre boutique après vérification du paiement." } 
      });
      
      setPaymentStep(3);
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        history.push('/mes-boutiques');
      }, 3000);
      
    } catch (err) {
      console.error('Error sending payment notification:', err);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Erreur lors de l'envoi. Veuillez réessayer." } });
    } finally {
      setLoading(false);
    }
  };

  if (!boutique) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Chargement...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* En-tête */}
          <div className="text-center mb-4">
            <FaStore size={48} className="text-primary mb-2" />
            <h2>Activation de votre boutique</h2>
            <p className="text-muted">
              Boutique: <strong>{boutique.nom_boutique}</strong>
            </p>
            <Badge bg="warning" className="mb-2">
              ⚠️ Boutique actuellement inactive
            </Badge>
          </div>

          {paymentStep === 1 && (
            <>
              {/* Sélection du plan */}
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                  <h5 className="mb-3">Choisissez votre formule</h5>
                  <Row>
                    {plans.map(plan => (
                      <Col md={4} key={plan.id} className="mb-3">
                        <Card 
                          className={`h-100 cursor-pointer ${selectedPlan?.id === plan.id ? 'border-primary shadow' : 'border'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePlanChange(plan)}
                        >
                          <Card.Body className="text-center p-3">
                            <h6 className="fw-bold">{plan.name}</h6>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  
                  {selectedPlan && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h6 className="fw-bold">{selectedPlan.name}</h6>
                      <p className="mb-1">💰 Prix: <strong>{selectedPlan.price} DZD</strong></p>
                      <p className="mb-1">⏱️ Durée: {selectedPlan.duration}</p>
                      <small className="text-muted">
                        {selectedPlan.features.map((f, i) => (
                          <div key={i}>✓ {f}</div>
                        ))}
                      </small>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Formulaire de paiement */}
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Informations de paiement</h5>
                  
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom complet</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom_complet"
                        value={formData.nom_complet}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telephone"
                        placeholder="0555 12 34 56"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Méthode de paiement</Form.Label>
                      <div className="d-flex gap-3 flex-wrap">
                        {Object.entries(paymentMethods).map(([key, method]) => (
                          <Button
                            key={key}
                            variant={selectedMethod === key ? 'primary' : 'outline-secondary'}
                            className="d-flex align-items-center gap-2"
                            onClick={() => setSelectedMethod(key)}
                            disabled={method.disabled}
                          >
                            {method.icon}
                            {method.name}
                          </Button>
                        ))}
                      </div>
                    </Form.Group>

                    <Button type="submit" variant="success" className="w-100 mt-2">
                      Continuer vers le paiement
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </>
          )}

          {paymentStep === 2 && (
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3 text-center">Instructions de paiement</h5>
                
                <Alert variant="info" className="mb-4">
                  <FaClock className="me-2" />
                  Après votre paiement, l'administrateur activera votre boutique sous 24-48h.
                </Alert>

                <div className="p-3 bg-light rounded mb-4">
                  <h6>Coordonnées bancaires:</h6>
                  {selectedMethod === 'ccp' && (
                    <>
                      <p><strong>CCP:</strong> {paymentMethods.ccp.account}</p>
                      <p><strong>Clé:</strong> {paymentMethods.ccp.cle}</p>
                      <p><strong>Titulaire:</strong> {paymentMethods.ccp.titulaire}</p>
                      <p><strong>Montant:</strong> {selectedPlan.price} DZD</p>
                    </>
                  )}
                  {selectedMethod === 'baridimob' && (
                    <>
                      <p><strong>Numéro BaridiMob:</strong> {paymentMethods.baridimob.number}</p>
                      <p><strong>Titulaire:</strong> {paymentMethods.baridimob.titulaire}</p>
                      <p><strong>Montant:</strong> {selectedPlan.price} DZD</p>
                    </>
                  )}
                </div>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Référence du paiement</Form.Label>
                    <Form.Control
                      type="text"
                      name="reference"
                      placeholder="Entrez le numéro de transaction / reçu"
                      value={formData.reference}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      {selectedMethod === 'ccp' ? "Le numéro de virement CCP" : "Le code de transaction BaridiMob"}
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date du paiement</Form.Label>
                    <Form.Control
                      type="date"
                      name="date_paiement"
                      value={formData.date_paiement}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="secondary" onClick={() => setPaymentStep(1)}>
                      Retour
                    </Button>
                    <Button 
                      variant="success" 
                      onClick={handleConfirmPayment} 
                      disabled={loading || !formData.reference}
                      className="flex-grow-1"
                    >
                      {loading ? <Spinner size="sm" /> : "J'ai effectué le paiement"}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {paymentStep === 3 && (
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="py-5">
                <FaCheckCircle size={64} className="text-success mb-3" />
                <h4>Demande envoyée !</h4>
                <p className="text-muted">
                  Votre demande a été transmise à l'administrateur.
                  Il activera votre boutique dès réception et vérification du paiement.
                </p>
                <p className="text-muted small">
                  Vous recevrez une notification lorsque votre boutique sera active.
                </p>
                <Button variant="primary" onClick={() => history.push('/mes-boutiques')}>
                  Retour à mes boutiques
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentBoutique;