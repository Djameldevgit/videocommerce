import React from 'react';
import { Form } from 'react-bootstrap';

const DateField = ({ postData, handleChangeInput, isRTL,   name, label, minDate }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Form.Group>
      <Form.Label>📅 Date</Form.Label>
      <Form.Control
        type="date"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        min={minDate || today}
      />
    </Form.Group>
  );
};

export default DateField;