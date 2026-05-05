// components/comments/InputComment.jsx
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addComment } from '../../../redux/actions/videoAction'
//mport Icons from '../Icons'

const InputComment = ({ children, video, onReply, setOnReply }) => {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { auth, socket, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!content.trim()) {
            if (setOnReply) return setOnReply(false);
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true)

        const result = await dispatch(addComment(
            video._id, 
            content, 
            auth.token, 
            auth, 
            socket, 
            video,
            onReply && onReply.commentId,
            onReply && onReply.user
        ))

        if (result?.success) {
            setContent('')
            if (setOnReply) return setOnReply(false);
        }
        
        setIsSubmitting(false)
    }

    return (
        <form className="card-footer comment_input" onSubmit={handleSubmit}>
            {children}
            <input 
                type="text" 
                placeholder="Ajouter un commentaire..."
                value={content} 
                onChange={e => setContent(e.target.value)}
                disabled={isSubmitting}
                style={{
                    filter: theme ? 'invert(1)' : 'invert(0)',
                    color: theme ? 'white' : '#111',
                    background: theme ? 'rgba(0,0,0,.03)' : '',
                }} 
            />

            <p setContent={setContent} content={content} theme={theme} />

            <button type="submit" className="postBtn" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi...' : 'Poster'}
            </button>
        </form>
    )
}

export default InputComment