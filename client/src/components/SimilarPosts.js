import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSimilarPosts } from '../redux/actions/postAction'; // Solo importa getSimilarPosts

const SimilarPosts = ({ category, subCategory, currentPostId }) => {
    const dispatch = useDispatch();
    
    // Obtener estado desde Redux
    const {
        similarPosts = [],
        similarLoading = false,
        similarHasMore = false,
        similarPage = 1,
        similarError = null,
        similarPostsCache = {}
    } = useSelector(state => state.post || {});
    
    // Memoizar el cache key
    const cacheKey = useMemo(() => 
        `${category}-${subCategory}`, [category, subCategory]
    );
    
    // Check cache
    const cachedData = similarPostsCache[cacheKey];
    
    console.log('🔍 SimilarPosts - State:', {
        category,
        subCategory,
        currentPostId,
        cacheKey,
        hasCache: !!cachedData,
        cacheCount: cachedData?.posts?.length,
        similarPostsCount: similarPosts.length,
        similarLoading,
        similarHasMore,
        similarPage,
        similarError
    });

    // Cargar posts similares
    const loadSimilarPosts = useCallback((page = 1) => {
        if (!category || !subCategory) {
            console.warn('Cannot load similar posts: missing category or subCategory');
            return;
        }
        
        console.log('📤 Loading similar posts, page:', page);
        
        dispatch(getSimilarPosts({
            category,
            subCategory,
            excludeId: currentPostId,
            limit: 6,
            page
        }));
    }, [category, subCategory, currentPostId, dispatch]);

    // Cargar inicialmente
    useEffect(() => {
        if (category && subCategory) {
            // Si ya tenemos cache, no cargar de nuevo
            if (cachedData && cachedData.posts.length > 0) {
                console.log('🎯 Using existing cache for:', cacheKey);
                return;
            }
            
            // Cargar primera página
            loadSimilarPosts(1);
        }
    }, [category, subCategory, dispatch, loadSimilarPosts, cachedData, cacheKey]);

    // Cargar más posts
    const handleLoadMore = useCallback(() => {
        if (similarHasMore && !similarLoading) {
            const nextPage = similarPage + 1;
            loadSimilarPosts(nextPage);
        }
    }, [similarHasMore, similarLoading, similarPage, loadSimilarPosts]);

    // ========== RENDERIZADO ==========

    // Validar props
    if (!category || !subCategory) {
        return (
            <div className="similar-posts mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold text-yellow-700 mb-2">⚠️ Configuración incompleta</h3>
                <p className="text-yellow-600 text-sm">
                    No se puede buscar posts similares sin categoría y subcategoría.
                </p>
            </div>
        );
    }

    // Error
    if (similarError) {
        return (
            <div className="similar-posts mt-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-bold text-red-700 mb-2">Error</h3>
                    <p className="text-red-600 text-sm">{similarError}</p>
                    <button 
                        onClick={() => loadSimilarPosts(1)}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // Loading inicial
    if (similarLoading && similarPosts.length === 0) {
        return (
            <div className="similar-posts mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
                    <p className="text-blue-700 font-medium">Buscando anuncios similares...</p>
                    <div className="mt-4 text-sm">
                        <p className="text-blue-600">
                            <strong>Categoría:</strong> {category}
                        </p>
                        <p className="text-blue-600">
                            <strong>Subcategoría:</strong> {subCategory}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // No hay posts
    const displayPosts = similarPosts.length > 0 ? similarPosts : [];
    
    if (!similarLoading && displayPosts.length === 0) {
        return (
            <div className="similar-posts mt-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-4">📭</div>
                    <h3 className="text-gray-700 font-bold mb-2">No hay anuncios similares</h3>
                    <p className="text-gray-600">
                        En <strong>{category}</strong> &gt; <strong>{subCategory}</strong>
                    </p>
                </div>
            </div>
        );
    }

    // ✅ Mostrar posts
    return (
        <div className="similar-posts">
            {/* Header */}
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Anuncios similares 
                            <span className="ml-2 bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                                {displayPosts.length}
                            </span>
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                            {category} &gt; {subCategory}
                            {similarPage > 1 && ` • Página ${similarPage}`}
                        </p>
                    </div>
                    
                    {similarHasMore && (
                        <button
                            onClick={handleLoadMore}
                            disabled={similarLoading}
                            className="mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                            {similarLoading ? 'Cargando...' : 'Ver más'}
                        </button>
                    )}
                </div>
            </div>

            {/* Grid de posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts
                    .filter(post => post && post._id && post._id !== currentPostId)
                    .map((post, index) => {
                        const postTitle = post.mixto?.title || post.title || 'Sin título';
                        const postPrice = post.mixto?.price || post.price || 0;
                        const postImage = post.images?.[0] || post.mixto?.images?.[0];
                        const postCategory = post.categorie || post.category || category;

                        return (
                            <Link
                                key={`${post._id}-${index}`}
                                to={`/post/${post._id}`}
                                className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
                            >
                                {/* Imagen */}
                                <div className="h-48 overflow-hidden bg-gray-100">
                                    {postImage ? (
                                        <img
                                            src={postImage}
                                            alt={postTitle}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <span className="text-gray-400">🖼️ Sin imagen</span>
                                        </div>
                                    )}
                                </div>

                                {/* Información */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 line-clamp-2 h-12 mb-3">
                                        {postTitle}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-green-600 font-bold">
                                            ${postPrice.toLocaleString()}
                                        </span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                            {postCategory}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
            </div>

            {/* Loading más posts */}
            {similarLoading && displayPosts.length > 0 && (
                <div className="text-center mt-6">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-gray-600 mt-2">Cargando más anuncios...</p>
                </div>
            )}

            {/* No hay más posts */}
            {!similarHasMore && displayPosts.length > 0 && (
                <div className="text-center mt-8 pt-6 border-t">
                    <p className="text-gray-600">
                        ✅ {displayPosts.length} anuncios similares
                    </p>
                </div>
            )}
        </div>
    );
};

export default SimilarPosts;