// 📂 components/CATEGORIES/GeneracionTitulo.js

/**
 * 📝 GENERADOR AUTOMÁTICO DE TÍTULOS POR CATEGORÍA
 * 
 * Este archivo se encarga de generar títulos descriptivos y consistentes
 * para cada tipo de anuncio según los campos específicos de la categoría.
 * 
 * Uso: generateTitle(categoryData, specificData, commonData)
 */

/**
 * Genera título automático según la categoría y los datos del anuncio
 * 
 * @param {Object} categoryData - { categorie, subCategory, articleType }
 * @param {Object} specificData - Datos específicos de la categoría
 * @param {Object} commonData - Datos comunes (description, etc.)
 * @returns {string} Título generado automáticamente
 */
 export const generateTitle = (categoryData, specificData, commonData) => {
    const { categorie, subCategory, articleType } = categoryData;
    
    console.log('🎨 Generando título para:', { categorie, subCategory, articleType });
    
    // ============ INMOBILIARIO (MEJORADO) ============
    if (categorie === 'immobilier') {
      return generateImmobilierTitle(specificData, articleType);
    }
    
    // ============ VEHÍCULOS ============
    if (categorie === 'vehicules') {
      return generateVehiculeTitle(specificData);
    }
    
    // ============ TELÉPHONES ============
    if (categorie === 'telephone' || categorie === 'telephones') {
      return generateTelephoneTitle(specificData);
    }
    
    // ============ ÉLECTROMÉNAGER ============
    if (categorie === 'electromenager') {
      return generateElectromenagerTitle(specificData);
    }
    
    // ============ INFORMATIQUE ============
    if (categorie === 'informatique') {
      return generateInformatiqueTitle(specificData);
    }
    
    // ============ VÊTEMENTS ============
    if (categorie === 'vetements') {
      return generateVetementsTitle(specificData);
    }
    
    // ============ CHAUSSURES ============
    if (subCategory === 'chaussures_homme' || subCategory === 'chaussures_femme') {
      return generateChaussuresTitle(specificData);
    }
    
    // ============ MEUBLES ============
    if (categorie === 'meubles') {
      return generateMeublesTitle(specificData);
    }
    
    // ============ SERVICES ============
    if (categorie === 'services') {
      return generateServicesTitle(specificData);
    }
    
    // ============ EMPLOI ============
    if (categorie === 'emploi') {
      return generateEmploiTitle(specificData, subCategory);
    }
    
    // ============ SPORT ============
    if (categorie === 'sport') {
      return generateSportTitle(specificData);
    }
    
    // ============ VOYAGES ============
    if (categorie === 'voyages') {
      return generateVoyagesTitle(specificData);
    }
    
    // ============ ALIMENTAIRES ============
    if (categorie === 'alimentaires') {
      return generateAlimentairesTitle(specificData);
    }
    
    // ============ PIÈCES DÉTACHÉES ============
    if (categorie === 'piecesDetachees') {
      return generatePiecesDetacheesTitle(specificData);
    }
    
    // ============ MATÉRIAUX ============
    if (categorie === 'materiaux') {
      return generateMateriauxTitle(specificData);
    }
    
    // ============ LOISIRS ============
    if (categorie === 'loisirs') {
      return generateLoisirsTitle(specificData);
    }
    
    // ============ SANTÉ & BEAUTÉ ============
    if (categorie === 'santebeaute') {
      return generateSanteBeauteTitle(specificData);
    }
    
    // ============ DEFAULT (FALLBACK) ============
    return generateDefaultTitle(categorie, subCategory, articleType, specificData, commonData);
  };
  
  // ============ FUNCIONES ESPECÍFICAS POR CATEGORÍA ============
  
  /**
   * 🏠 GENERADOR DE TÍTULOS PARA INMOBILIARIO
   * Ejemplos:
   * - Vente Appartement F3 Alger 120m²
   * - Location Villa F5 Oran
   * - Vente Terrain 500m² Blida
   */
  function generateImmobilierTitle(specificData, articleType) {
    const {
      operationType = '',
      typeImmobilier = '',
      surface = '',
      pieces = '',
      chambres = '',
      quartier = '',
      wilaya = ''
    } = specificData;
    
    const titleParts = [];
    
    // 1. Tipo de operación (Vente / Location)
    if (operationType) titleParts.push(operationType);
    
    // 2. Tipo de bien
    let typeBien = typeImmobilier || articleType || '';
    if (typeBien === 'appartement') typeBien = 'Appartement';
    if (typeBien === 'villa') typeBien = 'Villa';
    if (typeBien === 'terrain') typeBien = 'Terrain';
    if (typeBien === 'studio') typeBien = 'Studio';
    if (typeBien) titleParts.push(typeBien);
    
    // 3. 🔥 PIEZAS (F1, F2, F3, etc.)
    const hasPieces = pieces && pieces !== '' && pieces !== '0';
    const hasChambres = chambres && chambres !== '' && chambres !== '0';
    
    if (typeBien === 'Appartement' || typeBien === 'Villa') {
      if (hasPieces) {
        // Formatear como F1, F2, F3...
        let pieceNumber = pieces.toString();
        if (!pieceNumber.startsWith('F') && !pieceNumber.startsWith('F')) {
          pieceNumber = `F${pieceNumber}`;
        }
        titleParts.push(pieceNumber);
      } else if (hasChambres) {
        titleParts.push(`F${chambres}`);
      }
    }
    
    // 4. Superficie
    if (surface && surface > 0 && typeBien !== 'Terrain') {
      titleParts.push(`${surface}m²`);
    } else if (surface && surface > 0 && typeBien === 'Terrain') {
      titleParts.push(`${surface}m²`);
    }
    
    // 5. Ubicación
    const location = [];
    if (quartier) location.push(quartier);
    if (wilaya) location.push(wilaya);
    if (location.length > 0) {
      titleParts.push(location.join(' '));
    }
    
    return titleParts.join(' ').trim() || 'Bien immobilier';
  }
  
  /**
   * 🚗 GENERADOR DE TÍTULOS PARA VEHÍCULOS
   * Ejemplos:
   * - Renault Clio 2020 45000 km
   * - Mercedes Classe C 2019
   */
  function generateVehiculeTitle(specificData) {
    const {
      marque = '',
      modele = '',
      annee = '',
      couleur = '',
      kilometrage = ''
    } = specificData;
    
    const titleParts = [];
    
    // Marca y Modelo
    if (marque && modele) {
      titleParts.push(`${marque} ${modele}`);
    } else if (marque) {
      titleParts.push(marque);
    } else if (modele) {
      titleParts.push(modele);
    } else {
      titleParts.push('Véhicule');
    }
    
    // Año
    if (annee) titleParts.push(annee);
    
    // Color
    if (couleur) titleParts.push(couleur);
    
    // Kilometraje
    if (kilometrage && kilometrage > 0) {
      titleParts.push(`${kilometrage.toLocaleString()} km`);
    }
    
    return titleParts.join(' ').trim();
  }
  
  /**
   * 📱 GENERADOR DE TÍTULOS PARA TELÉPHONES
   * Ejemplos:
   * - iPhone 13 Pro 256GB Noir
   * - Samsung Galaxy S23 Ultra 512GB
   */
  function generateTelephoneTitle(specificData) {
    const {
      marque = '',
      modele = '',
      capaciteStockage = '',
      couleur = ''
    } = specificData;
    
    const titleParts = [];
    
    if (marque && modele) {
      titleParts.push(`${marque} ${modele}`);
    } else if (marque) {
      titleParts.push(marque);
    } else if (modele) {
      titleParts.push(modele);
    } else {
      titleParts.push('Téléphone');
    }
    
    if (capaciteStockage) titleParts.push(capaciteStockage);
    if (couleur) titleParts.push(couleur);
    
    return titleParts.join(' ').trim();
  }
  
  /**
   * 🔌 GENERADOR DE TÍTULOS PARA ÉLECTROMÉNAGER
   * Ejemplos:
   * - Réfrigérateur Samsung 450L
   * - Lave-linge LG 8kg
   */
  function generateElectromenagerTitle(specificData) {
    const {
      typeAppareil = '',
      marque = '',
      modele = '',
      capacite = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeAppareil) titleParts.push(typeAppareil);
    if (marque) titleParts.push(marque);
    if (modele) titleParts.push(modele);
    if (capacite) titleParts.push(capacite);
    
    return titleParts.join(' ').trim() || 'Appareil électroménager';
  }
  
  /**
   * 💻 GENERADOR DE TÍTULOS PARA INFORMÁTICA
   * Ejemplos:
   * - Ordinateur Portable Dell XPS 13 i7 16GB
   * - PC Gamer Intel i5 32GB
   */
  function generateInformatiqueTitle(specificData) {
    const {
      typeProduit = '',
      marque = '',
      modele = '',
      processeur = '',
      ram = '',
      stockage = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeProduit) titleParts.push(typeProduit);
    if (marque) titleParts.push(marque);
    if (modele) titleParts.push(modele);
    if (processeur) titleParts.push(processeur);
    if (ram) titleParts.push(`${ram} RAM`);
    if (stockage) titleParts.push(stockage);
    
    return titleParts.join(' ').trim() || 'Matériel informatique';
  }
  
  /**
   * 👕 GENERADOR DE TÍTULOS PARA VÊTEMENTS
   * Ejemplos:
   * - Chemise Homme Taille L Bleu
   * - Robe Femme Taille M Rouge
   */
  function generateVetementsTitle(specificData) {
    const {
      typeVetement = '',
      genre = '',
      taille = '',
      couleur = '',
      marque = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeVetement) titleParts.push(typeVetement);
    if (genre) titleParts.push(genre);
    if (marque) titleParts.push(marque);
    if (taille) titleParts.push(`Taille ${taille}`);
    if (couleur) titleParts.push(couleur);
    
    return titleParts.join(' ').trim() || 'Vêtement';
  }
  
  /**
   * 👟 GENERADOR DE TÍTULOS PARA CHAUSSURES
   */
  function generateChaussuresTitle(specificData) {
    const {
      typeChaussure = '',
      pointure = '',
      couleur = '',
      marque = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeChaussure) titleParts.push(typeChaussure);
    if (marque) titleParts.push(marque);
    if (pointure) titleParts.push(`Pointure ${pointure}`);
    if (couleur) titleParts.push(couleur);
    
    return titleParts.join(' ').trim() || 'Chaussures';
  }
  
  /**
   * 🛋️ GENERADOR DE TÍTULOS PARA MEUBLES
   */
  function generateMeublesTitle(specificData) {
    const {
      typeMeuble = '',
      matiere = '',
      dimensions = '',
      couleur = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeMeuble) titleParts.push(typeMeuble);
    if (matiere) titleParts.push(matiere);
    if (dimensions) titleParts.push(dimensions);
    if (couleur) titleParts.push(couleur);
    
    return titleParts.join(' ').trim() || 'Meuble';
  }
  
  /**
   * 🛠️ GENERADOR DE TÍTULOS PARA SERVICIOS
   */
  function generateServicesTitle(specificData) {
    const {
      typeService = '',
      duree = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeService) titleParts.push(typeService);
    if (duree) titleParts.push(`(${duree})`);
    
    return titleParts.join(' ').trim() || 'Service';
  }
  
  /**
   * 💼 GENERADOR DE TÍTULOS PARA EMPLOI
   */
  function generateEmploiTitle(specificData, subCategory) {
    const {
      poste = '',
      secteur = '',
      typeContrat = ''
    } = specificData;
    
    const titleParts = [];
    
    if (subCategory === 'offres') titleParts.push('Offre d\'emploi');
    else if (subCategory === 'demandes') titleParts.push('Demande d\'emploi');
    else titleParts.push('Emploi');
    
    if (poste) titleParts.push(`: ${poste}`);
    if (secteur) titleParts.push(`dans ${secteur}`);
    if (typeContrat) titleParts.push(`(${typeContrat})`);
    
    return titleParts.join(' ').trim();
  }
  
  /**
   * ⚽ GENERADOR DE TÍTULOS PARA SPORT
   */
  function generateSportTitle(specificData) {
    const {
      typeEquipement = '',
      typeSport = '',
      marque = '',
      taille = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeEquipement) titleParts.push(typeEquipement);
    else if (typeSport) titleParts.push(typeSport);
    else titleParts.push('Article de sport');
    
    if (marque) titleParts.push(marque);
    if (taille) titleParts.push(`Taille ${taille}`);
    
    return titleParts.join(' ').trim();
  }
  
  /**
   * ✈️ GENERADOR DE TÍTULOS PARA VOYAGES
   */
  function generateVoyagesTitle(specificData) {
    const {
      destination = '',
      duree = '',
      typeVoyage = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeVoyage) titleParts.push(typeVoyage);
    else titleParts.push('Voyage');
    
    if (destination) titleParts.push(`à ${destination}`);
    if (duree) titleParts.push(`- ${duree}`);
    
    return titleParts.join(' ').trim();
  }
  
  /**
   * 🍎 GENERADOR DE TÍTULOS PARA ALIMENTAIRES
   */
  function generateAlimentairesTitle(specificData) {
    const {
      typeAliment = '',
      marque = '',
      quantite = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeAliment) titleParts.push(typeAliment);
    if (marque) titleParts.push(marque);
    if (quantite) titleParts.push(`- ${quantite}`);
    
    return titleParts.join(' ').trim() || 'Produit alimentaire';
  }
  
  /**
   * ⚙️ GENERADOR DE TÍTULOS PARA PIÈCES DÉTACHÉES
   */
  function generatePiecesDetacheesTitle(specificData) {
    const {
      typePiece = '',
      marque = '',
      modele = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typePiece) titleParts.push(typePiece);
    if (marque) titleParts.push(marque);
    if (modele) titleParts.push(modele);
    
    return titleParts.join(' ').trim() || 'Pièce détachée';
  }
  
  /**
   * 🧱 GENERADOR DE TÍTULOS PARA MATÉRIAUX
   */
  function generateMateriauxTitle(specificData) {
    const {
      typeMateriau = '',
      quantite = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeMateriau) titleParts.push(typeMateriau);
    if (quantite) titleParts.push(`- ${quantite}`);
    
    return titleParts.join(' ').trim() || 'Matériau';
  }
  
  /**
   * 🎮 GENERADOR DE TÍTULOS PARA LOISIRS
   */
  function generateLoisirsTitle(specificData) {
    const {
      typeLoisir = '',
      marque = '',
      modele = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeLoisir) titleParts.push(typeLoisir);
    if (marque) titleParts.push(marque);
    if (modele) titleParts.push(modele);
    
    return titleParts.join(' ').trim() || 'Loisir';
  }
  
  /**
   * 💄 GENERADOR DE TÍTULOS PARA SANTÉ & BEAUTÉ
   */
  function generateSanteBeauteTitle(specificData) {
    const {
      typeProduit = '',
      marque = ''
    } = specificData;
    
    const titleParts = [];
    
    if (typeProduit) titleParts.push(typeProduit);
    if (marque) titleParts.push(marque);
    
    return titleParts.join(' ').trim() || 'Produit de beauté';
  }
  
  /**
   * 📦 GENERADOR POR DEFECTO (FALLBACK)
   */
  function generateDefaultTitle(categorie, subCategory, articleType, specificData, commonData) {
    // Intentar usar campos disponibles
    const possibleNames = [
      specificData.typeProduit,
      specificData.typeService,
      specificData.typeSport,
      specificData.typeVetement,
      specificData.typeChaussure,
      specificData.typeMeuble,
      specificData.typeAppareil,
      specificData.typeLoisir,
      specificData.typeAliment,
      specificData.typePiece,
      articleType,
      subCategory,
      categorie
    ];
    
    let title = possibleNames.find(name => name && name !== '') || 'Annonce';
    
    // Añadir marca si existe
    if (specificData.marque) {
      title = `${specificData.marque} ${title}`;
    }
    
    // Añadir modelo si existe
    if (specificData.modele) {
      title = `${title} ${specificData.modele}`;
    }
    
    // Si sigue siendo genérico, usar descripción truncada
    if (title === 'Annonce' && commonData.description) {
      const desc = commonData.description.trim();
      title = desc.length > 50 ? desc.substring(0, 50) + '...' : desc;
    }
    
    return title;
  }
  
  // ============ FUNCIONES AUXILIARES ============
  
  /**
   * Genera una versión SEO-friendly del título (URL amigable)
   * @param {string} title - Título original
   * @returns {string} Slug URL-friendly
   */
  export const generateSlug = (title) => {
    if (!title) return 'annonce';
    
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  /**
   * Obtener vista previa del título para mostrar en UI
   * @param {Object} categoryData - Datos de categoría
   * @param {Object} specificData - Datos específicos
   * @param {Object} commonData - Datos comunes
   * @returns {string} Vista previa del título
   */
  export const getTitlePreview = (categoryData, specificData, commonData) => {
    return generateTitle(categoryData, specificData, commonData);
  };
  
  export default generateTitle;