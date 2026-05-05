// src/components/CATEGORIES/camposComun/DescriptionField.js
import React from 'react';

const DescriptionField = ({
  mainCategory,
  subCategory,
  postData,
  handleChangeInput,
  fieldName,
  isRTL,
  t,
  ...props
}) => {
  
  return (
    <div className="form-field mb-3">
      <label htmlFor="description" className="form-label fw-bold">
        {t ? t('description') : 'Description'} 
        <span className="text-danger">*</span>
      </label>
      <textarea
        id="description"
        name="description"
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
        placeholder={t ? t('enterDescription') : 'Décrivez votre produit ou service en détail...'}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control form-control-lg"
        rows="4"
        style={{
          textAlign: isRTL ? 'right' : 'left',
          resize: 'vertical'
        }}
      />
      <div className="form-text text-muted">
        {t ? t('descriptionHelp') : 'Décrivez tous les détails importants'}
      </div>
    </div>
  );
};

export default DescriptionField;