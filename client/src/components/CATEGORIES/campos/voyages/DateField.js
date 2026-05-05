// campos/voyages/DateField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const DateField = ({ 
  name, 
  label, 
  minDate, 
  postData, 
  handleChangeInput, 
  isRTL, 
 
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>📅 {t(label, label)}</Form.Label>
      <Form.Control
        type="date"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        min={minDate || new Date().toISOString().split('T')[0]}
      />
    </Form.Group>
  );
};

export default DateField;