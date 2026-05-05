// components/boutique/BoutiqueHeader.jsx - Versión limpia con modales separados
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Badge, Button, Dropdown, Image, Modal, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  FaStore, FaEye, FaBoxOpen, FaStar, FaRegStar, 
  FaPlus, FaImages, FaTags, FaFileAlt,
  FaCheckCircle, FaShare, FaHeart, FaRegHeart,
  FaFacebook, FaTwitter, FaWhatsapp, FaLink,
  FaChevronLeft, FaChevronRight, FaCamera, FaTrash,
  FaUpload, FaTimes, FaEllipsisV,
  FaEdit, FaChartLine, FaUserPlus, FaUserCheck,
  FaArchive, FaFlag, FaUserFriends
} from 'react-icons/fa';
import { 
  updateBoutiqueHeaderImages,  
  deleteBoutiqueHeaderImage, 
  followBoutique, 
  getBoutiqueFollowers,
  likeBoutique,
  getBoutiqueLikes,
  incrementBoutiqueView,
  deleteBoutique,
  updateBoutiqueStatus
} from '../../redux/actions/boutiqueAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import '../../styles/BoutiqueHeader.css';

// Importar modales separados
import ViewersModal from './modals/ViewersModal';
import FollowersModal from './modals/FollowersModal';
import LikesModal from './modals/LikesModal';

const RatingStars = React.memo(({ rating = 0 }) => {
  const stars = useMemo(() => {
    const result = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        result.push(<FaStar key={i} className="text-warning" size={12} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        result.push(
          <div key={i} className="position-relative d-inline-block">
            <FaRegStar className="text-secondary" size={12} />
            <FaStar className="text-warning position-absolute top-0 start-0" style={{ clipPath: 'inset(0 50% 0 0)' }} size={12} />
          </div>
        );
      } else {
        result.push(<FaRegStar key={i} className="text-secondary" size={12} />);
      }
    }
    return result;
  }, [rating]);
  return <div className="boutique-rating-stars">{stars}</div>;
});
RatingStars.displayName = 'RatingStars';

const BoutiqueHeader = ({ boutique }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const authState = useSelector(state => state.auth);
  const { token, user } = authState || {};
  const isAuthenticated = !!token;
  const isOwner = user?._id === boutique?.user?._id || user?._id === boutique?.user;
  const isAdmin = user?.role === 'admin';

  // Estados sociales
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  
  // Estados modales
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  
  // Estados imágenes
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [headerImages, setHeaderImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [themeColor, setThemeColor] = useState('#2563eb');
  
  // Estados gestión boutique
  const [showDeleteBoutiqueModal, setShowDeleteBoutiqueModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDeletingBoutique, setIsDeletingBoutique] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const reduxBoutique = useSelector(state =>
    state.boutique.boutiques?.find(b => b._id === boutique._id)
  );
  const currentBoutique = reduxBoutique || boutique;

  const {
    _id,
    nom_boutique,
    slogan_boutique,
    header_images = [],
    images = [],
    categorie,
    isVerified,
    isActive = true,
    stats = { vues: 0, produits: 0, notes: 0, avis: 0, followersCount: 0, likesCount: 0 },
    couleur_theme = '#2563eb',
    views = 0,
  } = currentBoutique;

  const logoImage = images.length > 0 ? images[0] : null;

  // ── efectos ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (_id && isAuthenticated) {
      const loadStatus = async () => {
        try {
          const followRes = await dispatch(getBoutiqueFollowers(_id, authState));
          if (followRes) { setFollowersCount(followRes.followersCount || 0); setIsFollowing(followRes.userFollowing || false); }
          const likeRes = await dispatch(getBoutiqueLikes(_id, authState));
          if (likeRes) { setLikesCount(likeRes.likesCount || 0); setIsLiked(likeRes.userLiked || false); }
        } catch {
          setFollowersCount(stats?.followersCount || 0);
          setLikesCount(stats?.likesCount || 0);
        }
      };
      loadStatus();
    } else {
      setFollowersCount(stats?.followersCount || 0);
      setLikesCount(stats?.likesCount || 0);
      setIsFollowing(false);
      setIsLiked(false);
    }
  }, [_id, isAuthenticated]);

  useEffect(() => { if (header_images?.length > 0) setHeaderImages(header_images); }, [header_images]);
  useEffect(() => {
    setThemeColor(couleur_theme);
    document.documentElement.style.setProperty('--theme-color', couleur_theme);
  }, [couleur_theme]);
  useEffect(() => {
    if (headerImages.length <= 1) return;
    const id = setInterval(() => setCurrentSlide(p => (p + 1) % headerImages.length), 5000);
    return () => clearInterval(id);
  }, [headerImages.length]);
  useEffect(() => { if (_id) dispatch(incrementBoutiqueView(_id)); }, [_id]);

  // ── carousel ─────────────────────────────────────────────────────────────
  const nextSlide = useCallback(() => setCurrentSlide(p => (p + 1) % headerImages.length), [headerImages.length]);
  const prevSlide = useCallback(() => setCurrentSlide(p => (p - 1 + headerImages.length) % headerImages.length), [headerImages.length]);

  // ── acciones sociales ─────────────────────────────────────────────────────
  const handleFollow = async () => {
    if (!isAuthenticated) { alert('Veuillez vous connecter pour suivre cette boutique'); return; }
    if (loadingFollow) return;
    setLoadingFollow(true);
    const prev = isFollowing;
    setIsFollowing(!prev);
    setFollowersCount(c => prev ? c - 1 : c + 1);
    try {
      const r = await dispatch(followBoutique(_id, authState));
      setIsFollowing(r.following);
      setFollowersCount(r.followersCount);
    } catch { setIsFollowing(prev); setFollowersCount(c => prev ? c + 1 : c - 1); }
    finally { setLoadingFollow(false); }
  };

  const handleLike = async () => {
    if (!isAuthenticated) { alert('Veuillez vous connecter pour aimer cette boutique'); return; }
    if (loadingLike) return;
    setLoadingLike(true);
    const prev = isLiked;
    setIsLiked(!prev);
    setLikesCount(c => prev ? c - 1 : c + 1);
    try {
      const r = await dispatch(likeBoutique(_id, authState));
      setIsLiked(r.liked);
      setLikesCount(r.likesCount);
    } catch { setIsLiked(prev); setLikesCount(c => prev ? c + 1 : c - 1); }
    finally { setLoadingLike(false); }
  };

  // ── compartir ─────────────────────────────────────────────────────────────
  const shareUrl = useMemo(() => window.location.href, []);
  const shareTitle = `Découvrez ${nom_boutique} sur notre marketplace`;
  const handleShare = useCallback((platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter:  `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
      return;
    }
    if (urls[platform]) window.open(urls[platform], '_blank', 'width=600,height=400');
  }, [shareUrl, shareTitle]);

  // ── gestión de imágenes ───────────────────────────────────────────────────
  const handleFileSelect = useCallback((e) => {
    const valid = Array.from(e.target.files).filter(f => {
      if (!f.type.startsWith('image/')) { alert('Format non supporté'); return false; }
      if (f.size > 5 * 1024 * 1024) { alert('Image trop volumineuse (max 5MB)'); return false; }
      return true;
    });
    setSelectedFiles(valid);
    setPreviewUrls(valid.map(f => URL.createObjectURL(f)));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFiles.length || !token) return;
    setUploading(true);
    try {
      const result = await dispatch(updateBoutiqueHeaderImages({
        boutiqueId: _id,
        images: selectedFiles.map(f => ({ url: URL.createObjectURL(f), name: f.name, isExisting: false, file: f })),
        auth: authState
      }));
      if (result?.success) {
        setHeaderImages(result.header_images || result.images || []);
        setShowImageModal(false);
        setSelectedFiles([]);
        previewUrls.forEach(u => URL.revokeObjectURL(u));
        setPreviewUrls([]);
        alert('✅ Images téléchargées avec succès!');
      } else throw new Error(result?.error || 'Erreur');
    } catch (e) { alert('❌ ' + e.message); }
    finally { setUploading(false); }
  }, [selectedFiles, token, _id, authState, dispatch, previewUrls]);

  const handleDeleteImage = useCallback(async () => {
    if (imageToDelete === null || !token) return;
    try {
      const imageId = headerImages[imageToDelete]._id || headerImages[imageToDelete].public_id;
      const result = await dispatch(deleteBoutiqueHeaderImage({ boutiqueId: _id, imageId, auth: authState }));
      if (result?.success) {
        const next = headerImages.filter((_, i) => i !== imageToDelete);
        setHeaderImages(next);
        if (currentSlide >= next.length && next.length > 0) setCurrentSlide(next.length - 1);
        else if (!next.length) setCurrentSlide(0);
        setShowDeleteConfirm(false);
        setImageToDelete(null);
        alert('✅ Image supprimée');
      }
    } catch { alert('Erreur lors de la suppression'); }
  }, [imageToDelete, token, _id, headerImages, currentSlide, authState, dispatch]);

  const confirmDelete = useCallback((i) => { setImageToDelete(i); setShowDeleteConfirm(true); }, []);
  const handleCancel = useCallback(() => {
    previewUrls.forEach(u => URL.revokeObjectURL(u));
    setSelectedFiles([]); setPreviewUrls([]); setShowImageModal(false);
  }, [previewUrls]);

  // ── gestión boutique ─────────────────────────────────────────────────────
  const handleEditBoutique = useCallback((e) => {
    e?.stopPropagation();
    history.push(`/edit-boutique/${_id}`, { 
      boutiqueData: currentBoutique,
      isEdit: true 
    });
  }, [_id, currentBoutique, history]);

  const handleDeleteBoutique = useCallback(async () => {
    setIsDeletingBoutique(true);
    try {
      await dispatch(deleteBoutique({ boutiqueId: _id, auth: authState }));
      setShowDeleteBoutiqueModal(false);
      history.push('/');
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Boutique supprimée avec succès!' } });
    } catch (error) {
      console.error('Error deleting boutique:', error);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Erreur lors de la suppression' } });
    } finally {
      setIsDeletingBoutique(false);
    }
  }, [_id, authState, dispatch, history]);

  const handleToggleActive = useCallback(async () => {
    try {
      await dispatch(updateBoutiqueStatus({ boutiqueId: _id, statusData: { isActive: !isActive }, auth: authState }));
      setShowStatusModal(false);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: `Boutique ${!isActive ? 'activée' : 'désactivée'} avec succès!` } });
    } catch (error) {
      console.error('Error toggling boutique status:', error);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Erreur lors du changement de statut' } });
    }
  }, [_id, isActive, authState, dispatch]);

  const handleReportBoutique = useCallback(async () => {
    setShowReportModal(false);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Boutique signalée. Merci de votre aide!' } });
  }, [dispatch]);

  // ── estilos ──────────────────────────────────────────────────────────────
  const heroStyle = useMemo(() => headerImages.length === 0
    ? { background: `linear-gradient(135deg, ${themeColor} 0%, ${adjustColor(themeColor, 30)} 100%)` }
    : { backgroundImage: `url(${headerImages[currentSlide]?.url || headerImages[currentSlide]})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s ease-in-out' }
  , [headerImages, currentSlide, themeColor]);

  function adjustColor(color, pct) {
    const n = parseInt(color.replace('#', ''), 16), a = Math.round(2.55 * pct);
    const R = Math.min(255, Math.max(0, (n >> 16) + a));
    const G = Math.min(255, Math.max(0, ((n >> 8) & 0xFF) + a));
    const B = Math.min(255, Math.max(0, (n & 0xFF) + a));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'k' : String(n);

  return (
    <div className="bh-container">
      {/* Hero Section */}
      <div className={`bh-hero ${!isActive ? 'bh-hero--inactive' : ''}`} style={heroStyle}>
        <div className="bh-overlay" />
        
        {headerImages.length > 1 && (
          <>
            <button onClick={prevSlide} className="bh-carousel-btn bh-carousel-btn--left">
              <FaChevronLeft size={14} />
            </button>
            <button onClick={nextSlide} className="bh-carousel-btn bh-carousel-btn--right">
              <FaChevronRight size={14} />
            </button>
            <div className="bh-indicators">
              {headerImages.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)}
                  className={`bh-dot ${i === currentSlide ? 'bh-dot--active' : ''}`} />
              ))}
            </div>
          </>
        )}

        <div className="bh-hero-body">
          {/* Logo y nombre */}
          <div className="bh-row bh-row--name">
            {logoImage && (
              <div className="bh-logo">
                <img src={logoImage.url || logoImage} alt={nom_boutique} loading="lazy" />
              </div>
            )}
            <div className="bh-name-block">
              <h1 className="bh-title">{nom_boutique}</h1>
              {isVerified && <Badge className="bh-verified"><FaCheckCircle size={10} /><span className="ms-1">Vérifiée</span></Badge>}
              {!isActive && <Badge className="bh-inactive-badge"><FaArchive size={10} /><span className="ms-1">Inactive</span></Badge>}
            </div>
          </div>

          {/* Slogan */}
          {slogan_boutique && (
            <div className="bh-row bh-row--slogan">
              <p className="bh-slogan">{slogan_boutique}</p>
            </div>
          )}

          {/* Categoría y rating */}
          <div className="bh-row bh-row--category">
            <Badge className="bh-category-badge"><FaStore size={10} className="me-1" />{categorie}</Badge>
            <div className="bh-rating">
              <RatingStars rating={stats.notes} />
              <span className="bh-rating-count">({stats.avis})</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="bh-row bh-row--actions">
            <div className="bh-row-left">
              <div className="bh-stat-pill">
                <FaBoxOpen size={13} />
                <span className="bh-stat-value">{fmt(stats.produits || 0)}</span>
                <span className="bh-stat-label">produits</span>
              </div>
              <button className={`bh-btn-follow ${isFollowing ? 'bh-btn-follow--active' : ''}`} onClick={handleFollow} disabled={loadingFollow}>
                {loadingFollow ? <span className="spinner-border spinner-border-sm" /> : isFollowing ? <FaUserCheck size={13} /> : <FaUserPlus size={13} />}
                <span>{loadingFollow ? '...' : isFollowing ? 'Suivi' : 'Suivre'}</span>
                <span className="bh-btn-count">{fmt(followersCount)}</span>
              </button>
            </div>
            <div className="bh-row-right">
              <Dropdown>
                <Dropdown.Toggle as="button" className="bh-icon-btn"><FaShare size={14} /></Dropdown.Toggle>
                <Dropdown.Menu className="bh-dropdown" align="end">
                  <Dropdown.Item onClick={() => handleShare('facebook')}><FaFacebook className="text-primary" /> Facebook</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleShare('twitter')}><FaTwitter className="text-info" /> Twitter</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleShare('whatsapp')}><FaWhatsapp className="text-success" /> WhatsApp</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleShare('copy')}><FaLink /> Copier le lien</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {isOwner && (
                <Dropdown>
                  <Dropdown.Toggle as="button" className="bh-icon-btn"><FaEllipsisV size={14} /></Dropdown.Toggle>
                  <Dropdown.Menu className="bh-dropdown" align="end">
                    <Dropdown.Header><FaCamera /> Fond de l'image</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowImageModal(true)}><FaUpload /> Ajouter des images</Dropdown.Item>
                    {headerImages.map((img, i) => (
                      <Dropdown.Item key={i} onClick={() => confirmDelete(i)}>
                        <img src={img.url || img} className="bh-thumb" alt="" />
                        <span>Image {i + 1}</span>
                        <FaTrash className="text-danger" />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de métricas */}
      <div className="bh-bar">
        <Container fluid className="bh-bar-inner">
          <div className="bh-bar-metrics">
            <button className="bh-metric bh-metric--btn" onClick={() => setShowViewsModal(true)}>
              <FaEye size={15} className="bh-metric-icon" />
              <span className="bh-metric-value">{fmt(views || 0)}</span>
              <span className="bh-metric-label">vues</span>
            </button>
            <button className="bh-metric bh-metric--btn" onClick={() => setShowFollowersModal(true)}>
              <FaUserFriends size={15} className="bh-metric-icon" />
              <span className="bh-metric-value">{fmt(followersCount)}</span>
              <span className="bh-metric-label">followers</span>
            </button>
            <button className={`bh-metric bh-metric--btn ${isLiked ? 'bh-metric--liked' : ''}`} onClick={() => setShowLikesModal(true)}>
              {isLiked ? <FaHeart size={15} className="bh-metric-icon" /> : <FaRegHeart size={15} className="bh-metric-icon" />}
              <span className="bh-metric-value">{fmt(likesCount)}</span>
              <span className="bh-metric-label">{isLiked ? 'aimé' : "j'aime"}</span>
            </button>
          </div>

          {(isOwner || isAdmin) ? (
            <div className="bh-bar-actions">
              <Dropdown>
                <Dropdown.Toggle className="bh-btn-publish" style={{ backgroundColor: themeColor, borderColor: themeColor }}>
                  <FaPlus size={13} className="me-2" /><span>Publier</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bh-dropdown" align="end">
                  <Dropdown.Item href={`/boutique/${_id}/products/new`}><FaFileAlt /> Produit standard</Dropdown.Item>
                  <Dropdown.Item href={`/boutique/${_id}/products/new?type=promo`}><FaTags /> Promotion</Dropdown.Item>
                  <Dropdown.Item href={`/boutique/${_id}/gallery/new`}><FaImages /> Album photo</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle as="button" className="bh-icon-btn bh-icon-btn--dark"><FaEllipsisV size={14} /></Dropdown.Toggle>
                <Dropdown.Menu className="bh-dropdown" align="end">
                  <Dropdown.Item onClick={handleEditBoutique}><FaEdit /> Modifier les infos</Dropdown.Item>
                  <Dropdown.Item href={`/boutique/${_id}/dashboard`}><FaChartLine /> Tableau de bord</Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowStatusModal(true)}><FaArchive /> {isActive ? 'Désactiver' : 'Activer'}</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => setShowDeleteBoutiqueModal(true)} className="text-danger"><FaTrash /> Supprimer</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className="bh-bar-actions">
              <Button variant="link" className="bh-report-btn" onClick={() => setShowReportModal(true)}>
                <FaFlag size={16} /><span className="ms-2">Signaler</span>
              </Button>
            </div>
          )}
        </Container>
      </div>

      {/* MODALES IMPORTADOS */}
      <ViewersModal
        show={showViewsModal}
        onHide={() => setShowViewsModal(false)}
        boutiqueId={_id}
        boutiqueName={nom_boutique}
        token={token}
      />
      
      <FollowersModal
        show={showFollowersModal}
        onHide={() => setShowFollowersModal(false)}
        boutiqueId={_id}
        boutiqueName={nom_boutique}
        token={token}
        auth={authState}
      />
      
      <LikesModal
        show={showLikesModal}
        onHide={() => setShowLikesModal(false)}
        boutiqueId={_id}
        boutiqueName={nom_boutique}
        token={token}
      />

      {/* Resto de modales existentes... */}
      {/* Modal gestión de imágenes, confirmación eliminación, etc. */}
      
    </div>
  );
};

export default React.memo(BoutiqueHeader);