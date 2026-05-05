// 📂 components/CATEGORIES/specificFields/SportFields.js
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
        placeholder="Décrivez votre produit sportif en détail..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">Décrivez l'état, la taille, les caractéristiques, etc.</small>
    </div>
  );
};

// ============================================
// CAMPOS ESPECÍFICOS PARA SPORT
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Nike', label: '👟 Nike' },
    { value: 'Adidas', label: '👟 Adidas' },
    { value: 'Puma', label: '👟 Puma' },
    { value: 'Under Armour', label: '💪 Under Armour' },
    { value: 'Reebok', label: '👟 Reebok' },
    { value: 'Decathlon', label: '🏪 Decathlon' },
    { value: 'New Balance', label: '👟 New Balance' },
    { value: 'Asics', label: '👟 Asics' },
    { value: 'Mizuno', label: '👟 Mizuno' },
    { value: 'Kipsta', label: '⚽ Kipsta' },
    { value: 'Uhlsport', label: '⚽ Uhlsport' },
    { value: 'Wilson', label: '🎾 Wilson' },
    { value: 'Babolat', label: '🎾 Babolat' },
    { value: 'Head', label: '🎾 Head' },
    { value: 'Tunturi', label: '🏋️ Tunturi' },
    { value: 'Autre', label: '🏷️ Autre' }
  ];
  
  const selectedOption = marques.find(opt => opt.value === postData?.marque) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'marque', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <Select
        name="marque"
        options={marques}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la marque..."
        isClearable
      />
    </div>
  );
};

// Modèle
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: Mercurial, Predator, Ultraboost..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// État
const EtatField = ({ postData, handleChangeInput }) => {
  const etatOptions = [
    { value: 'Neuf avec étiquette', label: '🆕 Neuf avec étiquette' },
    { value: 'Neuf sans étiquette', label: '📦 Neuf sans étiquette' },
    { value: 'Comme neuf', label: '✨ Comme neuf' },
    { value: 'Très bon état', label: '💪 Très bon état' },
    { value: 'Bon état', label: '✅ Bon état' },
    { value: 'État moyen', label: '⚠️ État moyen' },
    { value: 'Usé', label: '🔧 Usé' }
  ];
  
  const selectedOption = etatOptions.find(opt => opt.value === postData?.etat) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'etat', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État</label>
      <Select
        name="etat"
        options={etatOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'état..."
        required
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA FOOTBALL
// ============================================

// Type de produit football
const TypeProduitFootballField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Ballon', label: '⚽ Ballon' },
    { value: 'But', label: '🥅 But' },
    { value: 'Chaussures', label: '👟 Chaussures' },
    { value: 'Maillot', label: '👕 Maillot' },
    { value: 'Short', label: '🩳 Short' },
    { value: 'Chaussettes', label: '🧦 Chaussettes' },
    { value: 'Protège-tibias', label: '🛡️ Protège-tibias' },
    { value: 'Gants de gardien', label: '🧤 Gants de gardien' },
    { value: 'Sac de sport', label: '🎒 Sac de sport' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeProduitFootball) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeProduitFootball', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <Select
        name="typeProduitFootball"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Taille chaussures
const TailleChaussureField = ({ postData, handleChangeInput }) => {
  const tailles = [
    { value: '36', label: '36' },
    { value: '37', label: '37' },
    { value: '38', label: '38' },
    { value: '39', label: '39' },
    { value: '40', label: '40' },
    { value: '41', label: '41' },
    { value: '42', label: '42' },
    { value: '43', label: '43' },
    { value: '44', label: '44' },
    { value: '45', label: '45' },
    { value: '46', label: '46' }
  ];
  
  const selectedOption = tailles.find(opt => opt.value === postData?.tailleChaussure) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tailleChaussure', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille chaussure</label>
      <Select
        name="tailleChaussure"
        options={tailles}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la taille..."
        isClearable
      />
    </div>
  );
};

// Taille vêtement
const TailleVetementSportField = ({ postData, handleChangeInput }) => {
  const tailles = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: '3XL', label: '3XL' },
    { value: 'Enfant', label: 'Enfant' }
  ];
  
  const selectedOption = tailles.find(opt => opt.value === postData?.tailleVetementSport) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tailleVetementSport', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille vêtement</label>
      <Select
        name="tailleVetementSport"
        options={tailles}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la taille..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA FITNESS - MUSCULATION
// ============================================

// Type d'équipement fitness
const TypeEquipementFitnessField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Tapis roulant', label: '🏃 Tapis roulant' },
    { value: 'Vélo elliptique', label: '🚴 Vélo elliptique' },
    { value: 'Vélo d\'appartement', label: '🚴 Vélo d\'appartement' },
    { value: 'Rameur', label: '🚣 Rameur' },
    { value: 'Banc de musculation', label: '🏋️ Banc de musculation' },
    { value: 'Haltères', label: '🏋️ Haltères' },
    { value: 'Barre de traction', label: '💪 Barre de traction' },
    { value: 'Tapis de sol', label: '🧘 Tapis de sol' },
    { value: 'Ballon de fitness', label: '⚽ Ballon de fitness' },
    { value: 'Élastique', label: '💪 Élastique' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeEquipementFitness) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeEquipementFitness', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'équipement</label>
      <Select
        name="typeEquipementFitness"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Poids (kg)
const PoidsField = ({ postData, handleChangeInput }) => {
  const poids = [
    { value: '1', label: '1 kg' },
    { value: '2', label: '2 kg' },
    { value: '3', label: '3 kg' },
    { value: '4', label: '4 kg' },
    { value: '5', label: '5 kg' },
    { value: '6', label: '6 kg' },
    { value: '7', label: '7 kg' },
    { value: '8', label: '8 kg' },
    { value: '9', label: '9 kg' },
    { value: '10', label: '10 kg' },
    { value: '12', label: '12 kg' },
    { value: '15', label: '15 kg' },
    { value: '20', label: '20 kg' },
    { value: '25', label: '25 kg' },
    { value: '30', label: '30 kg' }
  ];
  
  const selectedOption = poids.find(opt => opt.value === postData?.poids) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'poids', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Poids</label>
      <Select
        name="poids"
        options={poids}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le poids..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA SPORT DE COMBAT
// ============================================

// Type d'équipement combat
const TypeEquipementCombatField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Gants de boxe', label: '🥊 Gants de boxe' },
    { value: 'Casque', label: '⛑️ Casque' },
    { value: 'Protège-dents', label: '🦷 Protège-dents' },
    { value: 'Kimono', label: '🥋 Kimono' },
    { value: 'Pantalon', label: '👖 Pantalon' },
    { value: 'Protège-tibias', label: '🛡️ Protège-tibias' },
    { value: 'Sac de frappe', label: '🥊 Sac de frappe' },
    { value: 'Bandages', label: '🩹 Bandages' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeEquipementCombat) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeEquipementCombat', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'équipement</label>
      <Select
        name="typeEquipementCombat"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA SPORT DE RAQUETTE
// ============================================

// Type de sport raquette
const TypeSportRaquetteField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Tennis', label: '🎾 Tennis' },
    { value: 'Tennis de table', label: '🏓 Tennis de table' },
    { value: 'Badminton', label: '🏸 Badminton' },
    { value: 'Squash', label: '🎾 Squash' },
    { value: 'Padel', label: '🎾 Padel' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeSportRaquette) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeSportRaquette', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de sport</label>
      <Select
        name="typeSportRaquette"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le sport..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA VÉLOS & TROTINETTES
// ============================================

// Type de vélo
const TypeVeloField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Vélo de route', label: '🚲 Vélo de route' },
    { value: 'VTT', label: '🚵 VTT' },
    { value: 'Vélo de ville', label: '🚲 Vélo de ville' },
    { value: 'Vélo électrique', label: '⚡ Vélo électrique' },
    { value: 'Vélo enfant', label: '👶 Vélo enfant' },
    { value: 'Trotinette électrique', label: '🛴 Trotinette électrique' },
    { value: 'Trotinette classique', label: '🛴 Trotinette classique' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeVelo) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeVelo', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de vélo/trotinette</label>
      <Select
        name="typeVelo"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Taille de vélo (cadre)
const TailleVeloField = ({ postData, handleChangeInput }) => {
  const tailles = [
    { value: 'XS (14-16")', label: 'XS (14-16")' },
    { value: 'S (16-18")', label: 'S (16-18")' },
    { value: 'M (18-20")', label: 'M (18-20")' },
    { value: 'L (20-22")', label: 'L (20-22")' },
    { value: 'XL (22-24")', label: 'XL (22-24")' }
  ];
  
  const selectedOption = tailles.find(opt => opt.value === postData?.tailleVelo) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tailleVelo', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille du cadre</label>
      <Select
        name="tailleVelo"
        options={tailles}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la taille..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA NATATION
// ============================================

// Type d'équipement natation
const TypeEquipementNatationField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Maillot de bain', label: '🩲 Maillot de bain' },
    { value: 'Lunettes', label: '🥽 Lunettes' },
    { value: 'Bonnet', label: '🧢 Bonnet' },
    { value: 'Palmes', label: '🏊 Palmes' },
    { value: 'Planche', label: '🏄 Planche' },
    { value: 'Pull-buoy', label: '🏊 Pull-buoy' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeEquipementNatation) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeEquipementNatation', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'équipement</label>
      <Select
        name="typeEquipementNatation"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const SportFields = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos básicos
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'etat': <EtatField {...props} />,
    
    // Football
    'typeProduitFootball': <TypeProduitFootballField {...props} />,
    'tailleChaussure': <TailleChaussureField {...props} />,
    'tailleVetementSport': <TailleVetementSportField {...props} />,
    
    // Fitness - Musculation
    'typeEquipementFitness': <TypeEquipementFitnessField {...props} />,
    'poids': <PoidsField {...props} />,
    
    // Sport de combat
    'typeEquipementCombat': <TypeEquipementCombatField {...props} />,
    
    // Sport de raquette
    'typeSportRaquette': <TypeSportRaquetteField {...props} />,
    
    // Vélos & trotinettes
    'typeVelo': <TypeVeloField {...props} />,
    'tailleVelo': <TailleVeloField {...props} />,
    
    // Natation
    'typeEquipementNatation': <TypeEquipementNatationField {...props} />
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

export default SportFields;