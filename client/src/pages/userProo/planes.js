// src/components/planes.js - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FaCheck, FaStar, FaArrowRight, FaArrowLeft, FaVideo, FaHdd, FaClock, FaInfoCircle, FaShieldAlt, FaCreditCard, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PaymentService } from './PaymentService';
import './planes.css';

const planes = () => {
  const history = useHistory();
  const { auth } = useSelector(state => state);
  
  // ✅ Extraer token y user correctamente
  const token = auth?.token;
  const user = auth?.user;
  
  console.log('🔑 Token en planes:', token ? `${token.substring(0, 30)}...` : 'No hay token');
  console.log('👤 User en planes:', user?._id || user?.id);
  
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Refs para el slider
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Catégories (con emojis para mejor visual)
  const categories = [
    { id: 'automobile', name: 'Automobiles & Véhicules', icon: '🚗', color: '#dc3545' },
    { id: 'informatique', name: 'Informatique', icon: '💻', color: '#007bff' },
    { id: 'meubles', name: 'Meubles & Maison', icon: '🏠', color: '#fd7e14' },
    { id: 'materiaux', name: 'Matériaux & Equipement', icon: '💎', color: '#6c757d' },
    { id: 'telephonie', name: 'Téléphonie & Accessoires', icon: '📱', color: '#17a2b8' },
    { id: 'electromenager', name: 'Electroménager', icon: '🔌', color: '#28a745' },
    { id: 'vetements', name: 'Vêtements & Mode', icon: '👕', color: '#e83e8c' },
    { id: 'sante', name: 'Santé & Beauté', icon: '❤️', color: '#20c997' },
    { id: 'loisirs', name: 'Loisirs', icon: '🎮', color: '#6f42c1' },
    { id: 'emploi', name: 'Emploi', icon: '💼', color: '#343a40' },
    { id: 'immobilier', name: 'Immobilier', icon: '🏘️', color: '#d63384' },
    { id: 'services', name: 'Services', icon: '🛠️', color: '#0dcaf0' },
    { id: 'voyages', name: 'Voyages', icon: '✈️', color: '#0d6efd' },
    { id: 'alimentaire', name: 'Alimentaire', icon: '🍔', color: '#198754' },
    { id: 'sport', name: 'Sport', icon: '⚽', color: '#ffc107' }
  ];

  const durations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  const offers = [
    {
      id: 'free',
      name: 'Plan Gratuit',
      description: 'Pour commencer',
      credit: 5,
      storage: 10,
      price: 0,
      priceDisplay: 'Gratuit',
      currency: 'DA',
      duration: 20,
      quality: 'SD',
      analytics: false,
      support: false,
      branding: false,
      promotion: false,
      api: false,
      features: ['Site Builder', 'Nom de domaine']
    },
    {
      id: 'basic',
      name: 'Plan Basic',
      description: 'Pour les créateurs',
      credit: 50,
      storage: 50,
      price: 400,
      priceDisplay: '400 DA',
      currency: 'DA',
      duration: 40,
      quality: 'HD 1080p',
      analytics: 'Basiques',
      support: 'Standard',
      branding: false,
      promotion: 'Payant (100 DA/vidéo)',
      api: false,
      features: ['Site Builder', 'Nom de domaine', 'Analytiques basiques']
    },
    {
      id: 'pro',
      name: 'Plan Pro',
      description: 'Pour les professionnels',
      credit: 200,
      storage: 500,
      price: 700,
      priceDisplay: '700 DA',
      currency: 'DA',
      duration: 60,
      quality: 'HD+ 2K',
      analytics: 'Avancées',
      support: '24/7',
      branding: 'Oui',
      promotion: 'Inclus (2/mois)',
      api: 'Limitée',
      features: ['Site Builder', 'Nom de domaine', 'Analytiques avancées', 'Support prioritaire']
    },
    {
      id: 'business',
      name: 'Plan Business',
      description: 'Pour les entreprises',
      credit: 'Illimité',
      storage: 2048,
      price: 1300,
      priceDisplay: '1300 DA',
      currency: 'DA',
      duration: 120,
      quality: '4K Ultra HD',
      analytics: 'Complètes',
      support: 'Dédié 24/7',
      branding: 'Illimitée',
      promotion: 'Illimitée',
      api: 'Complète',
      features: ['Site Builder', 'Nom de domaine', 'Analytiques complètes', 'Support 24/7', 'API accès']
    }
  ];

  // Verificar posición del slider
  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const getDiscount = (duration, planId) => {
    if (planId === 'free') return 0;
    if (duration >= 12) return 20;
    if (duration >= 6) return 10;
    return 0;
  };

  const getFreeMonths = (duration) => {
    if (duration >= 12) return 3;
    if (duration >= 6) return 1;
    return 0;
  };

  const calculateTotalPrice = () => {
    if (!selectedOffer) return 0;
    if (selectedOffer.id === 'free') return 0;
    const discount = getDiscount(selectedDuration, selectedOffer.id);
    const total = selectedOffer.price * selectedDuration;
    return total * (1 - discount / 100);
  };

  const handleNextStep = () => {
    if (step === 1 && selectedCategory) {
      setStep(2);
    } else if (step === 2 && selectedDuration) {
      setStep(3);
    } else if (step === 3 && selectedOffer) {
      setStep(4);
    }
  };
  const handleProceedToPayment = async () => {
    try {
      console.log('🟢 Solicitando pago al backend...');
      
      // ✅ Obtener el token del localStorage o Redux
      const token = localStorage.getItem('token') || auth?.token;
      
      console.log('🔑 Token disponible:', token ? '✅ Sí' : '❌ No');
      
      // ✅ URL CORRECTA con /api/
      const response = await fetch('http://localhost:5000/api/chargily/create-checkout?amount=1000', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // ✅ Token incluido aquí
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      console.log('📦 Respuesta:', result);
      
      // La URL está en result.data.checkout_url
      const checkoutUrl = result?.data?.checkout_url;
      
      if (checkoutUrl) {
        console.log('✅ Redirigiendo a:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        console.error('❌ No se recibió checkout_url');
        alert('Error al crear el pago');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error de conexión: ' + error.message);
    }
  };
  // Step 1: Slider horizontal
  const Step1 = () => (
    <div className="step-container">
      <div className="step-header">
        <span className="step-number">1</span>
        <h2 className="step-title">Choix de la catégorie</h2>
      </div>
      <p className="step-subtitle">Choisissez la catégorie de votre boutique</p>
      
      <div className="categories-slider-wrapper">
        {showLeftArrow && (
          <button className="slider-arrow-btn" onClick={() => scrollSlider('left')}>
            <FaChevronLeft />
          </button>
        )}
        
        <div className="categories-slider" ref={sliderRef}>
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-card ${selectedCategory === cat.id ? 'selected' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ borderColor: selectedCategory === cat.id ? cat.color : '#e0e0e0' }}
            >
              <div className="category-icon" style={{ color: cat.color, fontSize: '32px' }}>
                {cat.icon}
              </div>
              <div className="category-name">{cat.name}</div>
              {selectedCategory === cat.id && (
                <div className="category-selected-check">✓</div>
              )}
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <button className="slider-arrow-btn" onClick={() => scrollSlider('right')}>
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );

  // Step 2 - Duración
  const Step2 = () => (
    <div className="step-container">
      <div className="step-header">
        <span className="step-number">2</span>
        <h2 className="step-title">Choisir une durée</h2>
      </div>
      <p className="step-subtitle">Sélectionnez la durée de votre abonnement</p>
      
      <div className="durations-grid">
        {durations.map(month => {
          const freeMonths = getFreeMonths(month);
          return (
            <div
              key={month}
              className={`duration-card ${selectedDuration === month ? 'selected' : ''}`}
              onClick={() => setSelectedDuration(month)}
            >
              <div className="duration-month">{month} Mois</div>
              {freeMonths > 0 && (
                <div className="duration-badge">
                  {freeMonths} mois offert{freeMonths > 1 ? 's' : ''}
                </div>
              )}
              {month >= 6 && month < 12 && (
                <div className="duration-discount">-10%</div>
              )}
              {month >= 12 && (
                <div className="duration-discount">-20% + 3 mois</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="duration-info">
        <p>💡 <strong>Astuce :</strong> Plus la durée est longue, plus vous économisez !</p>
        <p>🎁 À partir de 6 mois : 1 mois offert</p>
        <p>🏆 À partir de 12 mois : 3 mois offerts + réduction de 20%</p>
      </div>
    </div>
  );

  // Step 3 - Planes
  const Step3 = () => (
    <div className="step-container">
      <div className="step-header">
        <span className="step-number">3</span>
        <h2 className="step-title">Choisir une offre</h2>
      </div>
      <p className="step-subtitle">Sélectionnez le plan adapté à votre canal</p>
      
      <div className="offers-grid">
        {offers.map(offer => {
          const discount = getDiscount(selectedDuration, offer.id);
          const totalPrice = offer.price * selectedDuration;
          const finalPrice = totalPrice * (1 - discount / 100);
          const freeMonths = getFreeMonths(selectedDuration);
          
          return (
            <div
              key={offer.id}
              className={`offer-card ${selectedOffer?.id === offer.id ? 'selected' : ''} ${offer.id === 'free' ? 'free' : ''}`}
              onClick={() => setSelectedOffer(offer)}
            >
              {offer.id !== 'free' && (
                <div className="offer-badge">
                  {offer.id === 'basic' && '⭐ Populaire'}
                  {offer.id === 'pro' && '🚀 Recommandé'}
                  {offer.id === 'business' && '👑 Expert'}
                </div>
              )}
              
              <div className="offer-header">
                <h3 className="offer-name">{offer.name}</h3>
                <p className="offer-desc">{offer.description}</p>
              </div>
              
              <div className="offer-price">
                {offer.id === 'free' ? (
                  <span className="price-free">Gratuit</span>
                ) : (
                  <>
                    <span className="price-amount">{offer.priceDisplay}</span>
                    <span className="price-period">/mois</span>
                  </>
                )}
              </div>
              
              {offer.id !== 'free' && selectedDuration > 0 && (
                <div className="offer-total">
                  <span className="total-label">Total pour {selectedDuration} mois :</span>
                  <span className="total-amount">{finalPrice.toFixed(0)} DA</span>
                  {discount > 0 && (
                    <span className="total-discount">-{discount}%</span>
                  )}
                  {freeMonths > 0 && (
                    <span className="total-free">+{freeMonths} mois offert{freeMonths > 1 ? 's' : ''}</span>
                  )}
                </div>
              )}
              
              <div className="offer-features">
                <div className="feature-row">
                  <FaVideo /> <span>{offer.credit === 'Illimité' ? 'Vidéos illimitées' : `${offer.credit} vidéos`}</span>
                </div>
                <div className="feature-row">
                  <FaHdd /> <span>Stockage {offer.storage} MB</span>
                </div>
                <div className="feature-row">
                  <FaClock /> <span>Durée max: {offer.duration} sec</span>
                </div>
                {offer.features.map((feature, idx) => (
                  <div key={idx} className="feature-row">
                    <FaCheck className="check-icon" /> <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`select-offer-btn ${selectedOffer?.id === offer.id ? 'selected' : ''}`}>
                {selectedOffer?.id === offer.id ? '✓ Sélectionné' : 'Sélectionner'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Step 4 - Resumen
  const Step4 = () => {
    const freeMonths = getFreeMonths(selectedDuration);
    const discount = getDiscount(selectedDuration, selectedOffer?.id);
    const totalPrice = calculateTotalPrice();
    
    return (
      <div className="step-container">
        <div className="step-header">
          <span className="step-number">4</span>
          <h2 className="step-title">Récapitulatif de votre offre</h2>
        </div>
        <p className="step-subtitle">Vérifiez les détails de votre abonnement</p>
        
        <div className="complete-summary">
          <div className="summary-section">
            <h3><FaStar className="section-icon" /> Plan sélectionné</h3>
            <div className="plan-detail-card">
              <div className="plan-name-large">
                <span className="plan-badge" style={{ background: selectedOffer?.id === 'basic' ? '#667eea' : selectedOffer?.id === 'pro' ? '#f093fb' : '#f6b93b' }}>
                  {selectedOffer?.name}
                </span>
              </div>
              <div className="plan-price-large">
                {selectedOffer?.id === 'free' ? (
                  <span>Gratuit</span>
                ) : (
                  <span>{totalPrice.toFixed(0)} DA <small>pour {selectedDuration} mois</small></span>
                )}
              </div>
            </div>
          </div>
          
          <div className="summary-section">
            <h3><FaInfoCircle className="section-icon" /> Détails de l'abonnement</h3>
            <div className="subscription-details">
              <div className="detail-row">
                <span>Catégorie:</span>
                <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
              </div>
              <div className="detail-row">
                <span>Durée:</span>
                <strong>{selectedDuration} mois</strong>
              </div>
              {freeMonths > 0 && (
                <div className="detail-row free">
                  <span>🎁 Mois offerts:</span>
                  <strong>+{freeMonths} mois</strong>
                </div>
              )}
              {discount > 0 && (
                <div className="detail-row discount">
                  <span>🏷️ Réduction:</span>
                  <strong>-{discount}%</strong>
                </div>
              )}
              <div className="detail-row total">
                <span>Total à payer:</span>
                <strong className="total-amount-summary">{totalPrice.toFixed(0)} DA</strong>
              </div>
            </div>
          </div>
          
          <div className="summary-section">
            <h3><FaCreditCard className="section-icon" /> Méthodes de paiement</h3>
            <div className="payment-methods-summary">
              <div className="payment-method-badge">💳 Carte Edahabia</div>
              <div className="payment-method-badge">🏦 CIB</div>
            </div>
          </div>
          
          <div className="info-note">
            <FaShieldAlt />
            <p>Paiement sécurisé via Chargily Pay. Après validation, votre plan sera activé instantanément.</p>
          </div>
        </div>
        
        <div className="navigation-buttons step4-buttons">
          <button className="btn-back" onClick={() => setStep(3)}>
            <FaArrowLeft /> Modifier
          </button>
          <button 
            className="btn-next" 
            onClick={handleProceedToPayment}
            disabled={loading}
          >
            {loading ? 'Traitement en cours...' : 'Continuer vers paiement'} 
            {!loading && <FaArrowRight />}
          </button>
        </div>
      </div>
    );
  };

  const getStepContent = () => {
    switch(step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      default: return <Step1 />;
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedCategory;
    if (step === 2) return selectedDuration;
    if (step === 3) return selectedOffer;
    if (step === 4) return true;
    return false;
  };

  return (
    <div className="become-pro-page">
      <div className="progress-bar">
        <div className="progress-steps">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Catégorie</span>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Durée</span>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Offre</span>
          </div>
          <div className={`progress-line ${step >= 4 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <span>Récap</span>
          </div>
        </div>
      </div>

      {getStepContent()}

      {step !== 4 && (
        <div className="navigation-buttons">
          {step > 1 && (
            <button className="btn-back" onClick={() => setStep(step - 1)}>
              <FaArrowLeft /> Retour
            </button>
          )}
          
          <button 
            className={`btn-next ${!canProceed() ? 'disabled' : ''}`}
            onClick={handleNextStep}
            disabled={!canProceed() || loading}
          >
            Continuer <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default planes;