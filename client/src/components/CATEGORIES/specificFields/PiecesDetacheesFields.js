// 📂 components/CATEGORIES/specificFields/PiecesDetacheesField.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';
 
 
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Renault', label: 'Renault' },
    { value: 'Peugeot', label: 'Peugeot' },
    { value: 'Citroën', label: 'Citroën' },
    { value: 'Volkswagen', label: 'Volkswagen' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Mercedes', label: 'Mercedes' },
    { value: 'Audi', label: 'Audi' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Fiat', label: 'Fiat' },
    { value: 'Dacia', label: 'Dacia' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Mazda', label: 'Mazda' },
    { value: 'Volvo', label: 'Volvo' },
    { value: 'Porsche', label: 'Porsche' },
    { value: 'Yamaha', label: 'Yamaha (Moto)' },
    { value: 'Kawasaki', label: 'Kawasaki (Moto)' },
    { value: 'Suzuki', label: 'Suzuki' },
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

// Modèle
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: Clio 3, 308, Série 3, C4..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Année
const AnneeField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => ({ value: (currentYear - i).toString(), label: (currentYear - i).toString() }));
  
  const selectedOption = years.find(opt => opt.value === postData?.annee) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'annee', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Année du véhicule</label>
      <Select
        name="annee"
        options={years}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'année..."
        isClearable
      />
    </div>
  );
};

// Type de pièce
const TypePieceField = ({ postData, handleChangeInput }) => {
  const typesPiece = [
    { value: 'Moteur', label: '🔧 Moteur' },
    { value: 'Boîte de vitesse', label: '⚙️ Boîte de vitesse' },
    { value: 'Embrayage', label: '🔧 Embrayage' },
    { value: 'Freins', label: '🛑 Freins' },
    { value: 'Amortisseurs', label: '🔧 Amortisseurs' },
    { value: 'Alternateur', label: '⚡ Alternateur' },
    { value: 'Démarreur', label: '🔋 Démarreur' },
    { value: 'Batterie', label: '🔋 Batterie' },
    { value: 'Pneu', label: '🛞 Pneu' },
    { value: 'Jante', label: '🛞 Jante' },
    { value: 'Pare-chocs', label: '🚗 Pare-chocs' },
    { value: 'Rétroviseur', label: '🪞 Rétroviseur' },
    { value: 'Phares', label: '💡 Phares' },
    { value: 'Feux arrière', label: '💡 Feux arrière' },
    { value: 'Capot', label: '🚗 Capot' },
    { value: 'Porte', label: '🚪 Porte' },
    { value: 'Siège', label: '🪑 Siège' },
    { value: 'Volant', label: '🚗 Volant' },
    { value: 'Climatisation', label: '❄️ Climatisation' },
    { value: 'Radiateur', label: '🌡️ Radiateur' },
    { value: 'Échappement', label: '💨 Échappement' },
    { value: 'Filtre à huile', label: '🔧 Filtre à huile' },
    { value: 'Filtre à air', label: '🔧 Filtre à air' },
    { value: 'Courroie de distribution', label: '⛓️ Courroie de distribution' },
    { value: 'Calculateur', label: '💻 Calculateur' },
    { value: 'Autre', label: '📦 Autre' }
  ];
  
  const selectedOption = typesPiece.find(opt => opt.value === postData?.typePiece) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typePiece', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de pièce</label>
      <Select
        name="typePiece"
        options={typesPiece}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de pièce..."
        isClearable
      />
    </div>
  );
};

 

// Garantie
const GarantieField = ({ postData, handleChangeInput }) => {
  const garantieOptions = [
    { value: '1 mois', label: '1 mois' },
    { value: '3 mois', label: '3 mois' },
    { value: '6 mois', label: '6 mois' },
    { value: '1 an', label: '1 an' },
    { value: '2 ans', label: '2 ans' },
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

// Référence OEM
const ReferenceOEMField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Référence OEM</label>
      <input
        type="text"
        name="referenceOem"
        className="form-control"
        placeholder="Ex: 8200123456, 7700101234..."
        value={postData?.referenceOem || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Compatibilité
const CompatibiliteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compatibilité</label>
      <textarea
        name="compatibilite"
        className="form-control"
        rows="2"
        placeholder="Ex: Compatible avec Renault Clio 3 1.5 dCi 2008-2012"
        value={postData?.compatibilite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Kilométrage
const KilometrageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Kilométrage (si occasion)</label>
      <div className="input-group">
        <input
          type="number"
          name="kilometrage"
          className="form-control"
          placeholder="Kilométrage"
          value={postData?.kilometrage || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">km</span>
      </div>
    </div>
  );
};

// Position
const PositionField = ({ postData, handleChangeInput }) => {
  const positions = [
    { value: 'Avant droit', label: '➡️ Avant droit' },
    { value: 'Avant gauche', label: '⬅️ Avant gauche' },
    { value: 'Arrière droit', label: '➡️ Arrière droit' },
    { value: 'Arrière gauche', label: '⬅️ Arrière gauche' },
    { value: 'Avant', label: '⬆️ Avant' },
    { value: 'Arrière', label: '⬇️ Arrière' },
    { value: 'Intérieur', label: '🚗 Intérieur' },
    { value: 'Extérieur', label: '🌳 Extérieur' }
  ];
  
  const selectedOption = positions.find(opt => opt.value === postData?.position) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'position', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Position</label>
      <Select
        name="position"
        options={positions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la position..."
        isClearable
      />
    </div>
  );
};

// Type de moteur
const TypeMoteurField = ({ postData, handleChangeInput }) => {
  const moteurs = [
    { value: 'Essence', label: '⛽ Essence' },
    { value: 'Diesel', label: '🛢️ Diesel' },
    { value: 'GPL', label: '🔵 GPL' },
    { value: 'Électrique', label: '⚡ Électrique' },
    { value: 'Hybride', label: '🔋 Hybride' }
  ];
  
  const selectedOption = moteurs.find(opt => opt.value === postData?.typeMoteur) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeMoteur', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de moteur</label>
      <Select
        name="typeMoteur"
        options={moteurs}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de moteur..."
        isClearable
      />
    </div>
  );
};

// Quantité
const QuantiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Quantité disponible</label>
      <input
        type="number"
        name="quantite"
        className="form-control"
        placeholder="Quantité"
        value={postData?.quantite || ''}
        onChange={handleChangeInput}
        min="1"
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA LUBRIFIANTS
// ============================================

// Type de lubrifiant
const TypeLubrifiantField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Huile moteur', label: '🛢️ Huile moteur' },
    { value: 'Huile boîte', label: '🛢️ Huile boîte' },
    { value: 'Liquide frein', label: '🛑 Liquide frein' },
    { value: 'Liquide refroidissement', label: '❄️ Liquide refroidissement' },
    { value: 'Liquide lave-glace', label: '💧 Liquide lave-glace' },
    { value: 'Graisse', label: '🔧 Graisse' },
    { value: 'Additif', label: '🧪 Additif' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeLubrifiant) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeLubrifiant', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de lubrifiant</label>
      <Select
        name="typeLubrifiant"
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

// Viscosité
const ViscositeField = ({ postData, handleChangeInput }) => {
  const viscosites = [
    { value: '5W30', label: '5W30' },
    { value: '5W40', label: '5W40' },
    { value: '10W40', label: '10W40' },
    { value: '10W50', label: '10W50' },
    { value: '15W40', label: '15W40' },
    { value: '20W50', label: '20W50' },
    { value: '0W20', label: '0W20' },
    { value: '0W30', label: '0W30' }
  ];
  
  const selectedOption = viscosites.find(opt => opt.value === postData?.viscosite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'viscosite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Viscosité</label>
      <Select
        name="viscosite"
        options={viscosites}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la viscosité..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA OUTILS DE DIAGNOSTIC
// ============================================

// Type d'outil diagnostic
const TypeOutilDiagnosticField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Valise diagnostic', label: '📟 Valise diagnostic' },
    { value: 'Lecteur OBD2', label: '🔌 Lecteur OBD2' },
    { value: 'Multimètre', label: '📊 Multimètre' },
    { value: 'Testeur batterie', label: '🔋 Testeur batterie' },
    { value: 'Testeur compression', label: '🔧 Testeur compression' },
    { value: 'Pont élévateur', label: '🏗️ Pont élévateur' },
    { value: 'Chasse-pneu', label: '🛞 Chasse-pneu' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeOutilDiagnostic) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeOutilDiagnostic', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'outil</label>
      <Select
        name="typeOutilDiagnostic"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type d'outil..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA ALARME & SÉCURITÉ
// ============================================

// Type d'alarme
const TypeAlarmeField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Alarme volumétrique', label: '🔊 Alarme volumétrique' },
    { value: 'Alarme périmétrique', label: '🔒 Alarme périmétrique' },
    { value: 'Alarme avec GPS', label: '📍 Alarme avec GPS' },
    { value: 'Système main libre', label: '📱 Système main libre' },
    { value: 'Antidémarrage', label: '🔑 Antidémarrage' },
    { value: 'Traceur GPS', label: '🛰️ Traceur GPS' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeAlarme) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeAlarme', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'alarme</label>
      <Select
        name="typeAlarme"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type d'alarme..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA NETTOYAGE & ENTRETIEN
// ============================================

// Type de produit nettoyage
const TypeNettoyageField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Shampoing auto', label: '🧼 Shampoing auto' },
    { value: 'Cire', label: '✨ Cire' },
    { value: 'Nettoyant vitres', label: '🪟 Nettoyant vitres' },
    { value: 'Nettoyant jantes', label: '🛞 Nettoyant jantes' },
    { value: 'Nettoyant cuir', label: '👞 Nettoyant cuir' },
    { value: 'Décapant', label: '🧪 Décapant' },
    { value: 'Polish', label: '✨ Polish' },
    { value: 'Chiffon microfibre', label: '🧽 Chiffon microfibre' },
    { value: 'Brosse', label: '🪥 Brosse' },
    { value: 'Nettoyeur haute pression', label: '💦 Nettoyeur haute pression' },
    { value: 'Aspirateur auto', label: '🧹 Aspirateur auto' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeNettoyage) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeNettoyage', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <Select
        name="typeNettoyage"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de produit..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PiecesDetacheesField = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
   
   
    // Campos específicos para pièces détachées
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'annee': <AnneeField {...props} />,
    'typePiece': <TypePieceField {...props} />,
   
    'garantie': <GarantieField {...props} />,
    'referenceOem': <ReferenceOEMField {...props} />,
    'compatibilite': <CompatibiliteField {...props} />,
    'kilometrage': <KilometrageField {...props} />,
    'position': <PositionField {...props} />,
    'typeMoteur': <TypeMoteurField {...props} />,
    'quantite': <QuantiteField {...props} />,
    
    // Lubrifiants
    'typeLubrifiant': <TypeLubrifiantField {...props} />,
    'viscosite': <ViscositeField {...props} />,
    
    // Outils diagnostics
    'typeOutilDiagnostic': <TypeOutilDiagnosticField {...props} />,
    
    // Alarme & Sécurité
    'typeAlarme': <TypeAlarmeField {...props} />,
    
    // Nettoyage & Entretien
    'typeNettoyage': <TypeNettoyageField {...props} />
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

export default PiecesDetacheesField;