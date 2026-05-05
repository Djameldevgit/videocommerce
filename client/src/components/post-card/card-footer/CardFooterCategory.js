// 📂 frontend/src/components/card-footer/CardFooterCategory.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { 
  FaPhone, 
  FaEnvelope, 
  FaComment,
  FaUserCircle 
} from 'react-icons/fa';
 
moment.locale('fr');

const CardFooterCategory = ({ post }) => {
  const { auth } = useSelector(state => state);
  const history = useHistory();

  const getDisplayTitle = () => {
    if (post.title) return post.title;
    if (post.subCategory && post.articleType) {
      return `${post.subCategory} ${post.articleType}`;
    }
    return post.subCategory || post.articleType || 'Annonce';
  };

  const handleCall = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    if (post.user?.phone) {
      window.location.href = `tel:${post.user.phone}`;
    }
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    console.log('Open chat with user:', post.user?._id);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    history.push(`/post/${post._id}#comments`);
  };

  const formatPrice = (price) => {
    return `${price?.toLocaleString()} ${post.currency || 'DA'}`;
  };

  const getRelativeTime = (date) => {
    return moment(date).fromNow();
  };

  return (
    <div className="card-footer-category-container">
      {/* FILA 1: Título */}
      <div className="card-footer-category-row">
        <span className="card-footer-category-title">
          {getDisplayTitle()}
        </span>
      </div>

      {/* FILA 2: Precio */}
      <div className="card-footer-category-row">
        <span className="card-footer-category-price">
          {formatPrice(post.price)}
        </span>
      </div>

      {/* FILA 3: Wilaya y Commune */}
      <div className="card-footer-category-row">
        <span className="card-footer-category-location">
          {post.wilaya || ''} {post.commune ? `- ${post.commune}` : ''}
        </span>
      </div>
     
      {/* FILA 4: Fecha relativa */}
      <div className="card-footer-category-row">
        <span className="card-footer-category-date">
          {getRelativeTime(post.createdAt)}
        </span>
      </div>

      {/* FILA 5: Avatar + Boutique */}
      <div className="card-footer-category-boutique-row">
        {post.user?.avatar ? (
          <img 
            src={post.user.avatar} 
            alt={post.user?.boutiqueName || 'Boutique'}
            className="card-footer-category-avatar"
          />
        ) : (
          <FaUserCircle size={20} color="#9ca3af" />
        )}
        <span className="card-footer-category-boutique-name">
          {post.user?.boutiqueName || 'Boutique'}
        </span>
      </div>

      {/* FILA 6: Iconos de acción */}
      <div className="card-footer-category-icons-row">
        <button 
          onClick={handleCall} 
          className="card-footer-category-icon-button"
          aria-label="Appeler"
        >
          <FaPhone size={16} color="#6b7280" />
        </button>
        
        <button 
          onClick={handleMessage} 
          className="card-footer-category-icon-button"
          aria-label="Message"
        >
          <FaEnvelope size={16} color="#6b7280" />
        </button>
        
        <button 
          onClick={handleComment} 
          className="card-footer-category-icon-button"
          aria-label="Commentaire"
        >
          <FaComment size={16} color="#6b7280" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CardFooterCategory);