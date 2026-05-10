import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Comments from '../../components/Comments';
import InputComment from '../../components/InputComment';
import { getDataAPI } from '../../utils/fetchData';
import './VideoCommentsModern.css';

const VideoComments = ({ videoId, videoData, totalComments, onClose, onRefresh }) => {
    const { auth } = useSelector(state => state);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ CORRIGÉ: Vérifier que videoId est complet
    const loadComments = async () => {
        // ✅ Vérification stricte
        if (!videoId || videoId.length < 24) {
            console.error('❌ videoId invalide ou incomplet:', videoId);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            // ✅ S'assurer que l'ID est complet
            const cleanVideoId = videoId.trim();
            console.log('📥 Chargement commentaires pour videoId:', cleanVideoId);
            
            const res = await getDataAPI(`comments?targetId=${cleanVideoId}&targetModel=video`, auth.token);
            
            console.log('📥 Réponse:', res.data);
            
            if (res.data.success) {
                const allComments = [...res.data.data.comments, ...res.data.data.replies];
                setComments(allComments);
            }
        } catch (err) {
            console.error('❌ Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [videoId, refreshKey]);

    // ✅ Fonction pour rafraîchir après ajout de commentaire
    const handleCommentAction = () => {
        setRefreshKey(prev => prev + 1);
        if (onRefresh) onRefresh();
    };

    // ✅ Vérifier que target a un ID complet
    const target = {
        _id: videoId,  // Assurez-vous que videoId est complet
        user: {
            _id: videoData?.user?._id || auth.user?._id,
            username: videoData?.user?.username || auth.user?.username,
            avatar: videoData?.user?.avatar || auth.user?.avatar
        },
        title: videoData?.title || '',
        content: videoData?.description || '',
        images: videoData?.thumbnail ? [{ url: videoData.thumbnail }] : [],
        comments: comments
    };

    if (loading) {
        return (
            <div className="video-comments-container">
                <div className="comments-header">
                    {onClose && (
                        <>
                            <div className="header-drag-handle">
                                <div className="drag-bar" />
                            </div>
                            <button className="close-button" onClick={onClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                <div className="text-center py-4">Chargement des commentaires...</div>
            </div>
        );
    }

    return (
        <div className="video-comments-container">
            {onClose && (
                <div className="comments-header">
                    <div className="header-drag-handle">
                        <div className="drag-bar" />
                    </div>
                    <h3>
                        <span className="comments-count">{comments.length}</span>
                        {comments.length === 1 ? ' Commentaire' : ' Commentaires'}
                    </h3>
                    <button className="close-button" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}

            {!onClose && (
                <div className="comments-header">
                    <h5>{comments.length} {comments.length === 1 ? 'commentaire' : 'commentaires'}</h5>
                </div>
            )}
            
            {auth.token && (
                <div className="comment-input-wrapper">
                    <InputComment 
                        video={target}
                        onReply={null}
                        setOnReply={null}
                        onCommentAdded={handleCommentAction}
                    />
                </div>
            )}
            
            <div className="comments-list-scrollable">
                <Comments 
                    target={target}
                    targetType="video"
                    key={refreshKey}
                />
            </div>

            <style>{`
                .comment-input-wrapper {
                    padding: 12px 16px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .comments-list-scrollable {
                    flex: 1;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 8px 0;
                }
                .comments-list-scrollable::-webkit-scrollbar {
                    width: 8px;
                }
                .comments-list-scrollable::-webkit-scrollbar-track {
                    background: #2a2a2a;
                    border-radius: 10px;
                }
                .comments-list-scrollable::-webkit-scrollbar-thumb {
                    background: #666;
                    border-radius: 10px;
                }
                .text-center {
                    text-align: center;
                }
                .py-4 {
                    padding: 1rem 0;
                }
            `}</style>
        </div>
    );
};

export default VideoComments;