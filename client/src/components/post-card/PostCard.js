// 📂 frontend/src/components/PostCard.jsx - VERSIÓN CON COMENTARIOS GENÉRICOS

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CardBodyCarousel from './CardBodyCarousel';
import CardBodyTitle from './CardBodyTitle';
import DescriptionPost from './DescriptionPost';
import UserInfo from './UserInfo';
import CardFooterHome from './card-footer/CardFooterHome';
import CardFooterCategory from './card-footer/CardFooterCategory';
import Comments from '../Comments';
 
const PostCard = ({ post }) => {
  const location = useLocation();
  const { theme = 'light' } = useSelector(state => state.theme || {});
  const [showComments, setShowComments] = useState(false); // 👈 Controlar visibilidad de comentarios

  if (!post) return null;

  const pathname = location.pathname;

  // Detectar contexto
  const isDetailPage = pathname.includes('/post/') ||
                       pathname.includes('/detail/') ||
                       pathname.includes('/annonce/') ||
                       pathname.includes('/product/');

  const isHomePage = pathname === '/' ||
                     pathname === '/home' ||
                     pathname === '/accueil' ||
                     pathname === '';

  const isCategoryPage = !isDetailPage && !isHomePage && (
    pathname.match(/^\/(immobilier|vehicules|pieces-detachees|telephone|informatique|electromenager|vetements|sante-beaute|meubles|loisirs|sport|emploi|materiaux|alimentaires|services|voyages|boutiques)$/) ||
    pathname.startsWith('/category/')
  );

  const renderFooter = () => {
    // 🔥 NO mostrar footer en la página de detalle
    if (isDetailPage) return null;
    
    if (isHomePage) return <CardFooterHome post={post} />;
    if (isCategoryPage) return <CardFooterCategory post={post} />;
    return <CardFooterHome post={post} />;
  };

  // 👈 Función para toggle de comentarios (solo en detalle)
  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card
      className={`border-0 shadow-sm overflow-hidden mb-1 ${
        isDetailPage ? 'detail-view' : 'grid-view'
      } ${theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
      style={{
        borderRadius: '12px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(isDetailPage && { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' })
      }}
    >
      {/* Título solo en vistas de cuadrícula (Home y Category) */}
      {!isDetailPage && <CardBodyTitle post={post} />}

      {/* Carrusel de imágenes SOLO en Home y CategoryPage */}
      {!isDetailPage && <CardBodyCarousel post={post} />}

      {/* Secciones solo en detalle */}
      {isDetailPage && (
        <>
          <DescriptionPost post={post} />
          <UserInfo post={post} />
          
          <div className="px-3 py-2 border-top mt-2">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="btn btn-link text-decoration-none p-0"
              style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb' }}
            >
              <span className="material-icons" style={{ fontSize: '20px', verticalAlign: 'middle' }}>
                chat_bubble
              </span>
              <span className="ml-1">
                {post.comments?.length || 0} comentarios
              </span>
              <span className="material-icons ml-1" style={{ fontSize: '16px' }}>
                {showComments ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {showComments && (
            <div className="px-3 pb-3">
              <Comments 
                target={post}
                targetType="post"
              />
            </div>
          )}
        </>
      )}

      {/* Footer dinámico - NO se muestra en detalle */}
      {renderFooter()}

      {/* Estilos mínimos para la card y tema oscuro */}
      <style jsx>{`
        .detail-view {
          max-width: 100%;
          margin: 0 auto;
        }
        .grid-view {
          cursor: pointer;
        }
        .grid-view:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
        .bg-dark {
          background-color: #1f2937 !important;
          color: #f3f4f6;
        }
        .bg-white {
          background-color: #ffffff !important;
          color: #111827;
        }
      `}</style>
    </Card>
  );
};

export default PostCard;