const SimilarPostCard = ({ post: similarPost }) => {
    return (
      <Link to={`/post/${similarPost._id}`}>
        {/* SOLO 3 elementos: */}
        {/* 1. IMAGEN */}
        <div className="similar-post-image">
          <img src={firstImage} alt={title} />
        </div>
        
        {/* 2. TÍTULO (solo esto) */}
        <div className="similar-post-title">
          {getShortTitle(similarPost.title)}
        </div>
        
        {/* 3. PRECIO */}
        <div className="similar-post-price">
          {formatPrice(similarPost.price)}
        </div>
      </Link>
    );
  };