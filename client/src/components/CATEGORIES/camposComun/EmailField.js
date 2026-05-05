// 📂 src/components/CATEGORIES/camposComun/EmailField.js
import React from 'react';

const EmailField = ({
  mainCategory,
  subCategory,
  fieldName,
  postData,
  handleChangeInput,
  isRTL,
  ...props
}) => {
  
  return (
    <div className="form-field">
      <label htmlFor="email" className="form-label fw-bold">
        Email
        <span className="text-danger">*</span>
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={postData?.email || ''}
        onChange={handleChangeInput}
        required
        placeholder="Entrez votre adresse email"
        className="form-control form-control-lg"
      />
      <small className="text-muted">
        Votre email ne sera pas affiché publiquement
      </small>
    </div>
  );
};

export default EmailField;
