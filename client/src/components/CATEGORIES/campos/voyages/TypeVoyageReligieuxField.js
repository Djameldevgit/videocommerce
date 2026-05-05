// campos/voyages/TypeVoyageReligieuxField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const TypeVoyageReligieuxField = ({ 
  postData, 
  handleChangeInput, 
  isRTL ,
 
  // ← NO necesitas recibir t como prop
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  
  return (
    <Form.Group>
      <Form.Label>🕌 {t('religious_trip_type', 'Type de voyage religieux')}</Form.Label>
      <Form.Select
        name="typeVoyageReligieux"
        value={postData.typeVoyageReligieux || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_religious_trip', 'Sélectionnez')}</option>
        <option value="hajj">Hajj</option>
        <option value="omra">Omra</option>
        <option value="hajj_omra">Hajj & Omra</option>
      </Form.Select>
    </Form.Group>
  );
};

export default TypeVoyageReligieuxField;