// components/boutique/sections/BoutiqueProductsGrid.jsx

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Spinner, Offcanvas, Badge } from 'react-bootstrap';
import { 
  FaFilter, FaThLarge, FaList, FaTimes, FaSlidersH, FaChevronDown, FaChevronUp,
  FaBoxOpen, FaStore, FaBuilding, FaCar, FaTshirt, FaTv, FaMobile, FaCouch,
  FaUtensils, FaTools, FaTag, FaMapMarkerAlt, FaMoneyBillWave
} from 'react-icons/fa';

import BoutiqueProductCard from './BoutiqueProductCard';
import { getBoutiqueProducts, resetBoutiqueProducts } from '../../redux/actions/boutiqueProductAction';

// Iconos por categoría
const getCategoryIcon = (categorySlug) => {
  const icons = {
    'agences-immobilieres': FaBuilding,
    'promotions-immobilieres': FaBuilding,
    'showroom-automobiles': FaCar,
    'showroom-moto': FaCar,
    'vetements-accessoires-mode': FaTshirt,
    'magasin-electromenager': FaTv,
    'telephones-accessoires': FaMobile,
    'maison-meubles': FaCouch,
    'restaurants-salles-fetes': FaUtensils,
    'outillages-quincaillerie': FaTools
  };
  return icons[categorySlug] || FaStore;
};

// Opciones estáticas
const ETAT_OPTIONS = [
  { value: 'neuf', label: 'Neuf' },
  { value: 'comme-neuf', label: 'Comme neuf' },
  { value: 'bon-etat', label: 'Bon état' },
  { value: 'correct', label: 'Correct' }
];

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane'
];

const BoutiqueProductsGrid = ({ boutique }) => {
  const dispatch = useDispatch();
  
  // Redux
  const boutiqueProductState = useSelector(state => state.boutiqueProduct);
  const { categories: allCategories = [] } = useSelector(state => state.categories || {});
  
  // Datos de la boutique
  const boutiqueData = boutiqueProductState?.products?.[boutique?._id] || {
    products: [],
    total: 0,
    page: 1,
    hasMore: true
  };
  
  const products = boutiqueData.products || [];
  const total = boutiqueData.total || 0;
  const hasMore = boutiqueData.hasMore;
  const currentPage = boutiqueData.page || 1;
  const loadingProducts = boutiqueProductState?.loadingProducts || false;
  
  // Estados UI
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    subCategories: [],
    articleType: 'all',
    minPrice: '',
    maxPrice: '',
    etat: [],
    wilaya: ''
  });
  
  const loaderRef = useRef(null);
  const filtersRef = useRef(filters);
  const sortByRef = useRef(sortBy);
  
  // Actualizar refs
  useEffect(() => { filtersRef.current = filters; }, [filters]);
  useEffect(() => { sortByRef.current = sortBy; }, [sortBy]);
  
  // Categoría de la boutique
  const boutiqueCategory = useMemo(() => {
    if (!boutique?.categorie) return null;
    return allCategories.find(cat => cat.slug === boutique.categorie || cat._id === boutique.categorie) || {
      _id: boutique.categorie,
      slug: boutique.categorie,
      name: boutique.categorieName || boutique.categorie
    };
  }, [boutique?.categorie, allCategories]);
  
  // Subcategorías disponibles
  const availableSubCategories = useMemo(() => {
    if (!boutiqueCategory) return [];
    return allCategories.filter(cat => 
      (cat.parentId || cat.parent) === (boutiqueCategory._id || boutiqueCategory.slug)
    );
  }, [boutiqueCategory, allCategories]);
  
  // Tipos de artículo
  const articleTypes = useMemo(() => {
    if (boutique?.articleType && boutique.articleType !== 'mixed') {
      return [{ value: boutique.articleType, label: getArticleTypeLabel(boutique.articleType) }];
    }
    return [
      { value: 'product', label: '📦 Produit physique' },
      { value: 'service', label: '⚙️ Service' },
      { value: 'digital', label: '💻 Produit digital' }
    ];
  }, [boutique?.articleType]);
  
  const getArticleTypeLabel = (type) => {
    const labels = { product: '📦 Produit physique', service: '⚙️ Service', digital: '💻 Produit digital' };
    return labels[type] || '📦 Produit';
  };
  
  // Cargar productos
  const loadProducts = useCallback(async (page, reset = false) => {
    if (!boutique?._id || (isLoading && !reset)) return;
    
    setIsLoading(true);
    
    try {
      await dispatch(getBoutiqueProducts(boutique._id, {
        ...filtersRef.current,
        sort: sortByRef.current,
        page,
        limit: 12
      }, reset));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, boutique?._id, isLoading]);
  
  // Carga inicial
  useEffect(() => {
    if (!boutique?._id) return;
    
    const hasCategory = boutiqueCategory && filters.categories.length === 0;
    if (hasCategory) {
      setFilters(prev => ({
        ...prev,
        categories: [boutiqueCategory.slug || boutiqueCategory._id]
      }));
    }
    
    loadProducts(1, true);
  }, [boutique?._id]);
  
  // Scroll infinito
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loadingProducts || isLoading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingProducts && !isLoading) {
          loadProducts(currentPage + 1, false);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingProducts, isLoading, currentPage, loadProducts]);
  
  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value) 
        : [...prev[key], value]
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      categories: boutiqueCategory ? [boutiqueCategory.slug || boutiqueCategory._id] : [],
      subCategories: [],
      articleType: 'all',
      minPrice: '',
      maxPrice: '',
      etat: [],
      wilaya: ''
    });
  };
  
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > (boutiqueCategory ? 1 : 0)) count++;
    if (filters.subCategories.length) count++;
    if (filters.articleType !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.etat.length) count++;
    if (filters.wilaya) count++;
    return count;
  };
  
  // Renderizado condicional
  if (!boutique) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </div>
    );
  }
  
  if (loadingProducts && products.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits...</p>
      </div>
    );
  }
  
  // Componente de filtros
  const FiltersPanel = () => {
    const CategoryIcon = boutiqueCategory ? getCategoryIcon(boutiqueCategory.slug) : FaStore;
    const themeColor = boutique?.couleur_theme || '#6366F1';
    
    return (
      <div className="filters-content">
        {/* Buscador */}
        <div className="mb-4">
          <Form.Control
            type="text"
            placeholder={`🔍 Rechercher dans ${boutique?.nom_boutique || 'la boutique'}...`}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="rounded-pill"
          />
        </div>
        
        {/* Categoría */}
        {boutiqueCategory && (
          <div className="mb-4">
            <h6 className="fw-bold mb-3"><FaStore className="me-2" />Catégorie</h6>
            <div className="p-3 rounded-3" style={{ backgroundColor: `${themeColor}10`, borderLeft: `3px solid ${themeColor}` }}>
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: themeColor, color: 'white' }}>
                  <CategoryIcon size={24} />
                </div>
                <div><strong>{boutiqueCategory.name}</strong></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subcategorías */}
        {availableSubCategories.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold mb-3"><FaTag className="me-2" />Sous-catégories</h6>
            <div className="d-flex flex-wrap gap-2">
              {availableSubCategories.map(sub => (
                <Badge
                  key={sub._id}
                  pill
                  bg={filters.subCategories.includes(sub.slug || sub._id) ? 'primary' : 'light'}
                  text={filters.subCategories.includes(sub.slug || sub._id) ? 'white' : 'dark'}
                  className="px-3 py-2 cursor-pointer"
                  style={{ cursor: 'pointer', backgroundColor: filters.subCategories.includes(sub.slug || sub._id) ? themeColor : undefined }}
                  onClick={() => handleArrayFilter('subCategories', sub.slug || sub._id)}
                >
                  {sub.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Tipo de artículo */}
        {articleTypes.length > 1 && (
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Type d'article</h6>
            <div className="d-flex flex-wrap gap-2">
              <Badge
                pill
                bg={filters.articleType === 'all' ? 'primary' : 'light'}
                className="px-3 py-2 cursor-pointer"
                style={{ cursor: 'pointer', backgroundColor: filters.articleType === 'all' ? themeColor : undefined }}
                onClick={() => handleFilterChange('articleType', 'all')}
              >
                Tous
              </Badge>
              {articleTypes.map(type => (
                <Badge
                  key={type.value}
                  pill
                  bg={filters.articleType === type.value ? 'primary' : 'light'}
                  className="px-3 py-2 cursor-pointer"
                  style={{ cursor: 'pointer', backgroundColor: filters.articleType === type.value ? themeColor : undefined }}
                  onClick={() => handleFilterChange('articleType', type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Precio */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3"><FaMoneyBillWave className="me-2" />Prix</h6>
          <div className="d-flex gap-2">
            <Form.Control type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
            <Form.Control type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
          </div>
        </div>
        
        {/* Estado */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3">État</h6>
          <div className="d-flex flex-wrap gap-2">
            {ETAT_OPTIONS.map(option => (
              <Badge
                key={option.value}
                pill
                bg={filters.etat.includes(option.value) ? 'primary' : 'light'}
                className="px-3 py-2 cursor-pointer"
                style={{ cursor: 'pointer', backgroundColor: filters.etat.includes(option.value) ? themeColor : undefined }}
                onClick={() => handleArrayFilter('etat', option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Wilaya */}
        <div className="mb-4">
          <h6 className="fw-bold mb-3"><FaMapMarkerAlt className="me-2" />Wilaya</h6>
          <Form.Select value={filters.wilaya} onChange={(e) => handleFilterChange('wilaya', e.target.value)}>
            <option value="">Toutes les wilayas</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </Form.Select>
        </div>
        
        {/* Limpiar filtros */}
        {activeFiltersCount() > 0 && (
          <Button variant="link" onClick={clearFilters} className="p-0 text-decoration-none" style={{ color: themeColor }}>
            <FaTimes className="me-1" />Effacer les filtres ({activeFiltersCount()})
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <div className="boutique-products-grid">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="mb-1 d-flex align-items-center gap-2">
            <span>Nos produits</span>
            {boutiqueCategory && (
              <Badge style={{ backgroundColor: `${boutique?.couleur_theme || '#6366F1'}15`, color: boutique?.couleur_theme || '#6366F1' }}>
                {boutiqueCategory.name}
              </Badge>
            )}
          </h4>
          <small className="text-muted">{products.length} sur {total} produit{total > 1 ? 's' : ''}</small>
        </div>
        
        <div className="d-flex gap-2">
          {/* Filtros móvil */}
          <Button variant="outline-secondary" size="sm" className="d-md-none" onClick={() => setShowMobileFilters(true)}>
            <FaSlidersH /> Filtres {activeFiltersCount() > 0 && <Badge bg="primary">{activeFiltersCount()}</Badge>}
          </Button>
          
          {/* Vista grid/list */}
          <div className="btn-group">
            <Button variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'} size="sm" onClick={() => setViewMode('grid')} style={viewMode === 'grid' ? { backgroundColor: boutique?.couleur_theme, borderColor: boutique?.couleur_theme } : {}}>
              <FaThLarge />
            </Button>
            <Button variant={viewMode === 'list' ? 'primary' : 'outline-secondary'} size="sm" onClick={() => setViewMode('list')} style={viewMode === 'list' ? { backgroundColor: boutique?.couleur_theme, borderColor: boutique?.couleur_theme } : {}}>
              <FaList />
            </Button>
          </div>
          
          {/* Ordenamiento */}
          <Form.Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto', minWidth: 150 }}>
            <option value="recent">📅 Plus récents</option>
            <option value="price_asc">💰 Prix croissant</option>
            <option value="price_desc">💰 Prix décroissant</option>
            <option value="popular">⭐ Plus populaires</option>
          </Form.Select>
          
          {/* Filtros desktop */}
          <Button variant="outline-secondary" size="sm" className="d-none d-md-flex" onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filtres {activeFiltersCount() > 0 && <Badge bg="primary">{activeFiltersCount()}</Badge>}
            {showFilters ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
          </Button>
        </div>
      </div>
      
      <Row>
        {/* Sidebar filtros */}
        {showFilters && (
          <Col lg={3} className="d-none d-lg-block">
            <div className="p-4 bg-light rounded-3 sticky-top" style={{ top: 90 }}>
              <h5 className="mb-4"><FaFilter /> Filtres {activeFiltersCount() > 0 && <Badge bg="primary">{activeFiltersCount()}</Badge>}</h5>
              <FiltersPanel />
            </div>
          </Col>
        )}
        
        {/* Productos */}
        <Col lg={showFilters ? 9 : 12}>
          {products.length > 0 ? (
            <>
              <Row className={viewMode === 'grid' ? 'g-4' : ''}>
                {products.map(product => (
                  <Col key={product._id} {...(viewMode === 'grid' ? { xl: showFilters ? 4 : 3, lg: showFilters ? 6 : 4, md: 6, xs: 12 } : { xs: 12 })}>
                    <BoutiqueProductCard post={product} boutique={boutique} />
                  </Col>
                ))}
              </Row>
              
              {hasMore && (
                <div ref={loaderRef} className="text-center py-4">
                  {(loadingProducts || isLoading) ? <Spinner animation="border" size="sm" /> : <span className="text-muted small">↓ Scroll pour charger plus</span>}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <FaBoxOpen size={48} className="text-muted mb-3" />
              <h5 className="text-muted">Aucun produit disponible</h5>
              <p className="text-muted">
                {activeFiltersCount() > 0 ? 'Aucun produit ne correspond à vos filtres.' : 'Cette boutique n\'a pas encore de produits.'}
              </p>
              {activeFiltersCount() > 0 && (
                <Button variant="link" onClick={clearFilters} style={{ color: boutique?.couleur_theme }}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </Col>
      </Row>
      
      {/* Offcanvas móvil */}
      <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="start" style={{ width: 320 }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title><FaFilter /> Filtres {activeFiltersCount() > 0 && <Badge bg="primary">{activeFiltersCount()}</Badge>}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body><FiltersPanel /></Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default BoutiqueProductsGrid;