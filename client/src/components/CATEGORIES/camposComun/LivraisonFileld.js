// components/camposComun/LivraisonField.js
import React from 'react';
import { Form } from 'react-bootstrap';

const LivraisonField = ({ 
  postData, 
  handleChangeInput, 
  name = 'livraison'
}) => {
  
  return (
    <Form.Group>
      <Form.Label>🚚 Livraison disponible</Form.Label>
      <div className="d-flex gap-3">
        <Form.Check
          type="radio"
          id="livraison_oui"
          name={name}
          label="✅ Oui"
          value="oui"
          checked={postData[name] === 'oui'}
          onChange={handleChangeInput}
        />
        <Form.Check
          type="radio"
          id="livraison_non"
          name={name}
          label="❌ Non"
          value="non"
          checked={postData[name] === 'non'}
          onChange={handleChangeInput}
        />
      </div>
    </Form.Group>
  );
};

export default LivraisonField;