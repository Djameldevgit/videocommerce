import React, { useState, useEffect } from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { PROFILE_TYPES } from '../../redux/actions/profileAction'
import { Alert, Spinner, Button, Row, Col } from 'react-bootstrap'
import { PlusCircle, Images } from 'react-bootstrap-icons'

const Posts = ({ auth, id, dispatch, profile }) => {
    // 🔍 Obtener posts del estado global
    const userPostsData = profile.posts.find(item => item._id === id);
    
    const [loadingMore, setLoadingMore] = useState(false)
    const [error, setError] = useState(null)
    
    // 📊 Datos actuales
    const currentPosts = userPostsData?.posts || [];
    const totalPosts = userPostsData?.result || 0;
    const currentPage = userPostsData?.page || 1;

    console.log('📊 Estado actual de posts:', {
        id,
        userPostsData,
        currentPosts: currentPosts.length,
        totalPosts,
        currentPage,
        hasUserData: !!userPostsData
    });

    // 🚀 Cargar más posts
    const handleLoadMore = async () => {
        if (!auth.token || loadingMore) return;

        try {
            setLoadingMore(true);
            setError(null);
            
            const nextPage = currentPage + 1;
            console.log(`📥 Cargando página ${nextPage} para usuario ${id}`);
            
            const res = await getDataAPI(
                `user_posts/${id}?limit=9&page=${nextPage}`, 
                auth.token
            );
            
            console.log('📄 Respuesta de API:', res.data);
            
            if (res.data.success && res.data.posts) {
                const newPosts = res.data.posts || [];
                
                dispatch({
                    type: PROFILE_TYPES.UPDATE_POST,
                    payload: {
                        _id: id,
                        posts: newPosts,
                        page: nextPage,
                        result: res.data.pagination?.totalPosts || totalPosts
                    }
                });
                
                console.log(`✅ ${newPosts.length} nuevos posts añadidos`);
            } else {
                setError(res.data.message || 'No hay más posts');
            }
        } catch (err) {
            console.error('❌ Error cargando más posts:', err);
            setError(err.response?.data?.message || 'Error de conexión');
        } finally {
            setLoadingMore(false);
        }
    };

    // 🔄 Si no hay datos, cargarlos
    useEffect(() => {
        if (!userPostsData && auth.token && id) {
            console.log('🔄 Cargando posts iniciales para:', id);
            // El efecto de getProfileUsers en el componente Profile debería cargarlos
        }
    }, [userPostsData, auth.token, id]);

    // ⏳ Mostrar loading si el perfil está cargando
    if (profile.loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des publications...</p>
            </div>
        );
    }

    // 📭 Si no hay posts
    if (!userPostsData || currentPosts.length === 0) {
        return (
            <div className="text-center py-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <div className="mb-4">
                            <Images size={64} className="text-muted" />
                        </div>
                        <h5 className="mb-3">Aucune publication</h5>
                        <p className="text-muted mb-4">
                            {auth.user?._id === id 
                                ? "Vous n'avez pas encore publié d'annonces."
                                : "Cet utilisateur n'a pas encore publié d'annonces."
                            }
                        </p>
                        {auth.user?._id === id && (
                            <Button 
                                variant="primary"
                                href="/create-post"
                                className="rounded-pill px-4"
                            >
                                <PlusCircle className="me-2" />
                                Publier votre première annonce
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div className="posts-container">
            {/* Encabezado con contador */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">Publications</h5>
                    <p className="text-muted small mb-0">
                        {currentPosts.length} sur {totalPosts} publications
                    </p>
                </div>
                
                {auth.user?._id === id && (
                    <Button 
                        variant="outline-primary"
                        size="sm"
                        href="/create-post"
                        className="rounded-pill"
                    >
                        <PlusCircle size={16} className="me-2" />
                        Nouveau
                    </Button>
                )}
            </div>

            {/* Grid de posts */}
            <PostThumb posts={currentPosts} result={currentPosts.length} />

            {/* Mensaje de error */}
            {error && (
                <Alert 
                    variant="danger" 
                    className="mt-4"
                    dismissible
                    onClose={() => setError(null)}
                >
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </Alert>
            )}

            {/* Botón Cargar Más */}
            {totalPosts > currentPosts.length && (
                <div className="text-center mt-5">
                    <Button
                        variant="outline-primary"
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-5 py-2 rounded-pill"
                    >
                        {loadingMore ? (
                            <>
                                <Spinner 
                                    animation="border" 
                                    size="sm" 
                                    className="me-2" 
                                />
                                Chargement...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-arrow-down me-2"></i>
                                Charger plus 
                                <span className="ms-2 badge bg-primary">
                                    {totalPosts - currentPosts.length}
                                </span>
                            </>
                        )}
                    </Button>
                    
                    <p className="text-muted small mt-2">
                        Page {currentPage} sur {Math.ceil(totalPosts / 9)}
                    </p>
                </div>
            )}

            {/* Indicador de fin */}
            {totalPosts > 0 && totalPosts === currentPosts.length && (
                <div className="text-center mt-4">
                    <Alert variant="success" className="d-inline-block">
                        <i className="fas fa-check-circle me-2"></i>
                        Toutes les publications sont chargées
                    </Alert>
                </div>
            )}
        </div>
    );
};

export default Posts;