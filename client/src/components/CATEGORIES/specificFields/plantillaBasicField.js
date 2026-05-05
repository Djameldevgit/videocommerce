// 📁 src/components/CATEGORIES/specificFields/PlantillaBaseFields.js
import React from 'react';
 
// ✅ IMPORTS UNIFICADOS - Mismos en todas las categorías
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
import CouleurField from '../camposComun/CouleurField';
import PriceField from '../camposComun/PriceField';

const PlantillaBaseFields = ({ 
  fieldName,
  mainCategory,      // ← 'electromenager', 'informatique', etc.
  subCategory,       // ← 'televiseurs', 'ordinateurs_portables', etc.
  postData, 
  handleChangeInput,
  isRTL,
  t
}) => {
  // 🔥 OBJETO DE CAMPOS BASE (igual en todas las categorías)
  const baseFields = {
    // ✅ MARCA - SIEMPRE IGUAL
    'marque': (
      <MarqueField
        key="marque"
        mainCategory={mainCategory}      // ← Pasar la categoría dinámica
        subCategory={subCategory}        // ← Pasar la subcategoría dinámica
        fieldName="marque"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // ✅ MODELO - SIEMPRE IGUAL  
    'modele': (
      <ModeleField
        key="modele"
        mainCategory={mainCategory}      // ← MISMA categoría
        subCategory={subCategory}        // ← MISMA subcategoría
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="modele"
        brandField="marque"              // ← Campo donde está la marca
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // ✅ CAMPOS COMPARTIDOS (opcionales)
    'couleur': (
      <CouleurField
        key="couleur"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="couleur"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'prix': (
      <PriceField
        key="prix"
        fieldName="prix"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    )
  };
  
  // 🔥 CAMPOS ESPECÍFICOS DE ESTA CATEGORÍA
  const specificFields = {
    // ... campos específicos de cada categoría
  };
  
  // COMBINAR CAMPOS BASE + ESPECÍFICOS
  const allFields = { ...baseFields, ...specificFields };
  
  // Si se pide un campo específico
  if (fieldName) {
    return allFields[fieldName] || null;
  }
  
  // Si no, renderizar todos los campos de la subcategoría
  return (
    <>
      {Object.values(allFields).map((field, index) => (
        <div key={index} className="mb-3">
          {field}
        </div>
      ))}
    </>
  );
};

export default PlantillaBaseFields;