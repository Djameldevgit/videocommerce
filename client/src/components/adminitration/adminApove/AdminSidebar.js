// 📂 components/adminitration/adminApove/AdminSidebar.js
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Spinner, Button } from 'react-bootstrap';
import { 
  FaStore, FaBox, FaChevronDown, FaChevronRight,
  FaClipboardList, FaHourglassHalf, FaTimes,
    FaBell
} from 'react-icons/fa';
import { getCategoriesForAccordion } from '../../../redux/actions/categoryAction';
 

const AdminSidebar = ({ isOpen, onToggle, onSelectCategory, selectedCategory, activeTab, refreshKey, isMobile }) => {
  const dispatch = useDispatch();
  const { accordionCategories = [], loading } = useSelector(state => state.category || {});
  const { auth } = useSelector(state => state);
  const [openCategories, setOpenCategories] = useState({});
  const [pendingCounts, setPendingCounts] = useState({
    posts: {},
    boutiques: 0,
    products: 0
  });
  const [fetchingCounts, setFetchingCounts] = useState(false);
  
  // Cargar categorías
  useEffect(() => {
    if (accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length]);
  
  // Cargar contadores
  const fetchCounts = useCallback(async () => {
    if (!auth?.token) return;
    
    setFetchingCounts(true);
    
    try {
      const postsRes = await fetch('/api/posts/admin/pendientes/counts/all', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      let postsCounts = {};
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        if (postsData.success) {
          postsCounts = postsData.counts;
        }
      }
      
      let boutiquesCount = 0;
      try {
        const boutiquesRes = await fetch('/api/boutiques/admin/pendientes/count', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (boutiquesRes.ok) {
          const boutiquesData = await boutiquesRes.json();
          if (boutiquesData.success) boutiquesCount = boutiquesData.count;
        }
      } catch (err) {
        console.error('Error fetching boutiques count:', err);
      }
      
      let productsCount = 0;
      try {
        const productsRes = await fetch('/api/boutiques/products/pendientes/count', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.success) productsCount = productsData.count;
        }
      } catch (err) {
        console.error('Error fetching products count:', err);
      }
      
      setPendingCounts({
        posts: postsCounts,
        boutiques: boutiquesCount,
        products: productsCount
      });
      
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setFetchingCounts(false);
    }
  }, [auth?.token]);
  
  useEffect(() => {
    if (auth?.token) {
      fetchCounts();
    }
  }, [auth?.token, refreshKey, fetchCounts]);
  
  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleCategoryClick = (category, isSubCategory = false) => {
    if (isSubCategory) {
      const parentCategory = accordionCategories.find(parent => 
        parent.children?.some(child => child._id === category._id)
      );
      
      onSelectCategory({
        slug: category.slug,
        name: category.name,
        categorie: parentCategory?.slug,
        subCategory: category.slug
      }, 'posts');
    } else {
      onSelectCategory({
        slug: category.slug,
        name: category.name,
        categorie: category.slug,
        subCategory: null
      }, 'posts');
    }
    
    if (isMobile) {
      setTimeout(() => onToggle(), 300);
    }
  };
  
  const handleModuleClick = (module, tab) => {
    onSelectCategory(null, tab);
    if (isMobile) {
      setTimeout(() => onToggle(), 300);
    }
  };
  
  const totalPending = Object.values(pendingCounts.posts).reduce((a, b) => a + b, 0) + 
                       pendingCounts.boutiques + 
                       pendingCounts.products;
  
  if (!isOpen) {
    return null;
  }
  
  if (loading || fetchingCounts) {
    return (
      <div className={`adm-sidebar ${isOpen ? 'adm-open' : ''}`}>
        <div className="adm-sidebar-loading">
          <Spinner animation="border" variant="primary" size="sm" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`adm-sidebar ${isOpen ? 'adm-open' : ''}`}>
      {/* Header */}
      <div className="adm-sidebar-header">
        <div className="adm-header-content">
          <div className="adm-header-icon">
            <FaClipboardList />
          </div>
          <div className="adm-header-text">
            <h5>Admin Panel</h5>
            <span>Gestion des validations</span>
          </div>
        </div>
        {isMobile && (
          <button className="adm-sidebar-close" onClick={onToggle}>
            <FaTimes />
          </button>
        )}
      </div>
      
      <div className="adm-sidebar-body">
        {/* Tarjeta de resumen */}
        <div className="adm-summary-card">
          <div className="adm-summary-header">
            <FaBell className="adm-summary-icon" />
            <span className="adm-summary-title">En attente</span>
          </div>
          <div className="adm-summary-value">{totalPending}</div>
          <div className="adm-summary-footer">Éléments à vérifier</div>
        </div>
        
        {/* Módulo Boutiques */}
        <div className="adm-nav-module">
          <div
            onClick={() => handleModuleClick(null, 'boutiques')}
            className={`adm-nav-item ${activeTab === 'boutiques' && !selectedCategory ? 'adm-active' : ''}`}
          >
            <div className="adm-nav-icon adm-boutique">
              <FaStore />
            </div>
            <div className="adm-nav-content">
              <span className="adm-nav-title">Boutiques</span>
              <span className="adm-nav-desc">Commerces à valider</span>
            </div>
            {pendingCounts.boutiques > 0 && (
              <Badge className="adm-nav-badge">{pendingCounts.boutiques}</Badge>
            )}
          </div>
        </div>
        
        {/* Módulo Produits */}
        <div className="adm-nav-module">
          <div
            onClick={() => handleModuleClick(null, 'products')}
            className={`adm-nav-item ${activeTab === 'products' && !selectedCategory ? 'adm-active' : ''}`}
          >
            <div className="adm-nav-icon adm-product">
              <FaBox />
            </div>
            <div className="adm-nav-content">
              <span className="adm-nav-title">Produits boutique</span>
              <span className="adm-nav-desc">Articles à valider</span>
            </div>
            {pendingCounts.products > 0 && (
              <Badge className="adm-nav-badge">{pendingCounts.products}</Badge>
            )}
          </div>
        </div>
        
        {/* Separador */}
        <div className="adm-sidebar-divider">
          <span>POSTS PAR CATÉGORIE</span>
        </div>
        
        {/* Categorías */}
        <div className="adm-categories-list">
          {accordionCategories.map(category => {
            const pendingCount = pendingCounts.posts[category.slug] || 0;
            const isExpanded = openCategories[category._id];
            const hasChildren = category.children && category.children.length > 0;
            const isActive = activeTab === 'posts' && selectedCategory?.slug === category.slug;
            
            return (
              <div key={category._id} className="adm-category-group">
                <div
                  onClick={() => {
                    if (hasChildren) {
                      toggleCategory(category._id);
                    } else {
                      handleCategoryClick(category, false);
                    }
                  }}
                  className={`adm-category-item ${isActive ? 'adm-active' : ''}`}
                >
                  <div className="adm-category-left">
                    {hasChildren && (
                      <span className="adm-category-chevron">
                        {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                      </span>
                    )}
                    <span className="adm-category-emoji">{category.emoji || '📁'}</span>
                    <span className="adm-category-name">{category.name}</span>
                  </div>
                  {pendingCount > 0 && (
                    <Badge className="adm-category-badge">{pendingCount}</Badge>
                  )}
                </div>
                
                {/* Subcategorías */}
                {hasChildren && isExpanded && (
                  <div className="adm-subcategories-list">
                    {category.children.map(child => {
                      const childPending = pendingCounts.posts[child.slug] || 0;
                      const isChildActive = activeTab === 'posts' && selectedCategory?.subCategory === child.slug;
                      
                      return (
                        <div
                          key={child._id}
                          onClick={() => handleCategoryClick(child, true)}
                          className={`adm-subcategory-item ${isChildActive ? 'adm-active' : ''}`}
                        >
                          <span className="adm-subcategory-emoji">{child.emoji || '📄'}</span>
                          <span className="adm-subcategory-name">{child.name}</span>
                          {childPending > 0 && (
                            <Badge className="adm-subcategory-badge">{childPending}</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="adm-sidebar-footer">
        <div className="adm-footer-user">
          <div className="adm-user-avatar">
            {auth.user?.avatar ? (
              <img src={auth.user.avatar} alt="avatar" />
            ) : (
              <span>{auth.user?.name?.charAt(0) || auth.user?.username?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div className="adm-user-info">
            <div className="adm-user-name">{auth.user?.name || auth.user?.username || 'Admin'}</div>
            <div className="adm-user-role">{auth.user?.role === 'admin' ? 'Administrateur' : 'Moderateur'}</div>
          </div>
        </div>
        <div className="adm-footer-stats">
          <FaHourglassHalf />
          <span>{totalPending} en attente</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;