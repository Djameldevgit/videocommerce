import PostCard from '../../components/post-card/PostCard';
import { addView } from '../../redux/actions/postAction';
import PostThumb from '../../components/PostThumb';
import UserPosts from '../../components/UserPosts';
import { getDataAPI } from '../../utils/fetchData';







import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Spinner, Alert, Badge } from 'react-bootstrap';
 
import { getSimilarPosts, clearSimilarPosts } from '../../redux/actions/postAction';


const PostId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // REFs para control
  const hasFetchedPostRef = useRef(false);
  const hasFetchedSimilarRef = useRef(false);
  const previousIdRef = useRef(id);

  // LOG 1: Ver el estado completo
  const state = useSelector(state => {
    console.log('📊 LOG 1 - Estado completo:', {
      postsKeys: Object.keys(state.posts || {}),
      detailPost: state.detailPost?._id,
      auth: state.auth?.user?._id
    });
    return state;
  });

  const { posts = {}, detailPost = null, auth = {}, theme } = state;

  // LOG 2: Ver posts específicamente
  console.log('📊 LOG 2 - posts reducer:', {
    postsKeys: Object.keys(posts),
    hasSimilarPosts: 'similarPosts' in posts,
    similarPostsLength: posts.similarPosts?.length,
    similarLoading: posts.similarLoading
  });

  // Extraer valores
  const postsArray = posts.posts || [];
  const similarPosts = posts.similarPosts || posts.similarPostsArray || [];
  const similarLoading = posts.similarLoading || false;
  const detailPostData = detailPost;

  // LOG 3: Ver valores extraídos
  console.log('📊 LOG 3 - Valores extraídos:', {
    postsArrayLength: postsArray.length,
    similarPostsLength: similarPosts.length,
    similarLoading,
    detailPostData: detailPostData?._id
  });

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resetear refs cuando cambia el ID
  useEffect(() => {
    if (previousIdRef.current !== id) {
      console.log('🔄 ID cambiado, reseteando refs');
      hasFetchedPostRef.current = false;
      hasFetchedSimilarRef.current = false;
      previousIdRef.current = id;
      setLoading(true);
      setPost(null);
    }
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (hasFetchedPostRef.current) {
        setLoading(false);
        return;
      }

      console.log('🔍 Buscando post:', id);
      let current = null;

      if (detailPostData && detailPostData._id === id) {
        current = detailPostData;
        console.log('✅ Post encontrado en detailPost');
      }
      else if (postsArray.length > 0) {
        current = postsArray.find(p => p._id === id);
        if (current) {
          console.log('✅ Post encontrado en postsArray');
        }
      }

      if (!current) {
        try {
          console.log('📥 Obteniendo post de API:', id);
          const res = await getDataAPI(`post/${id}`);
          current = res.data?.post || res.data;
          
          if (current) {
            dispatch({ type: 'GET_POST', payload: current });
            console.log('📦 Post guardado en detailPost');
          }
        } catch (err) {
          console.error('❌ Error obteniendo post:', err);
          setLoading(false);
          return;
        }
      }

      if (current) {
        setPost(current);
        hasFetchedPostRef.current = true;
      }

      setLoading(false);
    };

    fetchPost();
  }, [id, detailPostData, postsArray, dispatch]);

  // useEffect para posts similares
  useEffect(() => {
    if (post && !hasFetchedSimilarRef.current && post.categorie && post.subCategory) {
      console.log('🔍 Buscando posts similares para:', {
        categorie: post.categorie,
        subCategory: post.subCategory
      });
      
      hasFetchedSimilarRef.current = true;
      dispatch(getSimilarPosts(id, { limit: 6 }));
    }

    return () => {
      dispatch(clearSimilarPosts());
    };
  }, [post, id, dispatch]);
  
  useEffect(() => {
    const viewed = localStorage.getItem(`viewed_${id}`);
    if (!viewed) {
      dispatch(addView(id));
      localStorage.setItem(`viewed_${id}`, true);
    }
  }, [id, dispatch]);
  
  // Actualizar post si cambia detailPost
  useEffect(() => {
    if (detailPostData && detailPostData._id === id && !hasFetchedPostRef.current) {
      setPost(detailPostData);
      hasFetchedPostRef.current = true;
      setLoading(false);
    }
  }, [detailPostData, id]);

  // LOG 4: Render con valores actuales
  console.log('🎨 LOG 4 - Render PostId:', {
    loading,
    hasPost: !!post,
    similarPostsLength: similarPosts.length,
    similarLoading
  });

  // Loading
  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement de la publication...</p>
      </Container>
    );
  }

  // No post found
  if (!post) {
    return (
      <Container className="text-center my-5 py-5">
        <Alert variant="warning">
          <Alert.Heading>Publication non trouvée</Alert.Heading>
          <p>La publication que vous recherchez n'existe pas ou a été supprimée.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="post-detail-page" style={{ maxWidth: '1200px' }}>
      {/* 1. POST DETAIL PRINCIPAL */}
      <div className="mb-5">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO EN HORIZONTAL CON SCROLL - UNA SOLA FILA */}
      {post.user && post.user._id && (
        <div className="mb-5">
          <div className="mb-4">
            <h5 className="fw-bold" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
              👤 Autres publications du vendeur
            </h5>
          </div>
          
          {/* Contenedor con scroll horizontal - UNA SOLA FILA */}
          <div
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              padding: '0.5rem 0 1rem 0',
              scrollbarWidth: 'thin',
              WebkitOverflowScrolling: 'touch',
            }}
            className="user-posts-horizontal-scroll"
          >
            <div style={{ display: 'flex', gap: '1rem', width: 'max-content', minWidth: '100%' }}>
              <UserPosts
                userId={post.user._id}
                auth={auth}
                limit={6}
                excludePostId={post._id}
                showTitle={false}
                gridView={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. POSTS SIMILARES */}
      {post.categorie && post.subCategory && (
        <div className="mb-5">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
                🔍 Publications similaires
              </h5>
              {similarPosts.length > 0 && !similarLoading && (
                <Badge bg="info" className="px-3 py-2">
                  {similarPosts.length} résultat{similarPosts.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-muted mb-4">
              Découvrez d'autres annonces similaires dans la même catégorie
            </p>
          </div>

          {/* Loading state */}
          {similarLoading && (
            <div className="text-center py-5" style={{
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Recherche de publications similaires...</p>
            </div>
          )}

          {/* Mostrar posts con PostThumb */}
          {!similarLoading && similarPosts.length > 0 && (
            <PostThumb posts={similarPosts} />
          )}

          {/* Mensaje cuando no hay posts */}
          {!similarLoading && similarPosts.length === 0 && (
            <Alert variant="light" className="text-center py-4" style={{
              background: '#f8f9fa',
              border: '1px dashed #dee2e6',
              borderRadius: '10px'
            }}>
              <div className="mb-2" style={{ fontSize: '2rem' }}>🔍</div>
              <p className="mb-0 text-muted">Aucune publication similaire trouvée</p>
            </Alert>
          )}
        </div>
      )}

      {/* Estilos para forzar UNA SOLA FILA horizontal y barra de scroll */}
      <style jsx="true">{`
        .user-posts-horizontal-scroll {
          width: 100%;
        }
        
        /* Forzar que el contenedor de UserPosts se muestre en UNA SOLA FILA */
        .user-posts-horizontal-scroll .row {
          flex-wrap: nowrap !important;
          overflow-x: visible !important;
          margin-right: 0 !important;
          margin-left: 0 !important;
          display: flex !important;
          gap: 1rem;
          width: max-content !important;
          min-width: 100%;
        }
        
        /* Cada columna debe tener ancho fijo y NO SALTAR DE LÍNEA */
        .user-posts-horizontal-scroll .row > [class*="col-"] {
          flex: 0 0 auto !important;
          width: 280px !important;
          max-width: 280px !important;
          padding-right: 0 !important;
          padding-left: 0 !important;
        }
        
        /* Ocultar cualquier fila adicional que pueda crear UserPosts */
        .user-posts-horizontal-scroll .row + .row {
          display: none !important;
        }
        
        /* Estilos para la barra de scroll */
        .user-posts-horizontal-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .user-posts-horizontal-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .user-posts-horizontal-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        
        .user-posts-horizontal-scroll::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </Container>
  );
};

export default PostId;