// campos/voyages/CapacityField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const CapacityField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  
}) => {
 
const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>👥 {t('capacity', 'Capacité (personnes)')}</Form.Label>
      <Form.Control
        type="number"
        name="capacity"
        value={postData.capacity || ''}
        onChange={handleChangeInput}
        placeholder={t('enter_capacity', 'Ex: 2, 4, 6...')}
        min="1"
        max="50"
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};

export default CapacityField;