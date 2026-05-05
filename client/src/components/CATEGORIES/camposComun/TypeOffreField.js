import React from 'react';
import { Form } from 'react-bootstrap';

const TypeOffreField = ({ 
  postData, 
  handleChangeInput, 
  name = 'typeOffre'
}) => {
  
  return (
    <Form.Group>
      <Form.Label>🏷️ Type d'offre</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">-- Sélectionnez le type --</option>
        <option value="fixe">Prix fixe</option>
        <option value="negociable">Prix négociable</option>
        <option value="offert">Offert/Gratuit</option>
      </Form.Control>
    </Form.Group>
  );
};

export default TypeOffreField;