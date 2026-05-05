import React, { useMemo } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const TailleField = ({ 
  selectedCategory,
  selectedSubCategory,
  postData, 
  handleChangeInput,
  isRTL,
  name = 'taille',
  label = 'Taille'
}) => {
  const { t } = useTranslation('camposcomunes');
  
  // 📏 OPCIONES DE TALLA COMPLETAS PARA TODAS LAS CATEGORÍAS
  const sizeOptions = useMemo(() => {
    const options = {
      // 👕 VÊTEMENTS
      vetements: {
        // Homme
        vetements_homme: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
        chaussures_homme: ['38', '39', '40', '41', '42', '43', '44', '45', '46', '47'],
        montres_homme: ['38mm', '40mm', '42mm', '44mm', '46mm'],
        ceintures_homme: ['85', '90', '95', '100', '105', '110', '115', '120'],
        costumes_homme: ['46', '48', '50', '52', '54', '56', '58'],
        
        // Femme
        vetements_femme: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        chaussures_femme: ['35', '36', '37', '38', '39', '40', '41', '42'],
        robes_femme: ['34', '36', '38', '40', '42', '44', '46', '48'],
        lingerie_femme: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        
        // Enfant
        vetements_enfant: ['2 ans', '4 ans', '6 ans', '8 ans', '10 ans', '12 ans', '14 ans'],
        chaussures_enfant: ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34'],
        
        // Accessoires
        sacs: ['Petit', 'Moyen', 'Grand'],
        lunettes: ['Petit', 'Moyen', 'Grand'],
        
        default: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
      },
      
      // 👟 SPORT
      sport: {
        chaussures_sport: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
        vetements_sport: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        velos: ['XS (13-14")', 'S (15-16")', 'M (17-18")', 'L (19-20")', 'XL (21-22")'],
        snowboard: ['145', '150', '155', '160', '165'],
        ski: ['150', '160', '170', '180', '190'],
        raquettes: ['Petite', 'Moyenne', 'Grande'],
        default: ['S', 'M', 'L', 'XL']
      },
      
      // 📺 ÉLECTROMÉNAGER
      electromenager: {
        televiseurs: ['32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"'],
        refrigerateurs: ['Petit (< 200L)', 'Moyen (200-400L)', 'Grand (> 400L)'],
        machines_laver: ['6kg', '7kg', '8kg', '9kg', '10kg', '12kg', '14kg'],
        climatiseurs: ['9000 BTU', '12000 BTU', '18000 BTU', '24000 BTU'],
        fours: ['45L', '60L', '70L', '85L'],
        hotte: ['60cm', '90cm', '120cm'],
        default: ['Petit', 'Moyen', 'Grand', 'Très grand']
      },
      
      // 💻 INFORMATIQUE
      informatique: {
        ecrans: ['15"', '17"', '19"', '21"', '24"', '27"', '32"', '34"', '49"'],
        laptops: ['13"', '14"', '15"', '16"', '17"'],
        tablettes: ['7"', '8"', '9"', '10"', '11"', '12"'],
        disques_durs: ['256GB', '512GB', '1TB', '2TB', '4TB', '8TB'],
        cartes_graphiques: ['Petite', 'Moyenne', 'Grande'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 📱 TÉLÉPHONES
      telephones: {
        smartphones: ['Petit (< 5")', 'Moyen (5-6")', 'Grand (> 6")'],
        tablettes: ['7"', '8"', '9"', '10"', '11"', '12"'],
        montres_connectees: ['38mm', '40mm', '42mm', '44mm', '46mm'],
        ecouteurs: ['Petits', 'Moyens', 'Grands'],
        default: ['Standard', 'Grand']
      },
      
      // 🚗 AUTOMOBILES
      automobiles: {
        voitures: ['Petite', 'Compacte', 'Berline', 'SUV', 'Monospace', 'Utilitaire'],
        motos: ['50cc', '125cc', '250cc', '500cc', '750cc', '1000cc', '1200cc'],
        scooters: ['50cc', '125cc', '250cc', '300cc'],
        quads: ['50cc', '90cc', '250cc', '500cc'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 🛋️ MEUBLES
      meubles: {
        canapes: ['2 places', '3 places', '4 places', '5 places', 'Angle'],
        lits: ['90x190', '140x190', '160x200', '180x200', '200x200'],
        tables: ['Petite (< 100cm)', 'Moyenne (100-150cm)', 'Grande (> 150cm)'],
        armoires: ['Petite (< 1.5m)', 'Moyenne (1.5-2m)', 'Grande (> 2m)'],
        chaises: ['Standard', 'Haute', 'Bureau'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 🏠 MATÉRIAUX
      materiaux: {
        planches_bois: ['1x2', '2x4', '4x4', '6x6'],
        tuyaux: ['1/2"', '3/4"', '1"', '1.5"', '2"'],
        cables_electriques: ['1.5mm²', '2.5mm²', '4mm²', '6mm²', '10mm²'],
        boulons: ['M4', 'M6', 'M8', 'M10', 'M12'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 🎮 LOISIRS
      loisirs: {
        instruments_musique: ['1/4', '1/2', '3/4', '4/4'],
        jeux_video: ['Standard', 'Collector', 'Édition limitée'],
        livres: ['Poche', 'Broché', 'Grand format'],
        jouets: ['Petit', 'Moyen', 'Grand'],
        default: ['Standard']
      },
      
      // 🛒 ALIMENTAIRES
      alimentaires: {
        fruits_legumes: ['Petit', 'Moyen', 'Grand'],
        viandes: ['Petit paquet', 'Moyen paquet', 'Grand paquet'],
        boissons: ['25cl', '33cl', '50cl', '1L', '1.5L', '2L'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 💄 SANTÉ & BEAUTÉ
      santebeaute: {
        produits_beaute: ['30ml', '50ml', '100ml', '200ml', '500ml'],
        parfums: ['30ml', '50ml', '75ml', '100ml'],
        complements_alimentaires: ['30 capsules', '60 capsules', '90 capsules'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 🚢 VOYAGES
      voyages: {
        valises: ['Cabine', 'Moyenne', 'Grande', 'Très grande'],
        sacs_voyage: ['20L', '30L', '40L', '50L', '60L', '70L'],
        default: ['Petit', 'Moyen', 'Grand']
      },
      
      // 🔩 PIÈCES DÉTACHÉES
      pieces_detachees: {
        pneus: ['13"', '14"', '15"', '16"', '17"', '18"', '19"', '20"'],
        batterie: ['Petite', 'Moyenne', 'Grande'],
        freins: ['Petit', 'Moyen', 'Grand'],
        default: ['Standard']
      },
      
      // 🛠️ SERVICES
      services: {
        default: ['Petit projet', 'Moyen projet', 'Grand projet']
      },
      
      // 💼 EMPLOI
      emploi: {
        default: ['Temps partiel', 'Temps plein', 'Stage']
      }
    };
    
    // Si no hay categoría seleccionada
    if (!selectedCategory) return [];
    
    const categoryData = options[selectedCategory];
    if (!categoryData) return [];
    
    // Buscar opciones específicas para subcategoría
    if (selectedSubCategory && categoryData[selectedSubCategory]) {
      return categoryData[selectedSubCategory];
    }
    
    // Intentar coincidencia parcial (por si la subcategoría tiene variaciones)
    if (selectedSubCategory) {
      const matchingKey = Object.keys(categoryData).find(key => 
        selectedSubCategory.includes(key) || key.includes(selectedSubCategory)
      );
      if (matchingKey && matchingKey !== 'default') {
        return categoryData[matchingKey];
      }
    }
    
    // Usar opciones por defecto de la categoría
    return categoryData.default || [];
  }, [selectedCategory, selectedSubCategory]);
  
  // 🎯 DETERMINAR EL TIPO DE CAMPO SEGÚN CATEGORÍA
  const getFieldType = () => {
    const sizeCategories = {
      select: ['vetements', 'sport', 'electromenager', 'informatique', 'telephones', 
               'automobiles', 'meubles', 'voyages', 'pieces_detachees'],
      number: ['materiaux', 'alimentaires', 'santebeaute'],
      text: ['loisirs', 'services', 'emploi']
    };
    
    if (sizeCategories.select.includes(selectedCategory)) return 'select';
    if (sizeCategories.number.includes(selectedCategory)) return 'number';
    return 'text';
  };
  
  const fieldType = getFieldType();
  
  return (
    <Form.Group className="mt-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <Form.Label>
        <span role="img" aria-label="size">📏</span> {t(label)}
      </Form.Label>
      
      {/* SELECT PARA CATEGORÍAS CON OPCIONES PREDEFINIDAS */}
      {fieldType === 'select' && sizeOptions.length > 0 ? (
        <>
          <Form.Select
            name={name}
            value={postData[name] || ''}
            onChange={handleChangeInput}
            className="mb-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="">{t('select_size')}</option>
            {sizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
            <option value="autre">{t('other_size')}</option>
          </Form.Select>
          
          {postData[name] === 'autre' && (
            <Form.Control
              type="text"
              name={`${name}_custom`}
              value={postData[`${name}_custom`] || ''}
              onChange={handleChangeInput}
              placeholder={t('specify_size')}
              className="mt-1"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          )}
        </>
      ) : (
        /* INPUT NUMÉRICO O DE TEXTO PARA OTRAS CATEGORÍAS */
        <Row className="g-2">
          <Col>
            <Form.Control
              type={fieldType}
              name={name}
              value={postData[name] || ''}
              onChange={handleChangeInput}
              placeholder={getPlaceholder()}
              min={fieldType === 'number' ? '0' : undefined}
              step={fieldType === 'number' ? '0.01' : undefined}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          
          {/* UNIDADES PARA CAMPOS NUMÉRICOS */}
          {fieldType === 'number' && (
            <Col xs="auto">
              <Form.Select
                name={`${name}Unit`}
                value={postData[`${name}Unit`] || getDefaultUnit()}
                onChange={handleChangeInput}
                style={{ minWidth: '100px' }}
                dir={isRTL ? 'rtl' : 'ltr'}
              >
                {getUnitOptions()}
              </Form.Select>
            </Col>
          )}
        </Row>
      )}
      
      {/* INFORMACIÓN ADICIONAL SEGÚN CATEGORÍA */}
      {getSizeInfo()}
    </Form.Group>
  );
  
  // 🔧 FUNCIONES AUXILIARES
  
  function getPlaceholder() {
    const placeholders = {
      vetements: 'Ex: M, 42, etc.',
      sport: 'Ex: L, 43, etc.',
      electromenager: 'Ex: 55", 8kg, etc.',
      automobiles: 'Ex: SUV, 1000cc, etc.',
      materiaux: 'Ex: 2x4, M10, etc.',
      alimentaires: 'Ex: 1kg, 500g, etc.',
      default: t('enter_size')
    };
    
    return placeholders[selectedCategory] || placeholders.default;
  }
  
  function getDefaultUnit() {
    const units = {
      vetements: 'cm',
      sport: 'cm',
      materiaux: 'cm',
      alimentaires: 'kg',
      santebeaute: 'ml',
      default: 'cm'
    };
    
    return units[selectedCategory] || units.default;
  }
  
  function getUnitOptions() {
    const unitSets = {
      vetements: [
        { value: 'cm', label: 'cm' },
        { value: 'pouces', label: 'pouces' },
        { value: 'eu', label: 'EU' },
        { value: 'us', label: 'US' }
      ],
      sport: [
        { value: 'cm', label: 'cm' },
        { value: 'pouces', label: '"' },
        { value: 'cc', label: 'cc' }
      ],
      materiaux: [
        { value: 'cm', label: 'cm' },
        { value: 'm', label: 'm' },
        { value: 'mm', label: 'mm' },
        { value: 'pouces', label: '"' }
      ],
      alimentaires: [
        { value: 'kg', label: 'kg' },
        { value: 'g', label: 'g' },
        { value: 'L', label: 'L' },
        { value: 'ml', label: 'ml' }
      ],
      electromenager: [
        { value: 'cm', label: 'cm' },
        { value: 'pouces', label: '"' },
        { value: 'L', label: 'L' },
        { value: 'kg', label: 'kg' }
      ],
      default: [
        { value: 'cm', label: 'cm' },
        { value: 'm', label: 'm' },
        { value: 'mm', label: 'mm' }
      ]
    };
    
    return (unitSets[selectedCategory] || unitSets.default).map(unit => (
      <option key={unit.value} value={unit.value}>{unit.label}</option>
    ));
  }
  
  function getSizeInfo() {
    const info = {
      vetements: (
        <Form.Text className="text-muted">
          💡 {t('clothing_size_tip')}
        </Form.Text>
      ),
      chaussures_homme: (
        <Form.Text className="text-muted">
          👣 {t('shoe_size_tip')}
        </Form.Text>
      ),
      televiseurs: (
        <Form.Text className="text-muted">
          📺 {t('tv_size_tip')}
        </Form.Text>
      ),
      automobiles: (
        <Form.Text className="text-muted">
          🚗 {t('car_size_tip')}
        </Form.Text>
      ),
      default: null
    };
    
    if (selectedSubCategory && info[selectedSubCategory]) {
      return info[selectedSubCategory];
    }
    
    return info[selectedCategory] || info.default;
  }
};

// 🎯 PROPIEDADES POR DEFECTO
TailleField.defaultProps = {
  selectedCategory: '',
  selectedSubCategory: '',
  postData: {},
  handleChangeInput: () => {},
  name: 'taille',
  label: 'Taille'
};

export default TailleField;