import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PostCard from '../PostCard';

const Posts = ({ 
    selectedCategory, 
    selectedSubcategory,
    fromCategoryPage = false,
    fromSubcategoryPage = false,
    fromImmobilerPage = false,
    displayMode = 'grid',
    page = 1
}) => {
    const location = useLocation();
    const { homePosts } = useSelector(state => state);
    
    console.log('🔍 Posts - Parámetros recibidos:', {
        selectedCategory,
        selectedSubcategory,
        fromCategoryPage,
        fromSubcategoryPage,
        fromImmobilerPage,
        page,
        path: location.pathname,
        search: location.search
    });
    
    // Leer parámetros de filtro de la URL
    const queryParams = useMemo(() => {
        return new URLSearchParams(location.search);
    }, [location.search]);
    
    const filterFromUrl = queryParams.get('filter');
    const filterLabelFromUrl = queryParams.get('filterLabel');
    
    // 📌 LÓGICA MEJORADA DE FILTRADO CON FILTROS DE URL
    const displayPosts = useMemo(() => {
        let postsToShow = [];
        
        console.log('🔄 Calculando posts a mostrar...', {
            filterFromUrl,
            filterLabelFromUrl,
            postsInHome: homePosts?.posts?.length,
            categorySpecificPosts: homePosts?.categorySpecificPosts?.length,
            categoryPosts: homePosts?.categoryPosts ? Object.keys(homePosts.categoryPosts) : []
        });
        
        // 🎯 CASO 1: Filtro desde URL (CategoryPage con filtro local)
        if (filterFromUrl && selectedCategory && fromCategoryPage) {
            console.log(`🎯 Aplicando filtro desde URL: ${filterFromUrl} (${filterLabelFromUrl})`);
            
            // Intentar obtener posts de categorySpecificPosts primero
            if (homePosts.categorySpecificPosts && homePosts.categorySpecificPosts.length > 0) {
                console.log(`📦 Filtrando ${homePosts.categorySpecificPosts.length} posts de categorySpecificPosts`);
                postsToShow = homePosts.categorySpecificPosts.filter(post => {
                    const matches = post.subCategory === filterFromUrl || 
                                   post.title?.toLowerCase().includes(filterFromUrl.toLowerCase());
                    return matches;
                });
                console.log(`✅ Encontrados ${postsToShow.length} posts después del filtro`);
            }
            
            // Si no hay resultados, intentar con categoryPosts
            if (postsToShow.length === 0 && homePosts.categoryPosts && homePosts.categoryPosts[selectedCategory]) {
                console.log(`📦 Intentando con categoryPosts para ${selectedCategory}`);
                const categoryPosts = homePosts.categoryPosts[selectedCategory] || [];
                postsToShow = categoryPosts.filter(post => 
                    post.subCategory === filterFromUrl
                );
                console.log(`✅ Encontrados ${postsToShow.length} posts en categoryPosts`);
            }
            
            // Si todavía no hay resultados, intentar con posts generales
            if (postsToShow.length === 0 && homePosts.posts && homePosts.posts.length > 0) {
                console.log(`📦 Intentando con posts generales`);
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === selectedCategory && 
                    post.subCategory === filterFromUrl
                );
                console.log(`✅ Encontrados ${postsToShow.length} posts en posts generales`);
            }
        }
        
        // 🏠 CASO 2: Página de IMMOBILIER
        else if (fromImmobilerPage) {
            console.log('🏠 ImmobilerPage - Mostrando posts de immobiler');
            
            if (homePosts.immobilierPosts && homePosts.immobilierPosts.length > 0) {
                postsToShow = homePosts.immobilierPosts;
                
                // Filtrar por propertyType si estamos en nivel 2
                if (selectedSubcategory && location.pathname.includes('/immobilier/')) {
                    const pathParts = location.pathname.split('/').filter(p => p);
                    if (pathParts.length === 4 && pathParts[1] === 'immobilier') {
                        const propertyId = pathParts[3];
                        console.log(`🏠 Nivel 2 de immobiler - Filtrando por propiedad: ${propertyId}`);
                        
                        postsToShow = postsToShow.filter(post => 
                            post.propertyType === propertyId || 
                            post.subCategory?.includes(propertyId)
                        );
                    }
                }
            } else if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === 'immobilier'
                );
                
                if (selectedSubcategory) {
                    postsToShow = postsToShow.filter(post => {
                        return post.operationType === selectedSubcategory ||
                               post.subCategory === selectedSubcategory;
                    });
                }
            }
        }
        
        // 📂 CASO 3: Página de SUBCATEGORÍA normal
        else if (fromSubcategoryPage || (selectedSubcategory && selectedCategory)) {
            console.log('📂 SubcategoryPage - Filtrando por subcategoría');
            
            if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => {
                    const matchesCategory = !selectedCategory || post.categorie === selectedCategory;
                    const matchesSubcategory = !selectedSubcategory || post.subCategory === selectedSubcategory;
                    return matchesCategory && matchesSubcategory;
                });
            } else if (homePosts.categorySpecificPosts && homePosts.categorySpecificPosts.length > 0) {
                postsToShow = homePosts.categorySpecificPosts.filter(post => 
                    post.subCategory === selectedSubcategory
                );
            }
        }
        
        // 🏘️ CASO 4: Página de CATEGORÍA específica (sin filtro)
        else if (fromCategoryPage || location.pathname.startsWith('/category/')) {
            console.log('📂 CategoryPage - Usando posts de categoría');
            
            // Prioridad 1: categorySpecificPosts
            if (homePosts.categorySpecificPosts && homePosts.categorySpecificPosts.length > 0) {
                postsToShow = homePosts.categorySpecificPosts;
            }
            // Prioridad 2: categoryPosts
            else if (homePosts.categoryPosts && homePosts.categoryPosts[selectedCategory]) {
                postsToShow = homePosts.categoryPosts[selectedCategory] || [];
            }
            // Prioridad 3: filtrar manualmente
            else if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === selectedCategory
                );
            }
        }
        
        // 🏠 CASO 5: Home con categoría específica
        else if (homePosts.categoryPosts && homePosts.categoryPosts[selectedCategory]) {
            console.log(`🏠 Home - Mostrando categoría ${selectedCategory}`);
            postsToShow = homePosts.categoryPosts[selectedCategory] || [];
        }
        
        // 🏠 CASO 6: Home con todas las categorías
        else if (selectedCategory === 'all' || !selectedCategory) {
            console.log('🏠 Home - Mostrando TODOS los posts');
            postsToShow = homePosts.posts || [];
        }
        
        // 🔍 CASO 7: Filtro simple por categoría
        else if (selectedCategory && !selectedSubcategory && !fromCategoryPage) {
            console.log(`🔍 Filtrando por categoría: ${selectedCategory}`);
            if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === selectedCategory
                );
            }
        }
        
        // 📊 DEPURACIÓN: Información sobre los posts encontrados
        console.log(`📊 Resultado final: ${postsToShow.length} posts a mostrar`);
        if (postsToShow.length > 0) {
            console.log('🔍 Ejemplo de posts:', postsToShow.slice(0, 2).map(post => ({
                id: post._id?.substring(0, 8),
                categorie: post.categorie,
                subCategory: post.subCategory,
                title: post.title?.substring(0, 40)
            })));
        }
        
        // 🔄 Paginación simple (si es necesario)
        if (page > 1 && postsToShow.length > 20) {
            const itemsPerPage = 20;
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            postsToShow = postsToShow.slice(startIndex, endIndex);
        }
        
        return postsToShow;
        
    }, [
        homePosts, 
        selectedCategory, 
        selectedSubcategory, 
        fromCategoryPage, 
        fromSubcategoryPage, 
        fromImmobilerPage, 
        location.pathname,
        filterFromUrl,
        filterLabelFromUrl,
        page
    ]);
    
    // 📌 MENSAJE CUANDO NO HAY POSTS
    const getEmptyMessage = () => {
        // Caso de filtro desde URL
        if (filterFromUrl && filterLabelFromUrl) {
            return `Aucune annonce disponible pour "${filterLabelFromUrl}"`;
        }
        
        if (fromImmobilerPage && selectedSubcategory) {
            const operationNames = {
                'vente': 'Vente',
                'location': 'Location',
                'location_vacances': 'Location Vacances',
                'cherche_location': 'Cherche Location',
                'cherche_achat': 'Cherche Achat'
            };
            const operationName = operationNames[selectedSubcategory] || selectedSubcategory;
            return `Aucune annonce disponible pour "${operationName}"`;
        }
        
        if (fromImmobilerPage) {
            return 'Aucune annonce immobilière disponible';
        }
        
        if (selectedSubcategory) {
            return `Aucune annonce dans "${selectedSubcategory}"`;
        }
        
        if (selectedCategory && selectedCategory !== 'all') {
            return `Aucune annonce dans "${selectedCategory}"`;
        }
        
        return 'Aucune annonce publiée pour le moment';
    };
    
    // 📌 EMOJI PARA ESTADO VACÍO
    const getEmptyEmoji = () => {
        if (filterFromUrl) return '🔍';
        if (fromImmobilerPage) return '🏠';
        if (selectedSubcategory) return '📂';
        return '📭';
    };
    
    // 📌 RENDERIZAR POSTS EN MODO HORIZONTAL O GRID
    const renderPosts = () => {
        if (displayMode === 'horizontal') {
            return (
                <div className="horizontal-posts-container">
                    <div className="horizontal-posts-scroll">
                        {displayPosts.map(post => (
                            <div key={post._id} className="horizontal-post-item">
                                <PostCard post={post} />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        // Modo grid por defecto
        return (
            <div className="post_thumb">
                {displayPosts.map(post => (
                    <div key={post._id} className="post_thumb_display">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        );
    };
    
    // 📌 RENDERIZAR ESTADO VACÍO
    const renderEmptyState = () => {
        return (
            <div className="text-center py-5">
                <div className="display-1 mb-3" style={{ opacity: 0.5 }}>
                    {getEmptyEmoji()}
                </div>
                <h4 className="text-muted mb-3">
                    {getEmptyMessage()}
                </h4>
                
                {/* Mensajes contextuales */}
                {filterFromUrl && (
                    <p className="text-muted mb-4">
                        Essayez de supprimer le filtre ou de chercher dans d'autres catégories
                    </p>
                )}
                
                {/* Botones de acción */}
                <div className="mt-4">
                    {filterFromUrl ? (
                        <button 
                            onClick={() => {
                                // Limpiar filtro de la URL
                                const newUrl = `${location.pathname}`;
                                window.location.href = newUrl;
                            }}
                            className="btn btn-primary me-2"
                        >
                            <i className="fas fa-times me-2"></i>
                            Supprimer le filtre
                        </button>
                    ) : null}
                    
                    <a href="/" className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    };
    
    // 📌 ESTADOS DE CARGA
    if (!homePosts) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Chargement des annonces...</p>
            </div>
        );
    }
    
    // 📌 VERIFICAR SI HAY POSTS PARA MOSTRAR
    if (!displayPosts || displayPosts.length === 0) {
        return renderEmptyState();
    }
    
    // 📌 RENDERIZAR LOS POSTS
    return (
        <div className="posts-container">
            {/* Información sobre los posts mostrados */}
            {filterFromUrl && (
                <div className="mb-4 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="text-muted">Filtre actif:</span>
                            <span className="ms-2 badge bg-primary">
                                {filterLabelFromUrl || filterFromUrl}
                            </span>
                            <span className="ms-3 text-muted">
                                ({displayPosts.length} annonce{displayPosts.length !== 1 ? 's' : ''})
                            </span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Posts */}
            {renderPosts()}
            
            {/* Paginación simple (si es necesario) */}
            {displayPosts.length >= 20 && (
                <div className="mt-4 text-center">
                    <div className="btn-group" role="group">
                        <button 
                            className="btn btn-outline-primary"
                            disabled={page <= 1}
                            onClick={() => {
                                const newPage = page - 1;
                                window.location.href = `${location.pathname}?page=${newPage}`;
                            }}
                        >
                            <i className="fas fa-chevron-left me-1"></i>
                            Précédent
                        </button>
                        <span className="btn btn-light">
                            Page {page}
                        </span>
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => {
                                const newPage = page + 1;
                                window.location.href = `${location.pathname}?page=${newPage}`;
                            }}
                        >
                            Suivant
                            <i className="fas fa-chevron-right ms-1"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Posts;