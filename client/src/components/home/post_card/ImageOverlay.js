// components/home/post_card/ImageOverlay.js
import React from 'react';
import ActionButton from './ActionButton';
  

const GRADIENTS = {
 
  saved: 'linear-gradient(135deg, rgba(255, 140, 0, 0.9) 0%, rgba(255, 165, 0, 0.9) 100%)'
};

const ImageOverlay = ({
  showInfo,
  post,
  t,
  formatDate,
  isLike,
  saved,
  saveLoad,
 
  buyLoad,
  savesCount = 0,
  onLike,
  onSaveToggle,
  onShare,
  onViewDetails,
  onBuyProduct,
  onCommentClick,
  isPostDetailPage = false // ✅ Nueva prop para saber si estamos en DetailPost
}) => {
  
  // ✅ Si estamos en DetailPost, no mostrar la información del usuario
  const shouldShowUserInfo = showInfo && !isPostDetailPage;
  
  return (
    <div style={{
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      zIndex: 2,
      color: "white",
      background: showInfo
        ? "linear-gradient(transparent 0%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.8) 100%)"
        : "transparent",
      padding: showInfo ? "20px 16px 16px 16px" : "0px 16px",
      backdropFilter: showInfo ? "blur(10px)" : "none",
      borderTop: showInfo ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
      height: showInfo ? "auto" : "0px",
      opacity: showInfo ? 1 : 0,
      transform: showInfo ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '7px'
    }}>

      {/* ✅ FILA 1: Username - SOLO mostrar en HOME */}
      {shouldShowUserInfo && post.user.username && (
        <div style={{
          fontSize: "clamp(16px, 2.5vh, 20px)",
          opacity: showInfo ? 0.95 : 0,
          lineHeight: "1.4",
          fontWeight: "600",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.1s'
        }}>
          {post.user.username}
        </div>
      )}

      {/* ✅ FILA 2: Title - SOLO mostrar en HOME */}
      {shouldShowUserInfo && (
        <div style={{
          fontSize: "clamp(14px, 2vh, 18px)",
          opacity: showInfo ? 0.95 : 0,
          lineHeight: "1.4",
          fontWeight: "500",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.15s'
        }} >
          {post.title}
        </div>
      )}

      {/* ✅ FILA 3: Fecha - SOLO mostrar en HOME */}
      {shouldShowUserInfo && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          color: "rgba(255, 255, 255, 0.8)",
          opacity: showInfo ? 1 : 0,
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.2s'
        }}>
          <span className="material-icons" style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.7)"
          }}>
            schedule
          </span>
          <span>{formatDate(post.createdAt)}  </span>
        </div>
      )}

      {/* ✅ FILA 4: Contenido (si existe) - SOLO mostrar en HOME */}
      {shouldShowUserInfo && post.content && (
        <div style={{
          fontSize: "clamp(13px, 1.8vh, 15px)",
          opacity: showInfo ? 0.8 : 0,
          lineHeight: "1.4",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.25s'
        }}>
          {post.content}
        </div>
      )}

      {/* ✅ FILA 5: Iconos de interacción - MOSTRAR SIEMPRE */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: "8px",
        borderTop: shouldShowUserInfo ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
        opacity: showInfo ? 1 : 0,
        transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease 0.3s'
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap"
        }}>
          {/* Like */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              position: 'relative'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onLike();
            }}
          >
            <span
              className="material-icons"
              style={{
                fontSize: "20px",
                color: isLike ? "#ff3040" : "white"
              }}
            >
              {isLike ? "favorite" : "favorite_border"}
            </span>
            {/* Contador de likes */}
            {post.likes?.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(255, 48, 64, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {post.likes?.length > 99 ? '99+' : post.likes?.length}
              </span>
            )}
          </div>

          {/* Comment */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              position: 'relative'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onCommentClick();
            }}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              chat_bubble_outline
            </span>
            {/* Contador de comentarios */}
            {post.comments?.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(0, 150, 255, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {post.comments?.length > 99 ? '99+' : post.comments?.length}
              </span>
            )}
          </div>

          {/* VIEWS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              position: 'relative'
            }}
          >
            <span className="material-icons" style={{
              fontSize: "20px",
              color: "white"
            }}>
              visibility
            </span>
            {/* Contador de vistas */}
            {(post.views || 0) > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(156, 39, 176, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {post.views > 999 ? `${Math.floor(post.views / 1000)}k` :
                  post.views > 99 ? '99+' : post.views}
              </span>
            )}
          </div>

          {/* SAVE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: saveLoad ? "wait" : "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: saved
                ? "rgba(255, 140, 0, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease",
              opacity: saveLoad ? 0.6 : 1,
              position: 'relative'
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSaveToggle();
            }}
          >
            <span
              className="material-icons"
              style={{
                fontSize: "20px",
                color: saved ? "#FF8C00" : "white"
              }}
            >
              {saveLoad ? "hourglass_empty" : (saved ? "bookmark" : "bookmark_border")}
            </span>
            {/* Contador de saves */}
            {savesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                fontSize: "10px",
                color: "white",
                fontWeight: "600",
                background: 'rgba(255, 140, 0, 0.9)',
                borderRadius: '50%',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2px'
              }}>
                {savesCount > 99 ? '99+' : savesCount}
              </span>
            )}
          </div>

          {/* Share */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              transition: "all 0.2s ease"
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onShare();
            }}
          >
            <span className="material-icons" style={{ fontSize: "20px" }}>
              share
            </span>
          </div>
        </div>

      
      </div>

      {/* ✅ FILA 6: Botón Detalles - SOLO mostrar en HOME */}
      {shouldShowUserInfo && (
        <div style={{
          opacity: showInfo ? 1 : 0,
          transform: showInfo ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.3s ease 0.35s',
          marginTop: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onViewDetails();
            }}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              backdropFilter: "blur(10px)",
              width: "100%",
              textAlign: "center"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.25)";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.15)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <span>{t('viewDetails')}</span>
            <span className="material-icons" style={{ fontSize: "18px" }}>
              arrow_forward
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageOverlay;