// components/comments/CommentCard.jsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react'
import Avatar from '../../../components/Avatar'
 
import { Link } from 'react-router-dom'
import moment from 'moment'

import LikeButton from '../../../components/LikeButton'
import { useSelector, useDispatch } from 'react-redux'
import CommentMenu from './CommentMenu'
import { 
     
    likeComment, 
    deleteComment, 
    updateComment
} from '../../../redux/actions/videoAction'
 
import InputComment from './InputComment'

const CommentCard = ({ children, comment, video, commentId }) => {
    const { auth, theme, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const [content, setContent] = useState('')
    const [readMore, setReadMore] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    const [onReply, setOnReply] = useState(false)

    // ✅ Validación segura - evitar undefined
    useEffect(() => {
        // Asegurar que comment existe
        if (!comment) return
        
        setContent(comment.text || comment.content || '')
        
        // ✅ Verificar que likes existe y es un array
        const likesArray = comment.likes || []
        setLikesCount(likesArray.length)
        
        setIsLike(false)
        setOnReply(false)
        
        // ✅ Verificar si el usuario actual dio like
        if (auth.user && likesArray.length > 0) {
            const hasLiked = likesArray.some(like => {
                if (!like) return false
                const likeId = like._id || like
                return likeId === auth.user._id
            })
            setIsLike(hasLiked)
        }
    }, [comment, auth.user])

    const handleUpdate = async () => {
        if (!comment) return
        
        if ((comment.text || comment.content) !== content) {
            const result = await dispatch(updateComment(
                video?._id, 
                comment._id, 
                content, 
                auth.token
            ))
            if (result?.success) {
                setOnEdit(false)
            }
        } else {
            setOnEdit(false)
        }
    }

    const handleLike = async () => {
        if (loadLike || !comment || !auth.token) return
        
        setIsLike(true)
        setLikesCount(prev => prev + 1)

        setLoadLike(true)
        await dispatch(likeComment(
            video?._id, 
            comment._id, 
            auth.token, 
            auth, 
            socket, 
            comment, 
            video
        ))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if (loadLike || !comment || !auth.token) return
        
        setIsLike(false)
        setLikesCount(prev => prev - 1)

        setLoadLike(true)
        await dispatch(likeComment(
            video?._id, 
            comment._id, 
            auth.token, 
            auth, 
            socket, 
            comment, 
            video
        ))
        setLoadLike(false)
    }

    const handleReply = () => {
        if (onReply) return setOnReply(false)
        setOnReply({ ...comment, commentId })
    }

    const handleDelete = async () => {
        if (!comment) return
        if (window.confirm('Supprimer ce commentaire ?')) {
            await dispatch(deleteComment(video?._id, comment._id, auth.token))
        }
    }

    // ✅ Validaciones de seguridad
    if (!comment || !comment.user) {
        return null
    }

    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator'
    const isOwner = comment.user?._id === auth.user?._id
    const canModify = isOwner || isAdmin

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }

    // ✅ Obtener texto seguro
    const commentText = comment.text || comment.content || ''
    const commentUser = comment.user || {}
    const commentLikes = comment.likes || []
    const commentCreatedAt = comment.createdAt || new Date().toISOString()

    return (
        <div className="comment_card mt-2" style={styleCard}>
            <Link to={`/profile/${commentUser._id}`} className="d-flex text-dark">
                <Avatar src={commentUser.avatar} size="small-avatar" />
                <h6 className="mx-1">@{commentUser.username || 'utilisateur'}</h6>
            </Link>

            <div className="comment_content">
                <div className="flex-fill"
                    style={{
                        filter: theme ? 'invert(1)' : 'invert(0)',
                        color: theme ? 'white' : '#111',
                    }}>
                    {
                        onEdit
                            ? <textarea rows="5" value={content}
                                onChange={e => setContent(e.target.value)} />
                            : <div>
                                {
                                    comment.tag && comment.tag._id !== commentUser._id &&
                                    <Link to={`/profile/${comment.tag._id}`} className="mr-1">
                                        @{comment.tag.username}
                                    </Link>
                                }
                                <span>
                                    {
                                        commentText.length < 100 ? commentText :
                                            readMore ? commentText + ' ' : commentText.slice(0, 100) + '....'
                                    }
                                </span>
                                {
                                    commentText.length > 100 &&
                                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                                        {readMore ? 'Voir moins' : 'Voir plus'}
                                    </span>
                                }
                            </div>
                    }

                    <div style={{ cursor: 'pointer' }}>
                        <small className="text-muted mr-3">
                            {moment(commentCreatedAt).fromNow()}
                        </small>

                        <small className="font-weight-bold mr-3">
                            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                        </small>

                        {
                            onEdit
                                ? <>
                                    <small className="font-weight-bold mr-3"
                                        onClick={handleUpdate}>
                                        Modifier
                                    </small>
                                    <small className="font-weight-bold mr-3"
                                        onClick={() => setOnEdit(false)}>
                                        Annuler
                                    </small>
                                </>
                                : auth.token && (
                                    <small className="font-weight-bold mr-3"
                                        onClick={handleReply}>
                                        {onReply ? 'Annuler' : 'Répondre'}
                                    </small>
                                )
                        }
                    </div>
                </div>

                <div className="d-flex align-items-center mx-2" style={{ cursor: 'pointer' }}>
                    {canModify && (
                        <CommentMenu 
                            video={video} 
                            comment={comment} 
                            setOnEdit={setOnEdit} 
                            onDelete={handleDelete}
                        />
                    )}
                    {auth.token && (
                        <LikeButton 
                            isLike={isLike} 
                            handleLike={handleLike} 
                            handleUnLike={handleUnLike} 
                        />
                    )}
                </div>
            </div>

            {
                onReply && auth.token &&
                <InputComment video={video} onReply={onReply} setOnReply={setOnReply}>
                    <Link to={`/profile/${onReply.user?._id}`} className="mr-1">
                        @{onReply.user?.username}:
                    </Link>
                </InputComment>
            }

            {children}
        </div>
    )
}

export default CommentCard