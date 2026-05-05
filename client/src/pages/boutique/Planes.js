// 📂 src/components/boutique/Planes.jsx - VERSIÓN CORREGIDA Y REDISEÑADA
import React, { useState, useEffect } from 'react';
import { Badge, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FaCheck, FaGift, FaClock, FaStore, FaCalendarAlt } from 'react-icons/fa';

// ============================================
// CATEGORÍAS PRINCIPALES (Nivel 1)
// ============================================
const CATEGORIES = [
  { id: 'immobilier', name: 'Immobilier', icon: '🏠', color: '#dc2626' },
  { id: 'vehicules', name: 'Véhicules', icon: '🚗', color: '#2563eb' },
  { id: 'electromenager', name: 'Électroménager', icon: '📺', color: '#16a34a' },
  { id: 'vetements', name: 'Vêtements & Mode', icon: '👕', color: '#ec4899' },
  { id: 'alimentaire', name: 'Alimentaire', icon: '🍔', color: '#f59e0b' },
  { id: 'beaute', name: 'Beauté & Bien-être', icon: '💄', color: '#9333ea' },
  { id: 'sport', name: 'Sport & Loisirs', icon: '⚽', color: '#06b6d4' },
  { id: 'services', name: 'Services', icon: '🔧', color: '#6b7280' },
  { id: 'informatique', name: 'Informatique', icon: '💻', color: '#3b82f6' },
  { id: 'maison', name: 'Maison & Jardin', icon: '🏡', color: '#10b981' },
  { id: 'sante', name: 'Santé', icon: '💊', color: '#ef4444' },
  { id: 'animaux', name: 'Animaux', icon: '🐕', color: '#f97316' }
];

// ============================================
// ACTIVIDADES POR CATEGORÍA (Nivel 2)
// ============================================
const ACTIVITIES_BY_CATEGORY = {
  immobilier: [
    { id: 'agences-immobilieres', name: 'Agences immobilières', icon: '🏢', description: 'Vente, location, gestion immobilière' },
    { id: 'promotions-immobilieres', name: 'Promotions immobilières', icon: '🏗️', description: 'Promoteurs, programmes neufs' },
    { id: 'syndics-copropriete', name: 'Syndics de copropriété', icon: '📋', description: 'Gestion de copropriétés' },
    { id: 'diagnostiqueurs', name: 'Diagnostiqueurs', icon: '🔍', description: 'Diagnostics immobiliers' }
  ],
  vehicules: [
    { id: 'showroom-automobiles', name: 'Showroom automobiles', icon: '🚘', description: 'Vente de voitures neuves et d\'occasion' },
    { id: 'showroom-moto', name: 'Showroom moto', icon: '🏍️', description: 'Motos, scooters, quads' },
    { id: 'pieces-accessoires', name: 'Pièces & Accessoires', icon: '🔧', description: 'Pièces détachées, accessoires auto' },
    { id: 'location-vehicules', name: 'Location de véhicules', icon: '🚙', description: 'Location courte et longue durée' },
    { id: 'reparation-vehicules', name: 'Réparation & Services', icon: '🔩', description: 'Garages, entretien, carrosserie' }
  ],
  electromenager: [
    { id: 'magasin-electromenager', name: 'Magasin d\'électroménager', icon: '📱', description: 'Électroménager, multimédia' },
    { id: 'reparation-electro', name: 'Réparation électroménager', icon: '🛠️', description: 'SAV, réparation' },
    { id: 'climatisation', name: 'Climatisation & Froid', icon: '❄️', description: 'Installation, entretien' }
  ],
  vetements: [
    { id: 'pret-a-porter', name: 'Prêt-à-porter', icon: '👗', description: 'Vêtements homme, femme, enfant' },
    { id: 'accessoires-mode', name: 'Accessoires de mode', icon: '👜', description: 'Sacs, chaussures, bijoux' },
    { id: 'couture-confection', name: 'Couture & Confection', icon: '🧵', description: 'Tailleur, retouches, création' },
    { id: 'luxe', name: 'Marques de luxe', icon: '💎', description: 'Produits haut de gamme' }
  ],
  alimentaire: [
    { id: 'epicerie-fine', name: 'Épicerie fine', icon: '🍷', description: 'Produits gourmets, terroir' },
    { id: 'boucherie-charcuterie', name: 'Boucherie & Charcuterie', icon: '🥩', description: 'Viandes, charcuteries' },
    { id: 'boulangerie-patisserie', name: 'Boulangerie & Pâtisserie', icon: '🥖', description: 'Pain, pâtisseries, viennoiseries' },
    { id: 'traiteur', name: 'Traiteur', icon: '🍽️', description: 'Repas, buffets, événements' },
    { id: 'produits-bio', name: 'Produits bio', icon: '🌿', description: 'Alimentation biologique' }
  ],
  beaute: [
    { id: 'cosmetiques', name: 'Cosmétiques', icon: '💄', description: 'Maquillage, soins' },
    { id: 'parfumerie', name: 'Parfumerie', icon: '🌸', description: 'Parfums, eaux de toilette' },
    { id: 'institut-beaute', name: 'Institut de beauté', icon: '💆', description: 'Soins esthétiques, spa' },
    { id: 'coiffure', name: 'Coiffure & Barbier', icon: '✂️', description: 'Salon de coiffure' }
  ],
  sport: [
    { id: 'articles-sport', name: 'Articles de sport', icon: '⚽', description: 'Équipements, vêtements sport' },
    { id: 'salle-sport', name: 'Salle de sport', icon: '💪', description: 'Fitness, musculation' },
    { id: 'outdoor', name: 'Outdoor & Randonnée', icon: '🏔️', description: 'Camping, randonnée' }
  ],
  services: [
    { id: 'nettoyage', name: 'Nettoyage & Entretien', icon: '🧹', description: 'Ménage, nettoyage professionnel' },
    { id: 'informatique-services', name: 'Services informatiques', icon: '💻', description: 'Dépannage, développement' },
    { id: 'conseil', name: 'Conseil & Formation', icon: '📚', description: 'Coaching, consulting' }
  ],
  informatique: [
    { id: 'magasin-informatique', name: 'Magasin informatique', icon: '💻', description: 'Ordinateurs, composants' },
    { id: 'reparation-informatique', name: 'Réparation informatique', icon: '🔧', description: 'SAV, dépannage' },
    { id: 'telephonie', name: 'Téléphonie', icon: '📱', description: 'Smartphones, accessoires' }
  ],
  maison: [
    { id: 'meubles', name: 'Meubles & Décoration', icon: '🛋️', description: 'Mobilier, décoration' },
    { id: 'jardinage', name: 'Jardinage', icon: '🌱', description: 'Plantes, outils de jardin' },
    { id: 'bricolage', name: 'Bricolage & Outillage', icon: '🔨', description: 'Outils, matériaux' }
  ],
  sante: [
    { id: 'pharmacie', name: 'Pharmacie', icon: '💊', description: 'Médicaments, parapharmacie' },
    { id: 'opticien', name: 'Opticien', icon: '👓', description: 'Lunettes, lentilles' }
  ],
  animaux: [
    { id: 'animalerie', name: 'Animalerie', icon: '🐕', description: 'Aliments, accessoires animaux' },
    { id: 'toilettage', name: 'Toilettage', icon: '✂️', description: 'Toilettage pour animaux' }
  ]
};

// ============================================
// PLANES CON ESTILOS REDISEÑADOS
// ============================================
const PLANS = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: 0,
    period: '5 jours',
    icon: '🎁',
    color: '#6c757d',
    gradient: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
    features: [
      'Boutique de base',
      'Jusqu\'à 20 produits',
      'Stockage 100 MB',
      'Support par email'
    ],
    badge: 'Démarrage'
  },
  {
    id: 'basique',
    name: 'Basique',
    price: 3000,
    period: 'mois',
    icon: '⭐',
    color: '#0d6efd',
    gradient: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
    features: [
      'Boutique professionnelle',
      'Jusqu\'à 100 produits',
      'Stockage 500 MB',
      'Support prioritaire',
      'Statistiques avancées',
      'Nom de domaine personnalisé'
    ],
    badge: 'Populaire'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    period: 'mois',
    icon: '💎',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    features: [
      'Boutique illimitée',
      'Produits illimités',
      'Stockage 2 GB',
      'Support 24/7',
      'Marketing tools',
      'API Access',
      'Certificat SSL offert'
    ],
    badge: 'Recommandé'
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    price: 35000,
    period: 'mois',
    icon: '🏢',
    color: '#198754',
    gradient: 'linear-gradient(135deg, #198754 0%, #0f5132 100%)',
    features: [
      'Solution complète',
      'Multi-vendeurs',
      'Stockage 10 GB',
      'Support dédié',
      'Formation incluse',
      'SLA 99.9%',
      'Compte manager'
    ],
    badge: 'Ultimate'
  }
];

// ============================================
// COMPONENTE PRINCIPAL CORREGIDO
// ============================================
const Planes = ({ onSelect, initialData = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialData.categorie || '');
  const [selectedActivity, setSelectedActivity] = useState(initialData.subCategory || '');
  const [selectedPlan, setSelectedPlan] = useState(initialData.plan || 'gratuit');
  const [selectedDuration, setSelectedDuration] = useState(initialData.duree || '1');
  const [expirationDate, setExpirationDate] = useState('');
  const [isFreePlan, setIsFreePlan] = useState(true);
  
  const freeDurations = [
    { id: '1', name: '1 jour', days: 1, price: 0 },
    { id: '2', name: '2 jours', days: 2, price: 0 },
    { id: '3', name: '3 jours', days: 3, price: 0 },
    { id: '4', name: '4 jours', days: 4, price: 0 },
    { id: '5', name: '5 jours', days: 5, price: 0 }
  ];
  
  const paidDurations = [
    { id: '1', name: '1 mois', months: 1, bonus: null, discount: 0 },
    { id: '3', name: '3 mois', months: 3, bonus: null, discount: 5 },
    { id: '6', name: '6 mois', months: 6, bonus: '1 mois offert', discount: 10 },
    { id: '12', name: '12 mois', months: 12, bonus: '3 mois offerts', discount: 15 }
  ];
  
  useEffect(() => {
    setIsFreePlan(selectedPlan === 'gratuit');
    if (selectedPlan === 'gratuit') {
      if (!freeDurations.find(d => d.id === selectedDuration)) {
        setSelectedDuration('1');
      }
    } else {
      if (!paidDurations.find(d => d.id === selectedDuration)) {
        setSelectedDuration('1');
      }
    }
  }, [selectedPlan]);
  
  // Calcular fecha de expiración
  useEffect(() => {
    if (selectedPlan && selectedDuration) {
      const today = new Date();
      let expiryDate = new Date(today);
      
      if (isFreePlan) {
        const duration = freeDurations.find(d => d.id === selectedDuration);
        if (duration) {
          expiryDate.setDate(today.getDate() + duration.days);
        }
      } else {
        const duration = paidDurations.find(d => d.id === selectedDuration);
        if (duration) {
          expiryDate.setMonth(today.getMonth() + duration.months);
          if (duration.bonus) {
            const bonusMonths = duration.bonus.includes('1 mois') ? 1 : duration.bonus.includes('3 mois') ? 3 : 0;
            expiryDate.setMonth(expiryDate.getMonth() + bonusMonths);
          }
        }
      }
      
      setExpirationDate(expiryDate.toLocaleDateString('fr-FR'));
    }
  }, [selectedPlan, selectedDuration, isFreePlan]);
  
  const availableActivities = selectedCategory ? ACTIVITIES_BY_CATEGORY[selectedCategory] || [] : [];
  const isComplete = selectedCategory && selectedActivity && selectedPlan && selectedDuration;
  
  const calculateTotalAmount = () => {
    if (isFreePlan) return 0;
    
    const planData = PLANS.find(p => p.id === selectedPlan);
    const durationData = paidDurations.find(d => d.id === selectedDuration);
    
    if (!planData || !durationData) return 0;
    
    let amount = planData.price * (durationData.months || 1);
    
    // Aplicar descuento
    if (durationData.discount > 0) {
      amount = amount * (1 - durationData.discount / 100);
    }
    
    return Math.round(amount);
  };
  
  const getSelectionData = () => {
    const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
    const durationData = isFreePlan 
      ? freeDurations.find(d => d.id === selectedDuration)
      : paidDurations.find(d => d.id === selectedDuration);
    
    const totalAmount = calculateTotalAmount();
    
    return {
      categorie: selectedCategory,
      subCategory: selectedActivity,
      plan: selectedPlan,
      planData: selectedPlanData,
      duree: selectedDuration,
      dureeData: durationData,
      montant: totalAmount,
      isFree: isFreePlan,
      expirationDate: expirationDate
    };
  };
  
  const handleConfirm = () => {
    console.log('🔵 Botón clickeado - handleConfirm');
    console.log('🔵 onSelect existe?', !!onSelect);
    
    if (!onSelect) {
      console.error('❌ onSelect es undefined o null');
      return;
    }
    
    if (typeof onSelect !== 'function') {
      console.error('❌ onSelect no es una función');
      return;
    }
    
    if (!isComplete) {
      console.warn('⚠️ Selección incompleta');
      return;
    }
    
    const data = getSelectionData();
    console.log('✅ Llamando a onSelect con:', data);
    onSelect(data);
  };
  
  return (
    <div className="planes-container p-3">
      <style jsx="true">{`
        .category-select {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .category-select:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .plan-card {
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .plan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .plan-card.selected {
          border: 2px solid #0d6efd;
          box-shadow: 0 0 0 4px rgba(13,110,253,0.1);
        }
        .plan-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .duration-card {
          transition: all 0.2s ease;
          cursor: pointer;
          text-align: center;
          padding: 12px;
          border-radius: 10px;
          background: white;
        }
        .duration-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .duration-card.selected {
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          color: white;
        }
        .summary-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 16px;
          padding: 20px;
        }
      `}</style>

      {/* Étape 1: Catégorie - Select Option */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-3">
          <Badge bg="primary" className="rounded-pill me-2 px-3 py-2">1</Badge>
          <h5 className="mb-0 fw-bold">Catégorie d'activité</h5>
        </div>
        <Form.Select 
          size="lg" 
          value={selectedCategory}
          onChange={(e) => { 
            setSelectedCategory(e.target.value); 
            setSelectedActivity('');
          }}
          className="category-select"
          style={{ borderRadius: '12px', border: '2px solid #e9ecef' }}
        >
          <option value="">Sélectionnez une catégorie</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </Form.Select>
      </div>
      
      {/* Étape 2: Activité - Cards horizontales en 2 filas */}
      {selectedCategory && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="rounded-pill me-2 px-3 py-2">2</Badge>
            <h5 className="mb-0 fw-bold">Activité spécifique</h5>
          </div>
          <div className="row g-3">
            {availableActivities.map(activity => (
              <div key={activity.id} className="col-md-6">
                <Card 
                  className={`border-0 shadow-sm h-100 ${selectedActivity === activity.id ? 'selected border-primary' : ''}`}
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: selectedActivity === activity.id ? '2px solid #0d6efd' : '1px solid #e9ecef'
                  }}
                  onClick={() => setSelectedActivity(activity.id)}
                >
                  <Card.Body className="d-flex align-items-center p-3">
                    <div style={{ fontSize: '2rem', marginRight: '15px' }}>{activity.icon}</div>
                    <div className="flex-grow-1">
                      <div className="fw-bold mb-1">{activity.name}</div>
                      <div className="small text-muted">{activity.description}</div>
                    </div>
                    {selectedActivity === activity.id && (
                      <div className="text-primary">
                        <FaCheck size={20} />
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Étape 3: Plan - Cards en una sola fila horizontal */}
      {selectedActivity && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="rounded-pill me-2 px-3 py-2">3</Badge>
            <h5 className="mb-0 fw-bold">Choisissez votre formule</h5>
          </div>
          <div className="d-flex gap-3 overflow-auto pb-2" style={{ flexWrap: 'nowrap' }}>
            {PLANS.map(plan => (
              <Card
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                style={{ 
                  minWidth: '260px',
                  borderRadius: '16px',
                  border: selectedPlan === plan.id ? '2px solid #0d6efd' : '1px solid #e9ecef',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.badge && <div className="plan-badge">{plan.badge}</div>}
                <Card.Body className="p-3 text-center">
                  <div style={{ 
                    fontSize: '3rem',
                    background: plan.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {plan.icon}
                  </div>
                  <h6 className="fw-bold mt-2 mb-1">{plan.name}</h6>
                  {plan.price === 0 ? (
                    <Badge bg="success" className="mb-2">GRATUIT</Badge>
                  ) : (
                    <div className="mb-2">
                      <span className="h5 fw-bold text-primary">{plan.price.toLocaleString()} DA</span>
                      <span className="text-muted small">/{plan.period}</span>
                    </div>
                  )}
                  <ul className="list-unstyled small text-start mt-2">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="mb-1">
                        <FaCheck className="text-success me-1" size={12} /> {f}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Étape 4: Durée - Cards horizontales */}
      {selectedPlan && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <Badge bg="primary" className="rounded-pill me-2 px-3 py-2">4</Badge>
            <h5 className="mb-0 fw-bold">Durée d'abonnement</h5>
          </div>
          <div className="d-flex gap-3 flex-wrap">
            {(isFreePlan ? freeDurations : paidDurations).map(duration => {
              const isSelected = selectedDuration === duration.id;
              const amount = !isFreePlan ? calculateTotalAmount() : 0;
              
              return (
                <div
                  key={duration.id}
                  className={`duration-card ${isSelected ? 'selected' : ''}`}
                  style={{ flex: '1', minWidth: '100px' }}
                  onClick={() => setSelectedDuration(duration.id)}
                >
                  <FaClock className={isSelected ? 'text-white' : 'text-muted'} size={20} />
                  <div className="fw-bold mt-1">{duration.name}</div>
                  {!isFreePlan && duration.discount > 0 && (
                    <small className={isSelected ? 'text-white-50' : 'text-success'}>
                      -{duration.discount}%
                    </small>
                  )}
                  {duration.bonus && (
                    <Badge bg="warning" className="mt-1 d-block" style={{ fontSize: '0.65rem' }}>
                      <FaGift className="me-1" size={10} /> {duration.bonus}
                    </Badge>
                  )}
                  {!isFreePlan && isSelected && (
                    <div className="mt-2 small fw-bold">
                      {amount.toLocaleString()} DA
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Étape 5: Fecha de expiración (NUEVO CAMPO) */}
      {selectedPlan && selectedDuration && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-3">
            <Badge bg="info" className="rounded-pill me-2 px-3 py-2">5</Badge>
            <h5 className="mb-0 fw-bold">Date d'expiration</h5>
          </div>
          <Card className="border-0 bg-light">
            <Card.Body className="d-flex align-items-center justify-content-between">
              <div>
                <FaCalendarAlt className="text-primary me-2" size={24} />
                <span className="fw-bold">Votre boutique expirera le :</span>
              </div>
              <div className="h5 mb-0 text-primary fw-bold">{expirationDate || 'Non définie'}</div>
            </Card.Body>
          </Card>
        </div>
      )}
      
      {/* Résumé y confirmación */}
      {isComplete && (
        <div className="mt-4">
          <div className="summary-card mb-4">
            <h6 className="fw-bold mb-3">📋 Résumé de votre sélection</h6>
            <div className="row g-2">
              <div className="col-md-6">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Catégorie:</span>
                  <span className="fw-bold">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Activité:</span>
                  <span className="fw-bold">{availableActivities.find(a => a.id === selectedActivity)?.name}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Formule:</span>
                  <Badge bg={PLANS.find(p => p.id === selectedPlan)?.color}>
                    {PLANS.find(p => p.id === selectedPlan)?.name}
                  </Badge>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Durée:</span>
                  <span className="fw-bold">
                    {isFreePlan 
                      ? freeDurations.find(d => d.id === selectedDuration)?.name
                      : paidDurations.find(d => d.id === selectedDuration)?.name}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Expiration:</span>
                  <span className="fw-bold text-primary">{expirationDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total TTC:</span>
                  <span className="h5 fw-bold text-success mb-0">
                    {isFreePlan ? 'GRATUIT' : `${calculateTotalAmount().toLocaleString()} DA`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="success" 
            size="lg" 
            className="w-100 py-3 fw-bold"
            onClick={handleConfirm}
            style={{ borderRadius: '12px', fontSize: '1.1rem' }}
          >
            <FaCheck className="me-2" size={18} /> Confirmer ma sélection
          </Button>
          <p className="text-muted text-center mt-3 small">
            <FaStore className="me-1" /> Vous pourrez modifier ces informations plus tard
          </p>
        </div>
      )}
    </div>
  );
};

export default Planes;