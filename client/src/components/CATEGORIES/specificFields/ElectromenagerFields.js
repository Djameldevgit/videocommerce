// 📂 components/CATEGORIES/specificFields/ElectromenagerField.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA ÉLECTROMÉNAGER
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Toshiba', 'Hisense',
    'TCL', 'Xiaomi', 'Apple', 'Beko', 'Whirlpool', 'Bosch', 'Siemens',
    'Electrolux', 'Brandt', 'Candy', 'Indesit', 'Miele', 'Rowenta',
    'Tefal', 'Krups', 'Moulinex', 'Delonghi', 'Braun', 'Dyson',
    'Vorwerk', 'Midea', 'Haier', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <select
        name="marque"
        className="form-control"
        value={postData?.marque || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la marque</option>
        {marques.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
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
        placeholder="Ex: UE55CU8000, F4J5TM0W..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Garantie
const GarantieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Garantie</label>
      <input
        type="text"
        name="garantie"
        className="form-control"
        placeholder="Ex: 6 mois, 1 an, 2 ans..."
        value={postData?.garantie || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA TV & MULTIMÉDIA
// ============================================

// Taille écran (TV)
const TailleEcranField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille d'écran</label>
      <div className="input-group">
        <input
          type="number"
          name="tailleEcran"
          className="form-control"
          placeholder="Taille"
          value={postData?.tailleEcran || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">pouces</span>
      </div>
    </div>
  );
};

// Résolution
const ResolutionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Résolution</label>
      <select
        name="resolution"
        className="form-control"
        value={postData?.resolution || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="HD Ready">HD Ready (720p)</option>
        <option value="Full HD">Full HD (1080p)</option>
        <option value="4K Ultra HD">4K Ultra HD</option>
        <option value="8K Ultra HD">8K Ultra HD</option>
      </select>
    </div>
  );
};

// Smart TV
const SmartTvField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Smart TV</label>
      <select
        name="smartTv"
        className="form-control"
        value={postData?.smartTv || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR RÉFRIGÉRATEURS & CONGÉLATEURS
// ============================================

// Capacité (litres)
const CapaciteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité</label>
      <div className="input-group">
        <input
          type="number"
          name="capacite"
          className="form-control"
          placeholder="Capacité"
          value={postData?.capacite || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">litres</span>
      </div>
    </div>
  );
};

// Classe énergétique
const ClasseEnergetiqueField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Classe énergétique</label>
      <select
        name="classeEnergetique"
        className="form-control"
        value={postData?.classeEnergetique || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="A+++">A+++</option>
        <option value="A++">A++</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR MACHINES À LAVER & LAVE-VAISSELLE
// ============================================

// Capacité (kg)
const CapaciteKgField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité</label>
      <div className="input-group">
        <input
          type="number"
          name="capaciteKg"
          className="form-control"
          placeholder="Capacité"
          value={postData?.capaciteKg || ''}
          onChange={handleChangeInput}
          step="0.5"
        />
        <span className="input-group-text">kg</span>
      </div>
    </div>
  );
};

// Vitesse d'essorage
const VitesseEssorageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vitesse d'essorage</label>
      <div className="input-group">
        <input
          type="number"
          name="vitesseEssorage"
          className="form-control"
          placeholder="Vitesse"
          value={postData?.vitesseEssorage || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">tr/min</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS POUR FOURS & CUISSON
// ============================================

// Puissance
const PuissanceField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Puissance</label>
      <div className="input-group">
        <input
          type="number"
          name="puissance"
          className="form-control"
          placeholder="Puissance"
          value={postData?.puissance || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">Watts</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS ADICIONALES
// ============================================

// Compatibilité (télécommandes)
const CompatibiliteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compatibilité</label>
      <input
        type="text"
        name="compatibilite"
        className="form-control"
        placeholder="Ex: Samsung TV, Universal, etc."
        value={postData?.compatibilite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ElectromenagerField = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, description, etat, sin types d'article)
  const customComponents = {
    // Marque al principio
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // TV & Multimédia
    'tailleEcran': <TailleEcranField {...props} />,
    'resolution': <ResolutionField {...props} />,
    'smartTv': <SmartTvField {...props} />,
    
    // Réfrigérateurs
    'capacite': <CapaciteField {...props} />,
    'classeEnergetique': <ClasseEnergetiqueField {...props} />,
    
    // Machines à laver
    'capaciteKg': <CapaciteKgField {...props} />,
    'vitesseEssorage': <VitesseEssorageField {...props} />,
    
    // Fours & cuisson
    'puissance': <PuissanceField {...props} />,
    
    // Télécommandes
    'compatibilite': <CompatibiliteField {...props} />
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

export default ElectromenagerField;