// src/pages/PostId.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom'; // ✅ Agregar Link
import { useSelector, useDispatch } from 'react-redux';
import { Container, Spinner, Alert, Button } from 'react-bootstrap'; // ✅ Agregar Button
import { FaEyeSlash, FaLock, FaUserShield } from 'react-icons/fa'; // ✅ Iconos

import PostCard from '../../components/post-card/PostCard';
import GridUserPosts from './GridUsersPosts';
import GridPostsSimilar from './GridPostsSimilar';
import { addView } from '../../redux/actions/postAction';
import { getSimilarPosts, clearSimilarPosts } from '../../redux/actions/postAction';
import { getDataAPI } from '../../utils/fetchData';

const PostId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const hasFetchedPostRef = useRef(false);
  const hasFetchedSimilarRef = useRef(false);
  const previousIdRef = useRef(id);

  const { posts = {}, detailPost = null, auth = {}, theme } = useSelector(state => state);
  
  const postsArray = posts.posts || [];
  const similarPosts = posts.similarPosts || posts.similarPostsArray || [];
  const similarLoading = posts.similarLoading || false;
  const detailPostData = detailPost;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postExists, setPostExists] = useState(true); // ✅ Nuevo estado para saber si existe
  const [isPending, setIsPending] = useState(false); // ✅ Saber si está pendiente

  // Resetear refs cuando cambia el ID
  useEffect(() => {
    if (previousIdRef.current !== id) {
      hasFetchedPostRef.current = false;
      hasFetchedSimilarRef.current = false;
      previousIdRef.current = id;
      setLoading(true);
      setPost(null);
      setPostExists(true);
      setIsPending(false);
    }
  }, [id]);

  // Fetch post principal
 useEffect(() => {
  const fetchPost = async () => {
    if (hasFetchedPostRef.current) {
      setLoading(false);
      return;
    }

    let current = null;

    if (detailPostData && detailPostData._id === id) {
      current = detailPostData;
    }
    else if (postsArray.length > 0) {
      current = postsArray.find(p => p._id === id);
    }

    if (!current) {
      try {
        const res = await getDataAPI(`post/${id}`);
        current = res.data?.post || res.data;
        
        if (current) {
          dispatch({ type: 'GET_POST', payload: current });
        }
        
        // ✅ Verificar si el post está pendiente desde la respuesta
        if (res.data?.pendiente) {
          setIsPending(true);
          if (current) setPost(current);
        }
      } catch (err) {
        console.error('❌ Error obteniendo post:', err);
        
        // ✅ Si es 403, el post está pendiente y no tenemos acceso
        if (err.response?.status === 403) {
          setPostExists(true);
          setIsPending(true);
          
          // Intentar obtener datos básicos del error
          if (err.response?.data?.post) {
            setPost(err.response.data.post);
          }
        } else if (err.response?.status === 404) {
          setPostExists(false);
        }
        
        setLoading(false);
        return;
      }
    }

    if (current) {
      setPost(current);
      // ✅ Verificar si el post está pendiente
      setIsPending(current.pendiente || false);
      hasFetchedPostRef.current = true;
    }

    setLoading(false);
  };

  fetchPost();
}, [id, detailPostData, postsArray, dispatch]);
  // Fetch posts similares
  useEffect(() => {
    if (post && !hasFetchedSimilarRef.current && post.categorie && post.subCategory) {
      hasFetchedSimilarRef.current = true;
      dispatch(getSimilarPosts(id, { limit: 6 }));
    }

    return () => {
      dispatch(clearSimilarPosts());
    };
  }, [post, id, dispatch]);

  // Registrar vista
  useEffect(() => {
    if (post && !post.pendiente) {
      const viewed = localStorage.getItem(`viewed_${id}`);
      if (!viewed) {
        dispatch(addView(id));
        localStorage.setItem(`viewed_${id}`, true);
      }
    }
  }, [id, dispatch, post]);

  // Actualizar post si cambia detailPost
  useEffect(() => {
    if (detailPostData && detailPostData._id === id && !hasFetchedPostRef.current) {
      setPost(detailPostData);
      setIsPending(detailPostData.pendiente || false);
      hasFetchedPostRef.current = true;
      setLoading(false);
    }
  }, [detailPostData, id]);

  // Loading
  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement de la publication...</p>
      </Container>
    );
  }

  // ✅ MENSAJE PERSONALIZADO: Post no existe
  if (!postExists) {
    return (
      <Container className="text-center my-5 py-5">
        <Alert variant="warning">
          <Alert.Heading>
            <FaEyeSlash className="me-2" />
            Publication non trouvée
          </Alert.Heading>
          <p>La publication que vous recherchez n'existe pas ou a été supprimée.</p>
          <hr />
          <div className="d-flex justify-content-center gap-2">
            <Button variant="outline-primary" onClick={() => window.history.back()}>
              Retour
            </Button>
            <Link to="/" className="btn btn-primary">
              Accueil
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  // ✅ MENSAJE PERSONALIZADO: Post pendiente de aprobación
  if (isPending) {
    const isAdmin = auth.user?.role === 'admin';
    const isOwner = post?.user?._id === auth.user?._id;
    
    return (
      <Container className="text-center my-5 py-5">
        {isAdmin ? (
          // ✅ MENSAJE PARA ADMIN
          <Alert variant="info" className="shadow-sm">
            <Alert.Heading className="d-flex align-items-center justify-content-center gap-2">
              <FaUserShield className="text-primary" />
              Publication en attente d'approbation
            </Alert.Heading>
            <p className="mb-3">
              Cette publication a été soumise et attend votre approbation en tant qu'administrateur.
            </p>
            {post && (
              <div className="mb-3">
                <p className="fw-bold mb-1">{post.title}</p>
                <p className="text-muted small">
                  Par: {post.user?.username || 'Utilisateur'}
                </p>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-center gap-3">
              <Link 
                to="/admin/posts/pendientes" 
                className="btn btn-primary"
              >
                Voir les posts en attente
              </Link>
              <Button 
                variant="outline-secondary" 
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </div>
          </Alert>
        ) : isOwner ? (
          // ✅ MENSAJE PARA EL DUEÑO DEL POST
          <Alert variant="warning" className="shadow-sm">
            <Alert.Heading className="d-flex align-items-center justify-content-center gap-2">
              <FaLock className="text-warning" />
              Votre annonce est en cours de validation
            </Alert.Heading>
            <p className="mb-2">
              Votre annonce a bien été soumise et est actuellement en attente de validation par notre équipe.
            </p>
            <p className="mb-3 text-muted">
              Vous recevrez une notification dès qu'elle sera approuvée ou si des modifications sont nécessaires.
            </p>
            {post && (
              <div className="bg-light p-3 rounded mb-3">
                <p className="fw-bold mb-1">{post.title}</p>
                <p className="text-muted small mb-0">
                  Soumis le: {new Date(post.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-center gap-3">
              <Link to={`/profile/${auth.user?._id}`} className="btn btn-primary">
                Voir mes annonces
              </Link>
              <Link to="/" className="btn btn-outline-secondary">
                Accueil
              </Link>
            </div>
          </Alert>
        ) : (
          // ✅ MENSAJE PARA OTROS USUARIOS (no dueño, no admin)
          <Alert variant="secondary" className="shadow-sm">
            <Alert.Heading className="d-flex align-items-center justify-content-center gap-2">
              <FaLock />
              Publication non disponible
            </Alert.Heading>
            <p>
              Cette publication n'est pas encore disponible. Elle est en attente de validation par nos modérateurs.
            </p>
            <hr />
            <Button variant="outline-primary" onClick={() => window.history.back()}>
              Retour
            </Button>
          </Alert>
        )}
      </Container>
    );
  }

  // ✅ Post aprobado - Mostrar normalmente
  return (
    <Container className="post-detail-page" style={{ maxWidth: '1200px' }}>
      {/* 1. POST DETAIL PRINCIPAL */}
      <div className="mb-5">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO EN HORIZONTAL */}
      {post.user && post.user._id && (
        <GridUserPosts
          userId={post.user._id}
          auth={auth}
          excludePostId={post._id}
          limit={6}
        />
      )}

      {/* 3. POSTS SIMILARES EN VERTICAL */}
      {post.categorie && post.subCategory && (
        <GridPostsSimilar
          similarPosts={similarPosts}
          loading={similarLoading}
          categorie={post.categorie}
          subCategory={post.subCategory}
        /> 
      )}
    </Container>
  );
};

export default PostId;