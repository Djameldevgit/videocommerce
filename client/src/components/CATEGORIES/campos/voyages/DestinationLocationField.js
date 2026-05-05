// campos/voyages/DestinationLocationField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const DestinationLocationField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
 
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>🗺️ {t('destination_location', 'Lieu de destination')}</Form.Label>
      <Form.Control
        type="text"
        name="destinationLocation"
        value={postData.destinationLocation || ''}
        onChange={handleChangeInput}
        placeholder={t('enter_destination', 'Ex: Paris, Istanbul...')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};

export default DestinationLocationField;