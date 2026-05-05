// src/pages/Home.jsx - VERSIÓN FINAL OPTIMIZADA

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategorySlider from '../components/CategorySlider';
import CategorySection from '../components/CategorySection';
import { getSliderCategories, getCategoriesWithVideos } from '../redux/actions/categoryAction';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const hasLoadedRef = useRef(false);
  const isReturningFromVideo = useRef(false);
  const initialLoadDone = useRef(false);
  const isFirstRender = useRef(true);
  
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const {
    sliderCategories = [],
    sliderLoading = false
  } = useSelector((state) => state.category || {});
  
  const {
    categoriesWithVideos = [],
    loadingCategoriesWithVideos = false,
    hasMoreCategoriesWithVideos = true,
    currentCategoriesPage = 1
  } = useSelector((state) => state.category || {});

  // ✅ Detectar si venimos de un video
  useEffect(() => {
    const returnToFeed = sessionStorage.getItem('returnToFeed');
    if (returnToFeed === 'true') {
      isReturningFromVideo.current = true;
      sessionStorage.removeItem('returnToFeed');
      console.log('🔄 Volviendo al Home desde un video');
    }
  }, []);

  // ✅ Carga inicial SOLO si es primera vez y no venimos de un video
  useEffect(() => {
    // Si venimos de un video y ya hay datos, no recargar
    if (isReturningFromVideo.current && categoriesWithVideos.length > 0) {
      console.log('⏭️ Evitando recarga al volver de video, datos existentes:', categoriesWithVideos.length);
      isReturningFromVideo.current = false;
      return;
    }
    
    // Si ya cargamos, no recargar
    if (hasLoadedRef.current) return;
    
    hasLoadedRef.current = true;
    
    console.log('🚀 Carga inicial del Home');
    
    if (sliderCategories.length === 0) {
      dispatch(getSliderCategories());
    }
    
    if (categoriesWithVideos.length === 0) {
      dispatch(getCategoriesWithVideos(1, 2));
    }
  }, [dispatch, sliderCategories.length, categoriesWithVideos.length]);

  // Marcar carga inicial completada
  useEffect(() => {
    if (categoriesWithVideos.length > 0 && !initialLoadDone.current) {
      initialLoadDone.current = true;
      console.log(`✅ Carga inicial completada: ${categoriesWithVideos.length} categorías`);
    }
  }, [categoriesWithVideos]);

  // ✅ Solo cargar más si realmente hay más
  const fetchMoreCategories = useCallback(() => {
    if (!hasMoreCategoriesWithVideos) {
      return;
    }
    
    if (loadingCategoriesWithVideos) {
      return;
    }
    
    const nextPage = currentCategoriesPage + 1;
    console.log(`📡 Cargando página ${nextPage}...`);
    dispatch(getCategoriesWithVideos(nextPage, 2));
  }, [dispatch, loadingCategoriesWithVideos, hasMoreCategoriesWithVideos, currentCategoriesPage]);

 // src/pages/Home.jsx

const handleCategoryClick = (category) => {
  const slug = typeof category === 'object' ? category.slug : category;
  if (slug) {
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('scrollPosition', window.scrollY);
    // ✅ CORREGIDO: quitar "/categoria/" y añadir "/1" para la página
    history.push(`/${slug}/1`);
  }
};

const handleViewMore = (slug, categoryName) => {
  sessionStorage.setItem('returnToFeed', 'true');
  sessionStorage.setItem('scrollPosition', window.scrollY);
  // ✅ CORREGIDO: quitar "/categoria/" y añadir "/1"
  history.push(`/${slug}/1`, { fromHome: true, categoryName });
};

 
  // Restaurar posición del scroll
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
        sessionStorage.removeItem('scrollPosition');
        console.log(`📍 Scroll restaurado a: ${savedScrollPosition}`);
      }, 100);
    }
  }, []);

  // Loading inicial
  if ((sliderLoading || loadingCategoriesWithVideos) && 
      categoriesWithVideos.length === 0 && 
      sliderCategories.length === 0) {
    return (
      <div className={`min-vh-100 d-flex align-items-center justify-content-center ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3 text-muted ms-2">Chargement des vidéos...</p>
      </div>
    );
  }

  return (
    <div className={`videocommerce-home ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      <div className="home-header">
        <Container fluid className="px-md-4">
          <CategorySlider 
            categories={sliderCategories} 
            onCategoryClick={handleCategoryClick} 
          />
        </Container>
      </div>

      <InfiniteScroll
        dataLength={categoriesWithVideos.length}
        next={fetchMoreCategories}
        hasMore={hasMoreCategoriesWithVideos && !loadingCategoriesWithVideos}
        loader={
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ms-2 text-muted">Chargement...</span>
          </div>
        }
        endMessage={
          <div className="text-center py-5">
            <i className="fas fa-check-circle fa-2x text-success mb-3"></i>
            <h5>Vous avez tout vu !</h5>
          </div>
        }
      >
        {categoriesWithVideos.map((category) => (
          <CategorySection
            key={category._id}
            category={category}
            videos={category.videos || []}
            onViewMore={handleViewMore}
          />
        ))}
      </InfiniteScroll>

      <style jsx="true">{`
        .videocommerce-home {
          min-height: 100vh;
        }
        
        .home-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: ${theme === 'dark' ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)'};
          backdrop-filter: blur(10px);
          border-bottom: 1px solid ${theme === 'dark' ? '#333' : '#eee'};
          padding: 12px 0;
        }
      `}</style>
    </div>
  );
};

export default Home;