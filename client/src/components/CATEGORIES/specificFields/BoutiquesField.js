// src/components/CATEGORIES/specificFields/BoutiquesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';
import { Form, Row, Col, Card, Badge, Alert, Button } from 'react-bootstrap';
import { categoryHierarchy } from '../index';

// Importar componentes comunes que necesitemos
import WilayaCommuneField from '../camposComun/WilayaCommuneField';
import TelephoneField from '../camposComun/PhoneField';
import EmailField from '../camposComun/EmailField';

const BoutiquesField = (props) => {
  const { mainCategory, subCategory, postData, handleChangeInput, isRTL, t } = props;
  
  // Obtener configuración de boutiques
  const boutiqueConfig = categoryHierarchy.boutiques || {};
  
  // Campos adicionales específicos para boutiques
  const additionalFields = {
    // Componentes personalizados para boutiques
    components: {
      // Nom de la boutique
      'nom_boutique': (
        <div className="mb-3" key="nom_boutique">
          <label className="form-label fw-bold">
            Nom de la boutique <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="nom_boutique"
            value={postData.nom_boutique || ''}
            onChange={handleChangeInput}
            placeholder="Ex: Fashion Store Algérie"
            required
          />
          <small className="text-muted">Le nom qui apparaîtra sur votre boutique en ligne</small>
        </div>
      ),
      
      // Domaine souhaité
      'domaine_boutique': (
        <div className="mb-3" key="domaine_boutique">
          <label className="form-label fw-bold">
            Nom de domaine <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              name="domaine_boutique"
              value={postData.domaine_boutique || ''}
              onChange={handleChangeInput}
              placeholder="monboutique"
              required
            />
            <span className="input-group-text">.monsite.dz</span>
          </div>
          <small className="text-muted">
            Votre boutique sera accessible à: https://{postData.domaine_boutique || 'exemple'}.monsite.dz
          </small>
        </div>
      ),
      
      // Slogan
      'slogan_boutique': (
        <div className="mb-3" key="slogan_boutique">
          <label className="form-label fw-bold">
            Slogan / Description courte
          </label>
          <input
            type="text"
            className="form-control"
            name="slogan_boutique"
            value={postData.slogan_boutique || ''}
            onChange={handleChangeInput}
            placeholder="Ex: Votre boutique de mode en ligne"
          />
          <small className="text-muted">Une phrase qui décrit votre boutique</small>
        </div>
      ),
      
      // Description détaillée
      'description_boutique': (
        <div className="mb-3" key="description_boutique">
          <label className="form-label fw-bold">
            Description détaillée
          </label>
          <textarea
            className="form-control"
            name="description_boutique"
            value={postData.description_boutique || ''}
            onChange={handleChangeInput}
            rows="3"
            placeholder="Décrivez votre boutique, votre mission, vos valeurs..."
          />
        </div>
      ),
      
      // Catégories de produits
      'categories_produits': (
        <div className="mb-3" key="categories_produits">
          <label className="form-label fw-bold">
            Catégories de produits <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            name="categories_produits"
            value={postData.categories_produits || ''}
            onChange={handleChangeInput}
            multiple
            required
          >
            <option value="mode">Mode & Vêtements</option>
            <option value="technologie">Technologie & Électronique</option>
            <option value="cosmetique">Cosmétique & Beauté</option>
            <option value="maison">Maison & Décoration</option>
            <option value="enfants">Enfants & Bébés</option>
            <option value="sport">Sport & Loisirs</option>
            <option value="alimentation">Alimentation</option>
            <option value="livres">Livres & Culture</option>
            <option value="artisanat">Artisanat Local</option>
          </select>
          <small className="text-muted">
            Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs catégories
          </small>
        </div>
      ),
      
      // Couleur du thème
      'couleur_theme': (
        <div className="mb-3" key="couleur_theme">
          <label className="form-label fw-bold">
            Couleur du thème
          </label>
          <div className="d-flex align-items-center">
            <input
              type="color"
              className="form-control form-control-color w-25 me-3"
              name="couleur_theme"
              value={postData.couleur_theme || '#2563eb'}
              onChange={handleChangeInput}
              title="Choisissez la couleur principale de votre boutique"
            />
            <span className="text-muted">Personnalisez l'apparence de votre boutique</span>
          </div>
        </div>
      ),
      
      // Plan boutique - Selector personalizado
      'plan_boutique': (
        <div className="mb-3" key="plan_boutique">
          <label className="form-label fw-bold">
            Plan boutique <span className="text-danger">*</span>
          </label>
          <div className="row g-3">
            {boutiqueConfig.categories && boutiqueConfig.categories.map(plan => (
              <div className="col-md-6" key={plan.id}>
                <Card 
                  className={`h-100 cursor-pointer ${postData.plan_boutique === plan.id ? 'border-primary shadow' : ''}`}
                  onClick={() => handleChangeInput({
                    target: { name: 'plan_boutique', value: plan.id }
                  })}
                >
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="me-2">{plan.emoji}</span>
                      <strong>{plan.name}</strong>
                    </div>
                    <Badge bg="primary">{plan.credits} crédits</Badge>
                  </Card.Header>
                  <Card.Body>
                    <ul className="mb-2">
                      <li><small>Stockage: {plan.storage}</small></li>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}><small>{feature}</small></li>
                      ))}
                    </ul>
                    <Button
                      size="sm"
                      variant={postData.plan_boutique === plan.id ? 'primary' : 'outline-primary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeInput({
                          target: { name: 'plan_boutique', value: plan.id }
                        });
                      }}
                    >
                      {postData.plan_boutique === plan.id ? '✓ Sélectionné' : 'Sélectionner'}
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          <small className="text-muted">
            Sélectionnez le plan qui correspond à vos besoins. Tous les plans incluent un nom de domaine.
          </small>
        </div>
      ),
      
      // Durée d'abonnement
      'duree_abonnement': (
        <div className="mb-3" key="duree_abonnement">
          <label className="form-label fw-bold">
            Durée d'abonnement <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            name="duree_abonnement"
            value={postData.duree_abonnement || ''}
            onChange={handleChangeInput}
            required
          >
            <option value="">Sélectionner une durée</option>
            <option value="1_mois">1 Mois</option>
            <option value="3_mois">3 Mois (1 mois offert)</option>
            <option value="6_mois">6 Mois (3 mois offerts)</option>
            <option value="12_mois">12 Mois (6 mois offerts)</option>
          </select>
          <small className="text-muted">
            Plus la durée est longue, plus vous économisez avec des mois offerts.
          </small>
        </div>
      ),
      
      // Total crédits (calculé automatiquement)
      'total_credits': (
        <div className="mb-3" key="total_credits">
          <label className="form-label fw-bold">
            Total crédits requis
          </label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              name="total_credits"
              value={postData.total_credits || ''}
              readOnly
              style={{ backgroundColor: '#f8f9fa' }}
            />
            <span className="input-group-text">crédits</span>
          </div>
          <small className="text-muted">
            Ce montant sera débité de votre compte lors de l'activation.
          </small>
        </div>
      ),
      
      // Stockage maximum
      'stockage_max': (
        <div className="mb-3" key="stockage_max">
          <label className="form-label fw-bold">
            Limite de stockage
          </label>
          <input
            type="text"
            className="form-control"
            name="stockage_max"
            value={postData.stockage_max || ''}
            readOnly
            style={{ backgroundColor: '#f8f9fa' }}
          />
          <small className="text-muted">
            Nombre maximum d'articles que vous pouvez publier dans votre boutique.
          </small>
        </div>
      ),
      
      // Inclusions du plan
      'inclusions_plan': (
        <div className="mb-3" key="inclusions_plan">
          <label className="form-label fw-bold">
            Inclusions du plan
          </label>
          <div className="alert alert-light border">
            <ul className="mb-0">
              <li>✓ Site Builder avec modèles personnalisables</li>
              <li>✓ Nom de domaine personnalisé (.monsite.dz)</li>
              <li>✓ Store à la une sur la plateforme</li>
              <li>✓ Tableau de bord administrateur</li>
              <li>✓ Statistiques de visite</li>
              <li>✓ Support technique</li>
            </ul>
          </div>
        </div>
      ),
      
      // Propriétaire nom
      'proprietaire_nom': (
        <div className="mb-3" key="proprietaire_nom">
          <label className="form-label fw-bold">
            Nom du propriétaire <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="proprietaire_nom"
            value={postData.proprietaire_nom || ''}
            onChange={handleChangeInput}
            placeholder="Nom complet du propriétaire"
            required
          />
        </div>
      ),
      
      // Propriétaire email
      'proprietaire_email': (
        <div className="mb-3" key="proprietaire_email">
          <EmailField
            key="proprietaire_email"
            mainCategory={mainCategory}
            subCategory={subCategory}
            fieldName="proprietaire_email"
            postData={postData}
            handleChangeInput={handleChangeInput}
            isRTL={isRTL}
            t={t}
          />
        </div>
      ),
      
      // Propriétaire téléphone
      'proprietaire_telephone': (
        <div className="mb-3" key="proprietaire_telephone">
          <TelephoneField
            key="proprietaire_telephone"
            mainCategory={mainCategory}
            subCategory={subCategory}
            fieldName="proprietaire_telephone"
            postData={postData}
            handleChangeInput={handleChangeInput}
            isRTL={isRTL}
            t={t}
          />
        </div>
      ),
      
      // Propriétaire wilaya
      'proprietaire_wilaya': (
        <div className="mb-3" key="proprietaire_wilaya">
          <WilayaCommuneField
            key="proprietaire_wilaya"
            mainCategory={mainCategory}
            subCategory={subCategory}
            fieldName="proprietaire_wilaya"
            postData={postData}
            handleChangeInput={handleChangeInput}
            isRTL={isRTL}
            t={t}
          />
        </div>
      ),
      
      // Propriétaire adresse
      'proprietaire_adresse': (
        <div className="mb-3" key="proprietaire_adresse">
          <label className="form-label fw-bold">
            Adresse complète
          </label>
          <input
            type="text"
            className="form-control"
            name="proprietaire_adresse"
            value={postData.proprietaire_adresse || ''}
            onChange={handleChangeInput}
            placeholder="Rue, numéro, commune"
          />
        </div>
      ),
      
      // Réseaux sociaux
      'reseaux_sociaux': (
        <div className="mb-3" key="reseaux_sociaux">
          <label className="form-label fw-bold">
            Réseaux sociaux (optionnel)
          </label>
          <textarea
            className="form-control"
            name="reseaux_sociaux"
            value={postData.reseaux_sociaux || ''}
            onChange={handleChangeInput}
            rows="2"
            placeholder="Facebook: https://facebook.com/votreboutique
Instagram: @votreboutique
TikTok: @votreboutique"
          />
          <small className="text-muted">
            Indiquez vos liens de réseaux sociaux (un par ligne)
          </small>
        </div>
      ),
      
      // Accepte conditions
      'accepte_conditions': (
        <div className="mb-3" key="accepte_conditions">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="accepte_conditions"
              id="accepte_conditions"
              checked={postData.accepte_conditions || false}
              onChange={handleChangeInput}
              required
            />
            <label className="form-check-label fw-bold" htmlFor="accepte_conditions">
              J'accepte les conditions générales de vente et d'utilisation de la plateforme <span className="text-danger">*</span>
            </label>
            <small className="d-block text-muted">
              En cochant cette case, vous acceptez nos CGV et notre politique de confidentialité.
            </small>
          </div>
        </div>
      ),
      
      // Logo boutique
      'logo_boutique': (
        <div className="mb-3" key="logo_boutique">
          <label className="form-label fw-bold">
            Logo de la boutique (optionnel)
          </label>
          <div className="border rounded p-3 text-center">
            <input
              type="file"
              className="form-control"
              name="logo_boutique"
              accept="image/*"
              onChange={(e) => {
                // Lógica para manejar upload de logo
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  handleChangeInput({
                    target: { name: 'logo_boutique_file', value: file }
                  });
                }
              }}
            />
            <small className="text-muted d-block mt-2">
              Taille recommandée: 300x300 pixels, format PNG ou JPG
            </small>
          </div>
        </div>
      )
    },
    
    // Campos adicionales por step (opcional)
    step2: [
      'nom_boutique', 
      'domaine_boutique', 
      'slogan_boutique',
      'description_boutique',
      'categories_produits',
      'couleur_theme'
    ],
    step3: [
      'plan_boutique',
      'duree_abonnement',
      'total_credits',
      'stockage_max',
      'inclusions_plan'
    ],
    step4: [
      'proprietaire_nom',
      'proprietaire_email',
      'proprietaire_telephone',
      'proprietaire_wilaya',
      'proprietaire_adresse',
      'reseaux_sociaux',
      'accepte_conditions'
    ],
    step5: ['images', 'logo_boutique'],
    
    // Campos personalizados con prefijo "custom:"
    customComponents: {
      // Para campos muy específicos
    }
  };
  
  return (
    <BaseCategoryField
      {...props}
      additionalFields={additionalFields}
    />
  );
};

export default BoutiquesField;