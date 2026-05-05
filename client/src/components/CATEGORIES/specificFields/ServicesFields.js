// 📂 components/CATEGORIES/specificFields/ServicesFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS GENERALES PARA TODOS LOS SERVICIOS
// ============================================

// Zone d'intervention
const ZoneInterventionField = ({ postData, handleChangeInput }) => {
  const zones = [
    { value: 'Alger Centre', label: '📍 Alger Centre' },
    { value: 'Alger Est', label: '📍 Alger Est' },
    { value: 'Alger Ouest', label: '📍 Alger Ouest' },
    { value: 'Toute l\'Algérie', label: '🇩🇿 Toute l\'Algérie' },
    { value: 'À domicile', label: '🏠 À domicile' },
    { value: 'En ligne', label: '💻 En ligne' }
  ];
  
  const selectedOption = zones.find(opt => opt.value === postData?.zoneIntervention) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'zoneIntervention', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Zone d'intervention</label>
      <Select
        name="zoneIntervention"
        options={zones}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la zone d'intervention..."
        isClearable
      />
    </div>
  );
};

// Disponibilité
const DisponibiliteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Disponibilité</label>
      <input
        type="text"
        name="disponibilite"
        className="form-control"
        placeholder="Ex: Tous les jours, Week-end, Sur rendez-vous..."
        value={postData?.disponibilite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Expérience
const ExperienceField = ({ postData, handleChangeInput }) => {
  const experiences = [
    { value: 'Moins de 1 an', label: 'Moins de 1 an' },
    { value: '1-3 ans', label: '1-3 ans' },
    { value: '3-5 ans', label: '3-5 ans' },
    { value: '5-10 ans', label: '5-10 ans' },
    { value: 'Plus de 10 ans', label: 'Plus de 10 ans' }
  ];
  
  const selectedOption = experiences.find(opt => opt.value === postData?.experience) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'experience', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Expérience</label>
      <Select
        name="experience"
        options={experiences}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'expérience..."
        isClearable
      />
    </div>
  );
};

// Diplômes / Certifications
const DiplomesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Diplômes / Certifications</label>
      <textarea
        name="diplomes"
        className="form-control"
        rows="2"
        placeholder="Listez vos diplômes et certifications..."
        value={postData?.diplomes || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA SALLES DE FÊTES / ÉVÉNEMENTS
// ============================================

const CapaciteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité</label>
      <div className="input-group">
        <input
          type="number"
          name="capacite"
          className="form-control"
          placeholder="Nombre de personnes"
          value={postData?.capacite || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">personnes</span>
      </div>
    </div>
  );
};

const SuperficieSalleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Superficie</label>
      <div className="input-group">
        <input
          type="number"
          name="superficieSalle"
          className="form-control"
          placeholder="Superficie"
          value={postData?.superficieSalle || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">m²</span>
      </div>
    </div>
  );
};

const EquipementsSalleField = ({ postData, handleChangeInput }) => {
  const equipements = [
    { value: 'Climatisation', label: '❄️ Climatisation' },
    { value: 'Chauffage', label: '🔥 Chauffage' },
    { value: 'Sonorisation', label: '🔊 Sonorisation' },
    { value: 'Écran géant', label: '📺 Écran géant' },
    { value: 'Scène', label: '🎭 Scène' },
    { value: 'Piste de danse', label: '💃 Piste de danse' },
    { value: 'Parking', label: '🅿️ Parking' },
    { value: 'Cuisine équipée', label: '🍳 Cuisine équipée' },
    { value: 'Espace extérieur', label: '🌳 Espace extérieur' },
    { value: 'Wifi', label: '📶 Wifi' }
  ];
  
  const selectedValues = postData?.equipementsSalle || [];
  const selectedOptions = equipements.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'equipementsSalle', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Équipements</label>
      <Select
        isMulti
        name="equipementsSalle"
        options={equipements}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les équipements..."
      />
    </div>
  );
};

const FormulesField = ({ postData, handleChangeInput }) => {
  const formules = [
    { value: 'Mariage', label: '💍 Mariage' },
    { value: 'Anniversaire', label: '🎂 Anniversaire' },
    { value: 'Séminaire', label: '💼 Séminaire' },
    { value: 'Conférence', label: '🎤 Conférence' },
    { value: 'Soirée privée', label: '🎉 Soirée privée' },
    { value: 'Banquet', label: '🍽️ Banquet' },
    { value: 'Cocktail', label: '🍸 Cocktail' }
  ];
  
  const selectedValues = postData?.formules || [];
  const selectedOptions = formules.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'formules', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Formules disponibles</label>
      <Select
        isMulti
        name="formules"
        options={formules}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les formules..."
      />
    </div>
  );
};

const TarifField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Tarif</label>
      <div className="row g-2">
        <div className="col-6">
          <input
            type="number"
            name="tarif"
            className="form-control"
            placeholder="Montant"
            value={postData?.tarif || ''}
            onChange={handleChangeInput}
          />
        </div>
        <div className="col-6">
          <select
            name="uniteTarif"
            className="form-select"
            value={postData?.uniteTarif || 'forfait'}
            onChange={handleChangeInput}
          >
            <option value="forfait">Forfait</option>
            <option value="personne">Par personne</option>
            <option value="heure">Par heure</option>
            <option value="jour">Par jour</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS PARA TRAITEURS
// ============================================

const TypeCuisineField = ({ postData, handleChangeInput }) => {
  const cuisines = [
    { value: 'Algérienne', label: '🍲 Algérienne' },
    { value: 'Orientale', label: '🥙 Orientale' },
    { value: 'Européenne', label: '🍝 Européenne' },
    { value: 'Asiatique', label: '🍜 Asiatique' },
    { value: 'Méditerranéenne', label: '🥗 Méditerranéenne' },
    { value: 'Fusion', label: '🍣 Fusion' }
  ];
  
  const selectedValues = postData?.typeCuisine || [];
  const selectedOptions = cuisines.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'typeCuisine', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de cuisine</label>
      <Select
        isMulti
        name="typeCuisine"
        options={cuisines}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les types de cuisine..."
      />
    </div>
  );
};

const NombrePersonnesMaxField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de personnes max</label>
      <input
        type="number"
        name="nombrePersonnesMax"
        className="form-control"
        placeholder="Nombre de personnes"
        value={postData?.nombrePersonnesMax || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA TRANSPORT & DÉMÉNAGEMENT
// ============================================

const TypeVehiculeField = ({ postData, handleChangeInput }) => {
  const vehicules = [
    { value: 'Camion 10m³', label: '🚚 Camion 10m³' },
    { value: 'Camion 20m³', label: '🚛 Camion 20m³' },
    { value: 'Fourgon', label: '🚐 Fourgon' },
    { value: 'Utilitaire', label: '🚙 Utilitaire' },
    { value: 'Camionnette', label: '🚗 Camionnette' }
  ];
  
  const selectedValues = postData?.typeVehicule || [];
  const selectedOptions = vehicules.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'typeVehicule', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de véhicule</label>
      <Select
        isMulti
        name="typeVehicule"
        options={vehicules}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les véhicules..."
      />
    </div>
  );
};

const ServiceInclusField = ({ postData, handleChangeInput }) => {
  const services = [
    { value: 'Emballage', label: '📦 Emballage' },
    { value: 'Montage/Démontage', label: '🔧 Montage/Démontage' },
    { value: 'Assurance', label: '🛡️ Assurance' },
    { value: 'Main d\'œuvre', label: '👷 Main d\'œuvre' }
  ];
  
  const selectedValues = postData?.serviceInclus || [];
  const selectedOptions = services.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'serviceInclus', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Services inclus</label>
      <Select
        isMulti
        name="serviceInclus"
        options={services}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les services inclus..."
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL INTELIGENTE
// ============================================

const ServicesFields = (props) => {
  const { step, subCategory } = props;
  
  // Campos comunes para todos los servicios
  const commonComponents = {
    'zoneIntervention': <ZoneInterventionField {...props} />,
    'disponibilite': <DisponibiliteField {...props} />
  };
  
  // Campos específicos según la subcategoría
  const getSpecificComponents = () => {
    switch (subCategory) {
      // Hôtellerie, Restauration & Salles (salles de fêtes)
      case 'hotellerie-restauration-salles':
        return {
          'capacite': <CapaciteField {...props} />,
          'superficieSalle': <SuperficieSalleField {...props} />,
          'equipementsSalle': <EquipementsSalleField {...props} />,
          'formules': <FormulesField {...props} />,
          'tarif': <TarifField {...props} />
        };
      
      // Traiteurs & Gateaux
      case 'traiteurs-gateaux':
        return {
          'typeCuisine': <TypeCuisineField {...props} />,
          'nombrePersonnesMax': <NombrePersonnesMaxField {...props} />,
          'tarif': <TarifField {...props} />
        };
      
      // Transport et déménagement
      case 'transport-demenagement':
        return {
          'typeVehicule': <TypeVehiculeField {...props} />,
          'serviceInclus': <ServiceInclusField {...props} />,
          'zoneIntervention': <ZoneInterventionField {...props} />
        };
      
      // Construction & Travaux / Réparation (necesitan experiencia y diplomas)
      case 'construction-travaux':
      case 'reparation-auto-diagnostic':
      case 'reparation-electromenager':
      case 'reparation-electronique':
      case 'flashage-reparation-telephones':
      case 'maintenance-informatique':
        return {
          'experience': <ExperienceField {...props} />,
          'diplomes': <DiplomesField {...props} />
        };
      
      // Médecine & Santé / Esthétique & Beauté / Ecoles & Formations
      case 'medecine-sante':
      case 'esthetique-beaute':
      case 'ecoles-formations':
        return {
          'diplomes': <DiplomesField {...props} />,
          'experience': <ExperienceField {...props} />
        };
      
      // Cas por defecto: solo campos comunes
      default:
        return {};
    }
  };
  
  // Combinar campos comunes + específicos
  const customComponents = {
    ...commonComponents,
    ...getSpecificComponents()
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

export default ServicesFields;