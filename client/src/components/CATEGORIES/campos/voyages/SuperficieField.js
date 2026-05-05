// campos/SuperficieField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SuperficieField = ({ 
  postData, 
  handleChangeInput, 
  isRTL,
  name = 'superficie',
  label = 'surface',
  placeholder = 'Ex: 90',
  min = 0,
  step = 0.1,
  className = ''
}) => {
  const { t } = useTranslation();
  
  return (
    <Form.Group className={`mb-3 ${className}`}>
      <Form.Label className="fw-semibold">
        <span role="img" aria-label="surface">📏</span> {t(label, 'Superficie')} (m²)
      </Form.Label>
      <Form.Control
        type="number"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        placeholder={t(placeholder, placeholder)}
        min={min}
        step={step}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="border-primary"
      />
      <Form.Text className="text-muted">
        {t('enter_surface_in_m2', 'Entrez la surface en mètres carrés')}
      </Form.Text>
    </Form.Group>
  );
};

export default SuperficieField;