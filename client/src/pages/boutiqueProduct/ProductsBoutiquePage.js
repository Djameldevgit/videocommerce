// 📂 pages/ProductsBoutiquePage.jsx - VERSIÓN CON CARDS

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { deleteBoutiqueProduct, getBoutiqueProducts } from '../../redux/actions/boutiqueProductAction';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import { FaBox, FaPlus, FaSpinner, FaArrowLeft, FaStore } from 'react-icons/fa';
import ProductManagementCard from '../../components/boutique/ProductCard';

const ProductsBoutiquePage = () => {
  const { boutiqueId } = useParams();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { products: productsState, loadingProducts } = useSelector(state => state.boutiqueProduct);
  const { currentBoutique } = useSelector(state => state.boutique);

  const boutiqueProducts = productsState[boutiqueId] || {
    products: [],
    total: 0,
    loading: false
  };

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (boutiqueId && auth?.token) {
      dispatch(getBoutique(boutiqueId, auth));
      dispatch(getBoutiqueProducts(boutiqueId, { page: 1, limit: 50 }, auth));
    }
  }, [dispatch, boutiqueId, auth, refresh]);

  const handleDelete = async (productId) => {
    await dispatch(deleteBoutiqueProduct({ boutiqueId, productId, auth }));
    setRefresh(prev => !prev);
  };

  const themeColor = currentBoutique?.couleur_theme || '#6366F1';

  if (loadingProducts && boutiqueProducts.products.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={{ ...styles.spinner, fontSize: '40px', color: themeColor }} size={40} />
        <p style={{ color: '#6b7280', marginTop: '15px' }}>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerLeft}>
          <Link to="/mes-boutiques" style={styles.backLink}>
            <FaArrowLeft /> Mes boutiques
          </Link>
          <div>
            <h1 style={styles.headerTitle}>
              <FaBox style={{ color: themeColor }} /> 
              Produits de {currentBoutique?.nom_boutique || 'ma boutique'}
            </h1>
            {currentBoutique?.domaine_boutique && (
              <p style={styles.boutiqueInfo}>
                <FaStore size={12} /> {currentBoutique.domaine_boutique}
              </p>
            )}
          </div>
        </div>
        <Link to={`/boutique/${boutiqueId}/products/new`} style={{ ...styles.btnPrimary, background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%)` }}>
          <FaPlus /> Ajouter un produit
        </Link>
      </div>

      {/* Estadísticas */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{boutiqueProducts.products.length}</div>
          <div style={styles.statLabel}>Total produits</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {boutiqueProducts.products.filter(p => p.pendiente === true).length}
          </div>
          <div style={styles.statLabel}>En attente</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>
            {boutiqueProducts.products.filter(p => p.isActive !== false && p.pendiente !== true).length}
          </div>
          <div style={styles.statLabel}>Actifs</div>
        </div>
      </div>

      {/* Contenido principal - GRID DE CARDS */}
      {boutiqueProducts.products.length === 0 ? (
        <div style={styles.emptyState}>
          <FaBox size={60} style={styles.emptyStateIcon} />
          <h3 style={styles.emptyStateTitle}>Aucun produit</h3>
          <p style={styles.emptyStateText}>Ajoutez votre premier produit à cette boutique</p>
          <Link to={`/boutique/${boutiqueId}/products/new`} style={{ ...styles.btnPrimary, background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}cc 100%)` }}>
            Ajouter un produit
          </Link>
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {boutiqueProducts.products.map(product => (
            <ProductManagementCard 
              key={product._id}
              product={product}
              boutiqueId={boutiqueId}
              onDelete={handleDelete}
              themeColor={themeColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Estilos en línea
const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: '#f8fafc',
    minHeight: '100vh'
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  headerTitle: {
    fontSize: '1.5rem',
    margin: 0,
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600'
  },
  boutiqueInfo: {
    fontSize: '0.8rem',
    color: '#64748b',
    margin: '4px 0 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    background: '#f1f5f9',
    fontSize: '0.9rem'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  emptyStateIcon: {
    color: '#cbd5e1',
    marginBottom: '20px'
  },
  emptyStateTitle: {
    fontSize: '1.25rem',
    color: '#1e293b',
    marginBottom: '10px',
    fontWeight: '600'
  },
  emptyStateText: {
    color: '#64748b',
    marginBottom: '25px'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    animation: 'spin 1s linear infinite'
  }
};

// Agregar animación
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default ProductsBoutiquePage;