// pages/boutique/BoutiqueDetailPage.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Spinner, Tabs, Tab } from 'react-bootstrap';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import NotFound from '../../components/NotFound';
import BoutiqueProductsGrid from '../../components/boutique/BoutiqueProductsGrid';
import { FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
import BoutiqueHeader from '../../components/boutique/BoutiqueHeader';

const BoutiqueDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBoutique, loading } = useSelector(state => state.boutique);
  const { auth } = useSelector(state => state);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('produits');

  const isOwner = auth.user?._id === currentBoutique?.user;

  useEffect(() => {
    if (id) {
      dispatch(getBoutique(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBoutique?.images?.length > 0) {
      setActiveImage(0);
    }
  }, [currentBoutique]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </Container>
    );
  }

  if (!currentBoutique) return <NotFound />;

  return (
    <div className="boutique-detail-page" style={{ backgroundColor: '#f8f9fa' }}>
      <Container className="mt-4">
        {/* 🔥 PASAR LA BOUTIQUE AL HEADER */}
        <BoutiqueHeader boutique={currentBoutique} />
        
        <Row>
          {/* Sidebar - SOLO para el dueño */}
          {isOwner ? (
            <Col lg={3} className="mb-4">
              {/* Aquí irían los elementos del sidebar para el dueño */}
            </Col>
          ) : null}

          {/* Contenido principal */}
          <Col lg={isOwner ? 9 : 12}>
            <Card className="border-0 shadow-sm">
              {isOwner ? (
                // Vista para el dueño
                <div>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                  >
                    <Tab 
                      eventKey="produits" 
                      title={
                        <span>
                          <FaBoxOpen className="me-2" />
                          Produits ({currentBoutique.stats?.produits || 0})
                        </span>
                      }
                    >
                      <BoutiqueProductsGrid boutique={currentBoutique} />
                    </Tab>
                    <Tab 
                      eventKey="infos" 
                      title={
                        <span>
                          <FaInfoCircle className="me-2" />
                          À propos
                        </span>
                      }
                    >
                      <div className="p-3">
                        <h5>Description</h5>
                        <p>{currentBoutique.description_boutique || 'Aucune description'}</p>
                        
                        {currentBoutique.proprietaire && (
                          <>
                            <h5 className="mt-4">Contact</h5>
                            <p>
                              <strong>Wilaya:</strong> {currentBoutique.proprietaire.wilaya || 'Non spécifié'}<br />
                              <strong>Téléphone:</strong> {currentBoutique.proprietaire.telephone || 'Non spécifié'}<br />
                              <strong>Email:</strong> {currentBoutique.proprietaire.email || 'Non spécifié'}
                            </p>
                          </>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              ) : (
                // Vista pública para visitantes
                <div>
                  <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-4"
                  >
                    <Tab 
                      eventKey="produits" 
                      title={
                        <span>
                          <FaBoxOpen className="me-2" />
                          Produits ({currentBoutique.stats?.produits || 0})
                        </span>
                      }
                    >
                      <BoutiqueProductsGrid boutique={currentBoutique} />
                    </Tab>
                    <Tab 
                      eventKey="infos" 
                      title={
                        <span>
                          <FaInfoCircle className="me-2" />
                          À propos
                        </span>
                      }
                    >
                      <div className="p-3">
                        <h5>Description</h5>
                        <p>{currentBoutique.description_boutique || 'Aucune description'}</p>
                        
                        {currentBoutique.proprietaire && (
                          <>
                            <h5 className="mt-4">Contact</h5>
                            <p>
                              <strong>Wilaya:</strong> {currentBoutique.proprietaire.wilaya || 'Non spécifié'}<br />
                              <strong>Téléphone:</strong> {currentBoutique.proprietaire.telephone || 'Non spécifié'}<br />
                              <strong>Email:</strong> {currentBoutique.proprietaire.email || 'Non spécifié'}
                            </p>
                          </>
                        )}
                      </div>
                    </Tab>
                  </Tabs>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BoutiqueDetailPage;