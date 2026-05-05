// components/comments/CommentDisplay.jsx
import React, { useState, useEffect } from 'react'
import CommentCard from './CommentCard'

const CommentDisplay = ({ comment, video, replyCm }) => {
    const [showRep, setShowRep] = useState([])
    const [next, setNext] = useState(1)

    useEffect(() => {
        setShowRep(replyCm.slice(replyCm.length - next))
    }, [replyCm, next])

    return (
        <div className="comment_display">
            <CommentCard comment={comment} video={video} commentId={comment._id}>
                <div className="pl-4">
                    {
                        showRep.map((item, index) => (
                            item.reply &&
                            <CommentCard
                                key={item._id || index}
                                comment={item}
                                video={video}
                                commentId={comment._id}
                            />
                        ))
                    }

                    {
                        replyCm.length - next > 0
                            ? <div style={{ cursor: 'pointer', color: 'crimson' }}
                                onClick={() => setNext(next + 10)}>
                                Voir plus de réponses...
                            </div>
                            : replyCm.length > 1 &&
                            <div style={{ cursor: 'pointer', color: 'crimson' }}
                                onClick={() => setNext(1)}>
                                Masquer les réponses...
                            </div>
                    }
                </div>
            </CommentCard>
        </div>
    )
}

export default CommentDisplay