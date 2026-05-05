// components/Video/CommentForm.jsx
import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import './CommentForm.css';

const CommentForm = ({ onSubmit, onCancel, avatar, placeholder = "Ajouter un commentaire...", isReply = false }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const success = await onSubmit(text);
      if (success) {
        setText('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      className={`comment-form ${isReply ? 'reply-form' : ''} ${isFocused ? 'focused' : ''} ${isLoading ? 'loading' : ''}`} 
      onSubmit={handleSubmit}
    >
      <img src={avatar || '/default-avatar.png'} alt="Avatar" className="form-avatar" />
      <div className="form-input-wrapper">
        <textarea
          className="form-input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows="1"
          disabled={isLoading}
        />
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel} disabled={isLoading}>
              <X size={isReply ? 14 : 16} />
            </button>
          )}
          <button type="submit" className="send-btn" disabled={!text.trim() || isLoading}>
            <Send size={isReply ? 14 : 18} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;