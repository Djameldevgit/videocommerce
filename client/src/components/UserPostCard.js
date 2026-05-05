export const UserPostCard = ({ post: userPost }) => {
    return (
      <Link to={`/post/${userPost._id}`}>
        {/* IMAGEN MÁS GRANDE con badge de precio */}
        <div className="user-post-image" style={{ height: '140px' }}>
          <img src={imagen} alt={titulo} />
          {/* Badge de precio en la imagen */}
          <span className="badge bg-primary">{precio}</span>
        </div>
        
        {/* MÁS INFORMACIÓN que posts similares */}
        <div className="card-body">
          {/* Título */}
          <div className="user-post-title">{titulo}</div>
          
          {/* Descripción corta (SOLO en posts del usuario) */}
          <div className="user-post-description">{descripción}</div>
          
          {/* Ubicación */}
          <div className="user-post-location">📍 {ubicación}</div>
          
          {/* Información adicional */}
          <div className="d-flex justify-content-between">
            <span className="badge">{categoría}</span>
            <span className="text-muted">{estado}</span>
          </div>
        </div>
      </Link>
    );
  };