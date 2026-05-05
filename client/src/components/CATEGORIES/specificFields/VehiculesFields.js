// 📂 components/CATEGORIES/specificFields/VehiculesField.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';
import MarqueModelVehicule from '../camposComun/MarqueModelVehicule';

// ============================================
// CAMPOS ESPECÍFICOS DE VEHÍCULOS (STEP 2)
// ============================================

// Année - Requerido
const AnneeField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Année <span className="text-danger">*</span>
      </label>
      <select
        name="annee"
        className="form-control"
        value={postData?.annee || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">Sélectionner l'année</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

// Finition
const FinitionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Finition</label>
      <input
        type="text"
        name="finition"
        className="form-control"
        placeholder="Ex: Confort, Luxe, Authentique..."
        value={postData?.finition || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Motorisation
const MotorisationField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Motorisation</label>
      <input
        type="text"
        name="motorisation"
        className="form-control"
        placeholder="Ex: 1.2 TCe, 1.5 dCi..."
        value={postData?.motorisation || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Moteur
const MoteurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Moteur</label>
      <input
        type="text"
        name="moteur"
        className="form-control"
        placeholder="Ex: 4 cylindres, V6..."
        value={postData?.moteur || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Energie
const EnergieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Energie</label>
      <select
        name="energie"
        value={postData?.energie || ''}
        onChange={handleChangeInput}
        className="form-control"
      >
        <option value="">Sélectionner</option>
        <option value="Essence">Essence</option>
        <option value="Diesel">Diesel</option>
        <option value="GPL">GPL</option>
        <option value="Électrique">Électrique</option>
        <option value="Hybride">Hybride</option>
      </select>
    </div>
  );
};

// Boite
const BoiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Boite</label>
      <select
        name="boite"
        value={postData?.boite || ''}
        onChange={handleChangeInput}
        className="form-control"
      >
        <option value="">Sélectionner</option>
        <option value="Manuelle">Manuelle</option>
        <option value="Automatique">Automatique</option>
        <option value="Semi Automatique">Semi Automatique</option>
      </select>
    </div>
  );
};

// Spécifications (Options) - MULTISELECT con react-select
const SpecsField = ({ postData, handleChangeInput }) => {
  const optionduvoiture = [
    { label: 'Climatisation', value: 'Climatisation' },
    { label: 'Alarme', value: 'Alarme' },
    { label: 'Jantes alliage', value: 'Jantes alliage' },
    { label: 'Rétroviseurs électriques', value: 'Retroviseurs électriques' },
    { label: 'Vitres électriques', value: 'Vitres électriques' },
    { label: 'ESP', value: 'ESP' },
    { label: 'Phares antibrouillard', value: 'Phares antibrouillard' },
    { label: 'Feux de jour', value: 'Feux de jour' },
    { label: 'Radar de recul', value: 'Radar de recul' },
    { label: 'Direction assistée', value: 'Direction assistée' },
    { label: 'Radio CD', value: 'Radio CD' },
    { label: 'Toit ouvrant', value: 'Toit ouvrant' },
    { label: 'Phares xénon', value: 'Phares xénon' },
    { label: 'Sièges chauffants', value: 'Sieges chauffants' },
    { label: 'Sièges en cuir', value: 'Sieges en cuir' },
    { label: 'Système de navigation (GPS)', value: 'GPS' },
    { label: 'Caméra de recul', value: 'Caméra de recul' },
    { label: 'Capteur de pluie', value: 'Capteur de pluie' },
    { label: 'Capteur de luminosité', value: 'Capteur de luminosité' },
    { label: 'Régulateur de vitesse', value: 'Regulateur de vitesse' },
    { label: 'Limiteur de vitesse', value: 'Limiteur de vitesse' },
    { label: 'Aide au stationnement', value: 'Aide au stationnement' },
    { label: 'Bluetooth', value: 'Bluetooth' },
    { label: 'Commande vocale', value: 'Commande vocale' },
    { label: 'Affichage tête haute', value: 'Affichage tête haute' },
    { label: 'Volant chauffant', value: 'Volant chauffant' },
    { label: 'Démarrage sans clé', value: 'Démarrage sans clé' },
    { label: 'Freinage d’urgence automatique', value: 'Freinage d’urgence automatique' },
    { label: 'Alerte de franchissement de ligne', value: 'Alerte de franchissement de ligne' },
    { label: 'Surveillance des angles morts', value: 'Surveillance des angles morts' },
    { label: 'Suspension adaptative', value: 'Suspension adaptative' },
    { label: 'Toit panoramique', value: 'Toit panoramique' },
    { label: 'Chargeur sans fil', value: 'Chargeur sans fil' },
    { label: 'Éclairage d’ambiance', value: 'Éclairage d’ambiance' },
    { label: 'Assistance au maintien de voie', value: 'Assistance au maintien de voie' }
  ];
  
  const selectOptions = optionduvoiture.map(opt => ({
    value: opt.value,
    label: opt.label
  }));
  
  const selectedValues = postData?.specs || [];
  const selectedOptions = selectOptions.filter(opt => selectedValues.includes(opt.value));
  
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
        options={selectOptions}
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

// Kilométrage
const KilometrageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Kilométrage</label>
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

// ============================================
// CAMPOS ADICIONALES PARA TIPOS ESPECÍFICOS
// ============================================

const ChargeUtileField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Charge utile</label>
    <div className="input-group">
      <input type="number" name="chargeUtile" className="form-control" placeholder="Charge utile" value={postData?.chargeUtile || ''} onChange={handleChangeInput} />
      <span className="input-group-text">kg</span>
    </div>
  </div>
);

const PoidsField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Poids</label>
    <div className="input-group">
      <input type="number" name="poids" className="form-control" placeholder="Poids" value={postData?.poids || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">tonnes</span>
    </div>
  </div>
);

const LongueurField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Longueur</label>
    <div className="input-group">
      <input type="number" name="longueur" className="form-control" placeholder="Longueur" value={postData?.longueur || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">m</span>
    </div>
  </div>
);

const PlacesField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Nombre de places</label>
    <input type="number" name="places" className="form-control" placeholder="Nombre de places" value={postData?.places || ''} onChange={handleChangeInput} />
  </div>
);

const CylindreeField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Cylindrée</label>
    <div className="input-group">
      <input type="number" name="cylindree" className="form-control" placeholder="Cylindrée" value={postData?.cylindree || ''} onChange={handleChangeInput} />
      <span className="input-group-text">cm³</span>
    </div>
  </div>
);

const VolumeField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Volume</label>
    <div className="input-group">
      <input type="number" name="volume" className="form-control" placeholder="Volume" value={postData?.volume || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">m³</span>
    </div>
  </div>
);

const HeuresField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Heures de fonctionnement</label>
    <div className="input-group">
      <input type="number" name="heures" className="form-control" placeholder="Heures" value={postData?.heures || ''} onChange={handleChangeInput} />
      <span className="input-group-text">h</span>
    </div>
  </div>
);

const TypeEnginField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Type d'engin</label>
    <select name="typeEngin" className="form-control" value={postData?.typeEngin || ''} onChange={handleChangeInput}>
      <option value="">Sélectionner</option>
      <option value="Pelleteuse">Pelleteuse</option>
      <option value="Chargeuse">Chargeuse</option>
      <option value="Bulldozer">Bulldozer</option>
      <option value="Niveleuse">Niveleuse</option>
      <option value="Compacteur">Compacteur</option>
      <option value="Grue">Grue</option>
    </select>
  </div>
);

const PuissanceField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Puissance</label>
    <div className="input-group">
      <input type="number" name="puissance" className="form-control" placeholder="Puissance" value={postData?.puissance || ''} onChange={handleChangeInput} />
      <span className="input-group-text">CV</span>
    </div>
  </div>
);

const EssieuxField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Nombre d'essieux</label>
    <select name="essieux" className="form-control" value={postData?.essieux || ''} onChange={handleChangeInput}>
      <option value="">Sélectionner</option>
      <option value="1">1 essieu</option>
      <option value="2">2 essieux</option>
      <option value="3">3 essieux</option>
      <option value="4">4 essieux ou plus</option>
    </select>
  </div>
);

const MoteurBateauField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Moteur</label>
    <input type="text" name="moteurBateau" className="form-control" placeholder="Type de moteur" value={postData?.moteurBateau || ''} onChange={handleChangeInput} />
  </div>
);

const TypeQuadField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Type de Quad</label>
    <select name="typeQuad" className="form-control" value={postData?.typeQuad || ''} onChange={handleChangeInput}>
      <option value="">Sélectionner</option>
      <option value="Sport">Sport</option>
      <option value="Utilitaire">Utilitaire</option>
      <option value="Cross">Cross</option>
      <option value="Enfant">Enfant</option>
    </select>
  </div>
);

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const VehiculesFields = (props) => {
  const { step } = props;
  
  const customComponents = { 
    'marque': <MarqueModelVehicule {...props} brandField="marque" modelField="modele" />,
    'annee': <AnneeField {...props} />,
   
    'finition': <FinitionField {...props} />,
    'motorisation': <MotorisationField {...props} />,
    'moteur': <MoteurField {...props} />,
    'energie': <EnergieField {...props} />,
    'boite': <BoiteField {...props} />,
    'specs': <SpecsField {...props} />,
    'kilometrage': <KilometrageField {...props} />,
    'chargeUtile': <ChargeUtileField {...props} />,
    'poids': <PoidsField {...props} />,
    'longueur': <LongueurField {...props} />,
    'places': <PlacesField {...props} />,
    'cylindree': <CylindreeField {...props} />,
    'volume': <VolumeField {...props} />,
    'heures': <HeuresField {...props} />,
    'typeEngin': <TypeEnginField {...props} />,
    'puissance': <PuissanceField {...props} />,
    'essieux': <EssieuxField {...props} />,
    'moteurBateau': <MoteurBateauField {...props} />,
    'typeQuad': <TypeQuadField {...props} />
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

export default VehiculesFields;