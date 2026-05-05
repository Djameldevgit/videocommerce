// 📂 frontend/src/components/GridUserPosts/GridUserPosts.jsx
import React from 'react';
import PostCard from '../../components/post-card/PostCard';
 
import UserPosts from './UserPosts';
 
const GridUserPosts = ({ userId, auth, excludePostId, limit = 6 }) => {
  if (!userId) return null;

  // Renderer personalizado que usa PostCard
  const renderHorizontalPosts = (posts) => {
    if (!posts || posts.length === 0) return null;
    
    return (
      <div className="horizontal-posts-scroll">
        {posts.map((post) => (
          <div key={post._id} className="horizontal-post-item">
            <PostCard post={post} />
          </div>
        ))}
        
        <style jsx="true">{`
          .horizontal-posts-scroll {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0.5rem 0 1rem 0;
            scrollbar-width: thin;
            scrollbar-color: #cbd5e0 #f1f1f1;
          }
          
          .horizontal-post-item {
            flex: 0 0 auto;
            width: 300px;
          }
          
          /* Forzar que PostCard se muestre correctamente */
          .horizontal-post-item .card {
            height: 100%;
            margin: 0;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .horizontal-post-item .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          }
          
          /* Scrollbar personalizada */
          .horizontal-posts-scroll::-webkit-scrollbar {
            height: 8px;
          }
          
          .horizontal-posts-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .horizontal-posts-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 10px;
          }
          
          .horizontal-posts-scroll::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .horizontal-post-item {
              width: 260px;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div  >
      <div  >
        <h5 className="fw-bold" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
          👤 Autres publications du vendeur
        </h5>
      </div>

      <UserPosts
        userId={userId}
        auth={auth}
        limit={limit}
        excludePostId={excludePostId}
        showTitle={false}
        gridView={false}
        renderComponent={renderHorizontalPosts}
      />
    </div>
  );
};

export default GridUserPosts;