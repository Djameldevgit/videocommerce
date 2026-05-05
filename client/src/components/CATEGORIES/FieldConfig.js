export const DYNAMIC_FIELDS_CONFIG = {
  // ==================== VEHICULES ====================
  'vehicules': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'voitures': {
        step2: ['marque', 'annee', 'finition', 'motorisation', 'moteur', 'energie', 'boite', 'specs', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'utilitaire': {
        step2: ['marque', 'annee', 'energie', 'boite', 'kilometrage', 'chargeUtile', 'volume', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'motos-scooters': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'quads': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fourgon': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'camion': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bus': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'engin': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tracteurs': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'remorques': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bateaux-barques': {
        step2: ['marca', 'modelo', 'annee', 'energie', 'kilometrage', 'etat', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  // ==================== IMMOBILIER ====================
  'immobilier': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      // VENTE
      'vente': {
        step2: ['superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'typeVente', 'papiers', 'conditionsPaiement', 'adresse', 'quartier', 'descriptionBien'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'appartement': {
            step2: ['superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'local': {
            step2: ['superficie', 'vitrine', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'villa': {
            step2: ['superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'terrain': {
            step2: ['superficie', 'typeTerrain', 'viabilise', 'adresse', 'quartier', 'descriptionBien']
          },
          'terrain-agricole': {
            step2: ['superficie', 'typeTerrain', 'adresse', 'quartier', 'descriptionBien']
          },
          'immeuble': {
            step2: ['superficie', 'nbAppartements', 'nbEtages', 'adresse', 'quartier', 'descriptionBien']
          },
          'bungalow': {
            step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'descriptionBien']
          },
          'hangar-usine': {
            step2: ['superficie', 'hauteur', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'autre-vente': {
            step2: ['superficie', 'adresse', 'quartier', 'descriptionBien']
          }
        }
      },
      // LOCATION
      'location': {
        step2: ['superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'papiers', 'conditionsPaiement', 'adresse', 'quartier', 'descriptionBien'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'appartement-location': {
            step2: ['superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'local-location': {
            step2: ['superficie', 'vitrine', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'villa-location': {
            step2: ['superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'immeuble-location': {
            step2: ['superficie', 'nbAppartements', 'nbEtages', 'adresse', 'quartier', 'descriptionBien']
          },
          'bungalow-location': {
            step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'descriptionBien']
          },
          'autre-location': {
            step2: ['superficie', 'adresse', 'quartier', 'descriptionBien']
          }
        }
      },
      // LOCATION VACANCES
      'location-vacances': {
        step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'adresse', 'quartier', 'descriptionBien'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'appartement-vacances': {
            step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'villa-vacances': {
            step2: ['superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'descriptionBien']
          },
          'bungalow-vacances': {
            step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'descriptionBien']
          },
          'autre-vacances': {
            step2: ['superficie', 'adresse', 'quartier', 'descriptionBien']
          }
        }
      },
      // CHERCHE LOCATION
      'cherche-location': {
        step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'],
        step3: ['typeOffre', 'price'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'appartement-cherche-location': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'local-cherche-location': { step2: ['superficie', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'villa-cherche-location': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'immeuble-cherche-location': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'bungalow-cherche-location': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'autre-cherche-location': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] }
        }
      },
      // CHERCHE ACHAT
      'cherche-achat': {
        step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'],
        step3: ['typeOffre', 'price'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'appartement-cherche-achat': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'local-cherche-achat': { step2: ['superficie', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'villa-cherche-achat': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'terrain-cherche-achat': { step2: ['superficie', 'typeTerrain', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'terrain-agricole-cherche-achat': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'immeuble-cherche-achat': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'bungalow-cherche-achat': { step2: ['superficie', 'pieces', 'chambres', 'sallesBain', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'hangar-usine-cherche-achat': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] },
          'autre-cherche-achat': { step2: ['superficie', 'adresse', 'quartier', 'budget', 'descriptionBien'] }
        }
      }
    }
  },
  'materiaux': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'materiel-professionnel': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'industrie-fabrication': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'alimentaire-restauration': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'medical': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'batiment-construction': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'materiel-electrique': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'ateliers': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'stockage-magasinage': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'equipement-protection': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'agriculture': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'reparation-diagnostic': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'commerce-detail': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'coiffure-cosmetologie': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'autres-materiel-pro': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'outillage-professionnel': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'perceuse': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'meuleuse': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'outillage-main': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'scie': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'autres-outillage': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'materiel-agricole': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'equipement-agricole': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'arbres': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'terrain-agricole-materiaux': {
            step2: ['superficie', 'typeTerrain', 'adresse', 'quartier', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'autre-agricole': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'materiaux-construction': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'matieres-premieres': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'produits-hygiene': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-materiaux': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  // ==================== TELEPHONE ====================
  'telephone': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'smartphones': {
        step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'appareil', 'cameraFrontal', 'tailleEcran', 'ram', 'connectivite', 'doublePuce', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'telephones-cellulaires': {
        step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'ram', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tablettes': {
        step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'appareil', 'tailleEcran', 'ram', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fixes-fax': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'smartwatchs': {
        step2: ['marque', 'modele', 'couleur', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces-rechange-telephone': {
        step2: ['typeAccessoire', 'marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'offres-abonnements': {
        step2: ['marque', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'accessoires-telephone': {
        step2: ['typeAccessoire', 'marque', 'couleur', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'protection-antichoc': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ecouteurs-son': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'chargeurs-cables': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'supports-stabilisateurs': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'manettes-telephone': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'vr-telephone': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'power-banks': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'stylets': {
        step2: ['typeAccessoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'cartes-memoire': {
        step2: ['memoire', 'marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ==================== VETEMENTS ====================
  'vetements': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'vetements-homme': {
        step2: ['marque', 'taille', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'vetements-femme': {
        step2: ['marque', 'taille', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'chaussures-homme': {
        step2: ['marque', 'pointure', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'chaussures-femme': {
        step2: ['marque', 'pointure', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'garcons': {
        step2: ['marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'filles': {
        step2: ['marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bebe': {
        step2: ['marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'sacs-valises': {
        step2: ['marque', 'couleur', 'matiere', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'montres': {
        step2: ['marque', 'materiau', 'couleur', 'mecanisme', 'etancheite', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'lunettes': {
        step2: ['marque', 'monture', 'couleur', 'protection', 'typeVerre', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bijoux': {
        step2: ['marque', 'materiau', 'pierres', 'poids', 'carats', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tenues-professionnelles': {
        step2: ['marque', 'taille', 'couleur', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ==================== ELECTROMENAGER ====================
  'electromenager': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'televiseurs': {
        step2: ['marque', 'modele', 'tailleEcran', 'resolution', 'smartTv', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'demodulateurs-box-tv': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'paraboles-switch-tv': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'abonnements-iptv': {
        step2: ['duree', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'cameras-accessories': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'audio': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'aspirateurs-nettoyeurs': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'repassage': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'beaute-hygiene': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'machines-coudre': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'telecommandes': {
        step2: ['marque', 'modele', 'compatibilite', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'securite-gps': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'composants-electroniques': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces-rechange': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-electromenager': {
        step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      // ========== SUBCATEGORÍAS CON NIVEL 3 (articleTypes) ==========
      'refrigerateurs-congelateurs': {
        step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'refrigerateur': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'congelateur': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'refrigerateur-congelateur': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'cave-vin': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'machines-laver': {
        step2: ['marque', 'modele', 'capaciteKg', 'vitesseEssorage', 'classeEnergetique', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'lave-linge': {
            step2: ['marque', 'modele', 'capaciteKg', 'vitesseEssorage', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'seche-linge': {
            step2: ['marque', 'modele', 'capaciteKg', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'lave-linge-seche-linge': {
            step2: ['marque', 'modele', 'capaciteKg', 'vitesseEssorage', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'lave-linge-essorage': {
            step2: ['marque', 'modele', 'capaciteKg', 'vitesseEssorage', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'lave-vaisselles': {
        step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'lave-vaisselle-encastrable': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'lave-vaisselle-poselibre': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'lave-vaisselle-compact': {
            step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'fours-cuisson': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'four-electrique': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'four-gaz': {
            step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'four-micro-ondes': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'plaque-cuisson': {
            step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'cuisiniere': {
            step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'chauffage-climatisation': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'climatiseur': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'ventilateur': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'radiateur': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'chauffe-eau': {
            step2: ['marque', 'modele', 'capacite', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'pompe-chaleur': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'appareils-cuisine': {
        step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'robot-cuisine': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'mixeur': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'bouilloire': {
            step2: ['marque', 'modele', 'capacite', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'cafetiere': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'grille-pain': {
            step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      }
    }
  },
  // ==================== INFORMATIQUE ====================
  'informatique': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'ordinateurs-portables': {
        step2: ['marqueModelePcs', 'processeur', 'ram', 'stockage', 'tailleEcran', 'carteGraphique', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ordinateurs-bureau': {
        step2: ['marqueModelePcs', 'processeur', 'ram', 'stockage', 'carteGraphique', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'composants-pc-fixe': {
        step2: ['typeComposant', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'composants-pc-portable': {
        step2: ['typeComposant', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'composants-serveur': {
        step2: ['typeComposant', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'imprimantes-cartouches': {
        step2: ['marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'reseau-connexion': {
        step2: ['marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'stockage-externe-racks': {
        step2: ['marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'serveurs': {
        step2: ['marqueModelePcs', 'processeur', 'ram', 'stockage', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ecrans': {
        step2: ['marqueModelePcs', 'tailleEcran', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'onduleurs-stabilisateurs': {
        step2: ['marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'claviers-souris': {
        step2: ['typePeripherique', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'casques-son': {
        step2: ['typePeripherique', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'webcam-videoconference': {
        step2: ['typePeripherique', 'marqueModelePcs', 'garantie', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'cables-adaptateurs': {
        step2: ['typePeripherique', 'marqueModelePcs', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'logiciels-abonnements': {
        step2: ['description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-informatique': {
        step2: ['marqueModelePcs', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  // ==================== MEUBLES ====================
  'meubles': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'salon': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'chambres-coucher': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tables': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'canape': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'lits': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tables-pc-bureaux': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'decoration': {
        step2: ['marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'vaisselle': {
        step2: ['matiereVaisselle', 'nbPieces', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'literie-linge': {
        step2: ['tailleLiterie', 'matiere', 'couleur', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'tapis-moquettes': {
        step2: ['formeTapis', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'puericulture': {
        step2: ['ageBebe', 'marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'rideaux': {
        step2: ['marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fournitures-scolaires': {
        step2: ['marque', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-meubles': {
        step2: ['marque', 'modele', 'matiere', 'couleur', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  // ==================== VOYAGES ====================
  'voyages': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'voyage-organise': {
        step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'hebergement', 'activitesIncluses', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'location-vacances-voyages': {
        step2: ['destination', 'typeHebergement', 'capacite', 'equipements', 'duree', 'dateDepart', 'dateRetour', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'hajj-omra': {
        step2: ['destination', 'typePelerinage', 'hotelMakkah', 'hotelMadinah', 'volsInclus', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'reservations-visa': {
        step2: ['destination', 'compagnie', 'visa', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'sejour': {
        step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'hebergement', 'activitesIncluses', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'croisiere': {
        step2: ['destination', 'nomBateau', 'cabine', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'prixParPersonne', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-voyages': {
        step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'hebergement', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  'alimentaires': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'produits-laitiers': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fruits-secs': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'graines-riz-cereales': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'sucres-produits-sucres': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'boissons': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'viandes-poissons': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'cafe-the-infusion': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'complements-alimentaires': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'miel-derives': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fruits-legumes': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ble-farine': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bonbons-chocolat': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'boulangerie-viennoiserie': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ingredients-cuisine-patisserie': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'noix-graines': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'plats-cuisines': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'sauces-epices-condiments': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'oeufs': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'huiles': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'pates': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'gateaux': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'emballage': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'aliments-bebe': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'aliments-dietetiques': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-alimentaires': {
        step2: ['marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  // ==================== EMPLOI ====================
  'emploi': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'offres-emploi': {
        step2: ['poste', 'typeContrat', 'secteurActivite', 'experienceRequise', 'niveauEtudes', 'competences', 'salaire', 'avantages', 'lieuTravail', 'horaires', 'description']
      },
      'demandes-emploi': {
        step2: ['nomCandidat', 'poste', 'secteurActivite', 'experienceRequise', 'competences', 'disponibilite', 'mobilite', 'pretentionsSalariales', 'description']
      },
      'autres-services-emploi': {
        step2: ['typeService', 'description']
      }
    }
  },
  // ==================== LOISIRS ====================
  'loisirs': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'consoles-jeux-videos': {
        step2: ['marque', 'modele', 'typeConsole', 'genreJeu', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'instruments-musique': {
        step2: ['marque', 'modele', 'typeInstrument', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'livres-magazines': {
        step2: ['auteur', 'genreLitteraire', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'animalerie': {
        step2: ['typeAnimal', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'jardinage': {
        step2: ['marque', 'modele', 'typeProduitLoisir', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'barbecue-grillades': {
        step2: ['marque', 'modele', 'typeProduitLoisir', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'jouets': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'chasse-peche': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'jeux-loisirs': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'vapes-chichas': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'produits-accessoires-ete': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'antiquites-collections': {
        step2: ['etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-loisirs': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  'services': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'construction-travaux': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ecoles-formations': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'industrie-fabrication-services': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'transport-demenagement': {
        step2: ['typeVehicule', 'serviceInclus', 'zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'decoration-amenagement': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'publicite-communication': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'nettoyage-jardinage': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'froid-climatisation': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'traiteurs-gateaux': {
        step2: ['typeCuisine', 'nombrePersonnesMax', 'tarif', 'zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'medecine-sante': {
        step2: ['zoneIntervention', 'disponibilite', 'diplomes', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation-auto-diagnostic': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'securite-alarme': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'projets-etudes': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bureautique-internet': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'location-vehicules': {
        step2: ['typeVehicule', 'zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'menuiserie-meubles': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'impression-edition': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'hotellerie-restauration-salles': {
        step2: ['capacite', 'superficieSalle', 'equipementsSalle', 'formules', 'tarif', 'zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'esthetique-beaute': {
        step2: ['zoneIntervention', 'disponibilite', 'diplomes', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'image-son': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'comptabilite-economie': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'couture-confection': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'maintenance-informatique': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation-electromenager': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'evenements-divertissement': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'paraboles-demos': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation-electronique': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'services-etranger': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'flashage-reparation-telephones': {
        step2: ['zoneIntervention', 'disponibilite', 'experience', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'flashage-installation-jeux': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'juridique': {
        step2: ['zoneIntervention', 'disponibilite', 'diplomes', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autres-services': {
        step2: ['zoneIntervention', 'disponibilite', 'description'],
        step3: ['price', 'typeOffre'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },
  'sante-beaute': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'cosmetiques-beaute': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'soins-corps': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'savons-gels-douche': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'soins-visage': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'maquillage': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'produits-solaires-bronzage': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'instruments-outils-beaute': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'manucure-pedicure': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'rasage-epilation': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'hygiene': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'coiffure': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'soins-bebe': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'autres-produits-beaute': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'parapharmacie-sante': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images'],
        articleTypes: {
          'dispositifs-medicaux': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'complement-alimentaire': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'materiel-medical': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          },
          'aliments-dietetiques-sante': {
            step2: ['marque', 'modele', 'etat', 'description'],
            step3: ['price', 'typeOffre', 'livraison'],
            step4: ['wilaya', 'telephone', 'email'],
            step5: ['images']
          }
        }
      },
      'parfums-deodorants-femme': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'parfums-deodorants-homme': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'accessoires-beaute': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'soins-cheveux': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-sante-beaute': {
        step2: ['marque', 'modele', 'etat', 'description'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }

  },


  'art': {
    step2: [],
    step3: [],
    step4: [],
    step5: [],
    subCategories: {
      'peinture': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'sculpture': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'photographie': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'dessin': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'gravure': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'art-numerique': {
        step2: ['style', 'theme', 'technique', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'collage': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'art-textile': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'ceramique': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'bijouterie-artisanale': {
        step2: ['style', 'theme', 'technique', 'support', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'art-verre': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'art-bois': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'mosaique': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'autre-art': {
        step2: ['style', 'theme', 'technique', 'support', 'hauteur', 'largeur', 'profondeur', 'uniteMesure', 'licence', 'anneeCreation', 'certificatAuthenticite', 'oeuvreSignee', 'encadrement'],
        step3: ['price', 'typeOffre', 'livraison'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  }

};

// ============ FUNCIONES UTILITARIAS ============

export const getFieldsForCategory = (mainCategory, subCategory = null, step = null, articleType = null) => {
  if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    console.warn(`⚠️ Categoría no configurada: ${mainCategory}`);
    return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
  }

  const config = DYNAMIC_FIELDS_CONFIG[mainCategory];
  let activeConfig = { ...config };

  if (subCategory && config.subCategories?.[subCategory]) {
    activeConfig = { ...activeConfig, ...config.subCategories[subCategory] };

    // Manejar articleType (nivel 3)
    if (articleType && activeConfig.articleTypes?.[articleType]) {
      activeConfig = { ...activeConfig, ...activeConfig.articleTypes[articleType] };
    }
  }

  if (step) {
    const stepKey = `step${step}`;
    const baseFields = config[stepKey] || [];
    const levelFields = activeConfig[stepKey] || [];
    const allFields = [...new Set([...baseFields, ...levelFields])];
    return allFields;
  }

  return {
    step2: [...(config.step2 || []), ...(activeConfig.step2 || [])],
    step3: [...(config.step3 || []), ...(activeConfig.step3 || [])],
    step4: [...(config.step4 || []), ...(activeConfig.step4 || [])],
    step5: config.step5 || []
  };
};

export const isCategoryConfigured = (mainCategory, subCategory = null) => {
  if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) return false;
  if (subCategory) {
    return !!DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories?.[subCategory];
  }
  return true;
};

export const getSubCategories = (mainCategory) => {
  return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories
    ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories)
    : [];
};

export const getArticleTypes = (mainCategory, subCategory) => {
  return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories?.[subCategory]?.articleTypes
    ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories[subCategory].articleTypes)
    : [];
};