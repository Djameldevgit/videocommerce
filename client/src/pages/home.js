// src/pages/Home.jsx
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategorySlider from '../components/CategorySlider';
import CategorySection from '../components/CategorySection';
import { getSliderCategories, getCategoriesWithVideos } from '../redux/actions/categoryAction';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const history  = useHistory();

  const hasLoadedRef          = useRef(false);
  const isReturningFromVideo  = useRef(false);
  const initialLoadDone       = useRef(false);

  const { theme = 'light' } = useSelector(state => state.theme || {});

  const {
    sliderCategories               = [],
    sliderLoading                  = false,
    categoriesWithVideos           = [],
    loadingCategoriesWithVideos    = false,
    hasMoreCategoriesWithVideos    = true,
    currentCategoriesPage          = 1,
  } = useSelector(state => state.category || {});

  /* ── Detectar retorno desde video ────────────── */
  useEffect(() => {
    if (sessionStorage.getItem('returnToFeed') === 'true') {
      isReturningFromVideo.current = true;
      sessionStorage.removeItem('returnToFeed');
    }
  }, []);

  /* ── Carga inicial ───────────────────────────── */
  useEffect(() => {
    if (isReturningFromVideo.current && categoriesWithVideos.length > 0) {
      isReturningFromVideo.current = false;
      return;
    }
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    if (sliderCategories.length === 0)     dispatch(getSliderCategories());
    if (categoriesWithVideos.length === 0) dispatch(getCategoriesWithVideos(1, 2));
  }, [dispatch, sliderCategories.length, categoriesWithVideos.length]);

  useEffect(() => {
    if (categoriesWithVideos.length > 0 && !initialLoadDone.current) {
      initialLoadDone.current = true;
    }
  }, [categoriesWithVideos]);

  /* ── Scroll infinito ─────────────────────────── */
  const fetchMoreCategories = useCallback(() => {
    if (!hasMoreCategoriesWithVideos || loadingCategoriesWithVideos) return;
    dispatch(getCategoriesWithVideos(currentCategoriesPage + 1, 2));
  }, [dispatch, loadingCategoriesWithVideos, hasMoreCategoriesWithVideos, currentCategoriesPage]);

  /* ── Navegación ──────────────────────────────── */
  const handleCategoryClick = (category) => {
    const slug = typeof category === 'object' ? category.slug : category;
    if (!slug) return;
    sessionStorage.setItem('returnToFeed',    'true');
    sessionStorage.setItem('scrollPosition',  window.scrollY);
    history.push(`/${slug}/1`);
  };

  const handleViewMore = (slug, categoryName) => {
    sessionStorage.setItem('returnToFeed',   'true');
    sessionStorage.setItem('scrollPosition', window.scrollY);
    history.push(`/${slug}/1`, { fromHome: true, categoryName });
  };

  /* ── Restaurar scroll ────────────────────────── */
  useEffect(() => {
    const pos = sessionStorage.getItem('scrollPosition');
    if (pos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(pos));
        sessionStorage.removeItem('scrollPosition');
      }, 100);
    }
  }, []);

  /* ── Loading pantalla completa ───────────────── */
  const isFirstLoad =
    (sliderLoading || loadingCategoriesWithVideos) &&
    categoriesWithVideos.length === 0 &&
    sliderCategories.length     === 0;

  if (isFirstLoad) {
    return (
      <div className={`home-loading ${theme}`}>
        <Spinner animation="border" variant="primary" />
        <p>Chargement des vidéos...</p>
      </div>
    );
  }

  return (
    <div className={`home-root ${theme}`}>

      {/* Sticky category slider */}
      <header className="home-header">
        <CategorySlider
          categories={sliderCategories}
          onCategoryClick={handleCategoryClick}
        />
      </header>

      {/* Feed con scroll infinito */}
      <InfiniteScroll
        dataLength={categoriesWithVideos.length}
        next={fetchMoreCategories}
        hasMore={hasMoreCategoriesWithVideos && !loadingCategoriesWithVideos}
        loader={
          <div className="home-loader">
            <Spinner animation="border" size="sm" />
            <span>Chargement...</span>
          </div>
        }
        endMessage={
          <div className="home-end-msg">
            <i className="ti ti-circle-check" aria-hidden="true" />
            <p>Vous avez tout vu !</p>
          </div>
        }
      >
        {categoriesWithVideos.map((category, idx) => (
          <React.Fragment key={category._id}>
            <CategorySection
              category={category}
              videos={category.videos || []}
              colorIndex={idx}
              onViewMore={handleViewMore}
            />
            {idx < categoriesWithVideos.length - 1 && (
              <div className="home-divider" />
            )}
          </React.Fragment>
        ))}
      </InfiniteScroll>

    </div>
  );
};

export default Home;