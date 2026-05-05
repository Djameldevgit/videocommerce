// src/pages/Home.jsx - VERSIÓN GRID RESPONSIVE PARA PC

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSliderCategories } from '../redux/actions/categoryAction';
import { getTrendingVideos, getFeaturedVideos } from '../redux/actions/videoAction';
import { Container, Spinner, Row, Col } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainCategorySlider from '../components/SlidersCategories/CategorySlider';
import VideoCard from '../components/VideoCard'; // ← Usa VideoCard, no Feed

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const hasLoadedRef = useRef(false);
  
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const {
    sliderCategories = [],
    sliderLoading = false
  } = useSelector((state) => state.category || {});
  
  const {
    trendingVideos = [],
    trendingLoading = false,
    trendingHasMore = true,
    trendingPage = 1
  } = useSelector((state) => state.video || {});

  const feedVideos = trendingVideos;
  const feedLoading = trendingLoading;
  const feedHasMore = trendingHasMore;
  const feedPage = trendingPage;

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    
    dispatch(getSliderCategories());
    dispatch(getTrendingVideos('week', 1, 12)); // ← 12 por página
  }, [dispatch]);

  useEffect(() => {
    if (feedVideos.length > 0 && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [feedVideos, initialLoadDone]);

  const fetchMoreVideos = useCallback(() => {
    if (feedHasMore && !feedLoading && initialLoadDone) {
      const nextPage = feedPage + 1;
      dispatch(getTrendingVideos('week', nextPage, 12));
    }
  }, [dispatch, feedHasMore, feedLoading, feedPage, initialLoadDone]);

  const handleCategoryClick = (category) => {
    const slug = typeof category === 'object' ? category.slug : category;
    if (slug) history.push(`/categoria/${slug}`);
  };

  const handleVideoClick = (videoId) => {
    history.push(`/video/${videoId}`);
  };

  if ((sliderLoading || feedLoading) && feedVideos.length === 0 && !initialLoadDone) {
    return (
      <div className={`min-vh-100 d-flex align-items-center justify-content-center ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Chargement des vidéos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`videocommerce-home ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
      {/* Header con slider */}
      <div className="home-header">
        <Container fluid className="px-3 px-md-4">
          <MainCategorySlider 
            categories={sliderCategories}
            onCategoryClick={handleCategoryClick}
          />
        </Container>
      </div>

      {/* Grid de videos */}
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className={`mb-0 ${theme === 'dark' ? 'text-white' : 'text-dark'}`}>
            🎬 Vidéos tendance
          </h4>
          <span className="text-muted small">
            {feedVideos.length} vidéos
          </span>
        </div>

        <InfiniteScroll
          dataLength={feedVideos.length}
          next={fetchMoreVideos}
          hasMore={feedHasMore}
          loader={
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" size="sm" />
              <span className="ms-2 text-muted">Chargement...</span>
            </div>
          }
          endMessage={
            <div className="text-center py-5">
              <i className="fas fa-check-circle fa-2x text-success mb-3"></i>
              <h5 className="mb-2">Vous avez tout vu !</h5>
              <p className="text-muted">Revenez plus tard pour découvrir de nouvelles vidéos</p>
            </div>
          }
        >
          <Row className="g-3 g-md-4">
            {feedVideos.map((video) => (
              <Col 
                key={video._id} 
                xs={12} sm={6} md={4} lg={3} xl={3} xxl={2}
                className="video-grid-item"
              >
                <VideoCard 
                  video={video} 
                  onClick={() => handleVideoClick(video._id)}
                />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      </Container>

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
        
        .video-grid-item {
          transition: transform 0.2s;
          cursor: pointer;
        }
        
        .video-grid-item:hover {
          transform: translateY(-4px);
        }
        
        @media (max-width: 576px) {
          .video-grid-item {
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;