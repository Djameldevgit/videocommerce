import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const QuantiteField = ({ postData, handleChangeInput, isRTL, name = 'quantite', label = 'quantity' }) => {
  const { t } = useTranslation('camposcomunes');
  
  return (
    <Form.Group>
      <Form.Label>📦 {t(label)}</Form.Label>
      <Form.Control
        type="number"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        placeholder={t('enter_quantity')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};
 

export default QuantiteField;