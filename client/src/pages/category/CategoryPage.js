// pages/CategoryPage.jsx - VERSIÓN COMPLETAMENTE ACTUALIZADA CON NAVEGACIÓN REEL
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button, Nav } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel, CameraVideo, Shop, Grid, ArrowUp, Grid3x3, Film } from 'react-bootstrap-icons';
import PostCard from "../../components/post-card/PostCard";
import VideoCard from "../../components/VideoCard";
const VideoReelItem = require('../video/Feed').default;
//import VideoReelItem from "../video/Feed.js";
import { getCategoryPosts } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory } from "../../redux/actions/boutiqueAction";
import { getVideos } from "../../redux/actions/videoAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import BoutiqueCard from "../../components/boutique/BoutiquePostCard";
import PaginationComponent from "../../components/PaginationComponent";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";
import FilterDrawer from "./FilterDrawer";
import HeaderVideo from '../HeaderVideo';



 
const POSTS_SCROLL_LIMIT = 50;

const CONTENT_TYPES = {
  POSTS: 'posts',
  BOUTIQUES: 'boutiques',
  VIDEOS: 'videos'
};

// Modo de visualización para videos
const VIDEO_VIEW_MODE = {
  REEL: 'reel',
  GRID: 'grid'
};

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug, page } = useParams();

  // ✅ Obtener auth y socket del store global
  const { auth, socket } = useSelector(state => state);

  const [activeContentType, setActiveContentType] = useState(CONTENT_TYPES.POSTS);
  const [videoViewMode, setVideoViewMode] = useState(() => {
    return slug === 'videos' && !subSlug ? VIDEO_VIEW_MODE.REEL : VIDEO_VIEW_MODE.GRID;
  });
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [currentReelIndex, setCurrentReelIndex] = useState(0); // ✅ Para navegación entre reels
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoReelsRef = useRef(null);
  const isScrollingRef = useRef(false);

  // Redirigir si no hay página en la URL
  useEffect(() => {
    if (!page && !subSlug && !articleSlug) {
      history.replace(`/${slug}/1${location.search}`);
      return;
    }
    if (subSlug && !page) {
      const newPath = articleSlug 
        ? `/${slug}/${subSlug}/${articleSlug}/1`
        : `/${slug}/${subSlug}/1`;
      history.replace(`${newPath}${location.search}`);
      return;
    }
  }, [slug, subSlug, articleSlug, page, history, location.search]);

  const isBoutique = slug === 'boutiques';
  const isVideo = slug === 'videos';
  const categoryData = useSelector(state => state.category.currentCategory);
  
  // Estados REDUX
  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    pagination: rawPagination = {},
  } = useSelector((state) => state.category || {});

  const categoryChildren = categoryInfo?.children || [];

  const categoryPath = isBoutique && subSlug 
    ? `boutiques/${subSlug}` 
    : isBoutique ? 'boutiques' : null;

  const boutiqueCategoryData = useSelector((state) => 
    categoryPath ? state.boutique?.boutiquesByCategory[categoryPath] : null
  );

  const boutiques = boutiqueCategoryData?.boutiques || [];
  const boutiquesLoading = useSelector((state) => 
    categoryPath ? state.boutique?.loadingByCategory[categoryPath] : false
  );
  const hasMoreBoutiques = boutiqueCategoryData?.hasMore || false;
  const boutiquePagination = {
    currentPage: boutiqueCategoryData?.page || 1,
    totalPages: boutiqueCategoryData?.totalPages || 1,
    totalPosts: boutiqueCategoryData?.total || 0,
    limit: 12,
    hasMore: boutiqueCategoryData?.hasMore || false
  };

  const videosState = useSelector((state) => state.video);
  const videos = videosState.videos || [];
  const videosLoading = videosState.loading || false;
  const hasMoreVideos = videosState.hasMore || false;
  const videoPagination = {
    currentPage: videosState.page || 1,
    totalPages: videosState.totalPages || 1,
    totalPosts: videosState.total || 0,
    limit: 12,
    hasMore: videosState.hasMore || false
  };

  // Estados locales
  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: page ? parseInt(page) : 1
  });

  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  const [filterMetadata, setFilterMetadata] = useState({
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    appliedFilters: {}
  });

  // ============================================
  // MODO REEL - DETECCIÓN DE SCROLL MANUAL
  // ============================================
  useEffect(() => {
    if (!isVideo || videoViewMode !== VIDEO_VIEW_MODE.REEL) return;
    
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      const container = videoReelsRef.current;
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      
      if (newIndex !== activeVideoIndex && newIndex >= 0 && newIndex < videos.length) {
        setActiveVideoIndex(newIndex);
        setCurrentReelIndex(newIndex); // ✅ Sincronizar currentReelIndex
      }
      
      setShowScrollTop(scrollTop > window.innerHeight * 2);
    };
    
    const container = videoReelsRef.current;
    if (container && videos.length > 0) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [videos.length, activeVideoIndex, isVideo, videoViewMode]);

  // ✅ Sincronizar currentReelIndex con activeVideoIndex
  useEffect(() => {
    setCurrentReelIndex(activeVideoIndex);
  }, [activeVideoIndex]);

  // ✅ Función para ir al siguiente video
  const handleNextVideo = useCallback(() => {
    if (currentReelIndex < videos.length - 1) {
      const newIndex = currentReelIndex + 1;
      setCurrentReelIndex(newIndex);
      setActiveVideoIndex(newIndex);
      // Scroll al siguiente video
      if (videoReelsRef.current) {
        const nextVideoTop = newIndex * window.innerHeight;
        videoReelsRef.current.scrollTo({ top: nextVideoTop, behavior: 'smooth' });
      }
    }
  }, [currentReelIndex, videos.length]);

  // ✅ Función para ir al video anterior
  const handlePreviousVideo = useCallback(() => {
    if (currentReelIndex > 0) {
      const newIndex = currentReelIndex - 1;
      setCurrentReelIndex(newIndex);
      setActiveVideoIndex(newIndex);
      // Scroll al video anterior
      if (videoReelsRef.current) {
        const prevVideoTop = newIndex * window.innerHeight;
        videoReelsRef.current.scrollTo({ top: prevVideoTop, behavior: 'smooth' });
      }
    }
  }, [currentReelIndex]);

  const scrollToTop = () => {
    if (videoReelsRef.current) {
      videoReelsRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveVideoIndex(0);
      setCurrentReelIndex(0);
    }
  };

  const countActiveFilters = () => {
    if (!activeFilters) return 0;
    let count = 0;
    if (activeFilters.wilaya && activeFilters.wilaya !== '') count++;
    if (activeFilters.commune && activeFilters.commune !== '') count++;
    if (!isBoutique && !isVideo) {
      if (activeFilters.minPrice && activeFilters.minPrice !== null) count++;
      if (activeFilters.maxPrice && activeFilters.maxPrice !== null) count++;
    }
    if (activeFilters.sortBy && activeFilters.sortBy !== 'recent') count++;
    if (activeFilters.searchTerm && activeFilters.searchTerm !== '') count++;
    return count;
  };

  const activeFilterCount = countActiveFilters();

  // Sincronizar estado con URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const wilaya = searchParams.get('wilaya') || '';
    const commune = searchParams.get('commune') || '';
    const minPrice = searchParams.get('minPrice') || null;
    const maxPrice = searchParams.get('maxPrice') || null;
    const sortBy = searchParams.get('sortBy') || 'recent';
    const searchTerm = searchParams.get('searchTerm') || '';
    
    const newPage = page ? parseInt(page) : 1;
    
    setFilters({
      sub: subSlug || null,
      article: articleSlug || null,
      page: newPage
    });
    
    setActiveFilters({
      wilaya,
      commune,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortBy,
      searchTerm
    });
  }, [subSlug, articleSlug, page, location.search]);

  const updateUrl = useCallback((newFilters, customActiveFilters = null) => {
    let basePath = `/${slug}`;
    
    if (newFilters.sub) {
      basePath += `/${newFilters.sub}`;
      if (!isBoutique && !isVideo && newFilters.article) {
        basePath += `/${newFilters.article}`;
      }
    }
    
    basePath += `/${newFilters.page || 1}`;
    
    const filtersToUse = customActiveFilters || activeFilters;
    
    const searchParams = new URLSearchParams();
    if (filtersToUse?.searchTerm && filtersToUse.searchTerm !== '') {
      searchParams.set('searchTerm', filtersToUse.searchTerm);
    }
    if (filtersToUse?.wilaya && filtersToUse.wilaya !== '') {
      searchParams.set('wilaya', filtersToUse.wilaya);
    }
    if (filtersToUse?.commune && filtersToUse.commune !== '') {
      searchParams.set('commune', filtersToUse.commune);
    }
    if (!isBoutique && !isVideo && filtersToUse?.minPrice && filtersToUse.minPrice !== null) {
      searchParams.set('minPrice', filtersToUse.minPrice);
    }
    if (!isBoutique && !isVideo && filtersToUse?.maxPrice && filtersToUse.maxPrice !== null) {
      searchParams.set('maxPrice', filtersToUse.maxPrice);
    }
    if (filtersToUse?.sortBy && filtersToUse.sortBy !== 'recent') {
      searchParams.set('sortBy', filtersToUse.sortBy);
    }
    
    const finalPath = searchParams.toString() ? `${basePath}?${searchParams.toString()}` : basePath;
    history.push(finalPath);
  }, [slug, history, isBoutique, isVideo, activeFilters]);

  const loadData = useCallback(async () => {
    if (!slug) return;
    
    try {
      if (isBoutique) {
        const res = await dispatch(getBoutiquesByCategory(
          slug, filters.sub, filters.page, 12,
          activeFilters?.wilaya || '', activeFilters?.commune || '',
          null, null, activeFilters?.sortBy || 'recent'
        ));
        if (res?.children) setAllChildren(res.children);
        if (res?.filterMetadata) setFilterMetadata(res.filterMetadata);
      } else if (isVideo) {
        const res = await dispatch(getVideos(
          slug, filters.sub, filters.page, 12,
          activeFilters?.sortBy || 'recent',
          activeFilters?.searchTerm || null
        ));
        if (res?.children && res.children.length > 0) {
          setAllChildren(res.children);
        }
      } else {
        const res = await dispatch(getCategoryPosts(
          slug, filters.sub, filters.article, filters.page, 12,
          activeFilters?.wilaya || '', activeFilters?.commune || '',
          activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
          activeFilters?.sortBy || 'recent'
        ));
        if (res?.children) {
          setAllChildren(res.children);
          if (filters.sub) {
            const foundSub = res.children.find((c) => c.slug === filters.sub);
            setCurrentSub(foundSub || null);
            if (filters.article && foundSub?.articles) {
              const foundArticle = foundSub.articles.find((a) => a.slug === filters.article);
              setCurrentArticle(foundArticle || null);
            } else {
              setCurrentArticle(null);
            }
          } else {
            setCurrentSub(null);
            setCurrentArticle(null);
          }
        }
        if (res?.filterMetadata) setFilterMetadata(res.filterMetadata);
      }
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setIsInitialLoad(false);
    }
  }, [slug, filters.sub, filters.article, filters.page, dispatch, isBoutique, isVideo, activeFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    if (slug) {
      let nombreCategoria = slug;
      if (isBoutique) nombreCategoria = "Boutiques";
      else if (isVideo) nombreCategoria = "Vidéos";
      else if (categoryInfo?.name) nombreCategoria = categoryInfo.name;
      items.push({ label: nombreCategoria, path: `/${slug}/1` });
    }
    if (currentSub) {
      items.push({ label: currentSub.name, path: `/${slug}/${currentSub.slug}/1` });
    }
    if (!isBoutique && !isVideo && currentArticle) {
      items.push({
        label: currentArticle.name,
        path: `/${slug}/${currentSub?.slug}/${currentArticle.slug}/1`,
      });
    }
    return items;
  };

  const loadMore = useCallback(() => {
    if (isBoutique) {
      if (!hasMoreBoutiques || boutiquesLoading) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getBoutiquesByCategory(slug, filters.sub, nextPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
    } else if (isVideo) {
      if (!hasMoreVideos || videosLoading) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getVideos(slug, filters.sub, nextPage, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, nextPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  }, [isBoutique, isVideo, hasMoreBoutiques, boutiquesLoading, hasMoreVideos, videosLoading,
      hasMorePosts, postsLoading, posts.length, filters, dispatch, slug, updateUrl, activeFilters]);

  const handleSliderClick = useCallback((item) => {
    let newFilters = { sub: item.slug, article: null, page: 1 };
    if (!isBoutique && !isVideo) {
      const isSubCategory = item.level === 2;
      if (isSubCategory) setCurrentSub(item);
      else setCurrentArticle(item);
    } else {
      setCurrentSub(item);
    }
    setFilters(newFilters);
    updateUrl(newFilters);
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, newFilters.sub, 1, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
    } else if (isVideo) {
      if (newFilters.sub) {
        setVideoViewMode(VIDEO_VIEW_MODE.GRID);
      }
      dispatch(getVideos(slug, newFilters.sub, 1, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, null, 1, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  }, [slug, dispatch, isBoutique, isVideo, updateUrl, activeFilters]);

  const getSliderItems = () => {
    if (currentSub && currentSub.articles?.length > 0 && !isBoutique && !isVideo) {
      return currentSub.articles;
    }
    if (allChildren.length > 0) return allChildren;
    if (categoryChildren.length > 0) return categoryChildren;
    return [];
  };

  const getActiveItem = () => {
    if (isBoutique || isVideo) return currentSub;
    if (currentArticle) return currentArticle;
    if (currentSub) return currentSub;
    return null;
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateUrl(newFilters);
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, filters.sub, newPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
    } else if (isVideo) {
      dispatch(getVideos(slug, filters.sub, newPage, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
    } else {
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, newPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  };

  const handleApplyFilters = useCallback((filtersFromDrawer) => {
    const newFilters = {
      sub: filtersFromDrawer.subCategory || null,
      article: filtersFromDrawer.article || null,
      page: 1
    };
    const newActiveFilters = {
      wilaya: filtersFromDrawer.wilaya || '',
      commune: filtersFromDrawer.commune || '',
      sortBy: filtersFromDrawer.sortBy || 'recent',
      searchTerm: filtersFromDrawer.searchTerm || ''
    };
    if (!isBoutique && !isVideo) {
      newActiveFilters.minPrice = filtersFromDrawer.priceMin || null;
      newActiveFilters.maxPrice = filtersFromDrawer.priceMax || null;
    }
    setActiveFilters(newActiveFilters);
    setFilters(newFilters);
    updateUrl(newFilters, newActiveFilters);
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, newFilters.sub, 1, 12,
        newActiveFilters.wilaya, newActiveFilters.commune,
        null, null, newActiveFilters.sortBy));
    } else if (isVideo) {
      dispatch(getVideos(slug, newFilters.sub, 1, 12,
        newActiveFilters.sortBy, newActiveFilters.searchTerm));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, newFilters.article, 1, 12,
        newActiveFilters.wilaya, newActiveFilters.commune,
        newActiveFilters.minPrice, newActiveFilters.maxPrice,
        newActiveFilters.sortBy));
    }
    setShowFilterDrawer(false);
  }, [slug, isBoutique, isVideo, dispatch, updateUrl]);

  // ✅ Función para manejar eliminación de video y recargar lista
  const handleVideoDeleted = useCallback((deletedVideoId) => {
    console.log('🗑️ Video eliminado:', deletedVideoId);
    // Recargar videos después de eliminar
    dispatch(getVideos(slug, filters.sub, 1, 12,
      activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
  }, [dispatch, slug, filters.sub, activeFilters]);

  const isLoading = isBoutique ? boutiquesLoading : (isVideo ? videosLoading : postsLoading);
  const items = isBoutique ? boutiques : (isVideo ? videos : posts);
  const hasMore = isBoutique ? hasMoreBoutiques : (isVideo ? hasMoreVideos : hasMorePosts);
  const paginationData = isBoutique ? boutiquePagination : (isVideo ? videoPagination : rawPagination);

  // Función para renderizar videos en modo grid
  const renderVideoGrid = () => {
    if (error) {
      return (
        <div className="text-center py-5">
          <h5 className="text-danger">Error</h5>
          <p className="text-muted">{error}</p>
        </div>
      );
    }

    if (isLoading && items.length === 0 && isInitialLoad) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Chargement des vidéos...</p>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <>
          <InfiniteScroll
            dataLength={items.length}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" variant="primary" />
                <p className="text-muted small mt-2">Chargement supplémentaire...</p>
              </div>
            }
            next={loadMore}
            scrollThreshold={0.9}
          >
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {items.map((video) => (
                <Col key={video._id}>
                  <VideoCard video={video} showActions={true} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>

          {paginationData.totalPages > 1 && (
            <div className="mt-4">
              <PaginationComponent
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      );
    }

    return (
      <div className="text-center py-5">
        <h4 className="text-secondary mb-3">Aucune vidéo trouvée</h4>
        <p className="text-muted">
          {currentSub
            ? `Aucune vidéo dans "${currentSub.name}"`
            : "Essayez une autre catégorie"}
        </p>
      </div>
    );
  };

  // ============================================
  // RENDER MODO REEL PARA VIDEOS (TIKTOK STYLE) - CORREGIDO
  // ============================================
  if (isVideo && videoViewMode === VIDEO_VIEW_MODE.REEL) {
    return (
      <>
        {/* Botón para cambiar a modo grid */}
        <button
          onClick={() => setVideoViewMode(VIDEO_VIEW_MODE.GRID)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1001,
            background: 'rgba(0,0,0,0.6)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)',
            fontSize: '14px'
          }}
        >
          <Grid3x3 size={18} />
          Mode Grid
        </button>

        <div 
          ref={videoReelsRef}
          className="video-reels-container"
          style={{
            height: '100vh',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollBehavior: 'smooth',
            backgroundColor: '#000'
          }}
        >
          {videos.map((video, index) => (
            <VideoReelItem
              key={video._id}
              video={video}
              isActive={index === currentReelIndex}
              onVideoDeleted={handleVideoDeleted}
              // ✅ PASAR LAS PROPS DE NAVEGACIÓN
              onNextVideo={handleNextVideo}
              onPreviousVideo={handlePreviousVideo}
              hasNext={index < videos.length - 1}
              hasPrev={index > 0}
            />
          ))}
        
        </div>
  <HeaderVideo/>
        {/* Botón scroll to top */}
        {showScrollTop && videos.length > 3 && (
          <button
            onClick={scrollToTop}
            className="scroll-top-btn"
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1000,
              backdropFilter: 'blur(5px)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ArrowUp size={24} />
          </button>
        )}

        <style>{`
          .video-reels-container {
            scroll-snap-type: y mandatory;
            overflow-y: scroll;
            height: 100vh;
            scrollbar-width: none;
          }
          .video-reels-container::-webkit-scrollbar {
            display: none;
          }
          .scroll-top-btn {
            animation: fadeInUp 0.3s ease;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </>
    );
  }

  // ============================================
  // RENDER NORMAL PARA POSTS, BOUTIQUES Y VIDEOS EN MODO GRID
  // ============================================
  const renderContent = () => {
    if (isVideo && videoViewMode === VIDEO_VIEW_MODE.GRID) {
      return renderVideoGrid();
    }

    if (error) {
      return (
        <div className="text-center py-5">
          <h5 className="text-danger">Error</h5>
          <p className="text-muted">{error}</p>
        </div>
      );
    }

    if (isLoading && items.length === 0 && isInitialLoad) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">
            {isBoutique ? 'Chargement des boutiques...' : 'Chargement des annonces...'}
          </p>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <>
          <InfiniteScroll
            dataLength={items.length}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" variant="primary" />
                <p className="text-muted small mt-2">Chargement supplémentaire...</p>
              </div>
            }
            next={loadMore}
            scrollThreshold={0.9}
          >
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {items.map((item) => (
                <Col key={item._id}>
                  {isBoutique ? (
                    <BoutiqueCard boutique={item} />
                  ) : (
                    <PostCard post={item} />
                  )}
                </Col>
              ))}
            </Row>
          </InfiniteScroll>

          {paginationData.totalPages > 1 && (
            <div className="mt-4">
              <PaginationComponent
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      );
    }

    return (
      <div className="text-center py-5">
        <h4 className="text-secondary mb-3">
          {isBoutique ? 'Aucune boutique trouvée' : 'Aucune annonce trouvée'}
        </h4>
        <p className="text-muted">
          {currentSub
            ? `Aucun résultat dans "${currentSub.name}"`
            : isBoutique ? "Essayez d'autres critères" : "Essayez une autre catégorie"}
        </p>
      </div>
    );
  };

  return (
    <div className="category-page">
      <CategoryCarousel categorySlug={slug} categoryName={categoryData?.name} />

      <main className="category-content">
        <Container>
          {!isBoutique && (
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <Nav variant="tabs" activeKey={activeContentType} onSelect={(k) => setActiveContentType(k)}>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.POSTS}>
                    <Grid className="me-1" size={16} /> Annonces
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.BOUTIQUES}>
                    <Shop className="me-1" size={16} /> Boutiques
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.VIDEOS}>
                    <CameraVideo className="me-1" size={16} /> Vidéos
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Botón para cambiar modo de vista en videos */}
              {activeContentType === CONTENT_TYPES.VIDEOS && isVideo && (
                <div className="d-flex gap-2">
                  <Button
                    variant={videoViewMode === VIDEO_VIEW_MODE.REEL ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => setVideoViewMode(VIDEO_VIEW_MODE.REEL)}
                    className="d-flex align-items-center gap-1"
                  >
                    <Film size={14} />
                    Reels
                  </Button>
                  <Button
                    variant={videoViewMode === VIDEO_VIEW_MODE.GRID ? "primary" : "outline-secondary"}
                    size="sm"
                    onClick={() => setVideoViewMode(VIDEO_VIEW_MODE.GRID)}
                    className="d-flex align-items-center gap-1"
                  >
                    <Grid3x3 size={14} />
                    Grille
                  </Button>
                </div>
              )}
            </div>
          )}

          {getSliderItems().length > 0 && (
            <div className="mb-4">
              <SliderUnificado
                items={getSliderItems()}
                activeItem={getActiveItem()}
                variant="categoryPage"
                showCount={true}
                maxRows={2}
                onItemClick={(item) => handleSliderClick(item)}
              />
            </div>
          )}
          
          <div className="mb-3">
            <BreadcrumbNav items={buildBreadcrumbItems()} onItemClick={(path) => history.push(path)} />
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">
                {isBoutique ? 'Boutiques' : (isVideo ? 'Vidéos' : 'Annonces')}
                {currentSub && <span className="text-muted ms-2">- {currentSub.name}</span>}
              </h4>
              {activeFilterCount > 0 && (
                <small className="text-muted">
                  {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif
                </small>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">{items.length} résultat{items.length > 1 ? 's' : ''}</span>
              <Button
                variant={activeFilterCount > 0 ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setShowFilterDrawer(true)}
                className="d-flex align-items-center gap-2 rounded-pill"
              >
                <Funnel size={16} />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </Button>
            </div>
          </div>

          <section className="content-section">
            {activeContentType === CONTENT_TYPES.POSTS && renderContent()}
            {activeContentType === CONTENT_TYPES.BOUTIQUES && (
              <CategoryPage slug="boutiques" {...({})} />
            )}
            {activeContentType === CONTENT_TYPES.VIDEOS && renderContent()}
          </section>
        </Container>
      </main>

      <FilterDrawer
        show={showFilterDrawer}
        onHide={() => setShowFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
        initialWilaya={activeFilters?.wilaya || ''}
        initialCommune={activeFilters?.commune || ''}
        initialSearchTerm={activeFilters?.searchTerm || ''}
        initialSortBy={activeFilters?.sortBy || 'recent'}
        isBoutique={isBoutique}
        isVideo={isVideo}
      />

      <style>{`
        .filter-badge {
          background-color: white;
          color: #667eea;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }
        .nav-tabs .nav-link {
          color: #666;
          border: none;
          padding: 10px 20px;
          font-weight: 500;
        }
        .nav-tabs .nav-link:hover {
          color: #667eea;
          border: none;
        }
        .nav-tabs .nav-link.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
          background: transparent;
        }
      `}</style>
   
    </div>
  );
};

export default CategoryPage;