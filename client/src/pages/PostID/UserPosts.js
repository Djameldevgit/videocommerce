// components/UserPosts/UserPosts.js
import React, { useState, useEffect } from 'react';
import LoadMoreBtn from '../../components/LoadMoreBtn';
import PostThumb from '../../components/PostThumb';
 
import LoadIcon from '../../images/loading.gif';
 
 
const fetchPublicAPI = async (url) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
};

const UserPosts = ({ 
    userId, 
    limit = 6, 
    showTitle = true,
    excludePostId = null // Para excluir el post actual en detail
}) => {
    
    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Cargar posts iniciales
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!userId) return;

            setLoading(true);
            try {
                const res = await fetchPublicAPI(
                    `public/user_posts/${userId}?limit=${limit}&page=1`
                );
                
                // Filtrar el post actual si se proporciona excludePostId
                let filteredPosts = res.posts || [];
                if (excludePostId) {
                    filteredPosts = filteredPosts.filter(post => post._id !== excludePostId);
                }
                
                setPosts(filteredPosts);
                setResult(res.result || 0);
                setPage(2); // Siguiente página
                setHasMore(res.hasMore || false);
            } catch (err) {
                console.error('Error cargando posts del usuario:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [userId, limit, excludePostId]); // Eliminada dependencia de auth.token

    // Cargar más posts
    const handleLoadMore = async () => {
        if (!hasMore || loading || !userId) return;
        
        setLoading(true);
        try {
            const res = await fetchPublicAPI(
                `public/user_posts/${userId}?limit=${limit}&page=${page}`
            );
            
            // Filtrar el post actual si se proporciona excludePostId
            let newPosts = res.posts || [];
            if (excludePostId) {
                newPosts = newPosts.filter(post => post._id !== excludePostId);
            }
            
            setPosts(prev => [...prev, ...newPosts]);
            setResult(res.result || 0);
            setPage(prev => prev + 1);
            setHasMore(res.hasMore || false);
        } catch (err) {
            console.error('Error cargando más posts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="text-center py-5">
                <h5 className="text-muted">Usuario no especificado</h5>
            </div>
        );
    }

    return (
        <div className="user-posts-container" style={{ marginTop: '30px' }}>
            {/* Header con título y contador */}
            {showTitle && (
                <div className="user-posts-header mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="user-posts-title fw-bold mb-0">
                            <i className="fas fa-store me-2 text-primary"></i>
                            Más publicaciones de este vendedor
                        </h4>
                        {result > 0 && (
                            <span className="user-posts-count badge bg-secondary">
                                {result} publicación{result !== 1 ? 'es' : ''}
                            </span>
                        )}
                    </div>
                    <hr className="mt-2 mb-4" />
                </div>
            )}

            {/* Loading inicial */}
            {loading && page === 1 ? (
                <div className="text-center py-5">
                    <img src={LoadIcon} alt="loading" className="mb-3" style={{ width: '50px' }} />
                    <p className="text-muted">Cargando publicaciones...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-inbox display-1 text-muted mb-3"></i>
                    <h5 className="text-muted">No hay más publicaciones de este usuario</h5>
                    <p className="text-muted small">Este vendedor no tiene otras publicaciones</p>
                </div>
            ) : (
                <>
                    {/* Grid de publicaciones */}
                    <div className="posts-grid-container">
                        <PostThumb posts={posts} result={result} />
                    </div>

                    {/* Botón "Cargar más" */}
                    {hasMore && (
                        <div className="text-center mt-4 pt-3 border-top">
                            <LoadMoreBtn 
                                result={result} 
                                page={page}
                                load={loading} 
                                handleLoadMore={handleLoadMore} 
                            />
                        </div>
                    )}
                </>
            )}

            {/* Estilos CSS (se mantienen igual) */}
            <style jsx>{`
                .user-posts-container {
                    background: transparent;
                    border-radius: 12px;
                    padding: 20px 0;
                }

                .user-posts-header {
                    padding: 0 15px;
                }

                .user-posts-title {
                    font-size: 1.25rem;
                    color: #333;
                    display: flex;
                    align-items: center;
                }

                .user-posts-count {
                    font-size: 0.9rem;
                    padding: 5px 12px;
                    border-radius: 20px;
                }

                .posts-grid-container {
                    padding: 10px 0;
                }

                @media (max-width: 768px) {
                    .user-posts-container {
                        padding: 15px 0;
                        margin-top: 20px;
                    }

                    .user-posts-title {
                        font-size: 1.1rem;
                    }

                    .user-posts-header {
                        margin-bottom: 20px;
                    }
                }

                @media (max-width: 576px) {
                    .user-posts-title {
                        font-size: 1rem;
                    }

                    .user-posts-count {
                        font-size: 0.8rem;
                        padding: 4px 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserPosts;