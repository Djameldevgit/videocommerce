import React from 'react';
import { Form } from 'react-bootstrap';
import wilayasData from './json/wilayas.json';

const WilayaField = ({ postData, handleChangeInput, name = 'wilaya', onWilayaChange }) => {
  
  const handleChange = (e) => {
    const value = e.target.value;
    
    // Ejecutar el cambio normal
    handleChangeInput(e);
    
    // Encontrar la wilaya seleccionada
    const selectedWilaya = wilayasData.find(w => w.wilaya === value);
    
    // Notificar al padre
    if (onWilayaChange) {
      onWilayaChange(selectedWilaya || null);
    }
  };

  return (
    <Form.Group>
      <Form.Label>Wilaya</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChange}
      >
        <option value="">Sélectionner une wilaya</option>
        {wilayasData.map((wilaya, index) => (
          <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default WilayaField;