// 📂 components/CATEGORIES/specificFields/ImmobiliersFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE INMOBILIARIO (STEP 2)
// ============================================

// Désignation - Requerido
 

// Description du bien - Requerido
const DescriptionBienField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Description du bien <span className="text-danger">*</span>
      </label>
      <textarea
        name="descriptionBien"
        className="form-control"
        rows="4"
        placeholder="Décrivez votre bien en détail..."
        value={postData?.descriptionBien || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Superficie - Requerido (para todos)
const SuperficieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Superficie <span className="text-danger">*</span>
      </label>
      <div className="input-group">
        <input 
          type="number"
          name="superficie"
          className="form-control"
          placeholder="Superficie"
          value={postData?.superficie || ''}
          onChange={handleChangeInput}
          required
        />
        <span className="input-group-text">m²</span>
      </div>
    </div>
  );
};

// Étage (solo para appartement, local, bureau, studio, duplex, etc. - NO para terrain, villa, maison)
const EtageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Étage</label>
      <input
        type="number"
        name="etage"
        className="form-control"
        placeholder="Numéro d'étage"
        value={postData?.etage || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre de pièces (solo para appartement, villa, maison, etc. - NO para terrain, local commercial)
const PiecesField = ({ postData, handleChangeInput }) => {
  const piecesOptions = [
    { value: '1', label: '1 pièce' },
    { value: '2', label: '2 pièces' },
    { value: '3', label: '3 pièces' },
    { value: '4', label: '4 pièces' },
    { value: '5', label: '5 pièces' },
    { value: '6', label: '6+ pièces' }
  ];
  
  const selectedOption = piecesOptions.find(opt => opt.value === postData?.pieces) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'pieces', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de pièces</label>
      <Select
        name="pieces"
        options={piecesOptions}
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

// Nombre de chambres (solo para appartement, villa, maison, etc.)
const ChambresField = ({ postData, handleChangeInput }) => {
  const chambresOptions = [
    { value: '1', label: '1 chambre' },
    { value: '2', label: '2 chambres' },
    { value: '3', label: '3 chambres' },
    { value: '4', label: '4 chambres' },
    { value: '5', label: '5+ chambres' }
  ];
  
  const selectedOption = chambresOptions.find(opt => opt.value === postData?.chambres) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'chambres', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de chambres</label>
      <Select
        name="chambres"
        options={chambresOptions}
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

// Salles de bain (solo para appartement, villa, maison, etc.)
const SallesBainField = ({ postData, handleChangeInput }) => {
  const sallesBainOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4+' }
  ];
  
  const selectedOption = sallesBainOptions.find(opt => opt.value === postData?.sallesBain) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'sallesBain', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Salles de bain</label>
      <Select
        name="sallesBain"
        options={sallesBainOptions}
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

// Jardin
const JardinField = ({ postData, handleChangeInput }) => {
  const jardinOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ];
  
  const selectedOption = jardinOptions.find(opt => opt.value === postData?.jardin) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'jardin', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Jardin</label>
      <Select
        name="jardin"
        options={jardinOptions}
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

// Piscine
const PiscineField = ({ postData, handleChangeInput }) => {
  const piscineOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ];
  
  const selectedOption = piscineOptions.find(opt => opt.value === postData?.piscine) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'piscine', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Piscine</label>
      <Select
        name="piscine"
        options={piscineOptions}
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

// Spécifications (MULTISELECT con react-select)
const SpecsImmobilierField = ({ postData, handleChangeInput }) => {
  const optionsList = [
    { value: 'Meublé', label: 'Meublé' },
    { value: 'Non meublé', label: 'Non meublé' },
    { value: 'Ascenseur', label: 'Ascenseur' },
    { value: 'Parking', label: 'Parking' },
    { value: 'Jardin', label: 'Jardin' },
    { value: 'Balcon', label: 'Balcon' },
    { value: 'Terrasse', label: 'Terrasse' },
    { value: 'Cave', label: 'Cave' },
    { value: 'Garde', label: 'Garde' },
    { value: 'Interphone', label: 'Interphone' },
    { value: 'Vidéosurveillance', label: 'Vidéosurveillance' },
    { value: 'Chauffage central', label: 'Chauffage central' },
    { value: 'Climatisation', label: 'Climatisation' },
    { value: 'Piscine', label: 'Piscine' },
    { value: 'Salle de sport', label: 'Salle de sport' },
    { value: 'Cuisine équipée', label: 'Cuisine équipée' },
    { value: 'Double vitrage', label: 'Double vitrage' }
  ];
  
  const selectedValues = postData?.specs || [];
  const selectedOptions = optionsList.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'specs', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Spécifications</label>
      <Select
        isMulti
        name="specs"
        options={optionsList}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les options..."
        noOptionsMessage={() => "Aucune option disponible"}
      />
      <small className="text-muted">Vous pouvez sélectionner plusieurs options</small>
    </div>
  );
};

// Type de vente - Requerido
const TypeVenteField = ({ postData, handleChangeInput }) => {
  const typeVenteOptions = [
    { value: 'Particulier', label: 'Particulier' },
    { value: 'Professionnel', label: 'Professionnel' },
    { value: 'Agence', label: 'Agence immobilière' },
    { value: 'Promoteur', label: 'Promoteur' }
  ];
  
  const selectedOption = typeVenteOptions.find(opt => opt.value === postData?.typeVente) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeVente', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Type de vente <span className="text-danger">*</span>
      </label>
      <Select
        name="typeVente"
        options={typeVenteOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        required
      />
    </div>
  );
};

// Papiers
const PapiersImmobilierField = ({ postData, handleChangeInput }) => {
  const papiersOptions = [
    { value: 'Titre de propriété', label: 'Titre de propriété' },
    { value: 'Acte de vente', label: 'Acte de vente' },
    { value: 'Permis de construire', label: 'Permis de construire' },
    { value: 'Diagnostic technique', label: 'Diagnostic technique' },
    { value: 'Aucun', label: 'Aucun' }
  ];
  
  const selectedOption = papiersOptions.find(opt => opt.value === postData?.papiers) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'papiers', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Papiers</label>
      <Select
        name="papiers"
        options={papiersOptions}
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

// Conditions de paiement
const ConditionsPaiementField = ({ postData, handleChangeInput }) => {
  const conditionsOptions = [
    { value: 'Comptant', label: 'Comptant' },
    { value: 'Crédit', label: 'Crédit' },
    { value: 'Crédit bancaire', label: 'Crédit bancaire' },
    { value: 'Crédit vendeur', label: 'Crédit vendeur' },
    { value: 'Échange', label: 'Échange' }
  ];
  
  const selectedOption = conditionsOptions.find(opt => opt.value === postData?.conditionsPaiement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'conditionsPaiement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Conditions de paiement</label>
      <Select
        name="conditionsPaiement"
        options={conditionsOptions}
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
 

// Adresse du bien - Requerido
const AdresseBienField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Adresse du bien <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="adresse"
        className="form-control"
        placeholder="Ex: 123 Rue Mohamed V, Alger"
        value={postData?.adresse || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Quartier
const QuartierField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Quartier</label>
      <input
        type="text"
        name="quartier"
        className="form-control"
        placeholder="Ex: Hydra, El Biar, Sidi Yahia..."
        value={postData?.quartier || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de terrain (solo para terrain)
const TypeTerrainField = ({ postData, handleChangeInput }) => {
  const terrainOptions = [
    { value: 'Constructible', label: 'Constructible' },
    { value: 'Non constructible', label: 'Non constructible' },
    { value: 'Agricole', label: 'Agricole' }
  ];
  
  const selectedOption = terrainOptions.find(opt => opt.value === postData?.typeTerrain) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeTerrain', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de terrain</label>
      <Select
        name="typeTerrain"
        options={terrainOptions}
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

// Viabilisé (solo para terrain)
const ViabiliseField = ({ postData, handleChangeInput }) => {
  const viabiliseOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ];
  
  const selectedOption = viabiliseOptions.find(opt => opt.value === postData?.viabilise) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'viabilise', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Viabilisé</label>
      <Select
        name="viabilise"
        options={viabiliseOptions}
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

// Vitrine (solo pour local commercial)
const VitrineField = ({ postData, handleChangeInput }) => {
  const vitrineOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ];
  
  const selectedOption = vitrineOptions.find(opt => opt.value === postData?.vitrine) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'vitrine', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vitrine</label>
      <Select
        name="vitrine"
        options={vitrineOptions}
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

// Hauteur sous plafond (solo pour local commercial, bureau)
const HauteurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hauteur sous plafond</label>
      <div className="input-group">
        <input
          type="number"
          name="hauteur"
          className="form-control"
          placeholder="Hauteur"
          value={postData?.hauteur || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">m</span>
      </div>
    </div>
  );
};

// Nombre d'appartements (solo para immeuble)
const NbAppartementsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre d'appartements</label>
      <input
        type="number"
        name="nbAppartements"
        className="form-control"
        placeholder="Nombre d'appartements"
        value={postData?.nbAppartements || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre d'étages (solo para immeuble)
const NbEtagesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre d'étages</label>
      <input
        type="number"
        name="nbEtages"
        className="form-control"
        placeholder="Nombre d'étages"
        value={postData?.nbEtages || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL CON CAMPOS CONDICIONALES
// ============================================

const ImmobiliersFields = (props) => {
  const { step, articleType } = props;
  
  // Definir qué campos mostrar según el tipo de artículo (articleType del accordion)
  const getConditionalFields = () => {
    // Tipos que NO son terrain (tienen étage, pieces, chambres, sallesBain)
    const typesAvecEtagePieces = [
      'appartement', 'villa', 'maison', 'studio', 'duplex', 
      'local commercial', 'bureau', 'magasin'
    ];
    
    // Tipos que son terrain (solo para terrenos)
    const typesTerrain = ['terrain', 'terrains'];
    
    // Tipos que son locaux commerciaux (tienen vitrine)
    const typesAvecVitrine = ['local commercial', 'magasin', 'boutique'];
    
    // Tipos que son immeubles (tienen nbAppartements, nbEtages)
    const typesImmeuble = ['immeuble', 'building'];
    
    // Tipos que son locaux/bureaux (tienen hauteur)
    const typesAvecHauteur = ['local commercial', 'bureau', 'entrepôt', 'warehouse'];
    
    const isTerrain = typesTerrain.includes(articleType?.toLowerCase());
    const hasEtagePieces = typesAvecEtagePieces.includes(articleType?.toLowerCase());
    const hasVitrine = typesAvecVitrine.includes(articleType?.toLowerCase());
    const isImmeuble = typesImmeuble.includes(articleType?.toLowerCase());
    const hasHauteur = typesAvecHauteur.includes(articleType?.toLowerCase());
    
    // Construir objeto de componentes condicionales
    const conditionalComponents = {
      // Campos comunes para TODOS los tipos
    
      'descriptionBien': <DescriptionBienField {...props} />,
      'superficie': <SuperficieField {...props} />,
      'jardin': <JardinField {...props} />,
      'piscine': <PiscineField {...props} />,
      'specs': <SpecsImmobilierField {...props} />,
      'typeVente': <TypeVenteField {...props} />,
      'papiers': <PapiersImmobilierField {...props} />,
      'conditionsPaiement': <ConditionsPaiementField {...props} />,
   
      'adresse': <AdresseBienField {...props} />,
      'quartier': <QuartierField {...props} />
    };
    
    // Campos para tipos que NO son terrain (appartement, villa, maison, etc.)
    if (hasEtagePieces && !isTerrain) {
      conditionalComponents['etage'] = <EtageField {...props} />;
      conditionalComponents['pieces'] = <PiecesField {...props} />;
      conditionalComponents['chambres'] = <ChambresField {...props} />;
      conditionalComponents['sallesBain'] = <SallesBainField {...props} />;
    }
    
    // Campos específicos para terrain
    if (isTerrain) {
      conditionalComponents['typeTerrain'] = <TypeTerrainField {...props} />;
      conditionalComponents['viabilise'] = <ViabiliseField {...props} />;
    }
    
    // Campos para locaux commerciaux
    if (hasVitrine) {
      conditionalComponents['vitrine'] = <VitrineField {...props} />;
    }
    
    // Campos para immeubles
    if (isImmeuble) {
      conditionalComponents['nbAppartements'] = <NbAppartementsField {...props} />;
      conditionalComponents['nbEtages'] = <NbEtagesField {...props} />;
    }
    
    // Campos para locales con altura
    if (hasHauteur) {
      conditionalComponents['hauteur'] = <HauteurField {...props} />;
    }
    
    return conditionalComponents;
  };
  
  const customComponents = getConditionalFields();
  
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

export default ImmobiliersFields;