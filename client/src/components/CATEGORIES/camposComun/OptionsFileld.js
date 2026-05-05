// 📂 components/camposComun/OptionsField.js
import React, { useState } from 'react';

const OptionsField = ({ postData, handleChangeInput, isRTL, t }) => {
  const [selectedOptions, setSelectedOptions] = useState(postData.options || []);
  
  const availableOptions = [
    'Climatisation', 'GPS', 'Caméra de recul', 'Toit ouvrant',
    'Sièges cuir', 'ABS', 'Airbags', 'Direction assistée',
    'Vitres électriques', 'Verrouillage centralisé', 'Autoradio'
  ];
  
  const handleOptionToggle = (option) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(opt => opt !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newOptions);
    handleChangeInput({
      target: { name: 'options', value: newOptions }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        {isRTL ? 'خيارات إضافية' : 'Options supplémentaires'}
      </label>
      <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {availableOptions.map(option => (
          <div key={option} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`option-${option}`}
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionToggle(option)}
            />
            <label className="form-check-label" htmlFor={`option-${option}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsField;