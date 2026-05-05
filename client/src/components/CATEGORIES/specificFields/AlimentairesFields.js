// 📂 components/CATEGORIES/specificFields/AlimentairesField.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA ALIMENTAIRES
// ============================================

// Marque (opcional para alimentaires)
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Danone', label: 'Danone' },
    { value: 'Lactel', label: 'Lactel' },
    { value: 'Candia', label: 'Candia' },
    { value: 'Nestlé', label: 'Nestlé' },
    { value: 'Coca-Cola', label: 'Coca-Cola' },
    { value: 'Pepsi', label: 'Pepsi' },
    { value: 'Oasis', label: 'Oasis' },
    { value: 'Tropicana', label: 'Tropicana' },
    { value: 'Milka', label: 'Milka' },
    { value: 'Lindt', label: 'Lindt' },
    { value: 'Ferrero', label: 'Ferrero' },
    { value: 'Kellogg\'s', label: 'Kellogg\'s' },
    { value: 'Nutella', label: 'Nutella' },
    { value: 'Findus', label: 'Findus' },
    { value: 'Maggi', label: 'Maggi' },
    { value: 'Knorr', label: 'Knorr' },
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
        placeholder="Sélectionner la marque (optionnel)"
        isClearable
      />
      <small className="text-muted">Optionnel - Sélectionnez une marque si disponible</small>
    </div>
  );
};

// Date de péremption
const DatePeremptionField = ({ postData, handleChangeInput }) => {
  // Calculer la date minimale (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  // Calculer la date maximale (1 an après)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Date de péremption <span className="text-danger">*</span>
      </label>
      <input
        type="date"
        name="datePeremption"
        className="form-control"
        min={today}
        max={maxDateStr}
        value={postData?.datePeremption || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">La date de péremption doit être valide</small>
    </div>
  );
};

// Conditionnement
const ConditionnementField = ({ postData, handleChangeInput }) => {
  const conditionnements = [
    { value: 'Unité', label: 'Unité (1 pièce)' },
    { value: 'Lot de 2', label: 'Lot de 2' },
    { value: 'Lot de 3', label: 'Lot de 3' },
    { value: 'Lot de 4', label: 'Lot de 4' },
    { value: 'Lot de 5', label: 'Lot de 5' },
    { value: 'Lot de 6', label: 'Lot de 6' },
    { value: 'Lot de 10', label: 'Lot de 10' },
    { value: 'Pack familial', label: 'Pack familial' },
    { value: 'Sachet', label: 'Sachet' },
    { value: 'Boîte', label: 'Boîte' },
    { value: 'Carton', label: 'Carton' },
    { value: 'Bidon', label: 'Bidon' },
    { value: 'Bouteille', label: 'Bouteille' },
    { value: 'Pot', label: 'Pot' },
    { value: 'Barquette', label: 'Barquette' }
  ];
  
  const selectedOption = conditionnements.find(opt => opt.value === postData?.conditionnement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'conditionnement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Conditionnement <span className="text-danger">*</span>
      </label>
      <Select
        name="conditionnement"
        options={conditionnements}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le conditionnement..."
        required
      />
      <small className="text-muted">Comment est conditionné le produit</small>
    </div>
  );
};

// Poids / Quantité
const PoidsQuantiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Poids / Quantité</label>
      <div className="input-group">
        <input
          type="number"
          name="poidsQuantite"
          className="form-control"
          placeholder="Quantité"
          value={postData?.poidsQuantite || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <select
          name="unitePoids"
          className="form-select"
          value={postData?.unitePoids || 'kg'}
          onChange={handleChangeInput}
          style={{ width: '100px' }}
        >
          <option value="g">grammes (g)</option>
          <option value="kg">kilogrammes (kg)</option>
          <option value="ml">millilitres (ml)</option>
          <option value="l">litres (L)</option>
          <option value="piece">pièce(s)</option>
        </select>
      </div>
      <small className="text-muted">Exemple: 500g, 1kg, 2L, etc.</small>
    </div>
  );
};

// Composition / Ingrédients
const CompositionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Composition / Ingrédients</label>
      <textarea
        name="composition"
        className="form-control"
        rows="3"
        placeholder="Liste des ingrédients, composition..."
        value={postData?.composition || ''}
        onChange={handleChangeInput}
      />
      <small className="text-muted">Indiquez les ingrédients principaux</small>
    </div>
  );
};

// Certifications
const CertificationsField = ({ postData, handleChangeInput }) => {
  const certifications = [
    { value: 'Bio', label: '🌿 Bio' },
    { value: 'Halal', label: '🕌 Halal' },
    { value: 'Sans gluten', label: '🚫 Sans gluten' },
    { value: 'Vegan', label: '🌱 Vegan' },
    { value: 'Végétarien', label: '🥬 Végétarien' },
    { value: 'Sans lactose', label: '🥛 Sans lactose' },
    { value: 'Label Rouge', label: '🔴 Label Rouge' },
    { value: 'IGP', label: '🏷️ IGP' },
    { value: 'AOP', label: '🏷️ AOP' }
  ];
  
  const selectedValues = postData?.certifications || [];
  const selectedOptions = certifications.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'certifications', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Certifications</label>
      <Select
        isMulti
        name="certifications"
        options={certifications}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les certifications..."
      />
      <small className="text-muted">Certifications et labels du produit</small>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const AlimentairesFields = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, description, typeProduit)
  const customComponents = {
    // Marque al principio
    'marque': <MarqueField {...props} />,
    'datePeremption': <DatePeremptionField {...props} />,
    'conditionnement': <ConditionnementField {...props} />,
    'poidsQuantite': <PoidsQuantiteField {...props} />,
    'composition': <CompositionField {...props} />,
    'certifications': <CertificationsField {...props} />
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

export default AlimentairesFields;