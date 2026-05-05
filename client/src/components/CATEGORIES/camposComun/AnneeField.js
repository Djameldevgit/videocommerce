// 📂 components/camposComun/AnneeField.js
import React from 'react';

const AnneeField = ({ postData, handleChangeInput, isRTL, t }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        {isRTL ? 'السنة' : 'Année'}
        <span className="text-danger ms-1">*</span>
      </label>
      <select
        name="annee"
        className="form-control"
        value={postData.annee || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">{t('common.select')}</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default AnneeField;