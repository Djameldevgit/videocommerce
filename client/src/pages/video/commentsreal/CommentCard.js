// components/Video/CommentCard.jsx
import React, { useState } from 'react';
import { Heart, Reply, MoreVertical, Edit2, Trash2, X, Check } from 'lucide-react';
import ReplyItem from './ReplyItem';
import CommentForm from './CommentForm';
import './CommentCard.css';

const CommentCard = ({ 
  comment, 
  isLast, 
  lastRef,
  currentUserId,
  canModify,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onEditReply,
  onDeleteReply,
  canModifyReply,
  replyingTo,
  setReplyingTo
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isLiked, setIsLiked] = useState(comment.liked || false);
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = Math.floor((now - commentDate) / 1000);
    
    if (diff < 60) return 'maintenant';
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
    return commentDate.toLocaleDateString('fr-FR');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== comment.text) {
      onEdit(editText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  const handleReplySubmit = async (text) => {
    const success = await onReply(text);
    if (success) {
      setReplyingTo(null);
    }
    return success;
  };

  const isReplying = replyingTo === comment._id;

  return (
    <div className={`comment-card ${isLast ? 'last' : ''}`} ref={isLast ? lastRef : null}>
      <div className="comment-card-avatar">
        <img src={comment.user?.avatar || '/default-avatar.png'} alt={comment.user?.username} />
        <div className="avatar-badge">
          <Reply size={10} />
        </div>
      </div>
      
      <div className="comment-card-content">
        <div className="comment-card-header">
          <div className="comment-card-user">
            <strong className="username">@{comment.user?.username}</strong>
            <span className="time">{formatDate(comment.createdAt)}</span>
            {comment.user?.isPro && <span className="pro-badge">Pro</span>}
            {comment.edited && <span className="edited-badge">modifié</span>}
          </div>
          
          {canModify && !isEditing && (
            <div className="comment-card-menu">
              <button className="menu-trigger" onClick={() => setShowMenu(!showMenu)}>
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="menu-dropdown">
                  <button onClick={handleEdit}>
                    <Edit2 size={14} /> Modifier
                  </button>
                  <button onClick={onDelete} className="danger">
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="edit-mode">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="3"
              autoFocus
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSaveEdit}>
                <Check size={14} /> Enregistrer
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                <X size={14} /> Annuler
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}
        
        <div className="comment-card-actions">
          <button className={`action-btn like-btn ${isLiked ? 'active' : ''}`} onClick={handleLike}>
            <Heart size={16} />
            <span>{likesCount}</span>
          </button>
          <button 
            className="action-btn reply-btn" 
            onClick={() => setReplyingTo(isReplying ? null : comment._id)}
          >
            <Reply size={16} />
            <span>Répondre</span>
          </button>
        </div>
        
        {/* Respuestas existentes */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies-container">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply._id}
                reply={reply}
                commentId={comment._id}
                currentUserId={currentUserId}
                canModify={canModifyReply(reply.user?._id)}
                onEdit={(text) => onEditReply(reply._id, text)}
                onDelete={() => onDeleteReply(reply._id)}
              />
            ))}
          </div>
        )}
        
        {/* ✅ FORMULARIO DE RESPUESTA CORREGIDO */}
        {isReplying && (
          <div className="reply-form-container">
            <CommentForm
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyingTo(null)}
              avatar={currentUserId?.avatar}
              placeholder="Écrire une réponse..."
              isReply={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;