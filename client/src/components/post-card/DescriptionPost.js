import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { Card, Badge  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';

moment.locale('fr');

const DescriptionPost = ({ post }) => {
    const dispatch = useDispatch();
    const { accordionCategories = [], accordionLoading } = useSelector(state => state.category || {});
    const history = useHistory();
    
    const [mainImage, setMainImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const imageLoadTimeoutRef = useRef(null);

    useEffect(() => {
        if (accordionCategories.length === 0 && !accordionLoading) {
            dispatch(getCategoriesForAccordion());
        }
    }, [dispatch, accordionCategories.length, accordionLoading]);

    const postData = useMemo(() => {
        if (!post) return {};
        const allData = { ...post };
        if (post.categorySpecificData && typeof post.categorySpecificData === 'object') {
            Object.assign(allData, post.categorySpecificData);
        }
        return allData;
    }, [post]);

    useEffect(() => {
        if (post?.images && post.images.length > 0) {
            const firstImage = post.images[0];
            const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
            if (imageUrl) {
                setMainImage(imageUrl);
                setSelectedImageIndex(0);
                setIsImageLoaded(false);
                if (imageLoadTimeoutRef.current) {
                    clearTimeout(imageLoadTimeoutRef.current);
                }
                imageLoadTimeoutRef.current = setTimeout(() => {
                    setIsImageLoaded(true);
                }, 3000);
            }
        }
        return () => {
            if (imageLoadTimeoutRef.current) {
                clearTimeout(imageLoadTimeoutRef.current);
            }
        };
    }, [post]);

    const handleThumbnailClick = useCallback((imageUrl, index) => {
        if (!imageUrl) return;
        setIsImageLoaded(false);
        setMainImage(imageUrl);
        setSelectedImageIndex(index);
        
        if (imageLoadTimeoutRef.current) {
            clearTimeout(imageLoadTimeoutRef.current);
        }
        imageLoadTimeoutRef.current = setTimeout(() => {
            setIsImageLoaded(true);
        }, 3000);
    }, []);

    const handlePrevImage = useCallback(() => {
        if (!post?.images || post.images.length === 0) return;
        const newIndex = selectedImageIndex === 0 ? post.images.length - 1 : selectedImageIndex - 1;
        const imageUrl = typeof post.images[newIndex] === 'string' ? post.images[newIndex] : post.images[newIndex]?.url;
        if (imageUrl) {
            setIsImageLoaded(false);
            setMainImage(imageUrl);
            setSelectedImageIndex(newIndex);
            
            if (imageLoadTimeoutRef.current) {
                clearTimeout(imageLoadTimeoutRef.current);
            }
            imageLoadTimeoutRef.current = setTimeout(() => {
                setIsImageLoaded(true);
            }, 3000);
        }
    }, [post, selectedImageIndex]);

    const handleNextImage = useCallback(() => {
        if (!post?.images || post.images.length === 0) return;
        const newIndex = selectedImageIndex === post.images.length - 1 ? 0 : selectedImageIndex + 1;
        const imageUrl = typeof post.images[newIndex] === 'string' ? post.images[newIndex] : post.images[newIndex]?.url;
        if (imageUrl) {
            setIsImageLoaded(false);
            setMainImage(imageUrl);
            setSelectedImageIndex(newIndex);
            
            if (imageLoadTimeoutRef.current) {
                clearTimeout(imageLoadTimeoutRef.current);
            }
            imageLoadTimeoutRef.current = setTimeout(() => {
                setIsImageLoaded(true);
            }, 3000);
        }
    }, [post, selectedImageIndex]);

    const handleThumbnailScroll = useCallback((e) => {
        const container = e.currentTarget;
        const isAtEnd = container.scrollWidth - container.scrollLeft - container.clientWidth < 10;
        if (isAtEnd && !isLoadingMore) {
            console.log('Fin du scroll de miniatures');
        }
    }, [isLoadingMore]);

    const getCategoryDisplay = useCallback(() => {
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const articleType = postData.articleType;

        if (!categorie) return null;

        let fallbackPath = categorie;
        if (subCategory) fallbackPath += ` → ${subCategory}`;
        if (articleType && articleType !== subCategory) fallbackPath += ` → ${articleType}`;

        if (accordionCategories.length === 0) return fallbackPath;

        const mainCat = accordionCategories.find(c => c.slug === categorie || c.name === categorie);
        if (!mainCat) return fallbackPath;

        let path = mainCat.name;

        if (subCategory) {
            const level1 = mainCat.children?.find(c => c.slug === subCategory || c.name === subCategory);
            if (level1) {
                path += ` → ${level1.name}`;
                if (articleType && articleType !== subCategory) {
                    const level2 = level1.children?.find(c => c.slug === articleType || c.name === articleType);
                    path += ` → ${level2 ? level2.name : articleType}`;
                }
            } else {
                for (const l1 of mainCat.children || []) {
                    const l2 = l1.children?.find(c => c.slug === subCategory || c.name === subCategory);
                    if (l2) {
                        path += ` → ${l1.name} → ${l2.name}`;
                        break;
                    }
                }
            }
        } else if (articleType) {
            for (const l1 of mainCat.children || []) {
                const l2 = l1.children?.find(c => c.slug === articleType || c.name === articleType);
                if (l2) {
                    path += ` → ${l1.name} → ${l2.name}`;
                    break;
                }
            }
        }
        return path;
    }, [postData, accordionCategories]);

    const fieldIconMap = {
        'price': '💰',
        'etat': '⭐',
        'views': '👁️',
        'createdAt': '📅',
        'marque': '🚗',
        'modele': '🚘',
        'annee': '📅',
        'kilometrage': '🛣️',
        'carburant': '⛽',
        'boiteVitesse': '⚙️',
        'couleur': '🎨',
        'surface': '📏',
        'chambres': '🛏️',
        'pieces': '🏠',
        'sallesBain': '🚿',
        'etage': '🏢',
        'meuble': '🪑',
        'jardin': '🌳',
        'parking': '🅿️',
        'climatisation': '❄️',
        'chauffage': '🔥',
        'piscine': '🏊',
        'ascenseur': '🛗',
        'quartier': '📍',
        'operationType': '📝',
        'typeImmobilier': '🏠',
        'ram': '💾',
        'stockage': '💿',
        'processeur': '⚙️',
        'ecran': '🖥️',
        'camera': '📷',
        'batterie': '🔋',
        'capaciteStockage': '💾',
        'taille': '📏',
        'matiere': '🧵',
        'genre': '👤',
        'default': '📋'
    };

    const getFieldIcon = (field) => fieldIconMap[field] || fieldIconMap.default;

    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') return null;
        if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
        if (typeof value === 'number') {
            if (field === 'price') return new Intl.NumberFormat('fr-DZ').format(value) + ' DA';
            if (field === 'kilometrage') return new Intl.NumberFormat('fr-DZ').format(value) + ' km';
            if (field === 'surface') return new Intl.NumberFormat('fr-DZ').format(value) + ' m²';
            if (field === 'views') return new Intl.NumberFormat('fr-DZ').format(value);
            return new Intl.NumberFormat('fr-DZ').format(value);
        }
        if (field === 'createdAt' || field === 'updatedAt') return moment(value).format('DD/MM/YYYY');
        if (Array.isArray(value)) {
            if (value.length === 0) return null;
            return value.join(', ');
        }
        return String(value).trim().charAt(0).toUpperCase() + String(value).trim().slice(1);
    };

    const translateField = (field) => {
        const translations = {
            'price': 'Prix',
            'etat': 'État',
            'views': 'Vues',
            'createdAt': 'Publié le',
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte de vitesse',
            'couleur': 'Couleur',
            'surface': 'Surface',
            'chambres': 'Chambres',
            'pieces': 'Pièces',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'parking': 'Parking',
            'climatisation': 'Climatisation',
            'chauffage': 'Chauffage',
            'piscine': 'Piscine',
            'ascenseur': 'Ascenseur',
            'quartier': 'Quartier',
            'operationType': "Type d'opération",
            'typeImmobilier': 'Type de bien',
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            'capaciteStockage': 'Capacité',
            'taille': 'Taille',
            'matiere': 'Matière',
            'genre': 'Genre'
        };
        return translations[field] || field;
    };

    const getFieldsToDisplay = useMemo(() => {
        if (!postData) return [];
        
        const excludeFields = [
            '_id', '__v', 'user', 'categorySpecificData', 'images',
            'updatedAt', 'isActive', 'likes', 'comments',
            'boutique', 'isFromBoutique', 'category', 'title',
            'description', 'wilaya', 'commune', 'address',
            'phone', 'email', 'website', 'slug', 'score',
            'lastInteractionAt', 'categorie', 'subCategory', 'articleType',
            'price', 'etat', 'views', 'createdAt'
        ];
        
        const fields = Object.keys(postData).filter(field => {
            if (excludeFields.includes(field)) return false;
            const value = postData[field];
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        });

        const priorityOrder = [
            'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'couleur',
            'operationType', 'typeImmobilier', 'pieces', 'surface', 'chambres', 'sallesBain',
            'etage', 'meuble', 'jardin', 'parking', 'climatisation', 'chauffage', 'piscine', 'ascenseur', 'quartier',
            'processeur', 'ram', 'stockage', 'ecran', 'camera', 'batterie', 'capaciteStockage',
            'taille', 'matiere', 'genre'
        ];

        return fields.sort((a, b) => {
            const ia = priorityOrder.indexOf(a);
            const ib = priorityOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [postData]);

    const sellerInfo = useMemo(() => {
        if (!post) return null;
        return {
            name: post.user?.username || post.user?.name || 'Annonceur',
            avatar: post.user?.avatar,
            phone: post.phone || postData.telephone,
            email: post.email,
            wilaya: post.wilaya,
            commune: post.commune,
            address: post.address
        };
    }, [post, postData]);

    const fieldsToDisplay = getFieldsToDisplay;
    const hasImages = post?.images && post.images.length > 0;
    const imagesList = post?.images || [];
    const hasMultipleImages = imagesList.length > 1;
    const needsScroll = imagesList.length > (window.innerWidth < 768 ? 4 : 6);

    return (
        <div className="description-post">
            {/* GALERÍA DE IMÁGENES */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-0">
                    <div className="image-gallery">
                        {hasImages ? (
                            <>
                                <div className="main-image-container">
                                    {hasMultipleImages && (
                                        <button 
                                            className="nav-arrow prev-arrow" 
                                            onClick={handlePrevImage}
                                            aria-label="Image précédente"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    )}
                                    <div className="main-image-wrapper">
                                        <img 
                                            src={mainImage} 
                                            alt={post.title || 'Image principale'}
                                            className={`main-image ${isImageLoaded ? 'loaded' : 'loading'}`}
                                            onLoad={() => {
                                                setIsImageLoaded(true);
                                                if (imageLoadTimeoutRef.current) {
                                                    clearTimeout(imageLoadTimeoutRef.current);
                                                }
                                            }}
                                            onError={() => {
                                                setIsImageLoaded(true);
                                                if (imageLoadTimeoutRef.current) {
                                                    clearTimeout(imageLoadTimeoutRef.current);
                                                }
                                            }}
                                        />
                                        {!isImageLoaded && (
                                            <div className="image-loader">
                                                <div className="spinner-border text-primary" style={{ width: '1.5rem', height: '1.5rem' }}></div>
                                            </div>
                                        )}
                                    </div>
                                    {hasMultipleImages && (
                                        <button 
                                            className="nav-arrow next-arrow" 
                                            onClick={handleNextImage}
                                            aria-label="Image suivante"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    )}
                                    {hasMultipleImages && (
                                        <div className="image-counter">
                                            {selectedImageIndex + 1} / {imagesList.length}
                                        </div>
                                    )}
                                </div>
                                
                                {hasMultipleImages && (
                                    <div 
                                        className={`thumbnail-container ${needsScroll ? 'has-scroll' : ''}`}
                                        onScroll={handleThumbnailScroll}
                                    >
                                        {imagesList.map((img, index) => {
                                            const imageUrl = typeof img === 'string' ? img : img?.url;
                                            return (
                                                <div 
                                                    key={index}
                                                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                                    onClick={() => handleThumbnailClick(imageUrl, index)}
                                                >
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={`Image ${index + 1}`}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-image-placeholder">
                                <i className="fas fa-image"></i>
                                <p>Aucune image disponible</p>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>

            {/* DÉTAILS DE L'ANNONCE */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                        <i className="fas fa-info-circle text-primary me-2"></i>
                        Détails de l'annonce
                    </h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {/* Título */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                    <i className="fas fa-heading"></i>
                                </div>
                            </div>
                            <span className="fw-bold text-dark">{postData.title || 'Annonce'}</span>
                        </div>
                    </div>
                    
                    {/* Categoría */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                    <i className="fas fa-folder-open"></i>
                                </div>
                                <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>Catégorie:</span>
                            </div>
                            <span className="fw-bold text-dark">{getCategoryDisplay() || postData.categorie}</span>
                        </div>
                    </div>
                   
                    {/* Precio */}
                    {postData.price !== undefined && postData.price !== null && (
                        <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                        <i className="fas fa-tag"></i>
                                    </div>
                                    <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>Prix:</span>
                                </div>
                                <span className="fw-bold text-dark" style={{ color: '#dc2626', fontSize: '1.25rem' }}>
                                    {new Intl.NumberFormat('fr-DZ').format(postData.price)} DA
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {/* Estado */}
                    {postData.etat && (
                        <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                        <i className="fas fa-star"></i>
                                    </div>
                                    <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>État:</span>
                                </div>
                                <Badge bg="secondary" className="fw-bold">
                                    {postData.etat === 'neuf' ? 'Neuf' : 
                                     postData.etat === 'excellent' ? 'Excellent état' :
                                     postData.etat === 'bon' ? 'Bon état' :
                                     postData.etat === 'occasion' ? 'Occasion' : postData.etat}
                                </Badge>
                            </div>
                        </div>
                    )}
                    
                    {/* Teléfono */}
                    {sellerInfo?.phone && (
                        <div className="p-3 border-bottom">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>Téléphone:</span>
                                </div>
                                <a href={`tel:${sellerInfo.phone}`} className="fw-bold text-dark text-decoration-none">
                                    {sellerInfo.phone}
                                </a>
                            </div>
                        </div>
                    )}
                    
                    {/* Vistas */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                    <i className="fas fa-eye"></i>
                                </div>
                                <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>Vues:</span>
                            </div>
                            <span className="fw-bold text-dark">{postData.views || 0}</span>
                        </div>
                    </div>
                    
                    {/* Fecha */}
                    <div className="p-3">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <span className="me-2" style={{ color: '#1a5bbf', fontWeight: '500' }}>Publié le:</span>
                            </div>
                            <span className="fw-bold text-dark">{moment(post.createdAt).format('DD/MM/YYYY')}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* CARACTÉRISTIQUES DÉTAILLÉES */}
            {fieldsToDisplay.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold text-dark">
                            <i className="fas fa-list-ul text-primary me-2"></i>
                            Caractéristiques détaillées
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {fieldsToDisplay.map(field => {
                            const value = formatValue(field, postData[field]);
                            if (!value) return null;
                            return (
                                <div key={field} className="p-3 border-bottom">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                                                {getFieldIcon(field)}
                                            </div>
                                            <span className="text-muted" style={{ color: '#1a5bbf !important', fontWeight: '500' }}>{translateField(field)}:</span>
                                        </div>
                                        <span className="fw-bold text-dark">{value}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </Card.Body>
                </Card>
            )}

            {/* DESCRIPTION */}
            {postData.description && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-2">
                        <h5 className="mb-0 fw-bold">
                            <i className="fas fa-align-left text-primary me-2"></i>
                            Description
                        </h5>
                    </Card.Header>
                    <Card.Body>
                        <p className="mb-0" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {postData.description}
                        </p>
                    </Card.Body>
                </Card>
            )}

            {/* ESTILOS ADICIONALES */}
            <style>{`
                .image-gallery {
                    border-radius: 12px;
                    overflow: hidden;
                }
                .main-image-container {
                    position: relative;
                    aspect-ratio: 1 / 1;
                    background-color: #f5f5f5;
                    overflow: hidden;
                }
                .main-image-wrapper {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    transition: opacity 0.3s ease;
                    opacity: 0;
                    background-color: #f5f5f5;
                }
                .main-image.loaded {
                    opacity: 1;
                }
                .nav-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    background: rgba(0, 0, 0, 0.6);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 10;
                }
                .nav-arrow:hover {
                    background: rgba(0, 0, 0, 0.8);
                    transform: translateY(-50%) scale(1.05);
                }
                .prev-arrow { left: 1rem; }
                .next-arrow { right: 1rem; }
                .image-counter {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    z-index: 10;
                }
                .thumbnail-container {
                    display: flex;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: white;
                    border-top: 1px solid #e9ecef;
                }
                .thumbnail-container.has-scroll {
                    overflow-x: auto;
                }
                .thumbnail-container:not(.has-scroll) {
                    justify-content: center;
                }
                .thumbnail-container::-webkit-scrollbar {
                    height: 8px;
                }
                .thumbnail-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .thumbnail-container::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 10px;
                }
                .thumbnail {
                    flex-shrink: 0;
                    width: 70px;
                    height: 70px;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s ease;
                    background-color: #f5f5f5;
                }
                .thumbnail:hover {
                    transform: scale(1.05);
                    border-color: #4f46e5;
                }
                .thumbnail.active {
                    border-color: #4f46e5;
                    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
                }
                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .no-image-placeholder {
                    aspect-ratio: 1 / 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f5f5f5, #e9ecef);
                    color: #adb5bd;
                }
                .no-image-placeholder i {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                .image-loader {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                @media (max-width: 768px) {
                    .thumbnail { width: 60px; height: 60px; }
                    .nav-arrow { width: 32px; height: 32px; }
                }
                @media (max-width: 576px) {
                    .thumbnail { width: 50px; height: 50px; }
                }
            `}</style>
        </div>
    );
};

export default DescriptionPost;