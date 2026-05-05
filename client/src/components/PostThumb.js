// 📂 frontend/src/components/PostThumb.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, 
  HeartFill, 
  Bookmark, 
  BookmarkFill,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Image as ImageIcon,
  GeoAlt
} from 'react-bootstrap-icons';
import { Modal, Button } from 'react-bootstrap';
import { likePost, unLikePost, savePost, unSavePost } from '../redux/actions/postAction';
import ImageWithFallback from './ImageWithFallback';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const PostThumb = ({ posts }) => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [likedPosts, setLikedPosts] = useState({});
    const [savedPosts, setSavedPosts] = useState({});
    const [carouselIndexes, setCarouselIndexes] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;

    useEffect(() => {
        if (!Array.isArray(posts)) return;
        const initialLikes = {};
        const initialSaved = {};
        const initialCarousel = {};
        
        posts.forEach(post => {
            if (!post || !post._id) return;
            if (post.likes?.some(like => like._id === auth.user?._id)) {
                initialLikes[post._id] = true;
            }
            if (auth.user?.saved?.includes(post._id)) {
                initialSaved[post._id] = true;
            }
            initialCarousel[post._id] = 0;
        });
        
        setLikedPosts(initialLikes);
        setSavedPosts(initialSaved);
        setCarouselIndexes(initialCarousel);
    }, [posts, auth.user]);

    const formatPrice = (price) => {
        if (!price && price !== 0) return null;
        return `${price?.toLocaleString()} DA`;
    };

    const getPostImages = (post) => {
        if (!post) return [];
        if (Array.isArray(post.images) && post.images.length > 0) {
            return post.images.map(img => {
                if (typeof img === 'string') return img;
                if (img?.url) return img.url;
                if (img?.secure_url) return img.secure_url;
                return null;
            }).filter(Boolean);
        }
        if (post.image) {
            if (typeof post.image === 'string') return [post.image];
            if (post.image.url) return [post.image.url];
        }
        return [];
    };

    const getDisplayTitle = (post) => {
        if (post.title) return post.title;
        if (post.subCategory && post.articleType) {
            return `${post.subCategory} ${post.articleType}`;
        }
        return post.subCategory || post.articleType || 'Annonce';
    };

    const getLocation = (post) => {
        const wilaya = post.wilaya || post.location?.wilaya;
        const commune = post.commune || post.location?.commune;
        if (!wilaya && !commune) return null;
        return `${wilaya || ''} ${commune ? `- ${commune}` : ''}`;
    };

    const handleLike = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.token) {
            setShowModal(true);
            return;
        }
        
        const postId = post._id;
        const wasLiked = likedPosts[postId];
        setLikedPosts(prev => ({ ...prev, [postId]: !wasLiked }));
        
        try {
            if (wasLiked) {
                await dispatch(unLikePost({ post, auth }));
            } else {
                await dispatch(likePost({ post, auth }));
            }
        } catch (error) {
            setLikedPosts(prev => ({ ...prev, [postId]: wasLiked }));
        }
    };

    const handleSave = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.token) {
            setShowModal(true);
            return;
        }
        
        const postId = post._id;
        const wasSaved = savedPosts[postId];
        setSavedPosts(prev => ({ ...prev, [postId]: !wasSaved }));
        
        try {
            if (wasSaved) {
                await dispatch(unSavePost({ post, auth }));
            } else {
                await dispatch(savePost({ post, auth }));
            }
        } catch (error) {
            setSavedPosts(prev => ({ ...prev, [postId]: wasSaved }));
        }
    };

    const handleCarouselPrev = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            return { ...prev, [postId]: newIndex };
        });
    };

    const handleCarouselNext = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            return { ...prev, [postId]: newIndex };
        });
    };

    if (!Array.isArray(posts) || posts.length === 0) {
        return null;
    }

    return (
        <div className="post-thumb-horizontal">
            {posts.map((post) => {
                if (!post || !post._id) return null;
                
                const images = getPostImages(post);
                const currentImageIndex = carouselIndexes[post._id] || 0;
                const hasMultipleImages = images.length > 1;
                const currentImage = images[currentImageIndex];
                
                return (
                    <div key={post._id} className="post-thumb-horizontal-item">
                        <Link to={`/post/${post._id}`} className="post-thumb-horizontal-link">
                            <div className="post-thumb-horizontal-card">
                                {/* Imagen */}
                                <div className="post-thumb-horizontal-image-container">
                                    {currentImage ? (
                                        <>
                                            <ImageWithFallback
                                                src={currentImage}
                                                alt={getDisplayTitle(post)}
                                                className="post-thumb-horizontal-image"
                                                fallbackSrc="https://via.placeholder.com/120x120/e5e7eb/9ca3af?text=Image"
                                            />
                                            
                                            {hasMultipleImages && (
                                                <>
                                                    <button
                                                        className="post-thumb-horizontal-carousel-btn prev"
                                                        onClick={(e) => handleCarouselPrev(post._id, images, e)}
                                                    >
                                                        <ChevronLeft size={14} />
                                                    </button>
                                                    <button
                                                        className="post-thumb-horizontal-carousel-btn next"
                                                        onClick={(e) => handleCarouselNext(post._id, images, e)}
                                                    >
                                                        <ChevronRight size={14} />
                                                    </button>
                                                    <div className="post-thumb-horizontal-image-counter">
                                                        {currentImageIndex + 1}/{images.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="post-thumb-horizontal-no-image">
                                            <ImageIcon size={24} />
                                        </div>
                                    )}
                                    
                                    <button
                                        className="post-thumb-horizontal-save-btn"
                                        onClick={(e) => handleSave(post, e)}
                                    >
                                        {savedPosts[post._id] ? (
                                            <BookmarkFill size={12} color="#4b5563" />
                                        ) : (
                                            <Bookmark size={12} color="#6b7280" />
                                        )}
                                    </button>
                                </div>

                                {/* Información */}
                                <div className="post-thumb-horizontal-info">
                                    <div className="post-thumb-horizontal-title">
                                        {getDisplayTitle(post)}
                                    </div>
                                    {formatPrice(post.price) && (
                                        <div className="post-thumb-horizontal-price">
                                            {formatPrice(post.price)}
                                        </div>
                                    )}
                                    <div className="post-thumb-horizontal-meta">
                                        <span className="location">
                                            <GeoAlt size={10} /> {getLocation(post) || 'Algérie'}
                                        </span>
                                        <span className="date">
                                            <Clock size={10} /> {moment(post.createdAt).fromNow()}
                                        </span>
                                    </div>
                                    <div className="post-thumb-horizontal-actions">
                                        <button
                                            className="action-btn like-btn"
                                            onClick={(e) => handleLike(post, e)}
                                        >
                                            {likedPosts[post._id] ? (
                                                <HeartFill size={12} color="#dc2626" />
                                            ) : (
                                                <Heart size={12} />
                                            )}
                                            <span>{post.likes?.length || 0}</span>
                                        </button>
                                        <button
                                            className="action-btn save-btn"
                                            onClick={(e) => handleSave(post, e)}
                                        >
                                            {savedPosts[post._id] ? (
                                                <BookmarkFill size={12} color="#4b5563" />
                                            ) : (
                                                <Bookmark size={12} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Authentification requise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Connectez-vous pour aimer ou sauvegarder cette annonce.</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="primary" size="sm" onClick={() => window.location.href = '/login'}>
                            Se connecter
                        </Button>
                        <Button variant="success" size="sm" onClick={() => window.location.href = '/register'}>
                            S'inscrire
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <style jsx="true">{`
                .post-thumb-horizontal {
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                    overflow-x: auto;
                    overflow-y: hidden;
                    padding: 0.5rem 0;
                    scrollbar-width: thin;
                }
                
                .post-thumb-horizontal-item {
                    flex: 0 0 auto;
                    width: 280px;
                }
                
                .post-thumb-horizontal-link {
                    text-decoration: none;
                }
                
                .post-thumb-horizontal-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                
                .post-thumb-horizontal-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transform: translateY(-2px);
                }
                
                .post-thumb-horizontal-image-container {
                    position: relative;
                    height: 160px;
                    background: #f9fafb;
                    overflow: hidden;
                }
                
                .post-thumb-horizontal-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .post-thumb-horizontal-carousel-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 2;
                }
                
                .post-thumb-horizontal-carousel-btn.prev {
                    left: 4px;
                }
                
                .post-thumb-horizontal-carousel-btn.next {
                    right: 4px;
                }
                
                .post-thumb-horizontal-image-counter {
                    position: absolute;
                    bottom: 4px;
                    right: 4px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-size: 10px;
                }
                
                .post-thumb-horizontal-save-btn {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 28px;
                    height: 28px;
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .post-thumb-horizontal-no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                }
                
                .post-thumb-horizontal-info {
                    padding: 10px;
                }
                
                .post-thumb-horizontal-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .post-thumb-horizontal-price {
                    font-size: 13px;
                    font-weight: 600;
                    color: #dc2626;
                    margin-bottom: 6px;
                }
                
                .post-thumb-horizontal-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 10px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }
                
                .post-thumb-horizontal-meta .location,
                .post-thumb-horizontal-meta .date {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                
                .post-thumb-horizontal-actions {
                    display: flex;
                    gap: 12px;
                    padding-top: 6px;
                    border-top: 1px solid #f3f4f6;
                }
                
                .action-btn {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: none;
                    border: none;
                    font-size: 11px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                
                .action-btn:hover {
                    background: #f3f4f6;
                }
                
                .like-btn span {
                    font-size: 11px;
                }
                
                .post-thumb-horizontal::-webkit-scrollbar {
                    height: 6px;
                }
                
                .post-thumb-horizontal::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .post-thumb-horizontal::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default PostThumb;