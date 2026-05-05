// 📂 components/CATEGORIES/specificFields/VoyagesFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS PARA VOYAGES
// ============================================

// Destination LOCALE (Algérie)
const DestinationLocaleField = ({ postData, handleChangeInput }) => {
  const destinations = [
    // Grandes villes
    { value: 'Alger', label: '🇩🇿 Alger' },
    { value: 'Oran', label: '🇩🇿 Oran' },
    { value: 'Constantine', label: '🇩🇿 Constantine' },
    { value: 'Annaba', label: '🇩🇿 Annaba' },
    { value: 'Tlemcen', label: '🇩🇿 Tlemcen' },
    { value: 'Sétif', label: '🇩🇿 Sétif' },
    { value: 'Béjaïa', label: '🇩🇿 Béjaïa' },
    { value: 'Mostaganem', label: '🇩🇿 Mostaganem' },
    { value: 'Blida', label: '🇩🇿 Blida' },
    { value: 'Boumerdès', label: '🇩🇿 Boumerdès' },
    { value: 'Tipaza', label: '🇩🇿 Tipaza' },
    { value: 'Chlef', label: '🇩🇿 Chlef' },
    { value: 'Médéa', label: '🇩🇿 Médéa' },
    { value: 'Tizi Ouzou', label: '🇩🇿 Tizi Ouzou' },
    { value: 'Batna', label: '🇩🇿 Batna' },
    { value: 'Biskra', label: '🇩🇿 Biskra' },
    { value: 'Djelfa', label: '🇩🇿 Djelfa' },
    { value: 'Souk Ahras', label: '🇩🇿 Souk Ahras' },
    { value: 'Skikda', label: '🇩🇿 Skikda' },
    { value: 'Mila', label: '🇩🇿 Mila' },
    
    // Désert & Sud
    { value: 'Tamanrasset', label: '🏜️ Tamanrasset (Ahaggar)' },
    { value: 'Djanet', label: '🏜️ Djanet (Tassili)' },
    { value: 'Illizi', label: '🏜️ Illizi' },
    { value: 'Ghardaïa', label: '🏛️ Ghardaïa (M\'zab)' },
    { value: 'Timimoun', label: '🏜️ Timimoun' },
    { value: 'Adrar', label: '🏜️ Adrar' },
    { value: 'Béchar', label: '🏜️ Béchar' },
    { value: 'Tindouf', label: '🏜️ Tindouf' },
    { value: 'El Oued', label: '🏜️ El Oued' },
    { value: 'Touggourt', label: '🏜️ Touggourt' },
    { value: 'Ouargla', label: '🏜️ Ouargla' },
    { value: 'Hassi Messaoud', label: '🛢️ Hassi Messaoud' },
    { value: 'In Salah', label: '🏜️ In Salah' },
    { value: 'In Guezzam', label: '🏜️ In Guezzam' },
    { value: 'Bordj Badji Mokhtar', label: '🏜️ Bordj Badji Mokhtar' },
    
    // Sites historiques & romains
    { value: 'Djemila', label: '🏛️ Djemila (Cuicul)' },
    { value: 'Timgad', label: '🏛️ Timgad (Thamugadi)' },
    { value: 'Tipaza', label: '🏛️ Tipaza (Site romain)' },
    { value: 'Tiddis', label: '🏛️ Tiddis' },
    { value: 'Lambaesis', label: '🏛️ Lambaesis' },
    { value: 'Calama', label: '🏛️ Calama (Guelma)' },
    { value: 'Hippone', label: '🏛️ Hippone (Annaba)' },
    { value: 'Cherchell', label: '🏛️ Cherchell (Césarée)' },
    
    // Côtiers & plages
    { value: 'El Kala', label: '🏖️ El Kala' },
    { value: 'Collo', label: '🏖️ Collo' },
    { value: 'Jijel', label: '🏖️ Jijel' },
    { value: 'Azeffoun', label: '🏖️ Azeffoun' },
    { value: 'Zéralda', label: '🏖️ Zéralda' },
    { value: 'Sidi Fredj', label: '🏖️ Sidi Fredj' },
    { value: 'Ténès', label: '🏖️ Ténès' },
    { value: 'Marsa Ben M\'hidi', label: '🏖️ Marsa Ben M\'hidi' },
    
    // Montagnes & forêts
    { value: 'Chréa', label: '🏔️ Chréa (Blida)' },
    { value: 'Tikjda', label: '🏔️ Tikjda (Béjaïa)' },
    { value: 'Theniet El Had', label: '🏔️ Theniet El Had' },
    { value: 'Gouraya', label: '🏔️ Gouraya (Béjaïa)' },
    { value: 'Tala Guilef', label: '🏔️ Tala Guilef (Tizi Ouzou)' },
    { value: 'Lalla Khedidja', label: '🏔️ Lalla Khedidja (Tizi Ouzou)' },
    
    // Sources thermales
    { value: 'Hammam Bou Hadjar', label: '♨️ Hammam Bou Hadjar' },
    { value: 'Hammam Righa', label: '♨️ Hammam Righa' },
    { value: 'Hammam Melouane', label: '♨️ Hammam Melouane' },
    { value: 'Guelma', label: '♨️ Guelma (Hammam Debagh)' },
    { value: 'Bou Hanifia', label: '♨️ Bou Hanifia' },
    
    // Autres
    { value: 'Tassili n\'Ajjer', label: '🏜️ Tassili n\'Ajjer' },
    { value: 'M\'zab', label: '🏛️ Vallée du M\'zab' },
    { value: 'Beni Abbes', label: '🏜️ Beni Abbes' },
    { value: 'Taghit', label: '🏜️ Taghit' },
    { value: 'Béni Abbès', label: '🏜️ Béni Abbès' },
    { value: 'Autre', label: '📍 Autre destination' }
  ];
  
  const selectedOption = destinations.find(opt => opt.value === postData?.destination) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'destination', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Destination</label>
      <Select
        name="destination"
        options={destinations}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la destination..."
        isClearable
      />
    </div>
  );
};

// Destination INTERNATIONALE
const DestinationInternationaleField = ({ postData, handleChangeInput }) => {
  const destinations = [
    { value: 'Paris', label: '🇫🇷 Paris' },
    { value: 'Nice', label: '🇫🇷 Nice' },
    { value: 'Lyon', label: '🇫🇷 Lyon' },
    { value: 'Marseille', label: '🇫🇷 Marseille' },
    { value: 'Istanbul', label: '🇹🇷 Istanbul' },
    { value: 'Antalya', label: '🇹🇷 Antalya' },
    { value: 'Dubaï', label: '🇦🇪 Dubaï' },
    { value: 'Barcelone', label: '🇪🇸 Barcelone' },
    { value: 'Madrid', label: '🇪🇸 Madrid' },
    { value: 'Rome', label: '🇮🇹 Rome' },
    { value: 'Milan', label: '🇮🇹 Milan' },
    { value: 'Londres', label: '🇬🇧 Londres' },
    { value: 'Tunis', label: '🇹🇳 Tunis' },
    { value: 'Djerba', label: '🇹🇳 Djerba' },
    { value: 'Marrakech', label: '🇲🇦 Marrakech' },
    { value: 'Casablanca', label: '🇲🇦 Casablanca' },
    { value: 'Le Caire', label: '🇪🇬 Le Caire' },
    { value: 'Bangkok', label: '🇹🇭 Bangkok' },
    { value: 'Kuala Lumpur', label: '🇲🇾 Kuala Lumpur' },
    { value: 'Tokyo', label: '🇯🇵 Tokyo' },
    { value: 'New York', label: '🇺🇸 New York' },
    { value: 'Montréal', label: '🇨🇦 Montréal' },
    { value: 'Autre', label: '🌍 Autre destination' }
  ];
  
  const selectedOption = destinations.find(opt => opt.value === postData?.destination) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'destination', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Destination</label>
      <Select
        name="destination"
        options={destinations}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la destination..."
        isClearable
      />
    </div>
  );
};

// Destination HAJJ & OMRA (Arabie Saoudite)
const DestinationArabieField = ({ postData, handleChangeInput }) => {
  const destinations = [
    { value: 'Makkah', label: '🕋 Makkah' },
    { value: 'Madinah', label: '🕌 Madinah' },
    { value: 'Jeddah', label: '✈️ Jeddah' },
    { value: 'Riyad', label: '🏛️ Riyad' },
    { value: 'Arafat', label: '🏔️ Mont Arafat' },
    { value: 'Mina', label: '🏕️ Mina' },
    { value: 'Muzdalifah', label: '🌙 Muzdalifah' },
    { value: 'Badr', label: '⚔️ Badr' },
    { value: 'Khaybar', label: '🏰 Khaybar' },
    { value: 'Taïf', label: '🌹 Taïf' },
    { value: 'Yanbu', label: '🏖️ Yanbu' },
    { value: 'AlUla', label: '🏛️ AlUla' },
    { value: 'Dhahran', label: '🛢️ Dhahran' },
    { value: 'Dammam', label: '🏙️ Dammam' },
    { value: 'Abha', label: '🏔️ Abha' },
    { value: 'Khamis Mushait', label: '🏔️ Khamis Mushait' },
    { value: 'Najran', label: '🏛️ Najran' },
    { value: 'Hail', label: '🏜️ Hail' },
    { value: 'Jizan', label: '🏖️ Jizan' },
    { value: 'Tabuk', label: '🏔️ Tabuk' },
    { value: 'AlQassim', label: '🌾 Al Qassim' }
  ];
  
  
  const selectedOption = destinations.find(opt => opt.value === postData?.destination) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'destination', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Destination</label>
      <Select
        name="destination"
        options={destinations}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la destination..."
        isClearable
      />
    </div>
  );
};

// Durée
const DureeField = ({ postData, handleChangeInput }) => {
  const durees = [
    { value: '1 jour', label: '1 jour' },
    { value: '2 jours', label: '2 jours' },
    { value: '3 jours', label: '3 jours' },
    { value: '4 jours', label: '4 jours' },
    { value: '5 jours', label: '5 jours' },
    { value: '6 jours', label: '6 jours' },
    { value: '7 jours (1 semaine)', label: '7 jours (1 semaine)' },
    { value: '10 jours', label: '10 jours' },
    { value: '14 jours (2 semaines)', label: '14 jours (2 semaines)' },
    { value: '21 jours (3 semaines)', label: '21 jours (3 semaines)' },
    { value: '1 mois', label: '1 mois' }
  ];
  
  const selectedOption = durees.find(opt => opt.value === postData?.duree) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'duree', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Durée</label>
      <Select
        name="duree"
        options={durees}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la durée..."
        isClearable
      />
    </div>
  );
};

// Date départ
const DateDepartField = ({ postData, handleChangeInput }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de départ</label>
      <input
        type="date"
        name="dateDepart"
        className="form-control"
        min={today}
        value={postData?.dateDepart || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Date retour
const DateRetourField = ({ postData, handleChangeInput }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de retour</label>
      <input
        type="date"
        name="dateRetour"
        className="form-control"
        min={today}
        value={postData?.dateRetour || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre de personnes
const NombrePersonnesField = ({ postData, handleChangeInput }) => {
  const personnes = [
    { value: '1', label: '1 personne' },
    { value: '2', label: '2 personnes' },
    { value: '3', label: '3 personnes' },
    { value: '4', label: '4 personnes' },
    { value: '5', label: '5 personnes' },
    { value: '6', label: '6 personnes' },
    { value: '7+', label: '7 personnes ou plus' }
  ];
  
  const selectedOption = personnes.find(opt => opt.value === postData?.nombrePersonnes) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'nombrePersonnes', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de personnes</label>
      <Select
        name="nombrePersonnes"
        options={personnes}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le nombre..."
        isClearable
      />
    </div>
  );
};

// Transport
const TransportField = ({ postData, handleChangeInput }) => {
  const transports = [
    { value: 'Avion', label: '✈️ Avion' },
    { value: 'Bus', label: '🚌 Bus' },
    { value: 'Train', label: '🚂 Train' },
    { value: 'Voiture', label: '🚗 Voiture' },
    { value: 'Bateau', label: '⛴️ Bateau' },
    { value: 'Mixte', label: '🔄 Mixte' }
  ];
  
  const selectedOption = transports.find(opt => opt.value === postData?.transport) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'transport', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Transport</label>
      <Select
        name="transport"
        options={transports}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le transport..."
        isClearable
      />
    </div>
  );
};

// Hébergement
const HebergementField = ({ postData, handleChangeInput }) => {
  const hebergements = [
    { value: 'Hôtel 1*', label: '⭐ Hôtel 1*' },
    { value: 'Hôtel 2*', label: '⭐⭐ Hôtel 2*' },
    { value: 'Hôtel 3*', label: '⭐⭐⭐ Hôtel 3*' },
    { value: 'Hôtel 4*', label: '⭐⭐⭐⭐ Hôtel 4*' },
    { value: 'Hôtel 5*', label: '⭐⭐⭐⭐⭐ Hôtel 5*' },
    { value: 'Appartement', label: '🏢 Appartement' },
    { value: 'Villa', label: '🏡 Villa' },
    { value: 'Riad', label: '🕌 Riad' },
    { value: 'Chalet', label: '🏔️ Chalet' },
    { value: 'Camping', label: '🏕️ Camping' },
    { value: 'Non inclus', label: '❌ Non inclus' }
  ];
  
  const selectedOption = hebergements.find(opt => opt.value === postData?.hebergement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'hebergement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hébergement</label>
      <Select
        name="hebergement"
        options={hebergements}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'hébergement..."
        isClearable
      />
    </div>
  );
};

// Activités incluses
const ActivitesInclusesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Activités incluses</label>
      <textarea
        name="activitesIncluses"
        className="form-control"
        rows="3"
        placeholder="Visites guidées, excursions, repas..."
        value={postData?.activitesIncluses || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Prix par personne
const PrixParPersonneField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Prix par personne</label>
      <div className="input-group">
        <span className="input-group-text">💰</span>
        <input
          type="number"
          name="prixParPersonne"
          className="form-control"
          placeholder="Prix"
          value={postData?.prixParPersonne || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">DA</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS PARA LOCATION VACANCES
// ============================================

const TypeHebergementField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Appartement', label: '🏢 Appartement' },
    { value: 'Villa', label: '🏡 Villa' },
    { value: 'Maison', label: '🏠 Maison' },
    { value: 'Studio', label: '🏠 Studio' },
    { value: 'Riad', label: '🕌 Riad' },
    { value: 'Chalet', label: '🏔️ Chalet' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeHebergement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeHebergement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'hébergement</label>
      <Select
        name="typeHebergement"
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

const CapaciteHebergementField = ({ postData, handleChangeInput }) => {
  const capacites = [
    { value: '1', label: '1 personne' },
    { value: '2', label: '2 personnes' },
    { value: '3', label: '3 personnes' },
    { value: '4', label: '4 personnes' },
    { value: '5', label: '5 personnes' },
    { value: '6', label: '6 personnes' },
    { value: '7', label: '7 personnes' },
    { value: '8+', label: '8 personnes ou plus' }
  ];
  
  const selectedOption = capacites.find(opt => opt.value === postData?.capacite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'capacite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité (personnes)</label>
      <Select
        name="capacite"
        options={capacites}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la capacité..."
        isClearable
      />
    </div>
  );
};

const EquipementsHebergementField = ({ postData, handleChangeInput }) => {
  const equipementsList = [
    { value: 'WiFi', label: '📶 WiFi' },
    { value: 'Piscine', label: '🏊 Piscine' },
    { value: 'Climatisation', label: '❄️ Climatisation' },
    { value: 'Chauffage', label: '🔥 Chauffage' },
    { value: 'Parking', label: '🅿️ Parking' },
    { value: 'Cuisine équipée', label: '🍳 Cuisine équipée' },
    { value: 'Lave-linge', label: '🧺 Lave-linge' },
    { value: 'Télévision', label: '📺 Télévision' },
    { value: 'Balcon', label: '🏠 Balcon' },
    { value: 'Jardin', label: '🌳 Jardin' },
    { value: 'Terrasse', label: '🏠 Terrasse' },
    { value: 'Barbecue', label: '🔥 Barbecue' }
  ];
  
  const selectedValues = postData?.equipements || [];
  const selectedOptions = equipementsList.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'equipements', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Équipements</label>
      <Select
        isMulti
        name="equipements"
        options={equipementsList}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les équipements..."
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA HAJJ & OMRA
// ============================================

const TypePelerinageField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Hajj', label: '🕋 Hajj' },
    { value: 'Omra', label: '🕋 Omra' },
    { value: 'Hajj + Omra', label: '🕋 Hajj + Omra' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typePelerinage) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typePelerinage', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de pèlerinage</label>
      <Select
        name="typePelerinage"
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

const HotelMakkahField = ({ postData, handleChangeInput }) => {
  const hotels = [
    { value: 'Hôtel 3*', label: '⭐⭐⭐ Hôtel 3*' },
    { value: 'Hôtel 4*', label: '⭐⭐⭐⭐ Hôtel 4*' },
    { value: 'Hôtel 5*', label: '⭐⭐⭐⭐⭐ Hôtel 5*' },
    { value: 'Appartement', label: '🏢 Appartement' }
  ];
  
  const selectedOption = hotels.find(opt => opt.value === postData?.hotelMakkah) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'hotelMakkah', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Makkah</label>
      <Select
        name="hotelMakkah"
        options={hotels}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'hôtel..."
        isClearable
      />
    </div>
  );
};

const HotelMadinahField = ({ postData, handleChangeInput }) => {
  const hotels = [
    { value: 'Hôtel 3*', label: '⭐⭐⭐ Hôtel 3*' },
    { value: 'Hôtel 4*', label: '⭐⭐⭐⭐ Hôtel 4*' },
    { value: 'Hôtel 5*', label: '⭐⭐⭐⭐⭐ Hôtel 5*' },
    { value: 'Appartement', label: '🏢 Appartement' }
  ];
  
  const selectedOption = hotels.find(opt => opt.value === postData?.hotelMadinah) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'hotelMadinah', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Madinah</label>
      <Select
        name="hotelMadinah"
        options={hotels}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'hôtel..."
        isClearable
      />
    </div>
  );
};

const VolsInclusField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Aller-retour inclus', label: '✈️ Aller-retour inclus' },
    { value: 'Vols non inclus', label: '❌ Vols non inclus' },
    { value: 'Optionnel', label: '🔘 Optionnel' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.volsInclus) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'volsInclus', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vols inclus</label>
      <Select
        name="volsInclus"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

const VisaField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Visa inclus', label: '✅ Visa inclus' },
    { value: 'Visa non inclus', label: '❌ Visa non inclus' },
    { value: 'Assistance visa', label: '🛂 Assistance visa' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.visa) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'visa', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Visa</label>
      <Select
        name="visa"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL INTELIGENTE
// ============================================

const VoyagesFields = (props) => {
  const { step, subCategory } = props;
  
  // Campos comunes para todos los viajes
  const commonComponents = {
    'duree': <DureeField {...props} />,
    'dateDepart': <DateDepartField {...props} />,
    'dateRetour': <DateRetourField {...props} />,
    'nombrePersonnes': <NombrePersonnesField {...props} />,
    'transport': <TransportField {...props} />,
    'hebergement': <HebergementField {...props} />,
    'activitesIncluses': <ActivitesInclusesField {...props} />,
    'prixParPersonne': <PrixParPersonneField {...props} />
  };
  
  // Campos según subcategoría
  const getSpecificComponents = () => {
    switch (subCategory) {
      case 'voyage-organise':
        return {
          'destination': <DestinationInternationaleField {...props} />,
          ...commonComponents
        };
      
      case 'location-vacances-voyages':
        return {
          'destination': <DestinationLocaleField {...props} />,
          'typeHebergement': <TypeHebergementField {...props} />,
          'capacite': <CapaciteHebergementField {...props} />,
          'equipements': <EquipementsHebergementField {...props} />
        };
      
      case 'hajj-omra':
        return {
          'destination': <DestinationArabieField {...props} />,
          'typePelerinage': <TypePelerinageField {...props} />,
          'hotelMakkah': <HotelMakkahField {...props} />,
          'hotelMadinah': <HotelMadinahField {...props} />,
          'volsInclus': <VolsInclusField {...props} />,
          ...commonComponents
        };
      
      case 'reservations-visa':
        return {
          'destination': <DestinationInternationaleField {...props} />,
          'compagnie': <VolsInclusField {...props} />,
          'visa': <VisaField {...props} />
        };
      
      case 'sejour':
        return {
          'destination': <DestinationInternationaleField {...props} />,
          ...commonComponents
        };
      
      case 'croisiere':
        return {
          'destination': <DestinationInternationaleField {...props} />,
          'nomBateau': <VolsInclusField {...props} />,
          'cabine': <HebergementField {...props} />,
          ...commonComponents
        };
      
      case 'autre-voyages':
      default:
        return {
          'destination': <DestinationInternationaleField {...props} />,
          ...commonComponents
        };
    }
  };
  
  const customComponents = getSpecificComponents();
  
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

export default VoyagesFields;