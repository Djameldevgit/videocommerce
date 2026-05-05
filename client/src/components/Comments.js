 

import React, { useState, useEffect, useCallback } from 'react'
import CommentDisplay from './comments/CommentDisplay'
import InputComment from './InputComment'
import { useSelector } from 'react-redux'
import { getDataAPI } from '../utils/fetchData'

const Comments = ({ target, targetType }) => {
    const { auth } = useSelector(state => state)
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(2)
    const [replyComments, setReplyComments] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)  // 👈 Para forzar refresh

    // ✅ Cargar comentarios desde el servidor
    const loadComments = useCallback(async () => {
        if (!target?._id) return;
        
        try {
            const res = await getDataAPI(`comments?targetId=${target._id}&targetModel=${targetType}`, auth.token);
            
            if (res.data.success) {
                const allComments = [...res.data.data.comments, ...res.data.data.replies];
                const newCm = allComments.filter(cm => !cm.reply)
                const newRep = allComments.filter(cm => cm.reply)
                
                setComments(newCm)
                setReplyComments(newRep)
                setShowComments(newCm.slice(-next))
            } else if (target.comments) {
                // Fallback a los comentarios del target
                const allComments = target.comments || [];
                const newCm = allComments.filter(cm => !cm.reply)
                const newRep = allComments.filter(cm => cm.reply)
                
                setComments(newCm)
                setReplyComments(newRep)
                setShowComments(newCm.slice(-next))
            }
        } catch (err) {
            console.error('Error loading comments:', err);
            // Fallback
            const allComments = target.comments || [];
            const newCm = allComments.filter(cm => !cm.reply)
            const newRep = allComments.filter(cm => cm.reply)
            
            setComments(newCm)
            setReplyComments(newRep)
            setShowComments(newCm.slice(-next))
        }
    }, [target?._id, targetType, auth.token, next, target.comments])

    // Cargar cuando cambia target o refreshKey
    useEffect(() => {
        loadComments()
    }, [loadComments, refreshKey])

    // ✅ Función para refrescar después de acciones
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    if (!target || !target._id) {
        return <div className="text-muted p-3">Cargando comentarios...</div>
    }

    return (
        <div className="comments">
            <InputComment 
                target={target} 
                targetType={targetType}
                onReply={null}
                setOnReply={null}
                onCommentAdded={handleRefresh}  // 👈 Refrescar después de crear
            />
            
            {showComments.length === 0 ? (
                <div className="text-center text-muted py-3">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                </div>
            ) : (
                showComments.map((comment, index) => (
                    <CommentDisplay 
                        key={comment._id || index}
                        comment={comment}
                        target={target}
                        targetType={targetType}
                        replyCm={replyComments.filter(item => item.reply === comment._id)}
                        onCommentDeleted={handleRefresh}   // 👈 Refrescar después de eliminar
                        onCommentUpdated={handleRefresh}   // 👈 Refrescar después de editar
                    />
                ))
            )}
            
            {comments.length > next && (
                <div 
                    className="p-2 border-top text-center"
                    style={{cursor: 'pointer', color: 'crimson'}}
                    onClick={() => setNext(next + 10)}
                >
                    Ver más comentarios...
                </div>
            )}
        </div>
    )
}

export default Comments