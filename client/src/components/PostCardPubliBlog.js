import React from 'react';
import { useLocation } from 'react-router-dom';
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
import CardBodyTitle from './home/post_card/CardBodyTitle';
import CardFooter from './home/post_card/CardFooter';
import DescriptionPost from './home/post_card/DescriptionPost';
import DescriptionUser from './home/post_card/DescriptionUser';

const PostCard = ({ post }) => {
  const location = useLocation();
  
  if (!post) return null;

  // 🔍 DETECTAR SI ESTAMOS EN PÁGINA DE DETALLE
  const isDetailPage = location.pathname.includes('/post/') || 
                      location.pathname.includes('/detail/') ||
                      location.pathname.includes('/annonce/') ||
                      location.pathname.includes('/product/');

  return (
    <div className={`detail-post-card bg-white rounded-xl shadow-lg overflow-hidden mb-4 ${isDetailPage ? 'detail-view' : 'home-view'}`}>
      {/* TÍTULO DEL PRODUCTO */}
      <CardBodyTitle post={post} />
      
      {/* CARRUSEL DE IMÁGENES */}
      <CardBodyCarousel post={post} />
      
      {/* 🔥 DESCRIPCIÓN DEL PRODUCTO - SOLO EN DETALLE */}
      {isDetailPage && <DescriptionPost post={post} />}
      
      {/* 👤 INFORMACIÓN DEL USUARIO - SOLO EN DETALLE */}
      {isDetailPage && post.user && <DescriptionUser user={post.user} post={post} />}
      
      {/* FOOTER (LIKES, COMMENTS, SHARE) */}
      <CardFooter post={post} />
      
    
      
    </div>
  );
};

export default React.memo(PostCard);