// 📂 components/CATEGORIES/specificFields/MeublesFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA MEUBLES & MAISON
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'IKEA', label: 'IKEA' },
    { value: 'But', label: 'But' },
    { value: 'Conforama', label: 'Conforama' },
    { value: 'Roche Bobois', label: 'Roche Bobois' },
    { value: 'Maisons du Monde', label: 'Maisons du Monde' },
    { value: 'Alinéa', label: 'Alinéa' },
    { value: 'Habitat', label: 'Habitat' },
    { value: 'Ligne Roset', label: 'Ligne Roset' },
    { value: 'Leroy Merlin', label: 'Leroy Merlin' },
    { value: 'Castorama', label: 'Castorama' },
    { value: 'Villeroy & Boch', label: 'Villeroy & Boch' },
    { value: 'Autre', label: 'Autre' }
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

// Modèle / Nom du produit
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle / Nom</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: Table MALM, Canapé MANSTAD..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Matière / Matériau
const MatiereField = ({ postData, handleChangeInput }) => {
  const matieres = [
    { value: 'Bois massif', label: '🪵 Bois massif' },
    { value: 'Bois aggloméré', label: '🪵 Bois aggloméré' },
    { value: 'MDF', label: '📋 MDF' },
    { value: 'Contreplaqué', label: '📋 Contreplaqué' },
    { value: 'Métal', label: '⚙️ Métal' },
    { value: 'Verre', label: '🥛 Verre' },
    { value: 'Plastique', label: '🧴 Plastique' },
    { value: 'Résine', label: '💎 Résine' },
    { value: 'Céramique', label: '🏺 Céramique' },
    { value: 'Tissu', label: '🧵 Tissu' },
    { value: 'Cuir', label: '👞 Cuir' },
    { value: 'Velours', label: '🟣 Velours' },
    { value: 'Lin', label: '🌾 Lin' },
    { value: 'Coton', label: '🌿 Coton' },
    { value: 'Polyester', label: '🧵 Polyester' },
    { value: 'Laine', label: '🐑 Laine' },
    { value: 'Rotin', label: '🪴 Rotin' },
    { value: 'Osier', label: '🌿 Osier' }
  ];
  
  const selectedOption = matieres.find(opt => opt.value === postData?.matiere) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'matiere', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matière / Matériau</label>
      <Select
        name="matiere"
        options={matieres}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la matière..."
        isClearable
      />
    </div>
  );
};

// Couleur
const CouleurField = ({ postData, handleChangeInput }) => {
  const couleurs = [
    { value: 'Blanc', label: '⚪ Blanc' },
    { value: 'Noir', label: '⚫ Noir' },
    { value: 'Gris', label: '⬜ Gris' },
    { value: 'Beige', label: '🟫 Beige' },
    { value: 'Marron', label: '🟤 Marron' },
    { value: 'Chêne', label: '🪵 Chêne' },
    { value: 'Noyer', label: '🪵 Noyer' },
    { value: 'Bleu', label: '🔵 Bleu' },
    { value: 'Rouge', label: '🔴 Rouge' },
    { value: 'Vert', label: '🟢 Vert' },
    { value: 'Jaune', label: '🟡 Jaune' },
    { value: 'Rose', label: '🩷 Rose' },
    { value: 'Violet', label: '🟣 Violet' },
    { value: 'Multicolore', label: '🌈 Multicolore' }
  ];
  
  const selectedOption = couleurs.find(opt => opt.value === postData?.couleur) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'couleur', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Couleur</label>
      <Select
        name="couleur"
        options={couleurs}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la couleur..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA MEUBLES
// ============================================

// Dimensions
const DimensionsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Dimensions</label>
      <div className="row g-2">
        <div className="col-4">
          <input
            type="number"
            name="longueur"
            className="form-control"
            placeholder="L (cm)"
            value={postData?.longueur || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-4">
          <input
            type="number"
            name="largeur"
            className="form-control"
            placeholder="l (cm)"
            value={postData?.largeur || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-4">
          <input
            type="number"
            name="hauteur"
            className="form-control"
            placeholder="H (cm)"
            value={postData?.hauteur || ''}
            onChange={handleChangeInput}
          />
        </div>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS PARA VAISSELLE
// ============================================

// Matière vaisselle
const MatiereVaisselleField = ({ postData, handleChangeInput }) => {
  const matieres = [
    { value: 'Céramique', label: '🏺 Céramique' },
    { value: 'Porcelaine', label: '🏺 Porcelaine' },
    { value: 'Faïence', label: '🏺 Faïence' },
    { value: 'Verre', label: '🥛 Verre' },
    { value: 'Cristal', label: '💎 Cristal' },
    { value: 'Acier inoxydable', label: '⚙️ Acier inoxydable' },
    { value: 'Fonte', label: '⚙️ Fonte' },
    { value: 'Bois', label: '🪵 Bois' },
    { value: 'Plastique', label: '🧴 Plastique' }
  ];
  
  const selectedOption = matieres.find(opt => opt.value === postData?.matiereVaisselle) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'matiereVaisselle', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matière</label>
      <Select
        name="matiereVaisselle"
        options={matieres}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la matière..."
        isClearable
      />
    </div>
  );
};

// Nombre de pièces
const NbPiecesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de pièces</label>
      <input
        type="number"
        name="nbPieces"
        className="form-control"
        placeholder="Ex: 12, 24, 36..."
        value={postData?.nbPieces || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA LITERIE & LINGE
// ============================================

// Taille literie
const TailleLiterieField = ({ postData, handleChangeInput }) => {
  const tailles = [
    { value: '90x190 cm (1 personne)', label: '90x190 cm (1 personne)' },
    { value: '140x190 cm (2 personnes)', label: '140x190 cm (2 personnes)' },
    { value: '160x200 cm (Queen)', label: '160x200 cm (Queen)' },
    { value: '180x200 cm (King)', label: '180x200 cm (King)' },
    { value: '200x200 cm (Super King)', label: '200x200 cm (Super King)' },
    { value: 'Bébé 60x120', label: '👶 Bébé 60x120' }
  ];
  
  const selectedOption = tailles.find(opt => opt.value === postData?.tailleLiterie) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tailleLiterie', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille</label>
      <Select
        name="tailleLiterie"
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
// CAMPOS PARA PUÉRICULTURE
// ============================================

// Âge bébé
const AgeBebeField = ({ postData, handleChangeInput }) => {
  const ages = [
    { value: '0-3 mois', label: '0-3 mois' },
    { value: '3-6 mois', label: '3-6 mois' },
    { value: '6-9 mois', label: '6-9 mois' },
    { value: '9-12 mois', label: '9-12 mois' },
    { value: '12-18 mois', label: '12-18 mois' },
    { value: '18-24 mois', label: '18-24 mois' },
    { value: '2-3 ans', label: '2-3 ans' },
    { value: '3-5 ans', label: '3-5 ans' }
  ];
  
  const selectedOption = ages.find(opt => opt.value === postData?.ageBebe) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'ageBebe', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Âge recommandé</label>
      <Select
        name="ageBebe"
        options={ages}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'âge..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA RIDEAUX & TAPIS
// ============================================

// Forme tapis
const FormeTapisField = ({ postData, handleChangeInput }) => {
  const formes = [
    { value: 'Rectangulaire', label: '📐 Rectangulaire' },
    { value: 'Carré', label: '⬛ Carré' },
    { value: 'Rond', label: '⚪ Rond' },
    { value: 'Ovale', label: '🥚 Ovale' },
    { value: 'Couloir', label: '🛣️ Couloir' }
  ];
  
  const selectedOption = formes.find(opt => opt.value === postData?.formeTapis) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'formeTapis', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Forme</label>
      <Select
        name="formeTapis"
        options={formes}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la forme..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const MeublesFields = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, description, etat, sin types d'article)
  const customComponents = {
    // Marque al principio
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'matiere': <MatiereField {...props} />,
    'couleur': <CouleurField {...props} />,
    
    // Meubles
    'dimensions': <DimensionsField {...props} />,
    
    // Vaisselle
    'matiereVaisselle': <MatiereVaisselleField {...props} />,
    'nbPieces': <NbPiecesField {...props} />,
    
    // Literie
    'tailleLiterie': <TailleLiterieField {...props} />,
    
    // Puériculture
    'ageBebe': <AgeBebeField {...props} />,
    
    // Tapis
    'formeTapis': <FormeTapisField {...props} />
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

export default MeublesFields;