// campos/voyages/CommuneLocationField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const CommuneLocationField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
 
}) => {

  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    
    <Form.Group>
      <Form.Label>🏘️ {t('commune', 'Commune')}</Form.Label>
      <Form.Control
        type="text"
        name="communeLocation"
        value={postData.communeLocation || ''}
        onChange={handleChangeInput}
        placeholder={t('enter_commune', 'Ex: Alger-Centre...')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};

export default CommuneLocationField;