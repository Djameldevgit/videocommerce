// src/pages/Home.jsx - VERSIÓN CORREGIDA
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import HomeSlider from '../components/HomeSlider';
 
import CategorySection from '../components/CategorySection';
import { getSliderCategories, getCategoriesWithVideos } from '../redux/actions/categoryAction';

 
const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    sliderCategories = [],
    sliderLoading = false,
    categoriesWithVideos = [],
    loadingCategoriesWithVideos = false,
    hasMoreCategoriesWithVideos = true,
    currentCategoriesPage = 1,
  } = useSelector(state => state.category || {});

  // Sincronizar estado local con Redux
  useEffect(() => {
    if (categoriesWithVideos.length > 0) {
      setAllCategories(categoriesWithVideos);
      setHasMore(hasMoreCategoriesWithVideos);
      setPage(currentCategoriesPage);
      setIsInitialLoad(false);
      
      console.log('📊 Categorías cargadas:', categoriesWithVideos.length);
    }
  }, [categoriesWithVideos, hasMoreCategoriesWithVideos, currentCategoriesPage]);

  // Carga inicial
  useEffect(() => {
    console.log('🚀 [HOME] Iniciando carga inicial...');
    
    if (sliderCategories.length === 0 && !sliderLoading) {
      dispatch(getSliderCategories());
    }
    
    if (isInitialLoad && !loadingCategoriesWithVideos) {
      dispatch(getCategoriesWithVideos(1, 3));
    }
  }, []);

  // Scroll infinito
  const fetchMoreCategories = useCallback(() => {
    if (!hasMore || loadingCategoriesWithVideos) return;
    const nextPage = page + 1;
    dispatch(getCategoriesWithVideos(nextPage, 3));
  }, [hasMore, loadingCategoriesWithVideos, page, dispatch]);

  // ============================================
  // 🎯 FUNCIÓN CORREGIDA PARA EL SLIDER
  // ============================================
  const handleCategoryClick = useCallback((category) => {
    // Obtener el slug correctamente (puede ser objeto o string)
    const slug = category?.slug || category;
    
    if (!slug) {
      console.error('❌ [HOME] No se pudo obtener el slug:', category);
      return;
    }
    
    console.log('🖱️ [HOME] Click en categoría:', slug);
    
    // Guardar posición de scroll
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('scrollPosition', window.scrollY);
    
    // Navegar a la página de la categoría
    history.push(`/${slug}/1`);
  }, [history]);

  const handleViewMore = (slug, categoryName) => {
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/${slug}/1`, { fromHome: true, categoryName });
  };

  // Restaurar scroll
  useEffect(() => {
    const pos = sessionStorage.getItem('scrollPosition');
    if (pos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(pos));
        sessionStorage.removeItem('scrollPosition');
      }, 150);
    }
  }, []);

  const isLoading = isInitialLoad && loadingCategoriesWithVideos && allCategories.length === 0;
  
  if (isLoading) {
    return (
      <div className={`home-loading ${theme}`}>
        <Spinner animation="border" variant="primary" />
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className={`home-root ${theme}`}>
      <header className="home-header">
        <HomeSlider
          categories={sliderCategories}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      <InfiniteScroll
        dataLength={allCategories.length}
        next={fetchMoreCategories}
        hasMore={hasMore && !loadingCategoriesWithVideos}
        loader={
          <div className="home-loader">
            <Spinner animation="border" size="sm" />
            <span>Cargando más...</span>
          </div>
        }
        endMessage={
          allCategories.length > 0 && (
            <div className="home-end-msg">
              <p>✨ ¡Has visto todas las categorías! ✨</p>
            </div>
          )
        }
      >
        {allCategories.map((category, idx) => {
          const videos = category.videos || [];
          
          return (
            <React.Fragment key={category._id}>
              <CategorySection
                category={category}
                videos={videos}
                onViewMore={handleViewMore}
              />
              {idx < allCategories.length - 1 && <div className="home-divider" />}
            </React.Fragment>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Home;