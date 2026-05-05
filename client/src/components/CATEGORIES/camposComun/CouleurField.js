import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CouleurField = ({ 
  selectedCategory,
  selectedSubCategory,
  postData, 
  handleChangeInput, 
  isRTL, 
  name = 'couleur', 
  label = 'color'
}) => {
  const { t } = useTranslation('camposcomunes');
  
  // 📦 BASE DE DATOS DE COLORES DINÁMICA POR CATEGORÍA Y SUBCATEGORÍA
  const allColorsByCategory = {
    // UNIVERSAL: colores disponibles para cualquier categoría
    'universal': [
      'Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Gris', 
      'Marron', 'Orange', 'Violet', 'Rose', 'Beige', 'Argent', 'Or'
    ],
    
    // 📱 TÉLÉPHONES & ÉLECTRONIQUE
    'telephones': {
      'smartphones': [ 
        'Noir', 'Blanc', 'Gris Sidéral', 'Bleu Minuit', 'Vert Alpin', 
        'Rouge Produit', 'Or Rose', 'Violet', 'Bleu Pacific', 'Vert Menthe'
      ],
      'telephones_cellulaires': [ 
        'Noir', 'Blanc', 'Gris Sidéral', 'Bleu Minuit', 'Vert Alpin', 
        'Rouge Produit', 'Or Rose', 'Violet', 'Bleu Pacific', 'Vert Menthe'
      ],


      'tablettes': [
        'Gris Sidéral', 'Argent', 'Or', 'Noir', 'Blanc', 'Bleu', 'Rose Gold'
      ],
      'accessoires': [
        'Noir', 'Transparent', 'Bleu', 'Rouge', 'Vert', 'Rose', 'Violet', 'Multicolore'
      ],
      'default': ['Noir', 'Blanc', 'Gris', 'Or Rose', 'Bleu', 'Rouge']
    },
    
    // 💻 INFORMATIQUE
    'informatique': {
      'ordinateurs_portables': [
        'Gris Sidéral', 'Argent', 'Noir Mat', 'Bleu Minuit', 'Bordeaux', 
        'Vert Foncé', 'Blanc Nacré', 'Rouge Gaming'
      ],
      'souris_claviers': [
        'Noir', 'Blanc', 'Rouge', 'Bleu', 'Vert', 'RGB', 'Noir/Argent', 'Blanc/Rose'
      ],
      'default': ['Noir', 'Gris', 'Argent', 'Blanc', 'Bleu']
    },
    
    // 🛋️ MEUBLES & DÉCORATION
    'meubles': {
      'canapes': [
        'Gris', 'Beige', 'Marron', 'Noir', 'Bleu Foncé', 'Vert Foncé', 'Bordeaux', 'Taupe'
      ],
      'lits': [
        'Blanc', 'Noir', 'Chêne Naturel', 'Chêne Foncé', 'Noyer', 'Chêne Blanchi', 'Gris Bois'
      ],
      'tables': [
        'Chêne', 'Noyer', 'Verre Transparent', 'Verre Fumé', 'Marbre Blanc', 'Noir Laqué'
      ],
      'default': ['Chêne', 'Blanc', 'Noir', 'Gris', 'Marron', 'Beige']
    },
    
    // 👕 VÊTEMENTS & MODE
    'vetements': {
      'vetements_homme': [
        'Noir', 'Bleu Marine', 'Gris', 'Marron', 'Beige', 'Blanc', 'Bordeaux', 'Vert Foncé'
      ],
      'vetements_femme': [
        'Noir', 'Blanc', 'Rose', 'Rouge', 'Bleu Clair', 'Violet', 'Vert Menthe', 'Corail'
      ],
      'chaussures': [
        'Noir', 'Brun', 'Blanc', 'Beige', 'Bleu Marine', 'Gris', 'Rouge', 'Vert'
      ],
      'default': ['Noir', 'Blanc', 'Bleu', 'Rouge', 'Gris']
    },
    
    // 🚗 AUTOMOBILES
    'automobiles': {
      'voitures': [
        'Noir Nacré', 'Blanc Glacier', 'Gris Métallisé', 'Bleu Marine', 'Rouge Ferrari',
        'Argent Métallisé', 'Vert Foncé', 'Marron', 'Bleu Nuit', 'Gris Anthracite'
      ],
      'motos': [
        'Noir Mat', 'Rouge Racing', 'Bleu Royal', 'Jaune', 'Vert Lime', 'Orange', 'Blanc/Noir'
      ],
      'default': ['Noir', 'Blanc', 'Gris', 'Argent', 'Rouge', 'Bleu']
    },
    
    // 🏠 ÉLECTROMÉNAGER
    'electromenager': {
      'televiseurs': ['Noir', 'Argent', 'Gris Fumé', 'Blanc', 'Or Rose', 'Bord de Mer'],
      'refrigerateurs': ['Blanc', 'Inox', 'Noir Inox', 'Gris Foncé', 'Noir Mat'],
      'machines_laver': ['Blanc', 'Inox', 'Gris', 'Noir', 'Argent'],
      'default': ['Blanc', 'Inox', 'Noir', 'Gris']
    },
    
    // 💎 BIJOUX & MONTRES
    'bijoux': {
      'montres': ['Argent', 'Or Jaune', 'Or Rose', 'Or Blanc', 'Acier', 'Noir', 'Bicolor'],
      'colliers': ['Or', 'Argent', 'Acier', 'Cuivre', 'Laiton', 'Noir', 'Doré'],
      'bagues': ['Or Jaune', 'Or Rose', 'Argent', 'Platine', 'Acier', 'Or Blanc'],
      'default': ['Or', 'Argent', 'Acier', 'Doré']
    },
    
    // ✈️ VOYAGES & BAGAGES
    'voyages': {
      'valises': ['Noir', 'Bleu Marine', 'Gris', 'Rouge', 'Vert', 'Bordeaux', 'Noir/Argent'],
      'sacs_voyage': ['Noir', 'Marron', 'Beige', 'Vert Foncé', 'Bleu', 'Gris', 'Camouflage'],
      'default': ['Noir', 'Bleu', 'Gris', 'Rouge']
    }
  };

  // 🔍 FUNCIÓN PARA OBTENER COLORES SEGÚN SELECCIÓN
  const getFilteredColors = () => {
    // Si no hay categoría, devolver colores universales
    if (!selectedCategory) {
      return allColorsByCategory['universal'];
    }
    
    const categoryColors = allColorsByCategory[selectedCategory];
    
    // Si la categoría no tiene colores específicos, devolver universales
    if (!categoryColors) {
      return allColorsByCategory['universal'];
    }
    
    // Si la categoría tiene subcategorías y hay una seleccionada
    if (selectedSubCategory && categoryColors[selectedSubCategory]) {
      return categoryColors[selectedSubCategory];
    }
    
    // Si hay colores por defecto para la categoría
    if (categoryColors.default) {
      return categoryColors.default;
    }
    
    // Último recurso: colores universales
    return allColorsByCategory['universal'];
  };

  const colors = getFilteredColors();
  
  return (
    <Form.Group>
      <Form.Label>🎨 {t(label)}</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_color')}</option>
        
        {/* Agrupar colores si hay muchos */}
        {colors.length > 10 ? (
          <>
            <optgroup label={t('couleurs_principales')}>
              {colors.slice(0, 8).map(color => (
                <option key={color} value={color.toLowerCase()}>
                  {color}
                </option>
              ))}
            </optgroup>
            <optgroup label={t('toutes_couleurs')}>
              {colors.slice(8).map(color => (
                <option key={color} value={color.toLowerCase()}>
                  {color}
                </option>
              ))}
            </optgroup>
          </>
        ) : (
          colors.map(color => (
            <option key={color} value={color.toLowerCase()}>
              {color}
            </option>
          ))
        )}
        
        <option value="autre">{t('autre')}</option>
      </Form.Select>
      
      {/* Campo para color personalizado */}
      {postData[name] === 'autre' && (
        <Form.Control
          type="text"
          name={`${name}_custom`}
          value={postData[`${name}_custom`] || ''}
          onChange={handleChangeInput}
          placeholder={t('precisez_couleur')}
          className="mt-2"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      )}
      
      {/* Información contextual (mantenemos texto original) */}
      {selectedCategory && (
        <Form.Text className="text-muted">
          <small>
            {colors.length} couleur(s) disponible(s) pour 
            <strong> {selectedCategory}</strong>
            {selectedSubCategory && ` > ${selectedSubCategory}`}
          </small>
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default CouleurField;