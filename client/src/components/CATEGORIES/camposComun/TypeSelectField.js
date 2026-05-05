import React from 'react';
import { Form } from 'react-bootstrap';

const TypeSelectField = ({ postData, handleChangeInput, isRTL, t, name, label, category, subCategory, options }) => {
  // Puedes cargar opciones dinámicamente basado en categoría/subcategoría
  const getOptions = () => {
    if (options) return options;
    
    // Opciones por defecto basadas en el nombre del campo
    const defaultOptions = {
      'typeVoyage': ['culturel', 'plage', 'montagne', 'aventure', 'romantique', 'affaires'],
      'typeHebergement': ['appartement', 'villa', 'hotel', 'riad', 'maison_hote', 'camping'],
      'etat': ['neuf', 'tres_bon', 'bon', 'moyen', 'usage'],
      // Agrega más mapeos según necesites
    };
    
    return defaultOptions[name] || [];
  };
  
  const fieldOptions = getOptions();
  
  return (
    <Form.Group>
      <Form.Label>🎯 {t(label, name.replace('type', 'Type de '))}</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_option', 'Sélectionnez')}</option>
        {fieldOptions.map(option => (
          <option key={option} value={option}>
            {t(`options.${option}`, option.replace(/_/g, ' '))}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default TypeSelectField;