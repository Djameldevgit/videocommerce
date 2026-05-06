// 📂 components/adminitration/adminApove/AdminSidebar.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Spinner } from 'react-bootstrap';
import { 
  FaVideo, FaChevronDown, FaChevronRight,
  FaClipboardList, FaHourglassHalf, FaTimes,
  FaBell
} from 'react-icons/fa';
import { getCategoriesForAccordion } from '../../../redux/actions/categoryAction';

const AdminSidebar = ({ isOpen, onToggle, onSelectCategory, selectedCategory, activeTab, isMobile }) => {
  const dispatch = useDispatch();
  const { accordionCategories = [], loading } = useSelector(state => state.category || {});
  const { auth } = useSelector(state => state);
  const [openCategories, setOpenCategories] = useState({});
  const [pendingVideosCount, setPendingVideosCount] = useState(0);
  
  // Cargar categorías
  useEffect(() => {
    if (accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length]);
  
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
      });
    } else {
      onSelectCategory({
        slug: category.slug,
        name: category.name,
        categorie: category.slug,
        subCategory: null
      });
    }
    
    if (isMobile) {
      setTimeout(() => onToggle(), 300);
    }
  };
  
  if (!isOpen) {
    return null;
  }
  
  if (loading) {
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
            <span>Gestion des vidéos</span>
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
          <div className="adm-summary-value">{pendingVideosCount}</div>
          <div className="adm-summary-footer">Vidéos à vérifier</div>
        </div>
        
        {/* Módulo Principal: Videos */}
        <div className="adm-nav-module">
          <div
            onClick={() => onSelectCategory(null)}
            className={`adm-nav-item ${activeTab === 'videos' && !selectedCategory ? 'adm-active' : ''}`}
          >
            <div className="adm-nav-icon adm-video">
              <FaVideo />
            </div>
            <div className="adm-nav-content">
              <span className="adm-nav-title">Vidéos</span>
              <span className="adm-nav-desc">Vidéos à valider</span>
            </div>
            {pendingVideosCount > 0 && (
              <Badge className="adm-nav-badge">{pendingVideosCount}</Badge>
            )}
          </div>
        </div>
        
        {/* Separador */}
        <div className="adm-sidebar-divider">
          <span>VIDÉOS PAR CATÉGORIE</span>
        </div>
        
        {/* Categorías */}
        <div className="adm-categories-list">
          {accordionCategories.map(category => {
            const isExpanded = openCategories[category._id];
            const hasChildren = category.children && category.children.length > 0;
            const isActive = activeTab === 'videos' && selectedCategory?.slug === category.slug;
            
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
                </div>
                
                {/* Subcategorías */}
                {hasChildren && isExpanded && (
                  <div className="adm-subcategories-list">
                    {category.children.map(child => {
                      const isChildActive = activeTab === 'videos' && selectedCategory?.subCategory === child.slug;
                      
                      return (
                        <div
                          key={child._id}
                          onClick={() => handleCategoryClick(child, true)}
                          className={`adm-subcategory-item ${isChildActive ? 'adm-active' : ''}`}
                        >
                          <span className="adm-subcategory-emoji">{child.emoji || '📄'}</span>
                          <span className="adm-subcategory-name">{child.name}</span>
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
          <span>{pendingVideosCount} en attente</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;