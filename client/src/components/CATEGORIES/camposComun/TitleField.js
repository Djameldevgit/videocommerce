// src/components/CATEGORIES/camposComun/TitleField.js
import React from 'react';

const TitleField = ({
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
      <label htmlFor="title" className="form-label fw-bold">
       Titre
        <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={postData?.title || ''}
        onChange={handleChangeInput}
        required
        placeholder={ 'Entrez le titre de l\'annonce'}
   
        className="form-control form-control-lg"
       
      />
     
    </div>
  );
};

export default TitleField;