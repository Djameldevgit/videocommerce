// 📂 components/CATEGORIES/specificFields/TelephonesField.js
import React from 'react';
import Select from 'react-select';
import MarqueModelTelephone from '../camposComun/MarqueModelTelephone';
import BaseCategoryField from './BaseCategoryField';

 
const ReferenceField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Référence</label>
      <input
        type="text"
        name="reference"
        className="form-control"
        placeholder="Référence du produit"
        value={postData?.reference || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Copie / Grade
const CopieField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Original', label: '✅ Original' },
    { value: 'Reconditionné', label: '🔄 Reconditionné' },
    { value: 'Copie Chinois', label: '📱 Copie Chinois' },
    { value: 'Premium Copy', label: '✨ Premium Copy' },
    { value: 'Clone', label: '📱 Clone' },
    { value: 'Grade A+', label: '⭐ Grade A+' },
    { value: 'Grade A', label: '⭐ Grade A' },
    { value: 'Grade B', label: '⭐ Grade B' },
    { value: 'Grade C', label: '⭐ Grade C' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.copie) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'copie', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Copie / Grade</label>
      <Select
        name="copie"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le grade..."
        isClearable
      />
    </div>
  );
};

// Mémoire (Stockage)
const MemoireField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: '1 To', label: '1 To' },
    { value: '512 Go', label: '512 Go' },
    { value: '256 Go', label: '256 Go' },
    { value: '128 Go', label: '128 Go' },
    { value: '64 Go', label: '64 Go' },
    { value: '32 Go', label: '32 Go' },
    { value: '16 Go', label: '16 Go' },
    { value: '8 Go', label: '8 Go' },
    { value: '4 Go', label: '4 Go' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.memoire) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'memoire', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Mémoire (Stockage)</label>
      <Select
        name="memoire"
        options={options}
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

// Couleur
const CouleurField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Blanc', label: '⚪ Blanc' },
    { value: 'Noir', label: '⚫ Noir' },
    { value: 'Doré', label: '🟡 Doré' },
    { value: 'Argenté', label: '⚪ Argenté' },
    { value: 'Bleu', label: '🔵 Bleu' },
    { value: 'Bleu nuit', label: '🔵 Bleu nuit' },
    { value: 'Rouge', label: '🔴 Rouge' },
    { value: 'Bordeaux', label: '🔴 Bordeaux' },
    { value: 'Vert', label: '🟢 Vert' },
    { value: 'Vert forêt', label: '🟢 Vert forêt' },
    { value: 'Rose', label: '🩷 Rose' },
    { value: 'Rose gold', label: '🩷 Rose gold' },
    { value: 'Gris', label: '⬜ Gris' },
    { value: 'Gris sidéral', label: '⬜ Gris sidéral' },
    { value: 'Jaune', label: '🟡 Jaune' },
    { value: 'Orange', label: '🟠 Orange' },
    { value: 'Violet', label: '🟣 Violet' },
    { value: 'Lavande', label: '🟣 Lavande' },
    { value: 'Titanium', label: '⚪ Titanium' },
    { value: 'Autre', label: '🎨 Autre' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.couleur) || null;
  
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
        options={options}
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

// État
const EtatTelephoneField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Neuf jamais utilisé', label: '🆕 Neuf jamais utilisé' },
    { value: 'État neuf', label: '✨ État neuf' },
    { value: 'Comme neuf', label: '👍 Comme neuf' },
    { value: 'Reconditionné à neuf', label: '🔄 Reconditionné à neuf' },
    { value: 'Bon état', label: '✅ Bon état' },
    { value: 'État moyen', label: '⚠️ État moyen' },
    { value: 'Écran fissuré, fonctionne bien', label: '📱 Écran fissuré, fonctionne bien' },
    { value: 'Dysfonctionnement partiel', label: '🔧 Dysfonctionnement partiel' },
    { value: 'Pour pièces détachées', label: '🔨 Pour pièces détachées' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.etat) || null;
  
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
        options={options}
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

// OS / Android
const OsField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'iOS', label: '🍎 iOS' },
    { value: 'iOS (version spécifique)', label: '🍎 iOS (version spécifique)' },
    { value: 'Android', label: '🤖 Android' },
    { value: 'Android (version spécifique)', label: '🤖 Android (version spécifique)' },
    { value: 'Windows Phone', label: '🪟 Windows Phone' },
    { value: 'HarmonyOS', label: '🔷 HarmonyOS' },
    { value: 'Autre', label: '📱 Autre' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.os) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'os', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">OS / Android</label>
      <Select
        name="os"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'OS..."
        isClearable
      />
    </div>
  );
};

// Appareil photo (Megapixel)
const AppareilField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Appareil photo (MP)</label>
      <div className="input-group">
        <input
          type="number"
          name="appareil"
          className="form-control"
          placeholder="Mégapixels"
          value={postData?.appareil || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">MP</span>
      </div>
    </div>
  );
};

// Caméra frontale (Megapixel)
const CameraFrontalField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Caméra frontale (MP)</label>
      <div className="input-group">
        <input
          type="number"
          name="cameraFrontal"
          className="form-control"
          placeholder="Mégapixels"
          value={postData?.cameraFrontal || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">MP</span>
      </div>
    </div>
  );
};

// Taille écran
const TailleEcranField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille écran</label>
      <div className="input-group">
        <input
          type="number"
          name="tailleEcran"
          className="form-control"
          placeholder="Taille écran"
          value={postData?.tailleEcran || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">pouces</span>
      </div>
    </div>
  );
};

// RAM
const RamField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: '128 Mo', label: '128 Mo' },
    { value: '256 Mo', label: '256 Mo' },
    { value: '512 Mo', label: '512 Mo' },
    { value: '1 Go', label: '1 Go' },
    { value: '2 Go', label: '2 Go' },
    { value: '3 Go', label: '3 Go' },
    { value: '4 Go', label: '4 Go' },
    { value: '6 Go', label: '6 Go' },
    { value: '8 Go', label: '8 Go' },
    { value: '12 Go', label: '12 Go' },
    { value: '16 Go', label: '16 Go' },
    { value: '24 Go', label: '24 Go' },
    { value: '32 Go', label: '32 Go' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.ram) || null;
  
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
        options={options}
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

// Connectivité (Gigas)
const ConnectiviteField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Sans réseau', label: '📡 Sans réseau' },
    { value: '2G', label: '📶 2G' },
    { value: '3G', label: '📶 3G' },
    { value: '4G', label: '📶 4G' },
    { value: '5G', label: '📶 5G' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.connectivite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'connectivite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Connectivité</label>
      <Select
        name="connectivite"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la connectivité..."
        isClearable
      />
    </div>
  );
};

// Double puce
const DoublePuceField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Une seule puce', label: '📱 Une seule puce' },
    { value: 'Double puce', label: '📱📱 Double puce' },
    { value: 'Triple puce', label: '📱📱📱 Triple puce' },
    { value: 'eSIM + SIM physique', label: '📱🔷 eSIM + SIM physique' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.doublePuce) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'doublePuce', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Double puce</label>
      <Select
        name="doublePuce"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de puce..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA ACCESSOIRES
// ============================================

// Type d'accessoire
const TypeAccessoireField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Étui', label: '📱 Étui' },
    { value: 'Film de protection', label: '🛡️ Film de protection' },
    { value: 'Protection d\'écran', label: '🛡️ Protection d\'écran' },
    { value: 'Coque antichoc', label: '🛡️ Coque antichoc' },
    { value: 'Chargeur', label: '🔌 Chargeur' },
    { value: 'Câble', label: '🔌 Câble' },
    { value: 'Écouteurs', label: '🎧 Écouteurs' },
    { value: 'Support', label: '📱 Support' },
    { value: 'Power bank', label: '🔋 Power bank' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeAccessoire) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeAccessoire', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'accessoire</label>
      <Select
        name="typeAccessoire"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type d'accessoire..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const TelephonesField = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
   
    'marque': <MarqueModelTelephone {...props} brandField="marque" modelField="modele" />,
    'reference': <ReferenceField {...props} />,
    'copie': <CopieField {...props} />,
    'memoire': <MemoireField {...props} />,
    'couleur': <CouleurField {...props} />,
    'etat': <EtatTelephoneField {...props} />,
    'os': <OsField {...props} />,
    'appareil': <AppareilField {...props} />,
    'cameraFrontal': <CameraFrontalField {...props} />,
    'tailleEcran': <TailleEcranField {...props} />,
    'ram': <RamField {...props} />,
    'connectivite': <ConnectiviteField {...props} />,
    'doublePuce': <DoublePuceField {...props} />,
    
    // Campos para accesorios
    'typeAccessoire': <TypeAccessoireField {...props} />
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

export default TelephonesField;