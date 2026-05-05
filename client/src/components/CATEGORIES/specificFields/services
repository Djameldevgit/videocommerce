import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ServicesFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'construction_travaux': {
        'typeTravaux': 'typeTravaux',
        'experienceConstruction': 'experienceConstruction',
        'referencesConstruction': 'referencesConstruction',
        'zoneIntervention': 'zoneIntervention',
        'prix': 'prix'
      },
      'ecoles_formations': {
        'typeFormation': 'typeFormation',
        'domaineFormation': 'domaineFormation',
        'dureeFormation': 'dureeFormation',
        'diplomeDelivre': 'diplomeDelivre',
        'prix': 'prix'
      },
      'industrie_fabrication': {
        'typeServiceIndustrie': 'typeServiceIndustrie',
        'capaciteProduction': 'capaciteProduction',
        'equipementsIndustrie': 'equipementsIndustrie',
        'certificationsIndustrie': 'certificationsIndustrie',
        'prix': 'prix'
      },
      'transport_demenagement': {
        'typeVehiculeTransport': 'typeVehiculeTransport',
        'capaciteTransport': 'capaciteTransport',
        'zoneTransport': 'zoneTransport',
        'assuranceTransport': 'assuranceTransport',
        'prix': 'prix'
      },
      'decoration_amenagement': {
        'typeServiceDecoration': 'typeServiceDecoration',
        'styleDecoration': 'styleDecoration',
        'referencesDecoration': 'referencesDecoration',
        'budgetDecoration': 'budgetDecoration',
        'prix': 'prix'
      },
      'publicite_communication': {
        'typeServiceCommunication': 'typeServiceCommunication',
        'supportCommunication': 'supportCommunication',
        'ciblesCommunication': 'ciblesCommunication',
        'campagnesRealisees': 'campagnesRealisees',
        'prix': 'prix'
      },
      'nettoyage_jardinage': {
        'typeServiceNettoyage': 'typeServiceNettoyage',
        'surfaceNettoyage': 'surfaceNettoyage',
        'frequenceNettoyage': 'frequenceNettoyage',
        'materielNettoyage': 'materielNettoyage',
        'prix': 'prix'
      },
      'froid_climatisation': {
        'typeServiceFroid': 'typeServiceFroid',
        'marquesFroid': 'marquesFroid',
        'garantieFroid': 'garantieFroid',
        'urgenceFroid': 'urgenceFroid',
        'prix': 'prix'
      },
      'traiteurs_gateaux': {
        'typeServiceTraiteur': 'typeServiceTraiteur',
        'specialiteTraiteur': 'specialiteTraiteur',
        'capaciteTraiteur': 'capaciteTraiteur',
        'menuTraiteur': 'menuTraiteur',
        'prix': 'prix'
      },
      'medecine_sante': {
        'typeServiceSante': 'typeServiceSante',
        'specialiteSante': 'specialiteSante',
        'qualificationsSante': 'qualificationsSante',
        'consultationSante': 'consultationSante',
        'prix': 'prix'
      },
      'reparation_auto_diagnostic': {
        'typeServiceAuto': 'typeServiceAuto',
        'marquesAuto': 'marquesAuto',
        'garantieAuto': 'garantieAuto',
        'diagnosticAuto': 'diagnosticAuto',
        'prix': 'prix'
      },
      'securite_alarme': {
        'typeServiceSecurite': 'typeServiceSecurite',
        'systemesSecurite': 'systemesSecurite',
        'certificationsSecurite': 'certificationsSecurite',
        'monitoringSecurite': 'monitoringSecurite',
        'prix': 'prix'
      },
      'projets_etudes': {
        'typeServiceProjet': 'typeServiceProjet',
        'domaineProjet': 'domaineProjet',
        'delaiProjet': 'delaiProjet',
        'livrablesProjet': 'livrablesProjet',
        'prix': 'prix'
      },
      'bureautique_internet': {
        'typeServiceBureautique': 'typeServiceBureautique',
        'logicielsBureautique': 'logicielsBureautique',
        'supportBureautique': 'supportBureautique',
        'reseauBureautique': 'reseauBureautique',
        'prix': 'prix'
      },
      'location_vehicules': {
        'typeVehiculeLocation': 'typeVehiculeLocation',
        'modeleLocation': 'modeleLocation',
        'conditionsLocation': 'conditionsLocation',
        'assuranceLocation': 'assuranceLocation',
        'prix': 'prix'
      },
      'menuiserie_meubles': {
        'typeServiceMenuiserie': 'typeServiceMenuiserie',
        'materiauxMenuiserie': 'materiauxMenuiserie',
        'realisationsMenuiserie': 'realisationsMenuiserie',
        'delaiMenuiserie': 'delaiMenuiserie',
        'prix': 'prix'
      },
      'impression_edition': {
        'typeServiceImpression': 'typeServiceImpression',
        'equipementsImpression': 'equipementsImpression',
        'formatsImpression': 'formatsImpression',
        'quantiteImpression': 'quantiteImpression',
        'prix': 'prix'
      },
      'hotellerie_restauration_salles': {
        'typeServiceHotellerie': 'typeServiceHotellerie',
        'capaciteHotellerie': 'capaciteHotellerie',
        'equipementsHotellerie': 'equipementsHotellerie',
        'servicesHotellerie': 'servicesHotellerie',
        'prix': 'prix'
      },
      'image_son': {
        'typeServiceImage': 'typeServiceImage',
        'equipementsImage': 'equipementsImage',
        'experienceImage': 'experienceImage',
        'realisationsImage': 'realisationsImage',
        'prix': 'prix'
      },
      'comptabilite_economie': {
        'typeServiceComptabilite': 'typeServiceComptabilite',
        'specialiteComptabilite': 'specialiteComptabilite',
        'logicielsComptabilite': 'logicielsComptabilite',
        'clientsComptabilite': 'clientsComptabilite',
        'prix': 'prix'
      },
      'couture_confection': {
        'typeServiceCouture': 'typeServiceCouture',
        'specialiteCouture': 'specialiteCouture',
        'realisationsCouture': 'realisationsCouture',
        'delaiCouture': 'delaiCouture',
        'prix': 'prix'
      },
      'maintenance_informatique': {
        'typeServiceMaintenance': 'typeServiceMaintenance',
        'marquesMaintenance': 'marquesMaintenance',
        'diagnosticMaintenance': 'diagnosticMaintenance',
        'urgenceMaintenance': 'urgenceMaintenance',
        'prix': 'prix'
      },
      'reparation_electromenager': {
        'typeServiceElectromenager': 'typeServiceElectromenager',
        'marquesElectromenager': 'marquesElectromenager',
        'garantieElectromenager': 'garantieElectromenager',
        'depannageElectromenager': 'depannageElectromenager',
        'prix': 'prix'
      },
      'evenements_divertissement': {
        'typeServiceEvenement': 'typeServiceEvenement',
        'typeEvenement': 'typeEvenement',
        'equipementsEvenement': 'equipementsEvenement',
        'animationEvenement': 'animationEvenement',
        'prix': 'prix'
      },
      'paraboles_demos': {
        'typeServiceParabole': 'typeServiceParabole',
        'systemesParabole': 'systemesParabole',
        'installationParabole': 'installationParabole',
        'maintenanceParabole': 'maintenanceParabole',
        'prix': 'prix'
      },
      'reparation_electronique': {
        'typeServiceElectronique': 'typeServiceElectronique',
        'appareilsElectronique': 'appareilsElectronique',
        'garantieElectronique': 'garantieElectronique',
        'diagnosticElectronique': 'diagnosticElectronique',
        'prix': 'prix'
      },
      'services_etranger': {
        'typeServiceEtranger': 'typeServiceEtranger',
        'paysService': 'paysService',
        'languesService': 'languesService',
        'delaiService': 'delaiService',
        'prix': 'prix'
      },
      'flashage_reparation_telephones': {
        'typeServiceFlashage': 'typeServiceFlashage',
        'marquesFlashage': 'marquesFlashage',
        'garantieFlashage': 'garantieFlashage',
        'delaiFlashage': 'delaiFlashage',
        'prix': 'prix'
      },
      'juridique': {
        'typeServiceJuridique': 'typeServiceJuridique',
        'domaineJuridique': 'domaineJuridique',
        'languesJuridique': 'languesJuridique',
        'honorairesJuridique': 'honorairesJuridique',
        'prix': 'prix'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    // Construction & Travaux
    'typeTravaux': (
      <Form.Group>
        <Form.Label>🏗️ {t('work_type', 'Type de travaux')}</Form.Label>
        <Form.Select
          name="typeTravaux"
          value={postData.typeTravaux || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_work_type', 'Sélectionnez')}</option>
          <option value="maçonnerie">{t('masonry', 'Maçonnerie')}</option>
          <option value="electricite">{t('electricity', 'Électricité')}</option>
          <option value="plomberie">{t('plumbing', 'Plomberie')}</option>
          <option value="peinture">{t('painting', 'Peinture')}</option>
          <option value="carrelage">{t('tiling', 'Carrelage')}</option>
          <option value="toiture">{t('roofing', 'Toiture')}</option>
          <option value="menuiserie">{t('carpentry', 'Menuiserie')}</option>
          <option value="demolition">{t('demolition', 'Démolition')}</option>
          <option value="terrassement">{t('earthworks', 'Terrassement')}</option>
          <option value="isolation">{t('insulation', 'Isolation')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'experienceConstruction': (
      <Form.Group>
        <Form.Label>📅 {t('construction_experience', 'Années d\'expérience')}</Form.Label>
        <Form.Select
          name="experienceConstruction"
          value={postData.experienceConstruction || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_experience', 'Sélectionnez')}</option>
          <option value="moins_1">{t('less_than_1', 'Moins de 1 an')}</option>
          <option value="1_3">1-3 {t('years', 'ans')}</option>
          <option value="3_5">3-5 {t('years', 'ans')}</option>
          <option value="5_10">5-10 {t('years', 'ans')}</option>
          <option value="10_plus">10+ {t('years', 'ans')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'referencesConstruction': (
      <Form.Group>
        <Form.Label>📋 {t('construction_references', 'Références')}</Form.Label>
        <Form.Control
          as="textarea"
          name="referencesConstruction"
          value={postData.referencesConstruction || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_references', 'Projets réalisés, clients satisfaits...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'zoneIntervention': (
      <Form.Group>
        <Form.Label>🗺️ {t('intervention_area', 'Zone d\'intervention')}</Form.Label>
        <Form.Control
          type="text"
          name="zoneIntervention"
          value={postData.zoneIntervention || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_area', 'Ex: Alger centre, 50km autour de...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Écoles & Formations
    'typeFormation': (
      <Form.Group>
        <Form.Label>🎓 {t('training_type', 'Type de formation')}</Form.Label>
        <Form.Select
          name="typeFormation"
          value={postData.typeFormation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_training_type', 'Sélectionnez')}</option>
          <option value="scolaire">{t('school', 'Scolaire')}</option>
          <option value="universitaire">{t('university', 'Universitaire')}</option>
          <option value="professionnelle">{t('professional', 'Professionnelle')}</option>
          <option value="langues">{t('languages', 'Langues')}</option>
          <option value="informatique">{t('it', 'Informatique')}</option>
          <option value="art">{t('art', 'Arts')}</option>
          <option value="sport">{t('sports', 'Sports')}</option>
          <option value="cours_particuliers">{t('private_lessons', 'Cours particuliers')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'domaineFormation': (
      <Form.Group>
        <Form.Label>📚 {t('training_field', 'Domaine de formation')}</Form.Label>
        <Form.Control
          type="text"
          name="domaineFormation"
          value={postData.domaineFormation || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_field', 'Ex: Mathématiques, Informatique, Langues...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'dureeFormation': (
      <Form.Group>
        <Form.Label>⏱️ {t('training_duration', 'Durée de la formation')}</Form.Label>
        <Form.Select
          name="dureeFormation"
          value={postData.dureeFormation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_duration', 'Sélectionnez')}</option>
          <option value="courte">{t('short', 'Courte (quelques heures)')}</option>
          <option value="semaine">{t('week', '1 semaine')}</option>
          <option value="mois_1">1 {t('month', 'mois')}</option>
          <option value="mois_3">3 {t('months', 'mois')}</option>
          <option value="mois_6">6 {t('months', 'mois')}</option>
          <option value="an_1">1 {t('year', 'an')}</option>
          <option value="an_2">2 {t('years', 'ans')}</option>
          <option value="longue">{t('long', 'Longue (plusieurs années)')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'diplomeDelivre': (
      <Form.Group>
        <Form.Label>🎖️ {t('diploma_awarded', 'Diplôme délivré')}</Form.Label>
        <Form.Control
          type="text"
          name="diplomeDelivre"
          value={postData.diplomeDelivre || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_diploma', 'Nom du diplôme/certificat')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Industrie & Fabrication
    'typeServiceIndustrie': (
      <Form.Group>
        <Form.Label>🏭 {t('industry_service_type', 'Type de service industriel')}</Form.Label>
        <Form.Select
          name="typeServiceIndustrie"
          value={postData.typeServiceIndustrie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_industry_service', 'Sélectionnez')}</option>
          <option value="sous_traitance">{t('subcontracting', 'Sous-traitance')}</option>
          <option value="fabrication">{t('manufacturing', 'Fabrication')}</option>
          <option value="assemblage">{t('assembly', 'Assemblage')}</option>
          <option value="usinage">{t('machining', 'Usinage')}</option>
          <option value="moulage">{t('molding', 'Moulage')}</option>
          <option value="traitement_surface">{t('surface_treatment', 'Traitement de surface')}</option>
          <option value="controle_qualite">{t('quality_control', 'Contrôle qualité')}</option>
          <option value="logistique">{t('logistics', 'Logistique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteProduction': (
      <Form.Group>
        <Form.Label>⚙️ {t('production_capacity', 'Capacité de production')}</Form.Label>
        <Form.Control
          type="text"
          name="capaciteProduction"
          value={postData.capaciteProduction || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_capacity', 'Ex: 1000 pièces/jour, 500kg/heure...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'equipementsIndustrie': (
      <Form.Group>
        <Form.Label>🔧 {t('industrial_equipment', 'Équipements industriels')}</Form.Label>
        <Form.Control
          as="textarea"
          name="equipementsIndustrie"
          value={postData.equipementsIndustrie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Liste des équipements disponibles...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'certificationsIndustrie': (
      <Form.Group>
        <Form.Label>📜 {t('industrial_certifications', 'Certifications')}</Form.Label>
        <Form.Control
          as="textarea"
          name="certificationsIndustrie"
          value={postData.certificationsIndustrie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_certifications', 'ISO, normes qualité, agréments...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Transport & Déménagement
    'typeVehiculeTransport': (
      <Form.Group>
        <Form.Label>🚚 {t('transport_vehicle_type', 'Type de véhicule')}</Form.Label>
        <Form.Select
          name="typeVehiculeTransport"
          value={postData.typeVehiculeTransport || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_vehicle_type', 'Sélectionnez')}</option>
          <option value="camionnette">{t('van', 'Camionnette')}</option>
          <option value="camion">{t('truck', 'Camion')}</option>
          <option value="fourgon">{t('van', 'Fourgon')}</option>
          <option value="remorque">{t('trailer', 'Remorque')}</option>
          <option value="utilitaire">{t('utility_vehicle', 'Utilitaire')}</option>
          <option value="benne">{t('dump_truck', 'Benne')}</option>
          <option value="grumier">{t('logging_truck', 'Grumier')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteTransport': (
      <Form.Group>
        <Form.Label>📦 {t('transport_capacity', 'Capacité de transport')}</Form.Label>
        <Form.Control
          type="text"
          name="capaciteTransport"
          value={postData.capaciteTransport || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_capacity', 'Ex: 3 tonnes, 20m³, 10 palettes...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'zoneTransport': (
      <Form.Group>
        <Form.Label>🌍 {t('transport_zone', 'Zone de transport')}</Form.Label>
        <Form.Control
          type="text"
          name="zoneTransport"
          value={postData.zoneTransport || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_zone', 'Ex: National, Régional, Local...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'assuranceTransport': (
      <Form.Group>
        <Form.Label>📄 {t('transport_insurance', 'Assurance transport')}</Form.Label>
        <Form.Check
          type="switch"
          name="assuranceTransport"
          checked={postData.assuranceTransport || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'assuranceTransport',
              value: e.target.checked
            }
          })}
          label={postData.assuranceTransport ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Décoration & Aménagement
    'typeServiceDecoration': (
      <Form.Group>
        <Form.Label>🎨 {t('decoration_service_type', 'Type de service décoration')}</Form.Label>
        <Form.Select
          name="typeServiceDecoration"
          value={postData.typeServiceDecoration || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_decoration_service', 'Sélectionnez')}</option>
          <option value="interieur">{t('interior', 'Intérieur')}</option>
          <option value="exterieur">{t('exterior', 'Extérieur')}</option>
          <option value="commercial">{t('commercial', 'Commercial')}</option>
          <option value="evenementiel">{t('event', 'Événementiel')}</option>
          <option value="paysagiste">{t('landscaping', 'Paysagiste')}</option>
          <option value="luminaire">{t('lighting', 'Éclairage')}</option>
          <option value="mural">{t('wall', 'Mural')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'styleDecoration': (
      <Form.Group>
        <Form.Label>🏛️ {t('decoration_style', 'Style de décoration')}</Form.Label>
        <Form.Select
          name="styleDecoration"
          value={postData.styleDecoration || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_style', 'Sélectionnez')}</option>
          <option value="moderne">{t('modern', 'Moderne')}</option>
          <option value="classique">{t('classic', 'Classique')}</option>
          <option value="contemporain">{t('contemporary', 'Contemporain')}</option>
          <option value="rustique">{t('rustic', 'Rustique')}</option>
          <option value="industriel">{t('industrial', 'Industriel')}</option>
          <option value="scandinave">{t('scandinavian', 'Scandinave')}</option>
          <option value="ethnique">{t('ethnic', 'Ethnique')}</option>
          <option value="minimaliste">{t('minimalist', 'Minimaliste')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'referencesDecoration': (
      <Form.Group>
        <Form.Label>📸 {t('decoration_references', 'Références décoration')}</Form.Label>
        <Form.Control
          type="text"
          name="referencesDecoration"
          value={postData.referencesDecoration || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_references', 'Projets similaires réalisés')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'budgetDecoration': (
      <Form.Group>
        <Form.Label>💰 {t('decoration_budget', 'Budget moyen')}</Form.Label>
        <Form.Control
          type="text"
          name="budgetDecoration"
          value={postData.budgetDecoration || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_budget_range', 'Ex: 5000-20000 DA, sur devis...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Publicité & Communication
    'typeServiceCommunication': (
      <Form.Group>
        <Form.Label>📢 {t('communication_service_type', 'Type de service communication')}</Form.Label>
        <Form.Select
          name="typeServiceCommunication"
          value={postData.typeServiceCommunication || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_communication_service', 'Sélectionnez')}</option>
          <option value="marketing">{t('marketing', 'Marketing')}</option>
          <option value="publicite">{t('advertising', 'Publicité')}</option>
          <option value="relations_publiques">{t('pr', 'Relations publiques')}</option>
          <option value="design">{t('design', 'Design graphique')}</option>
          <option value="web">{t('web', 'Web & Digital')}</option>
          <option value="evenementiel">{t('events', 'Événementiel')}</option>
          <option value="medias">{t('media', 'Médias')}</option>
          <option value="redaction">{t('copywriting', 'Rédaction')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'supportCommunication': (
      <Form.Group>
        <Form.Label>📱 {t('communication_support', 'Support de communication')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="supportPrint"
            label={t('print', 'Print (flyers, affiches)')}
            checked={postData.supportPrint || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="supportDigital"
            label={t('digital', 'Digital (réseaux sociaux, site web)')}
            checked={postData.supportDigital || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="supportRadio"
            label={t('radio', 'Radio')}
            checked={postData.supportRadio || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="supportTV"
            label={t('tv', 'Télévision')}
            checked={postData.supportTV || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="supportAffichage"
            label={t('outdoor', 'Affichage extérieur')}
            checked={postData.supportAffichage || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'ciblesCommunication': (
      <Form.Group>
        <Form.Label>🎯 {t('communication_targets', 'Cibles')}</Form.Label>
        <Form.Control
          as="textarea"
          name="ciblesCommunication"
          value={postData.ciblesCommunication || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_targets', 'Public cible, secteur d\'activité...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'campagnesRealisees': (
      <Form.Group>
        <Form.Label>📊 {t('campaigns_done', 'Campagnes réalisées')}</Form.Label>
        <Form.Control
          type="text"
          name="campagnesRealisees"
          value={postData.campagnesRealisees || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_campaigns', 'Exemples de campagnes réussies')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Nettoyage & Jardinage
    'typeServiceNettoyage': (
      <Form.Group>
        <Form.Label>🧹 {t('cleaning_service_type', 'Type de service nettoyage')}</Form.Label>
        <Form.Select
          name="typeServiceNettoyage"
          value={postData.typeServiceNettoyage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_cleaning_service', 'Sélectionnez')}</option>
          <option value="domestique">{t('domestic', 'Domestique')}</option>
          <option value="bureaux">{t('office', 'Bureaux')}</option>
          <option value="industriel">{t('industrial', 'Industriel')}</option>
          <option value="vitres">{t('windows', 'Nettoyage de vitres')}</option>
          <option value="tapis">{t('carpets', 'Tapis & moquettes')}</option>
          <option value="apres_travaux">{t('post_construction', 'Après travaux')}</option>
          <option value="jardinage">{t('gardening', 'Jardinage')}</option>
          <option value="piscine">{t('pool', 'Piscine')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'surfaceNettoyage': (
      <Form.Group>
        <Form.Label>📏 {t('cleaning_surface', 'Surface à nettoyer')}</Form.Label>
        <Form.Select
          name="surfaceNettoyage"
          value={postData.surfaceNettoyage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_surface', 'Sélectionnez')}</option>
          <option value="petite">{t('small', 'Petite (< 50m²)')}</option>
          <option value="moyenne">{t('medium', 'Moyenne (50-150m²)')}</option>
          <option value="grande">{t('large', 'Grande (150-500m²)')}</option>
          <option value="tres_grande">{t('very_large', 'Très grande (> 500m²)')}</option>
          <option value="sur_mesure">{t('custom', 'Sur mesure')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'frequenceNettoyage': (
      <Form.Group>
        <Form.Label>🔄 {t('cleaning_frequency', 'Fréquence de nettoyage')}</Form.Label>
        <Form.Select
          name="frequenceNettoyage"
          value={postData.frequenceNettoyage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_frequency', 'Sélectionnez')}</option>
          <option value="ponctuel">{t('one_time', 'Ponctuel')}</option>
          <option value="quotidien">{t('daily', 'Quotidien')}</option>
          <option value="hebdomadaire">{t('weekly', 'Hebdomadaire')}</option>
          <option value="mensuel">{t('monthly', 'Mensuel')}</option>
          <option value="trimestriel">{t('quarterly', 'Trimestriel')}</option>
          <option value="annuel">{t('annual', 'Annuel')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'materielNettoyage': (
      <Form.Group>
        <Form.Label>🧽 {t('cleaning_equipment', 'Matériel de nettoyage')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="materielFourni"
            label={t('equipment_provided', 'Matériel fourni')}
            checked={postData.materielFourni || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="produitsEco"
            label={t('eco_products', 'Produits écologiques')}
            checked={postData.produitsEco || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="machinesProfessionnelles"
            label={t('professional_machines', 'Machines professionnelles')}
            checked={postData.machinesProfessionnelles || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Froid & Climatisation
    'typeServiceFroid': (
      <Form.Group>
        <Form.Label>❄️ {t('refrigeration_service_type', 'Type de service froid')}</Form.Label>
        <Form.Select
          name="typeServiceFroid"
          value={postData.typeServiceFroid || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_refrigeration_service', 'Sélectionnez')}</option>
          <option value="installation">{t('installation', 'Installation')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="maintenance">{t('maintenance', 'Maintenance')}</option>
          <option value="depannage">{t('troubleshooting', 'Dépannage')}</option>
          <option value="recharge_gaz">{t('gas_recharge', 'Recharge de gaz')}</option>
          <option value="nettoyage">{t('cleaning', 'Nettoyage')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marquesFroid': (
      <Form.Group>
        <Form.Label>🏷️ {t('refrigeration_brands', 'Marques prises en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="marquesFroid"
          value={postData.marquesFroid || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brands', 'Ex: Daikin, LG, Samsung, Mitsubishi...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'garantieFroid': (
      <Form.Group>
        <Form.Label>🛡️ {t('refrigeration_warranty', 'Garantie sur les réparations')}</Form.Label>
        <Form.Control
          type="text"
          name="garantieFroid"
          value={postData.garantieFroid || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, 1 an...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'urgenceFroid': (
      <Form.Group>
        <Form.Label>🚨 {t('refrigeration_emergency', 'Service d\'urgence')}</Form.Label>
        <Form.Check
          type="switch"
          name="urgenceFroid"
          checked={postData.urgenceFroid || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'urgenceFroid',
              value: e.target.checked
            }
          })}
          label={postData.urgenceFroid ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Traiteurs & Gâteaux
    'typeServiceTraiteur': (
      <Form.Group>
        <Form.Label>🍽️ {t('catering_service_type', 'Type de service traiteur')}</Form.Label>
        <Form.Select
          name="typeServiceTraiteur"
          value={postData.typeServiceTraiteur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_catering_service', 'Sélectionnez')}</option>
          <option value="mariage">{t('wedding', 'Mariage')}</option>
          <option value="anniversaire">{t('birthday', 'Anniversaire')}</option>
          <option value="entreprise">{t('corporate', 'Entreprise')}</option>
          <option value="buffet">{t('buffet', 'Buffet')}</option>
          <option value="cocktail">{t('cocktail', 'Cocktail')}</option>
          <option value="reception">{t('reception', 'Réception')}</option>
          <option value="gateaux">{t('cakes', 'Gâteaux')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'specialiteTraiteur': (
      <Form.Group>
        <Form.Label>👨‍🍳 {t('catering_specialty', 'Spécialité culinaire')}</Form.Label>
        <Form.Control
          type="text"
          name="specialiteTraiteur"
          value={postData.specialiteTraiteur || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specialty', 'Ex: Cuisine algérienne, française, asiatique...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'capaciteTraiteur': (
      <Form.Group>
        <Form.Label>👥 {t('catering_capacity', 'Capacité d\'accueil')}</Form.Label>
        <Form.Control
          type="text"
          name="capaciteTraiteur"
          value={postData.capaciteTraiteur || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_capacity', 'Ex: Jusqu\'à 100 personnes, 50-200 personnes...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'menuTraiteur': (
      <Form.Group>
        <Form.Label>📋 {t('catering_menu', 'Menu proposé')}</Form.Label>
        <Form.Control
          as="textarea"
          name="menuTraiteur"
          value={postData.menuTraiteur || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_menu', 'Description des plats, entrées, desserts...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Médecine & Santé
    'typeServiceSante': (
      <Form.Group>
        <Form.Label>🏥 {t('health_service_type', 'Type de service santé')}</Form.Label>
        <Form.Select
          name="typeServiceSante"
          value={postData.typeServiceSante || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_health_service', 'Sélectionnez')}</option>
          <option value="consultation">{t('consultation', 'Consultation')}</option>
          <option value="soins">{t('care', 'Soins')}</option>
          <option value="analyses">{t('analysis', 'Analyses')}</option>
          <option value="imagerie">{t('imaging', 'Imagerie médicale')}</option>
          <option value="urgence">{t('emergency', 'Urgence')}</option>
          <option value="prevention">{t('prevention', 'Prévention')}</option>
          <option value="therapie">{t('therapy', 'Thérapie')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'specialiteSante': (
      <Form.Group>
        <Form.Label>🎓 {t('health_specialty', 'Spécialité médicale')}</Form.Label>
        <Form.Control
          type="text"
          name="specialiteSante"
          value={postData.specialiteSante || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specialty', 'Ex: Généraliste, Cardiologie, Pédiatrie...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'qualificationsSante': (
      <Form.Group>
        <Form.Label>📜 {t('health_qualifications', 'Qualifications')}</Form.Label>
        <Form.Control
          as="textarea"
          name="qualificationsSante"
          value={postData.qualificationsSante || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_qualifications', 'Diplômes, certifications, expérience...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'consultationSante': (
      <Form.Group>
        <Form.Label>⏰ {t('health_consultation_hours', 'Horaires de consultation')}</Form.Label>
        <Form.Control
          type="text"
          name="consultationSante"
          value={postData.consultationSante || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_hours', 'Ex: 9h-12h, 14h-18h, sur rendez-vous...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Répare Auto & Diagnostic
    'typeServiceAuto': (
      <Form.Group>
        <Form.Label>🔧 {t('auto_service_type', 'Type de service auto')}</Form.Label>
        <Form.Select
          name="typeServiceAuto"
          value={postData.typeServiceAuto || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_auto_service', 'Sélectionnez')}</option>
          <option value="mecanique">{t('mechanics', 'Mécanique')}</option>
          <option value="carrosserie">{t('bodywork', 'Carrosserie')}</option>
          <option value="electricite_auto">{t('auto_electricity', 'Électricité auto')}</option>
          <option value="diagnostic">{t('diagnostic', 'Diagnostic')}</option>
          <option value="vidange">{t('oil_change', 'Vidange')}</option>
          <option value="freins">{t('brakes', 'Freins')}</option>
          <option value="climatisation_auto">{t('auto_ac', 'Climatisation auto')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marquesAuto': (
      <Form.Group>
        <Form.Label>🚗 {t('auto_brands', 'Marques prises en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="marquesAuto"
          value={postData.marquesAuto || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_auto_brands', 'Ex: Renault, Peugeot, Toyota, Mercedes...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'garantieAuto': (
      <Form.Group>
        <Form.Label>🛡️ {t('auto_warranty', 'Garantie sur les réparations')}</Form.Label>
        <Form.Control
          type="text"
          name="garantieAuto"
          value={postData.garantieAuto || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, 1 an...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'diagnosticAuto': (
      <Form.Group>
        <Form.Label>🔍 {t('auto_diagnostic', 'Diagnostic électronique')}</Form.Label>
        <Form.Check
          type="switch"
          name="diagnosticAuto"
          checked={postData.diagnosticAuto || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'diagnosticAuto',
              value: e.target.checked
            }
          })}
          label={postData.diagnosticAuto ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Sécurité & Alarmes
    'typeServiceSecurite': (
      <Form.Group>
        <Form.Label>🔒 {t('security_service_type', 'Type de service sécurité')}</Form.Label>
        <Form.Select
          name="typeServiceSecurite"
          value={postData.typeServiceSecurite || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_security_service', 'Sélectionnez')}</option>
          <option value="alarmes">{t('alarms', 'Alarmes')}</option>
          <option value="surveillance">{t('surveillance', 'Surveillance')}</option>
          <option value="contrôle_acces">{t('access_control', 'Contrôle d\'accès')}</option>
          <option value="incendie">{t('fire', 'Sécurité incendie')}</option>
          <option value="gardiennage">{t('guarding', 'Gardiennage')}</option>
          <option value="cybersecurite">{t('cybersecurity', 'Cybersécurité')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'systemesSecurite': (
      <Form.Group>
        <Form.Label>⚙️ {t('security_systems', 'Systèmes de sécurité')}</Form.Label>
        <Form.Control
          type="text"
          name="systemesSecurite"
          value={postData.systemesSecurite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_systems', 'Ex: Caméras, détecteurs, alarmes sans fil...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'certificationsSecurite': (
      <Form.Group>
        <Form.Label>📜 {t('security_certifications', 'Certifications sécurité')}</Form.Label>
        <Form.Control
          type="text"
          name="certificationsSecurite"
          value={postData.certificationsSecurite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_certifications', 'Ex: NF, CE, ISO, agréments...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'monitoringSecurite': (
      <Form.Group>
        <Form.Label>📡 {t('security_monitoring', 'Monitoring 24/7')}</Form.Label>
        <Form.Check
          type="switch"
          name="monitoringSecurite"
          checked={postData.monitoringSecurite || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'monitoringSecurite',
              value: e.target.checked
            }
          })}
          label={postData.monitoringSecurite ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Projets & Études
    'typeServiceProjet': (
      <Form.Group>
        <Form.Label>📋 {t('project_service_type', 'Type de service projet')}</Form.Label>
        <Form.Select
          name="typeServiceProjet"
          value={postData.typeServiceProjet || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_project_service', 'Sélectionnez')}</option>
          <option value="etude_faisabilite">{t('feasibility_study', 'Étude de faisabilité')}</option>
          <option value="conception">{t('design', 'Conception')}</option>
          <option value="gestion_projet">{t('project_management', 'Gestion de projet')}</option>
          <option value="consulting">{t('consulting', 'Consulting')}</option>
          <option value="audit">{t('audit', 'Audit')}</option>
          <option value="recherche">{t('research', 'Recherche')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'domaineProjet': (
      <Form.Group>
        <Form.Label>🎯 {t('project_domain', 'Domaine du projet')}</Form.Label>
        <Form.Control
          type="text"
          name="domaineProjet"
          value={postData.domaineProjet || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_domain', 'Ex: Construction, Informatique, Marketing...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiProjet': (
      <Form.Group>
        <Form.Label>⏱️ {t('project_delivery_time', 'Délai de réalisation')}</Form.Label>
        <Form.Control
          type="text"
          name="delaiProjet"
          value={postData.delaiProjet || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_delivery_time', 'Ex: 1 mois, 3-6 mois, sur devis...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'livrablesProjet': (
      <Form.Group>
        <Form.Label>📄 {t('project_deliverables', 'Livrables')}</Form.Label>
        <Form.Control
          as="textarea"
          name="livrablesProjet"
          value={postData.livrablesProjet || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_deliverables', 'Rapports, plans, études, présentations...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Bureautique & Internet
    'typeServiceBureautique': (
      <Form.Group>
        <Form.Label>💼 {t('office_service_type', 'Type de service bureautique')}</Form.Label>
        <Form.Select
          name="typeServiceBureautique"
          value={postData.typeServiceBureautique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_office_service', 'Sélectionnez')}</option>
          <option value="formation_logiciels">{t('software_training', 'Formation logiciels')}</option>
          <option value="installation_reseau">{t('network_installation', 'Installation réseau')}</option>
          <option value="depannage_informatique">{t('it_troubleshooting', 'Dépannage informatique')}</option>
          <option value="conseil_digital">{t('digital_consulting', 'Conseil digital')}</option>
          <option value="services_cloud">{t('cloud_services', 'Services cloud')}</option>
          <option value="impression_scanner">{t('printing_scanning', 'Impression/Scanner')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'logicielsBureautique': (
      <Form.Group>
        <Form.Label>💻 {t('office_software', 'Logiciels maîtrisés')}</Form.Label>
        <Form.Control
          type="text"
          name="logicielsBureautique"
          value={postData.logicielsBureautique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_software', 'Ex: Office 365, Adobe Suite, SAP...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'supportBureautique': (
      <Form.Group>
        <Form.Label>📞 {t('office_support', 'Support technique')}</Form.Label>
        <Form.Control
          type="text"
          name="supportBureautique"
          value={postData.supportBureautique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_support', 'Ex: Téléphone, email, remote, sur site...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'reseauBureautique': (
      <Form.Group>
        <Form.Label>🌐 {t('office_network', 'Services réseau')}</Form.Label>
        <Form.Control
          as="textarea"
          name="reseauBureautique"
          value={postData.reseauBureautique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_network_services', 'Configuration routeur, VPN, WiFi, sécurité...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Location Véhicules
    'typeVehiculeLocation': (
      <Form.Group>
        <Form.Label>🚗 {t('rental_vehicle_type', 'Type de véhicule à louer')}</Form.Label>
        <Form.Select
          name="typeVehiculeLocation"
          value={postData.typeVehiculeLocation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_rental_vehicle', 'Sélectionnez')}</option>
          <option value="voiture">{t('car', 'Voiture')}</option>
          <option value="utilitaire">{t('utility_vehicle', 'Utilitaire')}</option>
          <option value="camion">{t('truck', 'Camion')}</option>
          <option value="bus">{t('bus', 'Bus')}</option>
          <option value="moto">{t('motorcycle', 'Moto')}</option>
          <option value="velo">{t('bicycle', 'Vélo')}</option>
          <option value="engin">{t('equipment', 'Engin de chantier')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'modeleLocation': (
      <Form.Group>
        <Form.Label>📋 {t('rental_model', 'Modèle disponible')}</Form.Label>
        <Form.Control
          type="text"
          name="modeleLocation"
          value={postData.modeleLocation || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_model', 'Ex: Renault Clio, Mercedes Sprinter...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'conditionsLocation': (
      <Form.Group>
        <Form.Label>📝 {t('rental_conditions', 'Conditions de location')}</Form.Label>
        <Form.Control
          as="textarea"
          name="conditionsLocation"
          value={postData.conditionsLocation || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_conditions', 'Kilométrage inclus, âge minimum, caution...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'assuranceLocation': (
      <Form.Group>
        <Form.Label>🛡️ {t('rental_insurance', 'Assurance incluse')}</Form.Label>
        <Form.Check
          type="switch"
          name="assuranceLocation"
          checked={postData.assuranceLocation || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'assuranceLocation',
              value: e.target.checked
            }
          })}
          label={postData.assuranceLocation ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Menuiserie & Meubles
    'typeServiceMenuiserie': (
      <Form.Group>
        <Form.Label>🪚 {t('carpentry_service_type', 'Type de service menuiserie')}</Form.Label>
        <Form.Select
          name="typeServiceMenuiserie"
          value={postData.typeServiceMenuiserie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_carpentry_service', 'Sélectionnez')}</option>
          <option value="fabrication_meubles">{t('furniture_making', 'Fabrication de meubles')}</option>
          <option value="agencement">{t('fittings', 'Agencement')}</option>
          <option value="escaliers">{t('stairs', 'Escaliers')}</option>
          <option value="portes_fenetres">{t('doors_windows', 'Portes & Fenêtres')}</option>
          <option value="cuisine">{t('kitchen', 'Cuisine')}</option>
          <option value="placards">{t('wardrobes', 'Placards')}</option>
          <option value="restauration">{t('restoration', 'Restauration')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'materiauxMenuiserie': (
      <Form.Group>
        <Form.Label>🌳 {t('carpentry_materials', 'Matériaux utilisés')}</Form.Label>
        <Form.Control
          type="text"
          name="materiauxMenuiserie"
          value={postData.materiauxMenuiserie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_materials', 'Ex: Bois massif, MDF, contreplaqué, mélaminé...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'realisationsMenuiserie': (
      <Form.Group>
        <Form.Label>📸 {t('carpentry_works', 'Réalisations')}</Form.Label>
        <Form.Control
          as="textarea"
          name="realisationsMenuiserie"
          value={postData.realisationsMenuiserie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_works', 'Projets réalisés, photos disponibles...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiMenuiserie': (
      <Form.Group>
        <Form.Label>⏱️ {t('carpentry_delivery_time', 'Délai de fabrication')}</Form.Label>
        <Form.Control
          type="text"
          name="delaiMenuiserie"
          value={postData.delaiMenuiserie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_delivery_time', 'Ex: 2-3 semaines, sur devis...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Impression & Édition
    'typeServiceImpression': (
      <Form.Group>
        <Form.Label>🖨️ {t('printing_service_type', 'Type de service impression')}</Form.Label>
        <Form.Select
          name="typeServiceImpression"
          value={postData.typeServiceImpression || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_printing_service', 'Sélectionnez')}</option>
          <option value="offset">{t('offset', 'Impression offset')}</option>
          <option value="numerique">{t('digital', 'Impression numérique')}</option>
          <option value="grand_format">{t('large_format', 'Grand format')}</option>
          <option value="serigraphie">{t('screen_printing', 'Sérigraphie')}</option>
          <option value="brochures">{t('brochures', 'Brochures')}</option>
          <option value="cartes">{t('cards', 'Cartes de visite')}</option>
          <option value="packaging">{t('packaging', 'Packaging')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'equipementsImpression': (
      <Form.Group>
        <Form.Label>⚙️ {t('printing_equipment', 'Équipements d\'impression')}</Form.Label>
        <Form.Control
          type="text"
          name="equipementsImpression"
          value={postData.equipementsImpression || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Ex: Presse offset, imprimante numérique, plotter...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'formatsImpression': (
      <Form.Group>
        <Form.Label>📏 {t('printing_formats', 'Formats disponibles')}</Form.Label>
        <Form.Control
          type="text"
          name="formatsImpression"
          value={postData.formatsImpression || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_formats', 'Ex: A4, A3, A2, A1, sur mesure...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'quantiteImpression': (
      <Form.Group>
        <Form.Label>📊 {t('printing_quantity', 'Quantités minimales')}</Form.Label>
        <Form.Control
          type="text"
          name="quantiteImpression"
          value={postData.quantiteImpression || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_quantity', 'Ex: À partir de 100 exemplaires, sur devis...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Hôtellerie & Restauration
    'typeServiceHotellerie': (
      <Form.Group>
        <Form.Label>🏨 {t('hospitality_service_type', 'Type de service hôtellerie')}</Form.Label>
        <Form.Select
          name="typeServiceHotellerie"
          value={postData.typeServiceHotellerie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_hospitality_service', 'Sélectionnez')}</option>
          <option value="hebergement">{t('accommodation', 'Hébergement')}</option>
          <option value="restauration">{t('restaurant', 'Restauration')}</option>
          <option value="salle_fetes">{t('party_room', 'Salle des fêtes')}</option>
          <option value="seminaire">{t('seminar', 'Séminaire')}</option>
          <option value="reception">{t('reception', 'Réception')}</option>
          <option value="catering">{t('catering', 'Catering')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteHotellerie': (
      <Form.Group>
        <Form.Label>👥 {t('hospitality_capacity', 'Capacité d\'accueil')}</Form.Label>
        <Form.Control
          type="text"
          name="capaciteHotellerie"
          value={postData.capaciteHotellerie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_capacity', 'Ex: 50 chambres, 200 couverts, 500 personnes...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'equipementsHotellerie': (
      <Form.Group>
        <Form.Label>🛏️ {t('hospitality_equipment', 'Équipements disponibles')}</Form.Label>
        <Form.Control
          as="textarea"
          name="equipementsHotellerie"
          value={postData.equipementsHotellerie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Ex: Salles équipées, cuisine, sonorisation...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'servicesHotellerie': (
      <Form.Group>
        <Form.Label>✨ {t('hospitality_services', 'Services proposés')}</Form.Label>
        <Form.Control
          as="textarea"
          name="servicesHotellerie"
          value={postData.servicesHotellerie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_services', 'Ex: Petit-déjeuner, wifi, parking, animation...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Image & Son
    'typeServiceImage': (
      <Form.Group>
        <Form.Label>🎥 {t('media_service_type', 'Type de service image/son')}</Form.Label>
        <Form.Select
          name="typeServiceImage"
          value={postData.typeServiceImage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_media_service', 'Sélectionnez')}</option>
          <option value="photographie">{t('photography', 'Photographie')}</option>
          <option value="video">{t('video', 'Vidéo')}</option>
          <option value="sonorisation">{t('sound', 'Sonorisation')}</option>
          <option value="eclairage">{t('lighting', 'Éclairage')}</option>
          <option value="montage">{t('editing', 'Montage')}</option>
          <option value="drone">{t('drone', 'Drone')}</option>
          <option value="streaming">{t('streaming', 'Streaming')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'equipementsImage': (
      <Form.Group>
        <Form.Label>📷 {t('media_equipment', 'Équipements audiovisuels')}</Form.Label>
        <Form.Control
          type="text"
          name="equipementsImage"
          value={postData.equipementsImage || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Ex: Caméras 4K, micros, drones, éclairage...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'experienceImage': (
      <Form.Group>
        <Form.Label>📅 {t('media_experience', 'Années d\'expérience')}</Form.Label>
        <Form.Select
          name="experienceImage"
          value={postData.experienceImage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_experience', 'Sélectionnez')}</option>
          <option value="moins_1">{t('less_than_1', 'Moins de 1 an')}</option>
          <option value="1_3">1-3 {t('years', 'ans')}</option>
          <option value="3_5">3-5 {t('years', 'ans')}</option>
          <option value="5_10">5-10 {t('years', 'ans')}</option>
          <option value="10_plus">10+ {t('years', 'ans')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'realisationsImage': (
      <Form.Group>
        <Form.Label>🎬 {t('media_portfolio', 'Réalisations/Portfolio')}</Form.Label>
        <Form.Control
          type="text"
          name="realisationsImage"
          value={postData.realisationsImage || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_portfolio', 'Lien vers portfolio ou chaîne YouTube...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Comptabilité & Économie
    'typeServiceComptabilite': (
      <Form.Group>
        <Form.Label>💰 {t('accounting_service_type', 'Type de service comptabilité')}</Form.Label>
        <Form.Select
          name="typeServiceComptabilite"
          value={postData.typeServiceComptabilite || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_accounting_service', 'Sélectionnez')}</option>
          <option value="comptabilite_generale">{t('general_accounting', 'Comptabilité générale')}</option>
          <option value="fiscalite">{t('taxation', 'Fiscalité')}</option>
          <option value="paie">{t('payroll', 'Paie')}</option>
          <option value="audit_comptable">{t('accounting_audit', 'Audit comptable')}</option>
          <option value="conseil_financier">{t('financial_advice', 'Conseil financier')}</option>
          <option value="creation_entreprise">{t('company_creation', 'Création d\'entreprise')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'specialiteComptabilite': (
      <Form.Group>
        <Form.Label>🎯 {t('accounting_specialty', 'Spécialité')}</Form.Label>
        <Form.Control
          type="text"
          name="specialiteComptabilite"
          value={postData.specialiteComptabilite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specialty', 'Ex: PME, associations, commerce...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'logicielsComptabilite': (
      <Form.Group>
        <Form.Label>💻 {t('accounting_software', 'Logiciels utilisés')}</Form.Label>
        <Form.Control
          type="text"
          name="logicielsComptabilite"
          value={postData.logicielsComptabilite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_software', 'Ex: Sage, Ciel, EBP, QuickBooks...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'clientsComptabilite': (
      <Form.Group>
        <Form.Label>👥 {t('accounting_clients', 'Types de clients')}</Form.Label>
        <Form.Control
          type="text"
          name="clientsComptabilite"
          value={postData.clientsComptabilite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_clients', 'Ex: TPE, PME, indépendants, associations...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Couture & Confection
    'typeServiceCouture': (
      <Form.Group>
        <Form.Label>🧵 {t('sewing_service_type', 'Type de service couture')}</Form.Label>
        <Form.Select
          name="typeServiceCouture"
          value={postData.typeServiceCouture || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_sewing_service', 'Sélectionnez')}</option>
          <option value="confection">{t('making', 'Confection')}</option>
          <option value="retouches">{t('alterations', 'Retouches')}</option>
          <option value="sur_mesure">{t('custom', 'Sur mesure')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="broderie">{t('embroidery', 'Broderie')}</option>
          <option value="uniforme">{t('uniform', 'Uniforme')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'specialiteCouture': (
      <Form.Group>
        <Form.Label>👗 {t('sewing_specialty', 'Spécialité')}</Form.Label>
        <Form.Control
          type="text"
          name="specialiteCouture"
          value={postData.specialiteCouture || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specialty', 'Ex: Vêtements femme, homme, enfants, mariage...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'realisationsCouture': (
      <Form.Group>
        <Form.Label>📸 {t('sewing_portfolio', 'Réalisations')}</Form.Label>
        <Form.Control
          as="textarea"
          name="realisationsCouture"
          value={postData.realisationsCouture || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_portfolio', 'Photos des créations, références...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiCouture': (
      <Form.Group>
        <Form.Label>⏱️ {t('sewing_delivery_time', 'Délai de confection')}</Form.Label>
        <Form.Control
          type="text"
          name="delaiCouture"
          value={postData.delaiCouture || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_delivery_time', 'Ex: 1-2 semaines, urgent possible...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Maintenance Informatique
    'typeServiceMaintenance': (
      <Form.Group>
        <Form.Label>🖥️ {t('it_maintenance_type', 'Type de service maintenance')}</Form.Label>
        <Form.Select
          name="typeServiceMaintenance"
          value={postData.typeServiceMaintenance || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_it_maintenance', 'Sélectionnez')}</option>
          <option value="preventive">{t('preventive', 'Maintenance préventive')}</option>
          <option value="curative">{t('corrective', 'Maintenance curative')}</option>
          <option value="depannage">{t('troubleshooting', 'Dépannage')}</option>
          <option value="reseau">{t('network', 'Réseau')}</option>
          <option value="serveurs">{t('servers', 'Serveurs')}</option>
          <option value="securite_informatique">{t('it_security', 'Sécurité informatique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marquesMaintenance': (
      <Form.Group>
        <Form.Label>💻 {t('it_brands', 'Marques prises en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="marquesMaintenance"
          value={postData.marquesMaintenance || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brands', 'Ex: Dell, HP, Lenovo, Cisco, Microsoft...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'diagnosticMaintenance': (
      <Form.Group>
        <Form.Label>🔍 {t('it_diagnostic', 'Diagnostic gratuit')}</Form.Label>
        <Form.Check
          type="switch"
          name="diagnosticMaintenance"
          checked={postData.diagnosticMaintenance || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'diagnosticMaintenance',
              value: e.target.checked
            }
          })}
          label={postData.diagnosticMaintenance ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'urgenceMaintenance': (
      <Form.Group>
        <Form.Label>🚨 {t('it_emergency', 'Intervention d\'urgence')}</Form.Label>
        <Form.Check
          type="switch"
          name="urgenceMaintenance"
          checked={postData.urgenceMaintenance || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'urgenceMaintenance',
              value: e.target.checked
            }
          })}
          label={postData.urgenceMaintenance ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Répare Électroménager
    'typeServiceElectromenager': (
      <Form.Group>
        <Form.Label>🔌 {t('appliance_service_type', 'Type de service électroménager')}</Form.Label>
        <Form.Select
          name="typeServiceElectromenager"
          value={postData.typeServiceElectromenager || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_appliance_service', 'Sélectionnez')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="depannage">{t('troubleshooting', 'Dépannage')}</option>
          <option value="entretien">{t('maintenance', 'Entretien')}</option>
          <option value="installation">{t('installation', 'Installation')}</option>
          <option value="nettoyage">{t('cleaning', 'Nettoyage')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marquesElectromenager': (
      <Form.Group>
        <Form.Label>🏷️ {t('appliance_brands', 'Marques prises en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="marquesElectromenager"
          value={postData.marquesElectromenager || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brands', 'Ex: Samsung, LG, Whirlpool, Bosch...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'garantieElectromenager': (
      <Form.Group>
        <Form.Label>🛡️ {t('appliance_warranty', 'Garantie sur les réparations')}</Form.Label>
        <Form.Control
          type="text"
          name="garantieElectromenager"
          value={postData.garantieElectromenager || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, pièces et main d\'œuvre...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'depannageElectromenager': (
      <Form.Group>
        <Form.Label>🚨 {t('appliance_emergency', 'Dépannage 24h/24')}</Form.Label>
        <Form.Check
          type="switch"
          name="depannageElectromenager"
          checked={postData.depannageElectromenager || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'depannageElectromenager',
              value: e.target.checked
            }
          })}
          label={postData.depannageElectromenager ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Événements & Divertissement
    'typeServiceEvenement': (
      <Form.Group>
        <Form.Label>🎪 {t('event_service_type', 'Type de service événementiel')}</Form.Label>
        <Form.Select
          name="typeServiceEvenement"
          value={postData.typeServiceEvenement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_event_service', 'Sélectionnez')}</option>
          <option value="organisation">{t('organization', 'Organisation')}</option>
          <option value="animation">{t('animation', 'Animation')}</option>
          <option value="decoration">{t('decoration', 'Décoration')}</option>
          <option value="sonorisation">{t('sound', 'Sonorisation')}</option>
          <option value="traiteur">{t('catering', 'Traiteur')}</option>
          <option value="logistique">{t('logistics', 'Logistique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEvenement': (
      <Form.Group>
        <Form.Label>🎉 {t('event_type', 'Type d\'événement')}</Form.Label>
        <Form.Control
          type="text"
          name="typeEvenement"
          value={postData.typeEvenement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_event_type', 'Ex: Mariage, anniversaire, séminaire...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'equipementsEvenement': (
      <Form.Group>
        <Form.Label>🎤 {t('event_equipment', 'Équipements événementiels')}</Form.Label>
        <Form.Control
          type="text"
          name="equipementsEvenement"
          value={postData.equipementsEvenement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Ex: Sono, éclairage, tentes, mobilier...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'animationEvenement': (
      <Form.Group>
        <Form.Label>🎭 {t('event_animation', 'Animation proposée')}</Form.Label>
        <Form.Control
          type="text"
          name="animationEvenement"
          value={postData.animationEvenement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_animation', 'Ex: DJ, magicien, photobooth, jeux...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Paraboles & Démodulateurs
    'typeServiceParabole': (
      <Form.Group>
        <Form.Label>🛰️ {t('satellite_service_type', 'Type de service parabole')}</Form.Label>
        <Form.Select
          name="typeServiceParabole"
          value={postData.typeServiceParabole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_satellite_service', 'Sélectionnez')}</option>
          <option value="installation">{t('installation', 'Installation')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="parametrage">{t('setup', 'Paramétrage')}</option>
          <option value="maintenance">{t('maintenance', 'Maintenance')}</option>
          <option value="depannage">{t('troubleshooting', 'Dépannage')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'systemesParabole': (
      <Form.Group>
        <Form.Label>📡 {t('satellite_systems', 'Systèmes pris en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="systemesParabole"
          value={postData.systemesParabole || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_systems', 'Ex: Astra, Hotbird, Nilesat, démodulateurs...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'installationParabole': (
      <Form.Group>
        <Form.Label>🔧 {t('satellite_installation', 'Installation à domicile')}</Form.Label>
        <Form.Check
          type="switch"
          name="installationParabole"
          checked={postData.installationParabole || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'installationParabole',
              value: e.target.checked
            }
          })}
          label={postData.installationParabole ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'maintenanceParabole': (
      <Form.Group>
        <Form.Label>🛠️ {t('satellite_maintenance', 'Contrat de maintenance')}</Form.Label>
        <Form.Check
          type="switch"
          name="maintenanceParabole"
          checked={postData.maintenanceParabole || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'maintenanceParabole',
              value: e.target.checked
            }
          })}
          label={postData.maintenanceParabole ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Répare Électronique
    'typeServiceElectronique': (
      <Form.Group>
        <Form.Label>🔌 {t('electronics_service_type', 'Type de service électronique')}</Form.Label>
        <Form.Select
          name="typeServiceElectronique"
          value={postData.typeServiceElectronique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_electronics_service', 'Sélectionnez')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="depannage">{t('troubleshooting', 'Dépannage')}</option>
          <option value="diagnostic">{t('diagnostic', 'Diagnostic')}</option>
          <option value="maintenance">{t('maintenance', 'Maintenance')}</option>
          <option value="retrofit">{t('retrofit', 'Rénovation')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'appareilsElectronique': (
      <Form.Group>
        <Form.Label>📺 {t('electronics_devices', 'Appareils électroniques')}</Form.Label>
        <Form.Control
          type="text"
          name="appareilsElectronique"
          value={postData.appareilsElectronique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_devices', 'Ex: TV, audio, ordinateurs, consoles...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'garantieElectronique': (
      <Form.Group>
        <Form.Label>🛡️ {t('electronics_warranty', 'Garantie sur les réparations')}</Form.Label>
        <Form.Control
          type="text"
          name="garantieElectronique"
          value={postData.garantieElectronique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, pièces et main d\'œuvre...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'diagnosticElectronique': (
      <Form.Group>
        <Form.Label>🔍 {t('electronics_diagnostic', 'Diagnostic gratuit')}</Form.Label>
        <Form.Check
          type="switch"
          name="diagnosticElectronique"
          checked={postData.diagnosticElectronique || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'diagnosticElectronique',
              value: e.target.checked
            }
          })}
          label={postData.diagnosticElectronique ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    // Services à l'Étranger
    'typeServiceEtranger': (
      <Form.Group>
        <Form.Label>🌍 {t('foreign_service_type', 'Type de service à l\'étranger')}</Form.Label>
        <Form.Select
          name="typeServiceEtranger"
          value={postData.typeServiceEtranger || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_foreign_service', 'Sélectionnez')}</option>
          <option value="traduction">{t('translation', 'Traduction')}</option>
          <option value="interpretariat">{t('interpretation', 'Interprétariat')}</option>
          <option value="conseil_international">{t('international_advice', 'Conseil international')}</option>
          <option value="logistique_internationale">{t('international_logistics', 'Logistique internationale')}</option>
          <option value="commerce_international">{t('international_trade', 'Commerce international')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'paysService': (
      <Form.Group>
        <Form.Label>🗺️ {t('service_countries', 'Pays couverts')}</Form.Label>
        <Form.Control
          type="text"
          name="paysService"
          value={postData.paysService || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_countries', 'Ex: France, Canada, Émirats, Chine...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'languesService': (
      <Form.Group>
        <Form.Label>🗣️ {t('service_languages', 'Langues parlées')}</Form.Label>
        <Form.Control
          type="text"
          name="languesService"
          value={postData.languesService || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_languages', 'Ex: Arabe, Français, Anglais, Espagnol...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiService': (
      <Form.Group>
        <Form.Label>⏱️ {t('service_delivery_time', 'Délai de service')}</Form.Label>
        <Form.Control
          type="text"
          name="delaiService"
          value={postData.delaiService || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_delivery_time', 'Ex: 24h, 48h, selon destination...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Flashage & Répare Téléphones
    'typeServiceFlashage': (
      <Form.Group>
        <Form.Label>📱 {t('flashing_service_type', 'Type de service flashage')}</Form.Label>
        <Form.Select
          name="typeServiceFlashage"
          value={postData.typeServiceFlashage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_flashing_service', 'Sélectionnez')}</option>
          <option value="flashage">{t('flashing', 'Flashage')}</option>
          <option value="reparation">{t('repair', 'Réparation')}</option>
          <option value="deblocage">{t('unlocking', 'Déblocage')}</option>
          <option value="changement_ecran">{t('screen_replacement', 'Changement écran')}</option>
          <option value="changement_batterie">{t('battery_replacement', 'Changement batterie')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marquesFlashage': (
      <Form.Group>
        <Form.Label>📱 {t('flashing_brands', 'Marques prises en charge')}</Form.Label>
        <Form.Control
          type="text"
          name="marquesFlashage"
          value={postData.marquesFlashage || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brands', 'Ex: Apple, Samsung, Huawei, Xiaomi...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'garantieFlashage': (
      <Form.Group>
        <Form.Label>🛡️ {t('flashing_warranty', 'Garantie sur le service')}</Form.Label>
        <Form.Control
          type="text"
          name="garantieFlashage"
          value={postData.garantieFlashage || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 1 mois, 3 mois, sur pièces...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'delaiFlashage': (
      <Form.Group>
        <Form.Label>⏱️ {t('flashing_delivery_time', 'Délai d\'intervention')}</Form.Label>
        <Form.Control
          type="text"
          name="delaiFlashage"
          value={postData.delaiFlashage || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_delivery_time', 'Ex: 1 heure, 24h, selon problème...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Juridique
    'typeServiceJuridique': (
      <Form.Group>
        <Form.Label>⚖️ {t('legal_service_type', 'Type de service juridique')}</Form.Label>
        <Form.Select
          name="typeServiceJuridique"
          value={postData.typeServiceJuridique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_legal_service', 'Sélectionnez')}</option>
          <option value="conseil">{t('advice', 'Conseil')}</option>
          <option value="redaction">{t('drafting', 'Rédaction')}</option>
          <option value="representation">{t('representation', 'Représentation')}</option>
          <option value="mediation">{t('mediation', 'Médiation')}</option>
          <option value="litige">{t('dispute', 'Litige')}</option>
          <option value="contrats">{t('contracts', 'Contrats')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'domaineJuridique': (
      <Form.Group>
        <Form.Label>🎯 {t('legal_domain', 'Domaine juridique')}</Form.Label>
        <Form.Control
          type="text"
          name="domaineJuridique"
          value={postData.domaineJuridique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_domain', 'Ex: Droit des affaires, familial, immobilier...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'languesJuridique': (
      <Form.Group>
        <Form.Label>🗣️ {t('legal_languages', 'Langues de travail')}</Form.Label>
        <Form.Control
          type="text"
          name="languesJuridique"
          value={postData.languesJuridique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_languages', 'Ex: Arabe, Français, Anglais...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'honorairesJuridique': (
      <Form.Group>
        <Form.Label>💰 {t('legal_fees', 'Honoraires')}</Form.Label>
        <Form.Control
          type="text"
          name="honorairesJuridique"
          value={postData.honorairesJuridique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_fees', 'Ex: Forfait, horaire, selon dossier...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'prix': (
      <Form.Group>
        <Form.Label>💰 {t('price', 'Prix du service')}</Form.Label>
        <Form.Control
          type="text"
          name="prix"
          value={postData.prix || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_price', 'Ex: 5000 DA, sur devis, forfait...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  };
  
  // Obtener campos específicos para la subcategoría actual
  const subCategoryFields = getSubCategorySpecificFields();
  
  // Si fieldName está especificado, devolver ese campo
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en ServicesFields para "${subCategory}"`);
      return (
        <Form.Group>
          <Form.Text className="text-danger">
            ⚠️ {t('field_not_implemented', 'Champ non implémenté')}: {fieldName}
          </Form.Text>
        </Form.Group>
      );
    }
    return fieldComponent;
  }
  
  // Si no hay fieldName específico, devolver todos los campos de la subcategoría
  if (subCategory && subCategoryFields) {
    return (
      <>
        {Object.keys(subCategoryFields).map(key => (
          <div key={key} className="mb-3">
            {fields[subCategoryFields[key]] || (
              <div className="alert alert-warning">
                ⚠️ {t('component_missing', 'Composant manquant')}: {subCategoryFields[key]}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
  
  return null;
};

export default ServicesFields;