// campos/voyages/TypeHebergementField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto

const TypeHebergementField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  
}) => {   
  const { t } = useTranslation(); // ← Usa el hook aquí

  return (
    <Form.Group>
      <Form.Label>🏠 {t('accommodation_type', "Type d'hébergement")}</Form.Label>
      <Form.Select
        name="typeHebergement"
        value={postData.typeHebergement || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_accommodation', 'Sélectionnez')}</option>
        <option value="appartement">Appartement</option>
        <option value="villa">Villa</option>
        <option value="hotel">Hôtel</option>
        <option value="riad">Riad</option>
        <option value="gite">Gîte</option>
        <option value="camping">Camping</option>
      </Form.Select>
    </Form.Group>
  );
};

export default TypeHebergementField;