// specificFields/ImmobiliersFields.js - COMPONENTE ESPECÍFICO PARA IMMOBILIER
import React from 'react';
import { Form } from 'react-bootstrap';

const ImmobilierFields = ({ 
  fieldName, 
  mainCategory, 
  subCategory, 
  articleType, 
  postData, 
  handleChangeInput, 
  isRTL, 
  t 
}) => {
  
  // Mapeo completo de todos los campos Immobilier
  const getAllImmobilierFields = () => {
    const commonFields = {
      'superficie': {
        type: 'number',
        label: 'Superficie (m²)',
        placeholder: 'Ex: 120',
        suffix: 'm²',
        required: true
      },
      'description': {
        type: 'textarea',
        label: 'Description détaillée',
        placeholder: 'Décrivez votre bien en détail...',
        rows: 4
      }
    };
    
    const venteFields = {
      'prix': {
        type: 'number',
        label: 'Prix de vente',
        placeholder: 'Ex: 50000000',
        suffix: 'DA',
        required: true
      }
    };
    
    const locationFields = {
      'loyer': {
        type: 'number',
        label: 'Loyer mensuel',
        placeholder: 'Ex: 50000',
        suffix: 'DA/mois',
        required: true
      },
      'caution': {
        type: 'number',
        label: 'Caution',
        placeholder: 'Ex: 100000',
        suffix: 'DA'
      }
    };
    
    const villaFields = {
      'jardin': {
        type: 'select',
        label: 'Jardin',
        options: [
          { value: '', label: 'Sélectionnez...' },
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' }
        ]
      },
      'piscine': {
        type: 'select',
        label: 'Piscine',
        options: [
          { value: '', label: 'Sélectionnez...' },
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' }
        ]
      },
      'garage': {
        type: 'select',
        label: 'Garage',
        options: [
          { value: '', label: 'Sélectionnez...' },
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' }
        ]
      },
      'etages': {
        type: 'number',
        label: "Nombre d'étages",
        placeholder: 'Ex: 2'
      }
    };
    
    const appartementFields = {
      'etage': {
        type: 'number',
        label: 'Étage',
        placeholder: 'Ex: 3'
      },
      'nombreEtagesImmeuble': {
        type: 'number',
        label: "Nombre total d'étages de l'immeuble",
        placeholder: 'Ex: 5'
      },
      'ascenseur': {
        type: 'select',
        label: 'Ascenseur',
        options: [
          { value: '', label: 'Sélectionnez...' },
          { value: 'oui', label: 'Oui' },
          { value: 'non', label: 'Non' }
        ]
      }
    };
    
    // Combinar campos según selección
    let fields = { ...commonFields };
    
    // Agregar campos según operación
    if (articleType === 'vente') {
      fields = { ...fields, ...venteFields };
    } else if (articleType === 'location' || articleType === 'location_vacances') {
      fields = { ...fields, ...locationFields };
    }
    
    // Agregar campos según tipo de propiedad
    if (subCategory === 'villa') {
      fields = { ...fields, ...villaFields };
    } else if (subCategory === 'appartement') {
      fields = { ...fields, ...appartementFields };
    }
    
    // Campos comunes para varios tipos
    if (subCategory === 'villa' || subCategory === 'appartement') {
      fields['chambres'] = {
        type: 'number',
        label: 'Nombre de chambres',
        placeholder: 'Ex: 3'
      };
      fields['salle_de_bain'] = {
        type: 'number',
        label: 'Salle(s) de bain',
        placeholder: 'Ex: 2'
      };
    }
    
    return fields;
  };
  
  const allFields = getAllImmobilierFields();
  const fieldConfig = allFields[fieldName];
  
  if (!fieldConfig) {
    console.warn(`⚠️ ImmobilierFields: No hay configuración para ${fieldName}`);
    return (
      <Form.Group className="mb-3">
        <Form.Label>{fieldName} (campo no definido)</Form.Label>
        <Form.Control
          type="text"
          name={fieldName}
          value={postData?.[fieldName] || ''}
          onChange={handleChangeInput}
          placeholder={`Entrez ${fieldName}`}
        />
      </Form.Group>
    );
  }
  
  return (
    <Form.Group className="mb-3">
      <Form.Label className={`fw-bold ${isRTL ? 'text-end d-block' : ''}`}>
        {fieldConfig.label}
        {fieldConfig.required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      
      {fieldConfig.type === 'textarea' ? (
        <Form.Control
          as="textarea"
          name={fieldName}
          value={postData?.[fieldName] || ''}
          onChange={handleChangeInput}
          placeholder={fieldConfig.placeholder}
          rows={fieldConfig.rows || 3}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="form-control-sm"
        />
      ) : fieldConfig.type === 'select' ? (
        <Form.Select
          name={fieldName}
          value={postData?.[fieldName] || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
          className="form-control-sm"
        >
          {fieldConfig.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <div className="position-relative">
          <Form.Control
            type={fieldConfig.type}
            name={fieldName}
            value={postData?.[fieldName] || ''}
            onChange={handleChangeInput}
            placeholder={fieldConfig.placeholder}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="form-control-sm"
            min={fieldConfig.type === 'number' ? '0' : undefined}
            step={fieldConfig.type === 'number' ? 'any' : undefined}
          />
          {fieldConfig.suffix && (
            <div className="position-absolute top-50 end-0 translate-middle-y me-2">
              <small className="text-muted">{fieldConfig.suffix}</small>
            </div>
          )}
        </div>
      )}
      
      {fieldConfig.type === 'number' && (
        <Form.Text className="text-muted">
          <small>
            <i className="fas fa-info-circle me-1"></i>
            {fieldConfig.label.includes('Prix') || fieldConfig.label.includes('Loyer')
              ? 'Montant en Dinars algériens (DA)'
              : 'Entrez une valeur numérique'}
          </small>
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default ImmobilierFields;