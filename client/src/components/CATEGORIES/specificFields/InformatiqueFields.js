// 📂 components/CATEGORIES/specificFields/InformatiqueFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';
import MarqueModelPcs from '../camposComun/MarqueModelPcs';

// ============================================
// CAMPOS ESPECÍFICOS PARA INFORMATIQUE
// ============================================

// Processeur
const ProcesseurField = ({ postData, handleChangeInput }) => {
  const processeurs = [
    { value: 'Intel Core i3', label: 'Intel Core i3' },
    { value: 'Intel Core i5', label: 'Intel Core i5' },
    { value: 'Intel Core i7', label: 'Intel Core i7' },
    { value: 'Intel Core i9', label: 'Intel Core i9' },
    { value: 'Intel Celeron', label: 'Intel Celeron' },
    { value: 'Intel Pentium', label: 'Intel Pentium' },
    { value: 'AMD Ryzen 3', label: 'AMD Ryzen 3' },
    { value: 'AMD Ryzen 5', label: 'AMD Ryzen 5' },
    { value: 'AMD Ryzen 7', label: 'AMD Ryzen 7' },
    { value: 'AMD Ryzen 9', label: 'AMD Ryzen 9' },
    { value: 'AMD Athlon', label: 'AMD Athlon' },
    { value: 'Apple M1', label: 'Apple M1' },
    { value: 'Apple M2', label: 'Apple M2' },
    { value: 'Apple M3', label: 'Apple M3' }
  ];
  
  const selectedOption = processeurs.find(opt => opt.value === postData?.processeur) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'processeur', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Processeur</label>
      <Select
        name="processeur"
        options={processeurs}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le processeur..."
        isClearable
      />
    </div>
  );
};

// RAM
const RamField = ({ postData, handleChangeInput }) => {
  const ramOptions = [
    { value: '2 Go', label: '2 Go' },
    { value: '4 Go', label: '4 Go' },
    { value: '8 Go', label: '8 Go' },
    { value: '16 Go', label: '16 Go' },
    { value: '32 Go', label: '32 Go' },
    { value: '64 Go', label: '64 Go' },
    { value: '128 Go', label: '128 Go' }
  ];
  
  const selectedOption = ramOptions.find(opt => opt.value === postData?.ram) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'ram', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">RAM</label>
      <Select
        name="ram"
        options={ramOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la RAM..."
        isClearable
      />
    </div>
  );
};

// Stockage
const StockageField = ({ postData, handleChangeInput }) => {
  const stockageOptions = [
    { value: '128 Go SSD', label: '128 Go SSD' },
    { value: '256 Go SSD', label: '256 Go SSD' },
    { value: '512 Go SSD', label: '512 Go SSD' },
    { value: '1 To SSD', label: '1 To SSD' },
    { value: '2 To SSD', label: '2 To SSD' },
    { value: '500 Go HDD', label: '500 Go HDD' },
    { value: '1 To HDD', label: '1 To HDD' },
    { value: '2 To HDD', label: '2 To HDD' },
    { value: '256 Go SSD + 1 To HDD', label: '256 Go SSD + 1 To HDD' },
    { value: '512 Go SSD + 1 To HDD', label: '512 Go SSD + 1 To HDD' }
  ];
  
  const selectedOption = stockageOptions.find(opt => opt.value === postData?.stockage) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'stockage', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Stockage</label>
      <Select
        name="stockage"
        options={stockageOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le stockage..."
        isClearable
      />
    </div>
  );
};

// Taille d'écran
const TailleEcranField = ({ postData, handleChangeInput }) => {
  const taillesEcran = [
    { value: '11.6 pouces', label: '11.6 pouces' },
    { value: '12.5 pouces', label: '12.5 pouces' },
    { value: '13.3 pouces', label: '13.3 pouces' },
    { value: '14 pouces', label: '14 pouces' },
    { value: '15.6 pouces', label: '15.6 pouces' },
    { value: '17.3 pouces', label: '17.3 pouces' },
    { value: '19 pouces', label: '19 pouces' },
    { value: '21 pouces', label: '21 pouces' },
    { value: '24 pouces', label: '24 pouces' },
    { value: '27 pouces', label: '27 pouces' },
    { value: '32 pouces', label: '32 pouces' }
  ];
  
  const selectedOption = taillesEcran.find(opt => opt.value === postData?.tailleEcran) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tailleEcran', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille d'écran</label>
      <Select
        name="tailleEcran"
        options={taillesEcran}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la taille d'écran..."
        isClearable
      />
    </div>
  );
};

// Carte graphique
const CarteGraphiqueField = ({ postData, handleChangeInput }) => {
  const cartesGraphiques = [
    { value: 'Intel HD Graphics', label: 'Intel HD Graphics' },
    { value: 'Intel Iris Xe', label: 'Intel Iris Xe' },
    { value: 'NVIDIA GeForce GTX 1650', label: 'NVIDIA GeForce GTX 1650' },
    { value: 'NVIDIA GeForce RTX 3050', label: 'NVIDIA GeForce RTX 3050' },
    { value: 'NVIDIA GeForce RTX 3060', label: 'NVIDIA GeForce RTX 3060' },
    { value: 'NVIDIA GeForce RTX 3070', label: 'NVIDIA GeForce RTX 3070' },
    { value: 'NVIDIA GeForce RTX 3080', label: 'NVIDIA GeForce RTX 3080' },
    { value: 'NVIDIA GeForce RTX 3090', label: 'NVIDIA GeForce RTX 3090' },
    { value: 'NVIDIA GeForce RTX 4060', label: 'NVIDIA GeForce RTX 4060' },
    { value: 'NVIDIA GeForce RTX 4070', label: 'NVIDIA GeForce RTX 4070' },
    { value: 'NVIDIA GeForce RTX 4080', label: 'NVIDIA GeForce RTX 4080' },
    { value: 'NVIDIA GeForce RTX 4090', label: 'NVIDIA GeForce RTX 4090' },
    { value: 'AMD Radeon RX 6600', label: 'AMD Radeon RX 6600' },
    { value: 'AMD Radeon RX 6700', label: 'AMD Radeon RX 6700' },
    { value: 'AMD Radeon RX 6800', label: 'AMD Radeon RX 6800' },
    { value: 'AMD Radeon RX 6900', label: 'AMD Radeon RX 6900' },
    { value: 'Apple GPU', label: 'Apple GPU' }
  ];
  
  const selectedOption = cartesGraphiques.find(opt => opt.value === postData?.carteGraphique) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'carteGraphique', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Carte graphique</label>
      <Select
        name="carteGraphique"
        options={cartesGraphiques}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la carte graphique..."
        isClearable
      />
    </div>
  );
};

// Garantie
const GarantieField = ({ postData, handleChangeInput }) => {
  const garantieOptions = [
    { value: '3 mois', label: '3 mois' },
    { value: '6 mois', label: '6 mois' },
    { value: '1 an', label: '1 an' },
    { value: '2 ans', label: '2 ans' },
    { value: '3 ans', label: '3 ans' },
    { value: 'Sans garantie', label: 'Sans garantie' }
  ];
  
  const selectedOption = garantieOptions.find(opt => opt.value === postData?.garantie) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'garantie', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Garantie</label>
      <Select
        name="garantie"
        options={garantieOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la garantie..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS ADICIONALES
// ============================================

// Type de composant
const TypeComposantField = ({ postData, handleChangeInput }) => {
  const typeComposants = [
    { value: 'Carte mère', label: 'Carte mère' },
    { value: 'Processeur', label: 'Processeur' },
    { value: 'RAM', label: 'RAM' },
    { value: 'Disque dur', label: 'Disque dur' },
    { value: 'Carte graphique', label: 'Carte graphique' },
    { value: 'Alimentation', label: 'Alimentation' },
    { value: 'Boîtier', label: 'Boîtier' },
    { value: 'Refroidissement', label: 'Refroidissement' }
  ];
  
  const selectedOption = typeComposants.find(opt => opt.value === postData?.typeComposant) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeComposant', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de composant</label>
      <Select
        name="typeComposant"
        options={typeComposants}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de composant..."
        isClearable
      />
    </div>
  );
};

// Type de périphérique
const TypePeripheriqueField = ({ postData, handleChangeInput }) => {
  const typePeripheriques = [
    { value: 'Clavier', label: '⌨️ Clavier' },
    { value: 'Souris', label: '🖱️ Souris' },
    { value: 'Casque audio', label: '🎧 Casque audio' },
    { value: 'Webcam', label: '📷 Webcam' },
    { value: 'Microphone', label: '🎤 Microphone' },
    { value: 'Enceinte', label: '🔊 Enceinte' },
    { value: 'Disque dur externe', label: '💾 Disque dur externe' },
    { value: 'Clé USB', label: '🔑 Clé USB' },
    { value: 'Câble', label: '🔌 Câble' }
  ];
  
  const selectedOption = typePeripheriques.find(opt => opt.value === postData?.typePeripherique) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typePeripherique', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de périphérique</label>
      <Select
        name="typePeripherique"
        options={typePeripheriques}
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

const InformatiqueFields = (props) => {
  const { step } = props;
  
  // CAMPOS ESPECÍFICOS con MarqueModelPcs
  const customComponents = {
    // ⭐ NUEVO: Componente MarqueModelPcs para PCs
    'marqueModelePcs': <MarqueModelPcs {...props} />,
    
    // Otros campos específicos
    'processeur': <ProcesseurField {...props} />,
    'ram': <RamField {...props} />,
    'stockage': <StockageField {...props} />,
    'tailleEcran': <TailleEcranField {...props} />,
    'carteGraphique': <CarteGraphiqueField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // Campos adicionales
    'typeComposant': <TypeComposantField {...props} />,
    'typePeripherique': <TypePeripheriqueField {...props} />
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

export default InformatiqueFields;