import React from 'react';
import { Form } from 'react-bootstrap';

const EchangeField = ({ 
  postData, 
  handleChangeInput, 
  name = 'echange'
}) => {
  
  return (
    <Form.Group>
      <Form.Label>🔄 Échange</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">-- Option d'échange --</option>
        <option value="accepte_echange">Accepte échange</option>
        <option value="pas_echange">Pas d'échange</option>
        <option value="echange_uniquement">Échange uniquement</option>
      </Form.Control>
    </Form.Group>
  );
};

export default EchangeField;