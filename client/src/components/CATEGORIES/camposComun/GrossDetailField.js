import React from 'react';
import { Form } from 'react-bootstrap';

const GrossDetailField = ({ postData, handleChangeInput, isRTL, name = 'grossdetail', label = 'Gross / Détail' }) => {
  
  return (
    <Form.Group>
      <Form.Label>📦 Vente en</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">Sélectionner...</option>
        <option value="gross">En gros</option>
        <option value="detail">Au détail</option>
        <option value="both">Les deux (gros et détail)</option>
      </Form.Select>
    </Form.Group>
  );
};

export default GrossDetailField;