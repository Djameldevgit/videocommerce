import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EtatField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  name = 'etat', 
  label = 'etat',
  options = null // Permite personalizar opciones
}) => {
  const { t } = useTranslation('camposcomunes');
  
  // Opciones por defecto (estado general del producto)
  const defaultOptions = [
    { value: 'new', label: 'Neuf' },
    { value: 'like_new', label: 'Comme neuf' },
    { value: 'good', label: 'Bon etat' },
    { value: 'used', label: 'Utilise' },
    { value: 'refurbished', label: 'Reconditionne' },
    { value: 'defective', label: 'Defectueux' }
  ];
  
  const displayOptions = options || defaultOptions;

  return (
    <Form.Group>
      <Form.Label>🏷️ {t(label)}</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_etat', 'Sélectionnez l\'état')}</option>
        {displayOptions.map(option => (
          <option key={option.value} value={option.value}>
            {t(option.label, option.label)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default EtatField;