// Exportar TODOS los componentes comunes
/*export { default as PrixField } from './PrixField';
export { default as DescriptionField } from './DescriptionField';
export { default as PhoneField } from './PhoneField';
export { default as EtatField } from './EtatField';
export { default as WilayaField } from './WilayaField';
export { default as CommuneField } from './CommuneField';
export { default as MarqueField } from './MarqueField';
export { default as ModeleField } from './ModeleField';

export { default as CouleurField } from './CouleurField';
export { default as TailleField } from './TailleField';
export { default as QuantiteField } from './QuantiteField';
export { default as SuperficieField } from './SuperficieField';
export { default as DateField } from './DateField';
export { default as TypeSelectField } from './TypeSelectField';*/
// camposComun/index.js
// camposComun/index.js
import MarqueField from './MarqueField';
import ModeleField from './ModeleField';
 import PrixField from './PrixField';
import TailleField from './TailleField';
import EtatField from './EtatField';
import WilayaField from './WilayaField';
import DescriptionField from './DescriptionField';
import PhoneField from './PhoneField';
import DateField from './DateField';
import QuantiteField from './QuantiteField';

 
// Exportación individual
export {
  MarqueField,
  ModeleField,
  PrixField,
  TailleField,
  EtatField,
  WilayaField,
  DescriptionField,
  PhoneField,
  DateField,
  QuantiteField
};

// 🗺️ MAPEO PARA FIELD RENDERER (VERSIÓN SIMPLIFICADA)
export const COMMON_FIELDS_MAP = {
  // Marcas
  'marque': 'MarqueField',
  'marqueauto': 'MarqueField',
  'marquemoto': 'MarqueField',
  'marqueCompatible': 'MarqueField',
  'marqueMateriel': 'MarqueField',
  'marqueOutil': 'MarqueField',
  'marqueSport': 'MarqueField',
  'marqueProduit': 'MarqueField',
  
  // Modelos
  'modele': 'ModeleField',
  'modeleCompatible': 'ModeleField',
  'modeleMateriel': 'ModeleField',
  
  // Precios
  'prix': 'PrixField',
  'price': 'PrixField',
  'loyer': 'PrixField',
  'salaire': 'PrixField',
  'pricePerPerson': 'PrixField',
  'pricePerNight': 'PrixField',
  'loyerMensuel': 'PrixField',
  'loyerSemaine': 'PrixField',
  'budgetMax': 'PrixField',
  
  // Tamaños
  'taille': 'TailleField',
  'tailleEcran': 'TailleField',
  'pointure': 'TailleField',
  'superficie': 'TailleField',
  'dimensions': 'TailleField',
  
  // Estado
  'etat': 'EtatField',
  'etatPiece': 'EtatField',
  'etatEquipement': 'EtatField',
  'etatMateriel': 'EtatField',
  
  // Ubicación
  'wilaya': 'WilayaField',
  'wilayaLocation': 'WilayaField',
  'destinationWilaya': 'WilayaField',
  'commune': 'WilayaField',
  
  // Contacto
  'contactPhone': 'PhoneField',
  'numeroTelephone': 'PhoneField',
  
  // Descripción
  'description': 'DescriptionField',
  
  // Fechas
  'dateDebut': 'DateField',
  'startDate': 'DateField',
  
  // Cantidad
  'quantite': 'QuantiteField',
  'nombrePieces': 'QuantiteField',
  'nombreChambres': 'QuantiteField',
  'capacite': 'QuantiteField'
};