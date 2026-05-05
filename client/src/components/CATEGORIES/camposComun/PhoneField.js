import React from 'react';
import { Form } from 'react-bootstrap';

const PhoneField = ({ postData, handleChangeInput, isRTL, name = 'phone', label = 'phone' }) => {
  
  const handlePhoneChange = (e) => {
    // Permitir solo números y los caracteres +, -, espacio
    const value = e.target.value.replace(/[^\d+\-\s]/g, '');
    
    // Crear un nuevo evento con el valor filtrado
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: value
      }
    };
    
    handleChangeInput(newEvent);
  };

  return (
    <Form.Group>
      <Form.Label>📞 Téléphone</Form.Label>
      <Form.Control
        type="tel"
        name={name}
        value={postData[name] || ''}
        onChange={handlePhoneChange}
        placeholder={'Téléphone'}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};

export default PhoneField;