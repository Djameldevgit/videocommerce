// 📂 components/CATEGORIES/specificFields/EmploiFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS COMUNES PARA TODAS LAS CATEGORÍAS
// ============================================

// Titre
const TitleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Titre</label>
      <input
        type="text"
        name="title"
        className="form-control"
        placeholder="Titre de l'annonce"
        value={postData?.title || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Description
const DescriptionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Description <span className="text-danger">*</span>
      </label>
      <textarea
        name="description"
        className="form-control"
        rows="4"
        placeholder="Décrivez l'offre ou la demande d'emploi en détail..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA OFFRES D'EMPLOI
// ============================================

// Poste proposé
const PosteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Poste proposé <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="poste"
        className="form-control"
        placeholder="Ex: Développeur web, Commercial, Comptable..."
        value={postData?.poste || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Type de contrat
const TypeContratField = ({ postData, handleChangeInput }) => {
  const contratOptions = [
    { value: 'CDI', label: 'CDI' },
    { value: 'CDD', label: 'CDD' },
    { value: 'Intérim', label: 'Intérim' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Freelance', label: 'Freelance/Indépendant' },
    { value: 'Temps partiel', label: 'Temps partiel' }
  ];
  
  const selectedOption = contratOptions.find(opt => opt.value === postData?.typeContrat) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeContrat', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de contrat</label>
      <Select
        name="typeContrat"
        options={contratOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Secteur d'activité
const SecteurActiviteField = ({ postData, handleChangeInput }) => {
  const secteurOptions = [
    { value: 'Informatique / IT', label: '💻 Informatique / IT' },
    { value: 'Commerce / Vente', label: '🛍️ Commerce / Vente' },
    { value: 'Industrie', label: '🏭 Industrie' },
    { value: 'Bâtiment / Construction', label: '🏗️ Bâtiment / Construction' },
    { value: 'Santé / Social', label: '🏥 Santé / Social' },
    { value: 'Éducation / Formation', label: '📚 Éducation / Formation' },
    { value: 'Tourisme / Hôtellerie', label: '✈️ Tourisme / Hôtellerie' },
    { value: 'Finance / Comptabilité', label: '💰 Finance / Comptabilité' },
    { value: 'Marketing / Communication', label: '📢 Marketing / Communication' },
    { value: 'Logistique / Transport', label: '🚚 Logistique / Transport' },
    { value: 'Administration', label: '📋 Administration' },
    { value: 'Droit / Juridique', label: '⚖️ Droit / Juridique' },
    { value: 'Art / Culture', label: '🎨 Art / Culture' }
  ];
  
  const selectedOption = secteurOptions.find(opt => opt.value === postData?.secteurActivite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'secteurActivite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Secteur d'activité</label>
      <Select
        name="secteurActivite"
        options={secteurOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Expérience requise
const ExperienceRequiseField = ({ postData, handleChangeInput }) => {
  const experienceOptions = [
    { value: 'Débutant accepté', label: '🎓 Débutant accepté' },
    { value: 'Moins de 1 an', label: '📅 Moins de 1 an' },
    { value: '1-2 ans', label: '📅 1-2 ans' },
    { value: '2-5 ans', label: '📅 2-5 ans' },
    { value: '5-10 ans', label: '📅 5-10 ans' },
    { value: 'Plus de 10 ans', label: '📅 Plus de 10 ans' }
  ];
  
  const selectedOption = experienceOptions.find(opt => opt.value === postData?.experienceRequise) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'experienceRequise', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Expérience requise</label>
      <Select
        name="experienceRequise"
        options={experienceOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Niveau d'études
const NiveauEtudesField = ({ postData, handleChangeInput }) => {
  const etudesOptions = [
    { value: 'Aucun diplôme requis', label: '📜 Aucun diplôme requis' },
    { value: 'Bac', label: '🎓 Bac' },
    { value: 'Bac+2 (BTS, DUT)', label: '🎓 Bac+2 (BTS, DUT)' },
    { value: 'Bac+3 (Licence)', label: '🎓 Bac+3 (Licence)' },
    { value: 'Bac+5 (Master, Ingénieur)', label: '🎓 Bac+5 (Master, Ingénieur)' },
    { value: 'Doctorat', label: '🎓 Doctorat' }
  ];
  
  const selectedOption = etudesOptions.find(opt => opt.value === postData?.niveauEtudes) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'niveauEtudes', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Niveau d'études</label>
      <Select
        name="niveauEtudes"
        options={etudesOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Compétences
const CompetencesField = ({ postData, handleChangeInput }) => {
  const competencesOptions = [
    { value: 'Marketing digital', label: 'Marketing digital' },
    { value: 'Comptabilité', label: 'Comptabilité' },
    { value: 'Gestion de projet', label: 'Gestion de projet' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Vente', label: 'Vente' },
    { value: 'Négociation', label: 'Négociation' },
    { value: 'Service client', label: 'Service client' },
    { value: 'Leadership', label: 'Leadership' },
    { value: 'Travail en équipe', label: 'Travail en équipe' },
    { value: 'PHP', label: 'PHP' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'React', label: 'React' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'C++', label: 'C++' },
    { value: 'SQL', label: 'SQL' },
    { value: 'WordPress', label: 'WordPress' },
    { value: 'SEO', label: 'SEO' }
    
  ];
  
  const selectedValues = postData?.competences || [];
  const selectedOptions = competencesOptions.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'competences', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compétences requises</label>
      <Select
        isMulti
        name="competences"
        options={competencesOptions}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les compétences..."
      />
      <small className="text-muted">Vous pouvez sélectionner plusieurs compétences</small>
    </div>
  );
};

// Salaire
const SalaireField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Salaire proposé</label>
      <div className="input-group">
        <input
          type="number"
          name="salaire"
          className="form-control"
          placeholder="Salaire"
          value={postData?.salaire || ''}
          onChange={handleChangeInput}
        />
        <select
          name="uniteSalaire"
          className="form-select"
          value={postData?.uniteSalaire || 'mois'}
          onChange={handleChangeInput}
          style={{ width: '120px' }}
        >
          <option value="mois">/ mois</option>
          <option value="heure">/ heure</option>
          <option value="jour">/ jour</option>
          <option value="mission">/ mission</option>
        </select>
      </div>
      <small className="text-muted">Laissez vide si négociable</small>
    </div>
  );
};

// Avantages
const AvantagesField = ({ postData, handleChangeInput }) => {
  const avantagesOptions = [
    { value: 'Mutuelle', label: '🏥 Mutuelle' },
    { value: 'Tickets resto', label: '🍽️ Tickets resto' },
    { value: 'Formation continue', label: '📚 Formation continue' },
    { value: 'Véhicule de fonction', label: '🚗 Véhicule de fonction' },
    { value: 'Télétravail', label: '🏠 Télétravail' },
    { value: 'Horaires flexibles', label: '⏰ Horaires flexibles' },
    { value: 'Primes', label: '💰 Primes' },
    { value: 'Participation transport', label: '🚌 Participation transport' }
  ];
  
  const selectedValues = postData?.avantages || [];
  const selectedOptions = avantagesOptions.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'avantages', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Avantages</label>
      <Select
        isMulti
        name="avantages"
        options={avantagesOptions}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les avantages..."
      />
    </div>
  );
};

// Lieu de travail
const LieuTravailField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Lieu de travail</label>
      <input
        type="text"
        name="lieuTravail"
        className="form-control"
        placeholder="Ex: Alger centre, Télétravail..."
        value={postData?.lieuTravail || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Horaires
const HorairesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Horaires</label>
      <input
        type="text"
        name="horaires"
        className="form-control"
        placeholder="Ex: 8h-17h, Flexible..."
        value={postData?.horaires || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR DEMANDES D'EMPLOI
// ============================================

// Nom du candidat
const NomCandidatField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nom du candidat</label>
      <input
        type="text"
        name="nomCandidat"
        className="form-control"
        placeholder="Nom et prénom"
        value={postData?.nomCandidat || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Disponibilité
const DisponibiliteField = ({ postData, handleChangeInput }) => {
  const disponibiliteOptions = [
    { value: 'Immédiate', label: 'Immédiate' },
    { value: '15 jours', label: '15 jours' },
    { value: '1 mois', label: '1 mois' },
    { value: '3 mois', label: '3 mois' },
    { value: 'À discuter', label: 'À discuter' }
  ];
  
  const selectedOption = disponibiliteOptions.find(opt => opt.value === postData?.disponibilite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'disponibilite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Disponibilité</label>
      <Select
        name="disponibilite"
        options={disponibiliteOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Mobilité géographique
const MobiliteField = ({ postData, handleChangeInput }) => {
  const mobiliteOptions = [
    { value: 'Local uniquement', label: '🏠 Local uniquement' },
    { value: 'Régional', label: '📍 Régional' },
    { value: 'National', label: '🇩🇿 National' },
    { value: 'International', label: '🌍 International' }
  ];
  
  const selectedOption = mobiliteOptions.find(opt => opt.value === postData?.mobilite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'mobilite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Mobilité géographique</label>
      <Select
        name="mobilite"
        options={mobiliteOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// Prétentions salariales
const PretentionsSalarialesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Prétentions salariales</label>
      <input
        type="text"
        name="pretentionsSalariales"
        className="form-control"
        placeholder="Ex: 60.000 DA/mois, Négociable..."
        value={postData?.pretentionsSalariales || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const EmploiFields = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos para ofertas y demandas
    'poste': <PosteField {...props} />,
    'typeContrat': <TypeContratField {...props} />,
    'secteurActivite': <SecteurActiviteField {...props} />,
    'experienceRequise': <ExperienceRequiseField {...props} />,
    'niveauEtudes': <NiveauEtudesField {...props} />,
    'competences': <CompetencesField {...props} />,
    
    // Campos para ofertas (adicionales)
    'salaire': <SalaireField {...props} />,
    'uniteSalaire': ({ postData, handleChangeInput }) => null, // Campo interno del salario
    'avantages': <AvantagesField {...props} />,
    'lieuTravail': <LieuTravailField {...props} />,
    'horaires': <HorairesField {...props} />,
    
    // Campos para demandas
    'nomCandidat': <NomCandidatField {...props} />,
    'disponibilite': <DisponibiliteField {...props} />,
    'mobilite': <MobiliteField {...props} />,
    'pretentionsSalariales': <PretentionsSalarialesField {...props} />
  };
  
  const additionalFields = {
    components: customComponents,
  };
  
  if (step) {
    return (
      <BaseCategoryField
        {...props}
        step={step}
        additionalFields={additionalFields}
      />
    );
  }
  
  return null;
};

export default EmploiFields;