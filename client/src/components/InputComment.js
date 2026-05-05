import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createComment } from '../redux/actions/commentAction'
import Icons from './Icons'

 

const InputComment = ({ children, target, onReply, setOnReply, targetType, onCommentAdded }) => {
    const [content, setContent] = useState('')
    const { auth, socket, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) {
            if (setOnReply) setOnReply(false)
            return
        }

        const newComment = {
            content,
            likes: [],
            user: auth.user,
            createdAt: new Date().toISOString(),
            reply: onReply?.commentId || null,
            tag: onReply?.user || null
        }
        
        setContent('')
        
        await dispatch(createComment({ target, newComment, auth, socket, targetType }))
        
        // ✅ Notificar que se agregó un comentario para refrescar la lista
        if (onCommentAdded) onCommentAdded()
        
        if (setOnReply) setOnReply(false)
    }

    if (!target || !target._id) return null

    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit}>
            {children}
            <input 
                type="text" 
                placeholder="Add your comments..."
                value={content} 
                onChange={e => setContent(e.target.value)}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    background: theme ? 'rgba(0,0,0,.03)' : '',
                }}
            />
            <Icons setContent={setContent} content={content} theme={theme} />
            <button type="submit" className="postBtn">Post</button>
        </form>
    )
}

export default InputComment