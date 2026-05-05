// 📂 components/CATEGORIES/specificFields/ArtFields.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ========== CAMPOS ESPECÍFICOS ==========
const StyleField = ({ postData, handleChangeInput }) => {
  const styles = ['Hyperréalisme', 'Réalisme', 'Abstrait', 'Impressionnisme', 'Expressionnisme', 'Cubisme', 'Surréalisme', 'Pop art', 'Minimalisme', 'Art conceptuel', 'Art brut', 'Art naïf', 'Fauvisme', 'Pointillisme', 'Rococo', 'Baroque', 'Renaissance', 'Moderne', 'Contemporain', 'Street art', 'Figuratif', 'Lyrique', 'Géométrique', 'Autre'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Style</label>
      <select name="style" className="form-control" value={postData?.style || ''} onChange={handleChangeInput}>
        <option value="">Sélectionner le style</option>
        {styles.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

const ThemeField = ({ postData, handleChangeInput }) => {
  const themes = ['Animaux', 'Paysage', 'Portrait', 'Nature morte', 'Abstrait', 'Marine', 'Ville / Urbain', 'Architecture', 'Fleurs / Jardin', 'Corps humain / Nu', 'Mythologie', 'Religion / Spiritualité', 'Guerre / Histoire', 'Politique / Société', 'Rêve / Fantastique', 'Science-fiction', 'Musique / Danse', 'Sport', 'Érotisme', 'Famille / Enfance', 'Voyage', 'Nourriture', 'Technologie', 'Écologie / Nature', 'Autre'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Thème</label>
      <select name="theme" className="form-control" value={postData?.theme || ''} onChange={handleChangeInput}>
        <option value="">Sélectionner le thème</option>
        {themes.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
};

const LicenceField = ({ postData, handleChangeInput }) => {
  const licences = ['Tous droits réservés', 'Creative Commons - Attribution (CC BY)', 'Creative Commons - Attribution - Partage dans les mêmes conditions (CC BY-SA)', 'Creative Commons - Attribution - Pas d\'utilisation commerciale (CC BY-NC)', 'Creative Commons - Attribution - Pas de modification (CC BY-ND)', 'Creative Commons - Attribution - Pas d\'utilisation commerciale - Partage dans les mêmes conditions (CC BY-NC-SA)', 'Creative Commons - Attribution - Pas d\'utilisation commerciale - Pas de modification (CC BY-NC-ND)', 'Domaine public', 'Licence libre (Open source)', 'Licence personnalisée - Contacter l\'artiste'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Droits d'auteur</label>
      <select name="licence" className="form-control" value={postData?.licence || ''} onChange={handleChangeInput}>
        <option value="">Choisissez une licence d'utilisation</option>
        {licences.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
};

const HauteurField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Hauteur</label>
    <div className="input-group">
      <input type="number" name="hauteur" className="form-control" placeholder="Hauteur" value={postData?.hauteur || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">cm</span>
    </div>
  </div>
);

const LargeurField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Largeur</label>
    <div className="input-group">
      <input type="number" name="largeur" className="form-control" placeholder="Largeur" value={postData?.largeur || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">cm</span>
    </div>
  </div>
);

const ProfondeurField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Profondeur</label>
    <div className="input-group">
      <input type="number" name="profondeur" className="form-control" placeholder="Profondeur" value={postData?.profondeur || ''} onChange={handleChangeInput} step="0.1" />
      <span className="input-group-text">cm</span>
    </div>
  </div>
);

const UniteMesureField = ({ postData, handleChangeInput }) => {
  const unites = ['cm', 'mm', 'm', 'pouces (in)', 'pieds (ft)'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Unité de mesure</label>
      <select name="uniteMesure" className="form-control" value={postData?.uniteMesure || ''} onChange={handleChangeInput}>
        <option value="">Choisissez une unité</option>
        {unites.map(u => <option key={u} value={u}>{u}</option>)}
      </select>
    </div>
  );
};

const SupportField = ({ postData, handleChangeInput }) => {
  const supports = ['Toile', 'Papier', 'Bois', 'Métal', 'Verre', 'Plexiglas', 'Carton', 'Panneau de fibres (MDF)', 'Marbre', 'Pierre', 'Argile', 'Résine', 'Plâtre', 'Textile', 'Murale', 'Numérique (écran)', 'Autre'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Support</label>
      <select name="support" className="form-control" value={postData?.support || ''} onChange={handleChangeInput}>
        <option value="">Choisissez le support</option>
        {supports.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

const AnneeCreationField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 1900; i--) years.push(i);
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Année de création</label>
      <select name="anneeCreation" className="form-control" value={postData?.anneeCreation || ''} onChange={handleChangeInput}>
        <option value="">Sélectionner l'année</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
};

const TechniqueField = ({ postData, handleChangeInput }) => {
  const techniques = ['Au pinceau', 'Au couteau', 'Au chiffon', 'Au rouleau', 'Au spray / aérosol', 'Giclée / Pulvérisation', 'Empâtement', 'Glacis', 'Frottis', 'Sfumato', 'Trompe-l\'œil', 'Collage', 'Assemblage', 'Soudure', 'Moulage', 'Cire perdue', 'Taille directe', 'Gravure manuelle', 'Impression numérique', 'Pixel art', 'Rendu 3D', 'Généré par IA', 'Autre'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Technique</label>
      <select name="technique" className="form-control" value={postData?.technique || ''} onChange={handleChangeInput}>
        <option value="">Sélectionner la technique</option>
        {techniques.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
};

const EtatOeuvreField = ({ postData, handleChangeInput }) => {
  const etats = ['Neuf / Jamais exposé', 'Très bon état', 'Bon état', 'État moyen (restauration mineure nécessaire)', 'Mauvais état (restauration importante)'];
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État de l'œuvre</label>
      <select name="etatOeuvre" className="form-control" value={postData?.etatOeuvre || ''} onChange={handleChangeInput}>
        <option value="">Sélectionner l'état</option>
        {etats.map(e => <option key={e} value={e}>{e}</option>)}
      </select>
    </div>
  );
};

const CertificationField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Certification / Authentification</label>
    <div className="form-check">
      <input type="checkbox" name="certificatAuthenticite" className="form-check-input" checked={postData?.certificatAuthenticite || false} onChange={(e) => handleChangeInput({ target: { name: 'certificatAuthenticite', value: e.target.checked } })} />
      <label className="form-check-label">Certificat d'authenticité inclus</label>
    </div>
    <div className="form-check mt-2">
      <input type="checkbox" name="oeuvreSignee" className="form-check-input" checked={postData?.oeuvreSignee || false} onChange={(e) => handleChangeInput({ target: { name: 'oeuvreSignee', value: e.target.checked } })} />
      <label className="form-check-label">Œuvre signée par l'artiste</label>
    </div>
    <div className="form-check mt-2">
      <input type="checkbox" name="oeuvreNumerotee" className="form-check-input" checked={postData?.oeuvreNumerotee || false} onChange={(e) => handleChangeInput({ target: { name: 'oeuvreNumerotee', value: e.target.checked } })} />
      <label className="form-check-label">Œuvre numérotée (édition limitée)</label>
    </div>
  </div>
);

const EncadrementField = ({ postData, handleChangeInput }) => (
  <div className="mb-3">
    <label className="form-label fw-bold">Encadrement</label>
    <select name="encadrement" className="form-control" value={postData?.encadrement || ''} onChange={handleChangeInput}>
      <option value="">Sélectionner</option>
      <option value="sans_encadrement">Sans encadrement</option>
      <option value="encadre_simple">Encadré (cadre simple)</option>
      <option value="encadre_luxe">Encadré (cadre de luxe / musée)</option>
      <option value="passe_partout">Avec passe-partout</option>
      <option value="chassis">Sur châssis</option>
    </select>
  </div>
);

// ========== COMPONENTE PRINCIPAL ==========
const ArtFields = (props) => {
  const { step, mainCategory, subCategory } = props;
  const customComponents = {
    'style': <StyleField {...props} />,
    'theme': <ThemeField {...props} />,
    'licence': <LicenceField {...props} />,
    'hauteur': <HauteurField {...props} />,
    'largeur': <LargeurField {...props} />,
    'profondeur': <ProfondeurField {...props} />,
    'uniteMesure': <UniteMesureField {...props} />,
    'support': <SupportField {...props} />,
    'anneeCreation': <AnneeCreationField {...props} />,
    'technique': <TechniqueField {...props} />,
    'etatOeuvre': <EtatOeuvreField {...props} />,
    'certificatAuthenticite': <CertificationField {...props} />,
    'oeuvreSignee': <CertificationField {...props} />,
    'oeuvreNumerotee': <CertificationField {...props} />,
    'encadrement': <EncadrementField {...props} />
  };
  const additionalFields = { components: customComponents };
  if (step) {
    return (
      <BaseCategoryField
        {...props}
        step={step}
        mainCategory={mainCategory || 'art'}
        subCategory={subCategory}
        additionalFields={additionalFields}
      />
    );
  }
  return null;
};

export default ArtFields;