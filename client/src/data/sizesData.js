// 📁 src/data/sizesData.js

export const SIZES_DATABASE = {
    // ============ 👗 VÊTEMENTS ============
    'vetements': {
      // ROPA DE HOMBRE
      'vetements_homme': {
        'pantalon': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        'chemise': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        'tshirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        'costume': ['46', '48', '50', '52', '54', '56', '58'],
        'pull': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'veste': ['S', 'M', 'L', 'XL', 'XXL'],
        'maillot': ['XS', 'S', 'M', 'L', 'XL'],
        'default': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      },
      
      // ROPA DE MUJER
      'vetements_femme': {
        'robe': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'jupe': ['34', '36', '38', '40', '42', '44', '46'],
        'blouse': ['XS', 'S', 'M', 'L', 'XL'],
        'pantalon': ['34', '36', '38', '40', '42', '44', '46'],
        'ensemble': ['XS', 'S', 'M', 'L', 'XL'],
        'maillot': ['XS', 'S', 'M', 'L', 'XL'],
        'default': ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      
      // ZAPATOS HOMBRE
      'chaussures_homme': {
        'sport': ['40', '41', '42', '43', '44', '45', '46', '47'],
        'ville': ['40', '41', '42', '43', '44', '45', '46'],
        'bottes': ['40', '41', '42', '43', '44', '45', '46'],
        'sandales': ['40', '41', '42', '43', '44', '45'],
        'default': ['40', '41', '42', '43', '44', '45', '46']
      },
      
      // ZAPATOS MUJER
      'chaussures_femme': {
        'talons': ['35', '36', '37', '38', '39', '40', '41'],
        'bottes': ['36', '37', '38', '39', '40', '41'],
        'sandales': ['35', '36', '37', '38', '39', '40'],
        'sport': ['36', '37', '38', '39', '40', '41', '42'],
        'default': ['35', '36', '37', '38', '39', '40', '41']
      },
      
      // NIÑOS
      'garcons': {
        'tshirt': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans'],
        'pantalon': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans'],
        'pull': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans'],
        'default': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans']
      },
      
      'filles': {
        'robe': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans'],
        'jupe': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans'],
        'default': ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans']
      },
      
      // BEBÉS
      'bebe': {
        'body': ['Naissance', '1 mois', '3 mois', '6 mois', '9 mois', '12 mois', '18 mois'],
        'pyjama': ['Naissance', '3 mois', '6 mois', '9 mois', '12 mois', '18 mois'],
        'combinaison': ['Naissance', '3 mois', '6 mois', '9 mois', '12 mois'],
        'default': ['Naissance', '1 mois', '3 mois', '6 mois', '9 mois', '12 mois', '18 mois']
      },
      
      // ROPA PROFESIONAL
      'tenues_pro': {
        'uniforme': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'blouse': ['XS', 'S', 'M', 'L', 'XL'],
        'costume': ['46', '48', '50', '52', '54', '56'],
        'default': ['XS', 'S', 'M', 'L', 'XL']
      }
    },
  
    // ============ 👟 SPORT ============
    'sport': {
      'football': {
        'maillot': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'short': ['XS', 'S', 'M', 'L', 'XL'],
        'chaussettes': ['36-38', '39-41', '42-44', '45-47'],
        'default': ['XS', 'S', 'M', 'L', 'XL']
      },
      
      'hand_voley_basket': {
        'maillot': ['XS', 'S', 'M', 'L', 'XL'],
        'short': ['XS', 'S', 'M', 'L', 'XL'],
        'default': ['XS', 'S', 'M', 'L', 'XL']
      },
      
      'sport_combat': {
        'kimono': ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
        'gants': ['8 oz', '10 oz', '12 oz', '14 oz', '16 oz'],
        'default': ['A1', 'A2', 'A3', 'A4']
      },
      
      'fitness_musculation': {
        'tshirt': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        'legging': ['XS', 'S', 'M', 'L', 'XL'],
        'short': ['XS', 'S', 'M', 'L', 'XL'],
        'default': ['XS', 'S', 'M', 'L', 'XL']
      },
      
      'natation': {
        'maillot': ['XS', 'S', 'M', 'L', 'XL'],
        'bonnet': ['Enfant', 'Adulte'],
        'lunettes': ['Standard', 'Junior', 'Adulte'],
        'default': ['XS', 'S', 'M', 'L', 'XL']
      }
    },
  
    // ============ 🛋️ MEUBLES ============
    'meubles': {
      'meubles_maison': {
        'canape': ['2 places', '3 places', '4 places', 'Corner', 'Modulaire'],
        'fauteuil': ['Standard', 'Grand', 'Relax'],
        'lit': ['90x200', '140x200', '160x200', '180x200', '200x200'],
        'table': ['4 personnes', '6 personnes', '8 personnes', '10 personnes', 'Extensible'],
        'armoire': ['Simple', 'Double', 'Triple', 'Penderie'],
        'default': ['Standard', 'Grand', 'Petit']
      },
      
      'literie_linge': {
        'matelas': ['90x200', '140x200', '160x200', '180x200', '200x200'],
        'couette': ['140x200', '200x200', '240x220', '260x240'],
        'oreiller': ['Standard', 'Grand', 'Confort'],
        'default': ['Standard', 'Grand', 'King Size']
      },
      
      'rideaux': {
        'rideau': ['120x250', '140x250', '160x250', '180x250', '200x250'],
        'voilage': ['120x250', '140x250', '160x250'],
        'store': ['60x120', '80x120', '100x120', '120x120'],
        'default': ['Standard', 'Grand', 'Sur mesure']
      }
    },
  
    // ============ 🎮 LOISIRS ============
    'loisirs': {
      'consoles_jeux_videos': {
        'manette': ['Standard', 'Mini', 'Pro'],
        'casque': ['Small', 'Medium', 'Large', 'Adjustable'],
        'default': ['Standard', 'Grand', 'Petit']
      },
      
      'instruments_musique': {
        'guitare': ['1/4', '1/2', '3/4', '4/4'],
        'violon': ['1/16', '1/10', '1/8', '1/4', '1/2', '3/4', '4/4'],
        'piano': ['88 touches', '76 touches', '61 touches'],
        'default': ['Standard', 'Professionnel', 'Junior']
      },
      
      'jeux_loisirs': {
        'jeu_societe': ['2-4 joueurs', '4-6 joueurs', '6-8 joueurs'],
        'puzzle': ['100 pièces', '500 pièces', '1000 pièces', '2000 pièces'],
        'default': ['Standard', 'Famille', 'Groupe']
      }
    },
  
    // ============ 🚗 VÉHICULES ============
    'vehicules': {
      'pneus': {
        'voiture': ['165/70 R14', '185/65 R15', '195/65 R15', '205/55 R16', '225/45 R17'],
        'moto': ['100/80-17', '110/70-17', '120/70-17', '130/70-17', '140/70-17'],
        'default': ['Standard', 'Grand', 'Sport']
      },
      
      'jantes': {
        'voiture': ['14"', '15"', '16"', '17"', '18"', '19"', '20"'],
        'moto': ['17"', '18"', '19"', '21"'],
        'default': ['Standard', 'Alliage', 'Sport']
      }
    },
  
    // ============ 📱 TÉLÉPHONES ============
    'telephones': {
      'coques': {
        'iphone': ['iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'],
        'samsung': ['Galaxy S21', 'Galaxy S22', 'Galaxy S23', 'Galaxy A52', 'Galaxy A53'],
        'default': ['Standard', 'Pro', 'Max']
      },
      
      'ecrans': {
        'remplacement': ['4.7"', '5.4"', '6.1"', '6.7"', '6.9"'],
        'protections': ['4.7"', '5.4"', '6.1"', '6.7"', '6.9"'],
        'default': ['Petit', 'Moyen', 'Grand', 'Extra large']
      }
    },
  
    // ============ 🏠 ÉLECTROMÉNAGER ============
    'electromenager': {
      'televiseurs': {
        'taille': ['32"', '43"', '50"', '55"', '65"', '75"', '85"'],
        'support': ['Murale', 'Pied', 'Pivotante'],
        'default': ['Petit', 'Moyen', 'Grand']
      },
      
      'refrigerateurs': {
        'capacite': ['150L', '200L', '250L', '300L', '400L', '500L', '600L'],
        'type': ['Simple', 'Double', 'Américain', 'Cave à vin'],
        'default': ['Petit', 'Moyen', 'Grand', 'Familial']
      }
    }
  };
  
  // 🔄 FUNCIÓN PARA OBTENER TALLAS
  export const getSizesByCategory = (mainCategory, subCategory, articleType = null) => {
    console.log('🔍 getSizesByCategory:', { mainCategory, subCategory, articleType });
    
    if (!mainCategory || !SIZES_DATABASE[mainCategory]) {
      console.warn(`⚠️ Categoría "${mainCategory}" no encontrada en SIZES_DATABASE`);
      return getDefaultSizes(mainCategory);
    }
  
    const categorySizes = SIZES_DATABASE[mainCategory];
    
    // Si hay subcategoría
    if (subCategory && categorySizes[subCategory]) {
      const subCategorySizes = categorySizes[subCategory];
      
      // Si hay tipo de artículo específico
      if (articleType && subCategorySizes[articleType]) {
        console.log(`✅ Tallas específicas para ${mainCategory}.${subCategory}.${articleType}`);
        return subCategorySizes[articleType];
      }
      
      // Si no, usar default de la subcategoría
      if (subCategorySizes.default) {
        console.log(`✅ Tallas default para ${mainCategory}.${subCategory}`);
        return subCategorySizes.default;
      }
    }
    
    // Si no hay nada específico, usar tallas default de la categoría
    return getDefaultSizes(mainCategory);
  };
  
  // 🎯 FUNCIÓN PARA OBTENER TALLAS POR TIPO DE ARTÍCULO
  export const getSizesByArticleType = (mainCategory, subCategory, articleType) => {
    if (!mainCategory || !SIZES_DATABASE[mainCategory]) {
      return [];
    }
    
    const categorySizes = SIZES_DATABASE[mainCategory];
    
    if (subCategory && categorySizes[subCategory]) {
      const subCategorySizes = categorySizes[subCategory];
      
      if (articleType && subCategorySizes[articleType]) {
        return subCategorySizes[articleType];
      }
    }
    
    return [];
  };
  
  // 🎨 FUNCIÓN PARA OBTENER TALLAS DEFAULT
  export const getDefaultSizes = (mainCategory) => {
    const defaultSizes = {
      'vetements': ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      'sport': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      'meubles': ['Petit', 'Moyen', 'Grand', 'Sur mesure'],
      'vehicules': ['Standard', 'Grand', 'Sport'],
      'telephones': ['Petit', 'Moyen', 'Grand'],
      'electromenager': ['Petit', 'Moyen', 'Grand', 'Familial'],
      'informatique': ['Standard', 'Pro', 'Max'],
      'default': ['Unique', 'Standard', 'Grand', 'Petit']
    };
    
    return defaultSizes[mainCategory] || defaultSizes['default'];
  };
  
  // 🔍 FUNCIÓN DE BÚSQUEDA
  export const searchSizes = (query, mainCategory = null) => {
    let allSizes = [];
    
    if (mainCategory && SIZES_DATABASE[mainCategory]) {
      // Buscar en categoría específica
      const categoryData = SIZES_DATABASE[mainCategory];
      Object.values(categoryData).forEach(subCategory => {
        Object.values(subCategory).forEach(sizes => {
          allSizes.push(...sizes);
        });
      });
    } else {
      // Buscar en todas las categorías
      Object.values(SIZES_DATABASE).forEach(category => {
        Object.values(category).forEach(subCategory => {
          Object.values(subCategory).forEach(sizes => {
            allSizes.push(...sizes);
          });
        });
      });
    }
    
    // Eliminar duplicados y filtrar
    allSizes = [...new Set(allSizes)];
    
    return allSizes.filter(size => 
      size.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);
  };
  
  // 📊 FUNCIÓN PARA CONVERTIR TALLAS
  export const convertSize = (size, fromSystem, toSystem) => {
    const conversionTables = {
      'vetements': {
        'XS': ['Extra Small', '34', '2'],
        'S': ['Small', '36', '4'],
        'M': ['Medium', '38', '6'],
        'L': ['Large', '40', '8'],
        'XL': ['Extra Large', '42', '10'],
        'XXL': ['2XL', '44', '12'],
        'XXXL': ['3XL', '46', '14']
      },
      'chaussures': {
        '40': ['7 US', '6.5 UK', '40 EU'],
        '41': ['8 US', '7.5 UK', '41 EU'],
        '42': ['9 US', '8.5 UK', '42 EU'],
        '43': ['10 US', '9.5 UK', '43 EU'],
        '44': ['11 US', '10.5 UK', '44 EU']
      }
    };
    
    // Lógica de conversión básica
    return size; // Por ahora devolver mismo tamaño
  };