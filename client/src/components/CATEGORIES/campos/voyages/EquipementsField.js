// campos/voyages/EquipmentsField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const EquipmentsField = ({ 
  postData, 
  handleChangeInput, 
  
 
}) => {
  const { t } = useTranslation(); // ← Usa el hook aquí
  return (
    <Form.Group>
      <Form.Label>🏡 {t('equipments', 'Équipements')}</Form.Label>
      <div className="border rounded p-3 bg-light">
        <Form.Check
          type="checkbox"
          id="equip_wifi"
          name="equipments_wifi"
          label="📶 Wi-Fi"
          checked={postData.equipments_wifi || false}
          onChange={handleChangeInput}
          className="mb-2"
        />
        <Form.Check
          type="checkbox"
          id="equip_piscine"
          name="equipments_piscine"
          label="🏊 Piscine"
          checked={postData.equipments_piscine || false}
          onChange={handleChangeInput}
          className="mb-2"
        />
      </div>
    </Form.Group>
  );
};

export default EquipmentsField;