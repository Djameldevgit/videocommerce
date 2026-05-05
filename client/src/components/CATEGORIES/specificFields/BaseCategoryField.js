// 📂 components/CATEGORIES/specificFields/BaseCategoryField.js
import React from 'react';
import { useTranslation } from 'react-i18next';

// Importar TODOS los campos comunes
import TitleField from '../camposComun/TitleField';
import DescriptionField from '../camposComun/DescriptionField';
import ReferenceField from '../camposComun/ReferenceField';
import LivraisonField from '../camposComun/LivraisonFileld';
import PriceField from '../camposComun/PriceField';
import UniteField from '../camposComun/UniteField';
import TypeOffreField from '../camposComun/TypeOffreField';
import EchangeField from '../camposComun/EchangeField';
import GrossDetailField from '../camposComun/GrossDetailField';
 
import TelephoneField from '../camposComun/PhoneField';
import EtatField from '../camposComun/EtatField';

// Importar configuración
import { getFieldsForCategory } from '../FieldConfig';
import WilayaCommuneField from '../camposComun/WilayaCommuneField';
import EmailField from '../camposComun/EmailField';
 
import ModeloField from '../camposComun/ModeloField';
import MarcaField from '../camposComun/MarcaField';

const BaseCategoryField = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  articleType,
  postData, 
  handleChangeInput,
  isRTL,
  step,  // ← ESTE ES EL STEP ACTUAL (2, 3 o 4)
  additionalFields = {},
  overrideFields = {}
}) => {
  const { t } = useTranslation();
  
  // 1. Obtener configuración de campos desde FieldConfig para el STEP ACTUAL
  const getStepFields = () => {
    // Obtener campos base de FieldConfig para este step
    const baseStepFields = getFieldsForCategory(mainCategory, subCategory, step) || [];
    
    // Obtener campos adicionales específicos para este step
    const additionalStepFields = additionalFields[`step${step}`] || [];
    
    // Obtener campos sobrescritos
    const overrideStepFields = overrideFields[`step${step}`] || [];
    
    // Combinar campos base + adicionales
    let combined = [...baseStepFields, ...additionalStepFields];
    
    // Eliminar campos excluidos (con prefijo '!')
    combined = combined.filter(field => 
      !overrideStepFields.includes(`!${field}`)
    );
    
    // Agregar campos sobrescritos (sin '!')
    const newFields = overrideStepFields.filter(f => !f.startsWith('!'));
    
    const finalFields = [...combined, ...newFields];
    
    console.log(`🔧 BaseCategoryField - Step ${step}:`, {
      base: baseStepFields,
      additional: additionalStepFields,
      final: finalFields
    });
    
    return finalFields;
  };
  
  // 3. Mapeo de TODOS los componentes de campo
  const fieldComponents = {
    // === CAMPOS BASE ===
    'title': (
      <TitleField
        key="title"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="title"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    'marca': (
      <MarcaField
        key="marca"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="marca"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    'modelo': (
      <ModeloField
        key="modelo"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="modelo"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),

    'description': (
      <DescriptionField
        key="description"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="description"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'reference': (
      <ReferenceField
        key="reference"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="reference"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'livraison': (
      <LivraisonField
        key="livraison"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="livraison"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'price': (
      <PriceField
        key="price"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="price"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'unite': (
      <UniteField
        key="unite"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="unite"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'typeOffre': (
      <TypeOffreField
        key="typeOffre"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="typeOffre"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'echange': (
      <EchangeField
        key="echange"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="echange"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'grossdetail': (
      <GrossDetailField
        key="grossdetail"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="grossdetail"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'wilaya': (
      <WilayaCommuneField
        key="wilaya"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="wilaya"
        isRTL={isRTL}
        t={t}
      />
    ),
    'email': (
      <EmailField
        key="email"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="email"
        isRTL={isRTL}
        t={t}
      />
    ),
    'telephone': (
      <TelephoneField
        key="telephone"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="telephone"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'etat': (
      <EtatField
        key="etat"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="etat"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // === CAMPOS ESPECÍFICOS (inyectados desde los hijos) ===
    ...additionalFields.components
  };
  
  // 4. Renderizar SOLO el step actual
  const renderCurrentStep = () => {
    const stepFields = getStepFields();
    
    if (!step || step < 2 || step > 4) {
      return null;
    }
    
    if (stepFields.length === 0) {
      return (
        <div className="alert alert-info text-center py-3">
          <i className="fas fa-info-circle me-2"></i>
          Aucun champ à remplir pour cette étape.
        </div>
      );
    }
    
    return (
      <div className="row g-3">
        {stepFields.map((fieldKey) => {
          // Saltar 'modele' si ya está siendo manejado por 'marque'
          if (fieldKey === 'modele' && fieldComponents['marque']) {
            return null;
          }
          
          const FieldComponent = fieldComponents[fieldKey];
          
          if (!FieldComponent) {
            return (
              <div key={fieldKey} className="col-12 col-md-6">
                <div className="alert alert-warning p-2 small">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  Champ non configuré: {fieldKey}
                </div>
              </div>
            );
          }
          
          return (
            <div key={fieldKey} className="col-12 col-md-6">
              <div className="field-wrapper p-3 border rounded bg-light h-100">
                {FieldComponent}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // 5. Renderizar según el modo
  if (step) {
    // 🔥 SOLO RENDERIZAR EL STEP ACTUAL
    return (
      <div className="step-fields">
        {renderCurrentStep()}
      </div>
    );
  }
  
  if (fieldName) {
    return fieldComponents[fieldName] || null;
  }
  
  return null;
};

BaseCategoryField.defaultProps = {
  additionalFields: {},
  overrideFields: {}
};

export default BaseCategoryField;