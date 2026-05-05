// campos/voyages/DestinationTypeField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const DestinationTypeField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>📍 {t('destination_type', 'Type de destination')}</Form.Label>
      <Form.Select
        name="destinationType"
        value={postData.destinationType || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_destination_type', 'Sélectionnez')}</option>
        <option value="local">{t('local_trip', 'Voyage local')}</option>
        <option value="international">{t('international_trip', 'Voyage international')}</option>
      </Form.Select>
    </Form.Group>
  );
};

export default DestinationTypeField;