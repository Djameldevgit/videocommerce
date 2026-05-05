// src/components/CATEGORIES/camposComun/ModeloField.js
import React from 'react';

const ModeloField = ({
  mainCategory,
  subCategory,
  fieldName,
  postData,
  handleChangeInput,
  isRTL,
  required = false,
  placeholder = "Entrez le modèle...)",
  className = "form-control form-control-lg",
  ...props
}) => {
  return (
    <div className="form-field mb-3">
      <label htmlFor="modelo" className="form-label fw-bold">
      Modèle {required && <span className="text-danger">*</span>}
      </label>
      <input
        type="text"
        id="modelo"
        name="modelo"
        value={postData?.modelo || ''}
        onChange={handleChangeInput}
        required={required}
        placeholder={placeholder}
        className={className}
        dir={isRTL ? 'rtl' : 'ltr'}
        {...props}
      />
    </div>
  );
};

export default ModeloField;