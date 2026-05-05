import React from 'react';
import { Form } from 'react-bootstrap';

const CommuneField = ({ postData, handleChangeInput, name = 'commune', communes = [] }) => {
  
  // DEBUG: Ver qué está recibiendo
  console.log("CommuneField - communes recibido:", communes);
  console.log("CommuneField - Tipo de communes:", typeof communes);
  console.log("CommuneField - Es array?", Array.isArray(communes));
  console.log("CommuneField - Longitud:", communes ? communes.length : 0);

  return (
    <Form.Group>
      <Form.Label>Commune</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        disabled={!communes || communes.length === 0}
      >
        <option value="">
          {!communes || communes.length === 0 
            ? 'Sélectionnez d\'abord une wilaya' 
            : 'Sélectionner une commune'
          }
        </option>
        
        {Array.isArray(communes) && communes.map((commune, index) => {
          // Asegurarnos que commune sea una string
          const communeName = typeof commune === 'string' ? commune : String(commune);
          return (
            <option key={index} value={communeName}>
              {communeName}
            </option>
          );
        })}
      </Form.Select>
    </Form.Group>
  );
};

export default CommuneField;