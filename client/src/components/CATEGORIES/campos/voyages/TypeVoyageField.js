// campos/voyages/TypeVoyageField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto

const TypeVoyageField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
 
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>🎯 {t('trip_type', 'Type de voyage')}</Form.Label>
      <Form.Select
        name="typeVoyage"
        value={postData.typeVoyage || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_trip_type', 'Sélectionnez')}</option>
        <option value="culturel">Voyage culturel</option>
        <option value="plage">Voyage plage</option>
        <option value="montagne">Voyage montagne</option>
        <option value="aventure">Voyage aventure</option>
        <option value="religieux">Voyage religieux</option>
        <option value="affaires">Voyage d'affaires</option>
      </Form.Select>
    </Form.Group>
  );
};

export default TypeVoyageField;