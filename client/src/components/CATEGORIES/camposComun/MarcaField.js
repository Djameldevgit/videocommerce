// src/components/CATEGORIES/camposComun/MarcaField.js
import React from 'react';

const MarcaField = ({
  mainCategory,
  subCategory,
  fieldName,
  postData,
  handleChangeInput,
  isRTL,
  required = false,
  placeholder = "Entrez la marque...)",
  className = "form-control form-control-lg",
  ...props
}) => {
  return (
    <div className="form-field mb-3">
      <label htmlFor="marca" className="form-label fw-bold">
        Marque {required && <span className="text-danger">*</span>}
      </label>
      <input
        type="text"
        id="marca"
        name="marca"
        value={postData?.marca || ''}
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

export default MarcaField;