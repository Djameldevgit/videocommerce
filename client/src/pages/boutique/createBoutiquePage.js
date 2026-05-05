// 📂 src/pages/boutique/CreateBoutiquePage.js
import React, { useEffect, useState } from 'react';
import { Container, Alert, Breadcrumb, Spinner } from 'react-bootstrap';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CreateBoutiqueWizard from './CreateBoutiqueWizard';
 
import axios from 'axios';
import { BASE_URL } from '../../utils/config';

const CreateBoutiquePage = () => {
  const { id } = useParams();  // ← Obtener ID de la URL
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [boutiqueData, setBoutiqueData] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const isEdit = !!id;  // ← Si hay ID, es modo edición

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!auth.token) {
      history.push('/login');
    }
  }, [auth.token, history]);

  // Cargar datos de la boutique si es edición
  useEffect(() => {
    const loadBoutiqueData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('📥 Cargando datos de boutique para edición:', id);
        
        // Intentar obtener datos del location.state primero (navegación desde el card)
        if (location.state?.boutiqueData) {
          console.log('✅ Datos encontrados en location.state');
          setBoutiqueData(location.state.boutiqueData);
        } else {
          // Si no, cargar desde la API
          console.log('🌐 Cargando desde API...');
          const res = await axios.get(`${BASE_URL}/api/boutique/${id}`, {
            headers: { Authorization: auth.token }
          });
          
          const data = res.data.boutique || res.data;
          console.log('✅ Datos cargados desde API:', data);
          setBoutiqueData(data);
        }
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError('Impossible de charger les données de la boutique');
      } finally {
        setLoading(false);
      }
    };

    loadBoutiqueData();
  }, [id, location.state, auth.token]);

  const handleSuccess = (boutique) => {
    // Redirigir a la página de la boutique
    history.push(`/boutique/${boutique._id}`);
  };

  if (!auth.token) return null;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des données...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
        <Breadcrumb.Item href="/profile">Profil</Breadcrumb.Item>
        <Breadcrumb.Item href="/mes-boutiques">Mes boutiques</Breadcrumb.Item>
        <Breadcrumb.Item active>
          {isEdit ? 'Modifier boutique' : 'Créer boutique'}
        </Breadcrumb.Item>
      </Breadcrumb>
      
   
      
      {/* Información sobre créditos */}
      {isEdit ? (
      // Modo edición: esperar a que los datos estén listos
      boutiqueData ? (
        <CreateBoutiqueWizard 
          isEdit={true}
          boutiqueData={boutiqueData}
          onSuccess={handleSuccess}
        />
      ) : (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement des données de la boutique...</p>
        </div>
      )
    ) : (
      // Modo creación: renderizar inmediatamente
      <CreateBoutiqueWizard 
        isEdit={false}
        boutiqueData={null}
        onSuccess={handleSuccess}
      />
    )}
      
      {/* Estilos */}
      <style jsx>{`
        .page-header {
          text-align: center;
        }
        
        .feature-icon {
          width: 70px;
          height: 70px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 2px solid #e9ecef;
        }
        
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default CreateBoutiquePage;