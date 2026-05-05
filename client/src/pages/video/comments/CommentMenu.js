// components/comments/CommentMenu.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment } from '../../../redux/actions/videoAction'
 
const CommentMenu = ({ video, comment, setOnEdit, onDelete }) => {
    const { auth, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleRemove = async () => {
        if (window.confirm('Supprimer ce commentaire ?')) {
            if (onDelete) {
                onDelete()
            } else {
                await dispatch(deleteComment(video._id, comment._id, auth.token))
            }
        }
    }

    const isOwner = comment.user?._id === auth.user?._id
    const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator'
    const canDelete = isOwner || isAdmin

    const MenuItem = () => {
        return (
            <>
                {isOwner && (
                    <div className="dropdown-item" onClick={() => setOnEdit(true)}>
                        <span className="material-icons">create</span> Modifier
                    </div>
                )}
                {canDelete && (
                    <div className="dropdown-item" onClick={handleRemove}>
                        <span className="material-icons">delete_outline</span> Supprimer
                    </div>
                )}
            </>
        )
    }

    if (!canDelete && !isOwner) return null

    return (
        <div className="menu">
            <div className="nav-item dropdown">
                <span className="material-icons" id="moreLink" data-toggle="dropdown">
                    more_vert
                </span>

                <div className="dropdown-menu" aria-labelledby="moreLink">
                    <MenuItem />
                </div>
            </div>
        </div>
    )
}

export default CommentMenu