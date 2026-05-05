import React from 'react';

// 📝 Campos básicos
 import TitleField from './TitleField';
 import ReferenceField from './RefereceField';

import DescriptionField from './DescriptionField';

// 🏷️ Campos de estado y características
import EtatField from './EtatField';
import TailleField from './TailleField';
import CouleurField from './CouleurField';
import QuantiteField from './QuantiteField';

// 💰 Campos de precio y negociación
import PriceField from './PriceField';
 
import TypeOffreField from './TypeOffreField';
import EchangeField from './EchangeField';

// 📍 Campos de localización
import WilayaField from './WilayaField';
import CommuneField from './CommuneField';
import AdresseField from './AdresseField';

// 📞 Campos de contacto
import TelephoneField from './TelephoneField';
import EmailField from './EmailField';

// 🚚 Campos de entrega
import LivraisonField from './LivraisonFileld';
import Unite from './Unite';

 
// 🔧 Función para renderizar cualquier campo común
export const renderCommonField = (fieldName, props) => {
  const {
    postData = {},
    handleChangeInput,
    isRTL = false,
    t = (key, fallback) => fallback,
    mainCategory,
    subCategory,
    fieldConfig = {},
    wilayasData = [],
    communesList = [],
    selectedWilaya = null,
    onWilayaChange = null
  } = props;

  // Configuración específica del campo
  const config = {
    name: fieldConfig.name || fieldName,
    label: fieldConfig.label || getDefaultLabel(fieldName),
    required: fieldConfig.required || false,
    disabled: fieldConfig.disabled || false,
    ...fieldConfig
  };

  // Mapeo de campos a componentes
  const fieldComponents = {
    // 📝 Campos básicos
    'title': (
      <TitleField
        key="title"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    'reference': (
      <ReferenceField
        key="reference"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    'description': (
      <DescriptionField
        key="description"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // 🏷️ Campos de estado y características
    'etat': (
      <EtatField
        key="etat"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'taille': (
      <TailleField
        key="taille"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'couleur': (
      <CouleurField
        key="couleur"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'quantite': (
      <QuantiteField
        key="quantite"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    // 💰 Campos de precio y negociación
    'prix': (
      <PriceField
        key="prix"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    'unitePrix': (
      <Unite
        key="unitePrix"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    'typeOffre': (
      <TypeOffreField
        key="typeOffre"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    'echange': (
      <EchangeField
        key="echange"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
      />
    ),
    
    // 📍 Campos de localización
    'wilaya': (
      <WilayaField
        key="wilaya"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        onWilayaChange={onWilayaChange}
        wilayasData={wilayasData}
      />
    ),
    
    'commune': (
      <CommuneField
        key="commune"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        communes={communesList}
        wilayaSelected={selectedWilaya}
      />
    ),
    
    'adresse': (
      <AdresseField
        key="adresse"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // 📞 Campos de contacto
    'telephone': (
      <TelephoneField
        key="telephone"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'email': (
      <EmailField
        key="email"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // 🚚 Campos de entrega
    'livraison': (
      <LivraisonField
        key="livraison"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name={config.name}
        label={config.label}
        required={config.required}
        disabled={config.disabled}
        isRTL={isRTL}
        t={t}
      />
    )
  };

  const FieldComponent = fieldComponents[fieldName];
  
  if (!FieldComponent) {
    console.warn(`⚠️ Campo común "${fieldName}" no encontrado en camposComunField`);
    
    // Campo genérico como fallback
    return (
      <div className="mb-3">
        <label>{config.label} {config.required && '*'}</label>
        <input
          type="text"
          name={config.name}
          value={postData[config.name] || ''}
          onChange={handleChangeInput}
          required={config.required}
          disabled={config.disabled}
          className="form-control"
          placeholder={`Entrez ${config.label.toLowerCase()}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
    );
  }

  return FieldComponent;
};

// 🔧 Función para obtener etiquetas por defecto en francés
const getDefaultLabel = (fieldName) => {
  const labels = {
    'title': '📝 Titre',
    'reference': '🏷️ Référence',
    'description': '📄 Description',
    'etat': '🔧 État',
    'taille': '📏 Taille',
    'couleur': '🎨 Couleur',
    'quantite': '📦 Quantité',
    'prix': '💰 Prix',
    'unitePrix': '💵 Unité de prix',
    'typeOffre': '🏷️ Type d\'offre',
    'echange': '🔄 Échange',
    'wilaya': '📍 Wilaya',
    'commune': '🏘️ Commune',
    'adresse': '🏠 Adresse',
    'telephone': '📞 Téléphone',
    'email': '📧 Email',
    'livraison': '🚚 Livraison'
  };
  
  return labels[fieldName] || fieldName;
};

// 📋 Lista de todos los campos comunes disponibles
export const ALL_COMMON_FIELDS = [
  'title',
  'reference',
  'description',
  'etat',
  'taille',
  'couleur',
  'quantite',
  'prix',
  'unitePrix',
  'typeOffre',
  'echange',
  'wilaya',
  'commune',
  'adresse',
  'telephone',
  'email',
  'livraison'
];

// 🎯 Campos requeridos por defecto
export const REQUIRED_COMMON_FIELDS = [
  'title',
  'description',
  'etat',
  'prix',
  'wilaya',
  'commune',
  'telephone'
];

// 📊 Campos agrupados por categoría
export const GROUPED_COMMON_FIELDS = {
  'informations': ['title', 'reference', 'description'],
  'caracteristiques': ['etat', 'taille', 'couleur', 'quantite'],
  'prix': ['prix', 'unitePrix', 'typeOffre', 'echange'],
  'localisation': ['wilaya', 'commune', 'adresse'],
  'contact': ['telephone', 'email'],
  'livraison': ['livraison']
};

// 🔄 Función para renderizar múltiples campos comunes
export const renderMultipleCommonFields = (fieldNames, props) => {
  return fieldNames.map(fieldName => (
    <div key={fieldName} className="mb-3">
      {renderCommonField(fieldName, props)}
    </div>
  ));
};

// 🏗️ Componente wrapper para campos comunes
const CamposComunField = ({ fieldName, ...props }) => {
  return renderCommonField(fieldName, props);
};

export default CamposComunField;