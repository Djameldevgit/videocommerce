// En MesBoutiques.jsx - Actualizar la tarjeta para mostrar el plan

const CompactBoutiqueCard = ({ boutique }) => {
    const isPending = isBoutiquePending(boutique);
    const isActive = boutique.isActive === true;
    const isInactive = !boutique.isActive && !boutique.pendiente;
    const isFreePlan = boutique.plan === 'gratuit';
    
    // Obtener información del plan
    const getPlanInfo = () => {
      const plans = {
        gratuit: { name: 'Gratuit', color: '#6c757d', icon: '🎁' },
        basique: { name: 'Basique', color: '#0d6efd', icon: '⭐', price: '3 000 DZD' },
        premium: { name: 'Premium', color: '#fd7e14', icon: '💎', price: '15 000 DZD' },
        entreprise: { name: 'Entreprise', color: '#198754', icon: '🏢', price: '30 000 DZD' }
      };
      return plans[boutique.plan] || plans.gratuit;
    };
    
    const planInfo = getPlanInfo();
    
    // Determinar si puede activarse (plan de pago inactivo)
    const canActivate = isInactive && !isFreePlan;
    
    return (
      <Card 
        className={`border-0 shadow-sm h-100 overflow-hidden`}
        style={{ 
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: '#ffffff',
          borderTop: `4px solid ${
            isPending ? '#ffc107' : (isActive ? '#198754' : '#6c757d')
          }`
        }}
        onClick={() => handleBoutiqueClick(boutique._id)}
      >
        {/* CONTENEDOR DE ETIQUETAS */}
        <div className="badges-container">
          <div className="badge-left">
            {isPending ? (
              <span className="badge-pending">
                <FaClock size={10} className="me-1" /> En attente
              </span>
            ) : (
              <span className="badge-approved">
                <FaCheckCircle size={10} className="me-1" /> Vérifié
              </span>
            )}
          </div>
          
          <div className="badge-right">
            {isActive ? (
              <span className="badge-active">
                <FaToggleOn size={10} className="me-1" /> Actif
              </span>
            ) : isInactive ? (
              <span className="badge-inactive">
                <FaToggleOff size={10} className="me-1" /> Inactif
              </span>
            ) : null}
          </div>
        </div>
        
        {/* Etiqueta del PLAN en la esquina inferior izquierda */}
        <div className="plan-badge">
          <span className={`plan-${boutique.plan}`}>
            {planInfo.icon} {planInfo.name}
            {!isFreePlan && !isActive && (
              <small className="plan-price"> ({planInfo.price})</small>
            )}
          </span>
        </div>
        
        <Row className="g-0">
          <Col xs={4} md={4} className="p-2">
            <div className="image-container" style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              {imageUrl ? (
                <img src={imageUrl} alt={boutique.nom_boutique || 'Boutique'} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                  <FaStore size={24} />
                </div>
              )}
            </div>
          </Col>
          
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              <Card.Title className="fw-bold mb-1" style={{ fontSize: '0.95rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {boutique.nom_boutique || 'Boutique sans nom'}
              </Card.Title>
              
              {boutique.slogan_boutique && (
                <p className="text-muted small mb-1" style={{ fontSize: '0.7rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {boutique.slogan_boutique}
                </p>
              )}
              
              <div className="d-flex gap-3 mt-1 mb-1">
                <div className="d-flex align-items-center">
                  <FaBox size={10} className="text-muted me-1" />
                  <span className="small">{boutique.stats?.produits || 0}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-eye me-1" style={{ fontSize: '0.6rem' }}></i>
                  <span className="small">{boutique.views || 0}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-heart me-1" style={{ fontSize: '0.6rem', color: '#dc3545' }}></i>
                  <span className="small">{boutique.likes?.length || 0}</span>
                </div>
              </div>
              
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(boutique.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        {/* Botones de acción */}
        <div className="action-buttons">
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => { e.stopPropagation(); handleBoutiqueClick(boutique._id); }} title="Voir la boutique">
            <Eye size={12} />
          </Button>
          
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => { e.stopPropagation(); history.push(`/edit-boutique/${boutique._id}`); }} title="Modifier la boutique">
            <Pencil size={12} />
          </Button>
          
          {/* Botón de activación - Solo para planes de pago inactivos */}
          {!boutique.pendiente && !isFreePlan && !isActive && (
            <Button
              variant="warning"
              size="sm"
              className="rounded-circle p-1 shadow-sm"
              onClick={(e) => handleActivateBoutique(boutique, e)}
              title="Activer la boutique (paiement requis)"
            >
              <FaCreditCard size={12} />
            </Button>
          )}
          
          {/* Mostrar mensaje para plan gratuito inactivo (no debería pasar) */}
          {!boutique.pendiente && isFreePlan && !isActive && (
            <Button
              variant="info"
              size="sm"
              className="rounded-circle p-1 shadow-sm"
              onClick={(e) => e.stopPropagation()}
              title="Contactez l'administrateur"
            >
              <FaClock size={12} />
            </Button>
          )}
          
          <Button variant="danger" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => handleDelete(boutique._id, e)} title="Supprimer la boutique">
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };