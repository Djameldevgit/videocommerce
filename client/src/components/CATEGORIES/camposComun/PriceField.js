// src/components/CATEGORIES/camposComun/PriceField.js
import React from 'react';

const PriceField = ({
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
      <label htmlFor="price" className="form-label fw-bold">
        {t ? t('price') : 'Prix'} 
        <span className="text-danger">*</span>
      </label>
      <div className="input-group">
        <input
          type="number"
          id="price"
          name="price"
          value={postData?.price || ''}
          onChange={handleChangeInput}
          required
          min="0"
          step="0.01"
          placeholder={t ? t('enterPrice') : '0.00'}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="form-control form-control-lg"
          style={{
            textAlign: isRTL ? 'right' : 'left'
          }}
        />
        <span className="input-group-text bg-light">
          {postData?.unite || 'DA'}
        </span>
      </div>
      <div className="form-text text-muted">
        {t ? t('priceHelp') : 'Indiquez un prix réaliste pour attirer plus d\'acheteurs'}
      </div>
    </div>
  );
};

export default PriceField;