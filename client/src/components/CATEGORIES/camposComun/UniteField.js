import React from 'react';
import { Form } from 'react-bootstrap';

const UniteField = ({ 
  postData, 
  handleChangeInput, 
  name = 'unitePrix'
}) => {
  
  return (
    <Form.Group>
      <Form.Label>💰 Unité de prix</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">-- Sélectionnez une unité --</option>
        <option value="millions">Millions</option>
        <option value="da">DA</option>
        <option value="miliard_da">Miliard DA</option>
        <option value="m2">m²</option>
        <option value="millions_m2">Millions m²</option>
        <option value="da_m2">DA m²</option>
      </Form.Control>
    </Form.Group>
  );
};

export default UniteField;
      
    