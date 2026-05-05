// src/components/CATEGORIES/specificFields/AlimentairesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// Campos específicos para alimentaires (si los hay)
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';

const InformatiqueFields = (props) => {
  // Campos adicionales específicos para alimentaires
  const additionalFields = {
    // Componentes personalizados
    components: {
      'marque': (
        <MarqueField
          key="marque"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="marque"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),
      'modele': (
        <ModeleField
          key="modele"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="modele"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      )
    },
    
    // Campos adicionales por step (opcional)
    step2: ['marque', 'modele'],
    
    // Campos personalizados con prefijo "custom:"
    customComponents: {
      // Para campos muy específicos
    }
  };
  
  return (
    <BaseCategoryField
      {...props}
      additionalFields={additionalFields}
    />
  );
};
 

export default InformatiqueFields;