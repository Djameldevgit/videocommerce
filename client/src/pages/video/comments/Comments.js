// components/comments/Comments.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react'
import CommentDisplay from './CommentDisplay'

const Comments = ({ video }) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(5)
    const [replyComments, setReplyComments] = useState([])

    // Validación de seguridad
    const videoComments = video?.comments || []

    useEffect(() => {
        // Filtrar comentarios principales (sin reply)
        const newCm = videoComments.filter(cm => !cm.reply)
        setComments(newCm)
        setShowComments(newCm.slice(0, next))
    }, [videoComments, next])

    useEffect(() => {
        // Filtrar respuestas (con reply)
        const newRep = videoComments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [videoComments])

    const handleLoadMore = () => {
        setNext(prev => prev + 10)
    }

    const handleHideComments = () => {
        setNext(5)
    }

    if (!videoComments.length) {
        return (
            <div className="no-comments">
                <div className="no-comments-icon">💬</div>
                <p>Aucun commentaire pour le moment</p>
                <span>Soyez le premier à commenter !</span>
            </div>
        )
    }

    return (
        <div className="comments">
            {showComments.map((comment, index) => (
                <CommentDisplay 
                    key={comment._id || index} 
                    comment={comment} 
                    video={video}
                    replyCm={replyComments.filter(item => item.reply === comment._id)} 
                />
            ))}

            {comments.length - showComments.length > 0 && (
                <div 
                    className="load-more-comments"
                    onClick={handleLoadMore}
                >
                    Voir plus de commentaires ({comments.length - showComments.length})
                </div>
            )}

            {comments.length > 5 && showComments.length === comments.length && (
                <div 
                    className="hide-comments"
                    onClick={handleHideComments}
                >
                    Masquer les commentaires
                </div>
            )}
        </div>
    )
}

export default Comments