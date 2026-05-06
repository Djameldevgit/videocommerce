// pages/admin/Posts.js - Actualizado con pestaña Videos
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import { FaBars, FaSync, FaVideo } from 'react-icons/fa';

import AdminSidebar from '../../components/adminitration/adminApove/AdminSidebar';
 
import VideosTable from '../../components/adminitration/adminApove/VideosTable';
 
const Posts = () => {
  const location = useLocation();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [pagination, setPagination] = useState({
    posts: { total: 0, page: 1, totalPages: 1 },
    boutiques: { total: 0, page: 1, totalPages: 1 },
    productos: { total: 0, page: 1, totalPages: 1 },
    videos: { total: 0, page: 1, totalPages: 1 }
  });
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    
    if (tab && ['videos'].includes(tab)) {
      setActiveTab(tab);
    }
    
    if (category) {
      setSelectedCategory({ slug: category, name: category, subcategory });
    } else {
      setSelectedCategory(null);
    }
  }, [location.search]);
  
  const updateUrl = (tab, category, subcategory) => {
    const params = new URLSearchParams();
    if (tab) params.set('tab', tab);
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    
    const newUrl = `/admin/posts${params.toString() ? `?${params.toString()}` : ''}`;
    history.replace(newUrl);
  };
  
  const handleSelectCategory = (category, tab = 'posts') => {
    setActiveTab(tab);
    setSelectedCategory(category);
    updateUrl(tab, category?.slug, category?.subcategory);
    if (isMobile) setTimeout(() => setSidebarOpen(false), 300);
  };
  
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    updateUrl(tab, null, null);
    if (isMobile) setTimeout(() => setSidebarOpen(false), 300);
  };
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const handlePaginationUpdate = (tab, data) => {
    setPagination(prev => ({
      ...prev,
      [tab]: {
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1
      }
    }));
  };
  
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  
  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>⛔ Accès non autorisé</h5>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <Button variant="outline-danger" onClick={() => history.push('/')}>
            Retour à l'accueil
          </Button>
        </Alert>
      </Container>
    );
  }
  
  return (
    <div className="adm-posts-container">
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        activeTab={activeTab}
        refreshKey={refreshKey}
        isMobile={isMobile}
      />
      
      {sidebarOpen && (
        <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className="adm-main-content">
        <div className="adm-content-header">
          <div className="adm-header-left">
            <div>
              <h4 className="adm-title">
       
                {activeTab === 'videos' && '🎬 Gestion des Vidéos'}
              </h4>
              <p className="adm-subtitle">
                {selectedCategory ? `Filtré par: ${selectedCategory.name}` : 'Éléments en attente de validation'}
              </p>
            </div>
          </div>
          <button className="adm-refresh-btn" onClick={handleRefresh}>
            <FaSync className={loading ? 'adm-spin' : ''} />
            <span>Actualiser</span>
          </button>
        </div>
        
        {/* 🔥 Tabs con iconos - estilo móvil horizontal */}
        <div className="adm-tabs-container-with-menu">
          <div className="adm-tabs-wrapper">
          
          
            <button
              className={`adm-tab ${activeTab === 'videos' ? 'adm-tab-active' : ''}`}
              onClick={() => handleSelectTab('videos')}
            >
              <span>🎬</span>
              <span>Vidéos</span>
              {pagination.videos.total > 0 && (
                <span className="adm-tab-count">{pagination.videos.total}</span>
              )}
            </button>
          </div>
          
          <button 
            className="adm-menu-integrated-btn"
            onClick={() => setSidebarOpen(true)}
            title="Ouvrir le panneau de filtres"
          >
            <FaBars />
            <span>Filtres</span>
          </button>
        </div>
        
        <div className="adm-tables-container">
         
          
         
          
         
          {activeTab === 'videos' && (
            <VideosTable
              key={`videos-${refreshKey}`}
              onLoadingChange={setLoading}
              onPaginationUpdate={(data) => handlePaginationUpdate('videos', data)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;