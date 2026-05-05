// 📂 components/CATEGORIES/specificFields/LoisirsFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA LOISIRS
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Sony', label: 'Sony' },
    { value: 'Microsoft', label: 'Microsoft' },
    { value: 'Nintendo', label: 'Nintendo' },
    { value: 'Sega', label: 'Sega' },
    { value: 'PlayStation', label: 'PlayStation' },
    { value: 'Xbox', label: 'Xbox' },
    { value: 'Yamaha', label: 'Yamaha' },
    { value: 'Fender', label: 'Fender' },
    { value: 'Gibson', label: 'Gibson' },
    { value: 'Casio', label: 'Casio' },
    { value: 'Roland', label: 'Roland' },
    { value: 'Weber', label: 'Weber' },
    { value: 'Napoleon', label: 'Napoleon' },
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
        placeholder="Ex: PlayStation 5, Xbox Series X, Nintendo Switch..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA JEUX VIDÉO & CONSOLES
// ============================================

// Type de console
const TypeConsoleField = ({ postData, handleChangeInput }) => {
  const consoles = [
    { value: 'PlayStation 4', label: 'PlayStation 4' },
    { value: 'PlayStation 5', label: 'PlayStation 5' },
    { value: 'Xbox One', label: 'Xbox One' },
    { value: 'Xbox Series X', label: 'Xbox Series X' },
    { value: 'Xbox Series S', label: 'Xbox Series S' },
    { value: 'Nintendo Switch', label: 'Nintendo Switch' },
    { value: 'Nintendo 3DS', label: 'Nintendo 3DS' },
    { value: 'PC Gaming', label: 'PC Gaming' }
  ];
  
  const selectedOption = consoles.find(opt => opt.value === postData?.typeConsole) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeConsole', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de console</label>
      <Select
        name="typeConsole"
        options={consoles}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la console..."
        isClearable
      />
    </div>
  );
};

// Genre de jeu
const GenreJeuField = ({ postData, handleChangeInput }) => {
  const genres = [
    { value: 'Action', label: '🎮 Action' },
    { value: 'Aventure', label: '🗺️ Aventure' },
    { value: 'RPG', label: '⚔️ RPG' },
    { value: 'FPS', label: '🔫 FPS' },
    { value: 'Sport', label: '⚽ Sport' },
    { value: 'Course', label: '🏎️ Course' },
    { value: 'Stratégie', label: '♟️ Stratégie' },
    { value: 'Simulation', label: '🎯 Simulation' },
    { value: 'Horreur', label: '👻 Horreur' },
    { value: 'Éducatif', label: '📚 Éducatif' }
  ];
  
  const selectedValues = postData?.genreJeu || [];
  const selectedOptions = genres.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'genreJeu', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Genre du jeu</label>
      <Select
        isMulti
        name="genreJeu"
        options={genres}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les genres..."
      />
      <small className="text-muted">Vous pouvez sélectionner plusieurs genres</small>
    </div>
  );
};

// ============================================
// CAMPOS POUR INSTRUMENTS DE MUSIQUE
// ============================================

// Type d'instrument
const TypeInstrumentField = ({ postData, handleChangeInput }) => {
  const instruments = [
    { value: 'Guitare électrique', label: '🎸 Guitare électrique' },
    { value: 'Guitare acoustique', label: '🎸 Guitare acoustique' },
    { value: 'Basse', label: '🎸 Basse' },
    { value: 'Piano', label: '🎹 Piano' },
    { value: 'Clavier', label: '🎹 Clavier' },
    { value: 'Batterie', label: '🥁 Batterie' },
    { value: 'Violon', label: '🎻 Violon' },
    { value: 'Flûte', label: '🎵 Flûte' },
    { value: 'Saxophone', label: '🎷 Saxophone' },
    { value: 'Trompette', label: '🎺 Trompette' },
    { value: 'Microphone', label: '🎤 Microphone' },
    { value: 'Amplificateur', label: '🔊 Amplificateur' }
  ];
  
  const selectedOption = instruments.find(opt => opt.value === postData?.typeInstrument) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeInstrument', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'instrument</label>
      <Select
        name="typeInstrument"
        options={instruments}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'instrument..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR LIVRES
// ============================================

// Auteur
const AuteurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Auteur</label>
      <input
        type="text"
        name="auteur"
        className="form-control"
        placeholder="Nom de l'auteur"
        value={postData?.auteur || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Genre littéraire
const GenreLitteraireField = ({ postData, handleChangeInput }) => {
  const genres = [
    { value: 'Roman', label: '📖 Roman' },
    { value: 'Policier', label: '🔍 Policier' },
    { value: 'Science-fiction', label: '🚀 Science-fiction' },
    { value: 'Fantasy', label: '🐉 Fantasy' },
    { value: 'Romance', label: '💕 Romance' },
    { value: 'Biographie', label: '👤 Biographie' },
    { value: 'Histoire', label: '📜 Histoire' },
    { value: 'Philosophie', label: '💭 Philosophie' },
    { value: 'Développement personnel', label: '🌟 Développement personnel' },
    { value: 'Cuisine', label: '🍳 Cuisine' }
  ];
  
  const selectedOption = genres.find(opt => opt.value === postData?.genreLitteraire) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'genreLitteraire', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Genre littéraire</label>
      <Select
        name="genreLitteraire"
        options={genres}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le genre..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR JARDINAGE & BARBECUE
// ============================================

// Type de produit
const TypeProduitLoisirField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Tondeuse', label: '🌿 Tondeuse' },
    { value: 'Taille-haie', label: '✂️ Taille-haie' },
    { value: 'Tronçonneuse', label: '🪓 Tronçonneuse' },
    { value: 'Barbecue à charbon', label: '🔥 Barbecue à charbon' },
    { value: 'Barbecue à gaz', label: '🔥 Barbecue à gaz' },
    { value: 'Barbecue électrique', label: '⚡ Barbecue électrique' },
    { value: 'Plancha', label: '🍳 Plancha' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeProduitLoisir) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeProduitLoisir', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <Select
        name="typeProduitLoisir"
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

// ============================================
// CAMPOS POUR ANIMALERIE
// ============================================

// Type d'animal
const TypeAnimalField = ({ postData, handleChangeInput }) => {
  const animaux = [
    { value: 'Chien', label: '🐕 Chien' },
    { value: 'Chat', label: '🐈 Chat' },
    { value: 'Oiseau', label: '🐦 Oiseau' },
    { value: 'Poisson', label: '🐟 Poisson' },
    { value: 'Rongeur', label: '🐭 Rongeur' },
    { value: 'Cheval', label: '🐎 Cheval' },
    { value: 'Ferme', label: '🐮 Animaux de ferme' }
  ];
  
  const selectedOption = animaux.find(opt => opt.value === postData?.typeAnimal) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeAnimal', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'animal</label>
      <Select
        name="typeAnimal"
        options={animaux}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'animal..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const LoisirsFields = (props) => {
  const { step } = props;
  
  // SOLO campos específicos (sin title, description, etat)
  const customComponents = {
    // Marque al principio
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    
    // Campos para jeux vidéo & consoles
    'typeConsole': <TypeConsoleField {...props} />,
    'genreJeu': <GenreJeuField {...props} />,
    
    // Campos para instruments de musique
    'typeInstrument': <TypeInstrumentField {...props} />,
    
    // Campos para livres
    'auteur': <AuteurField {...props} />,
    'genreLitteraire': <GenreLitteraireField {...props} />,
    
    // Campos para jardinage & barbecue
    'typeProduitLoisir': <TypeProduitLoisirField {...props} />,
    
    // Campos para animalerie
    'typeAnimal': <TypeAnimalField {...props} />
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

export default LoisirsFields;