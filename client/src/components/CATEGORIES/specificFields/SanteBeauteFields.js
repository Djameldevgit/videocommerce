// 📂 components/CATEGORIES/specificFields/SanteBeauteFields.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA SANTÉ & BEAUTÉ
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <input
        type="text"
        name="marque"
        className="form-control"
        placeholder="Ex: Nivea, L'Oréal, Garnier, Vichy..."
        value={postData?.marque || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Modèle / Référence
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle / Référence</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: Crème hydratante, Shampoing, Parfum..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const SanteBeauteFields = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, sin etat, sin description)
  const customComponents = {
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />
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

export default SanteBeauteFields;