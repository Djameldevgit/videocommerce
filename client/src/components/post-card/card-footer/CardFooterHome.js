// 📂 frontend/src/components/card-footer/CardFooterHome.jsx - VERSIÓN CENTRADA Y GRIS MÁS INTENSO
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaPhoneAlt, 
  FaRegEnvelope, 
  FaRegComment 
} from 'react-icons/fa';

const CardFooterHome = ({ post }) => {
  const { auth } = useSelector(state => state);
  const history = useHistory();

  // Determinar el título a mostrar
  const getDisplayTitle = () => {
    if (post.title) return post.title;
    if (post.subCategory && post.articleType) {
      return `${post.subCategory} ${post.articleType}`;
    }
    return post.subCategory || post.articleType || 'Annonce';
  };

  // Handlers de acciones
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
    if (!auth.token) return history.push('/login');
    console.log('Open comments for post:', post._id);
  };

  return (
    <div style={styles.container}>
      {/* FILA 1: Título */}
      <div style={styles.row}>
        <span style={styles.title}>
          {getDisplayTitle()}
        </span>
      </div>

      {/* FILA 2: Precio */}
      <div style={styles.row}>
        <span style={styles.price}>
          {post.price?.toLocaleString()} {post.currency || 'DA'}
        </span>
      </div>

      {/* FILA 3: Wilaya y Commune */}
      <div style={styles.row}>
        <span style={styles.location}>
          {post.wilaya || ''} {post.commune ? `- ${post.commune}` : ''}
        </span>
      </div>

      {/* FILA 4: Iconos - CENTRADOS y GRIS MÁS INTENSO */}
      <div style={styles.iconsRow}>
        <button 
          onClick={handleCall} 
          style={styles.iconButton}
          aria-label="Appeler"
        >
          <FaPhoneAlt size={18} color="#6b7280" />
        </button>
        
        <button 
          onClick={handleMessage} 
          style={styles.iconButton}
          aria-label="Message"
        >
          <FaRegEnvelope size={18} color="#6b7280" />
        </button>
        
        <button 
          onClick={handleComment} 
          style={styles.iconButton}
          aria-label="Commentaire"
        >
          <FaRegComment size={18} color="#6b7280" />
        </button>
      </div>
    </div>
  );
};

// Estilos con iconos CENTRADOS
const styles = {
  container: {
    padding: '2px 0',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
    width: '100%'
  },
  row: {
    margin: '2px 0',
    lineHeight: 1.3
  },
  title: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  price: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#dc2626',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  location: {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  // Iconos CENTRADOS con separación perfecta
  iconsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // ← CENTRADO en el eje X
    gap: '35px', // ← Espacio ENTRE iconos (ajusta este valor)
    margin: '6px 0 2px 0',
    padding: '0',
    width: '100%'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Sin ancho mínimo para que se centren naturalmente
  }
};

export default React.memo(CardFooterHome);