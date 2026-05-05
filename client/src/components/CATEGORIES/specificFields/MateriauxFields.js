// 📂 components/CATEGORIES/specificFields/MateriauxField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA MATÉRIAUX & ÉQUIPEMENT
// ============================================

// Marque (input normal)
const MarqueField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <input
        type="text"
        name="marque"
        className="form-control"
        placeholder="Ex: Bosch, Makita, Dewalt, Stanley..."
        value={postData?.marque || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Référence / Modèle
const ReferenceField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Référence / Modèle</label>
      <input
        type="text"
        name="reference"
        className="form-control"
        placeholder="Ex: GSB 1200, DCD796, F300..."
        value={postData?.reference || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const MateriauxField = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, sin etat, sin description)
  const customComponents = {
    'marque': <MarqueField {...props} />,
    'reference': <ReferenceField {...props} />
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

export default MateriauxField;