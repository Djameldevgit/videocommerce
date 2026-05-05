import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// 🔧 Componentes Campos Comunes
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
import CouleurField from '../camposComun/CouleurField';
import QuantiteField from '../camposComun/QuantiteField';
import PriceField from '../camposComun/PriceField';
import TailleField from '../camposComun/TailleField';

// 💰 Componentes de Precio y Negociación (los que acabamos de crear)
import UnitePrixField from '../camposComun/UniteField';
import TypeOffreField from '../camposComun/TypeDeVenteField';
import EchangeField from '../camposComun/EchangeField';

// 📍 Componentes de Localización
import WilayaField from '../camposComun/WilayaField';
import CommuneField from '../camposComun/CommuneField';
import LocalisationWrapper from '../camposComun/WilayaCommuneField'
import WilayaCommunesField from '../camposComun/WilayaCommuneField';
const TelephonesFields = ({ 
  fieldName,
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  onWilayaChange // Para la integración de wilaya/commune
}) => {
  const { t } = useTranslation();
  
  // Estado local para manejar las communes según wilaya seleccionada
  const [communesList, setCommunesList] = React.useState([]);
  const [selectedWilaya, setSelectedWilaya] = React.useState(null);

  // Manejar cambio de wilaya
  const handleWilayaChange = (wilaya) => {
    if (wilaya) {
      setSelectedWilaya(wilaya.wilaya);
      setCommunesList(wilaya.commune || []);
      // También actualizar en el estado principal si es necesario
      if (onWilayaChange) {
        onWilayaChange(wilaya);
      }
    } else {
      setSelectedWilaya(null);
      setCommunesList([]);
    }
  };

  // 🔥 OBJETO DE CAMPOS - ¡COMPLETO Y ORGANIZADO!
  const fields = {
    // 🔧 CAMPOS BÁSICOS DEL PRODUCTO
    'marque': (
      <MarqueField
        key="marque"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="marque"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'modele': (
      <ModeleField
        key="modele"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="modele"
        brandField="marque"
        isRTL={isRTL}
        t={t}
      />
    ),
    
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
    
    'quantite': (
      <QuantiteField
        key="quantite"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="quantite"
      />
    ),
    
    'taille': (
      <TailleField
        key="taille"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="taille"
      />
    ),
    
    // 💰 CAMPOS DE PRECIO Y NEGOCIACIÓN
    'prix': (
      <PriceField
        key="prix"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="prix"
      />
    ),
    
    'unitePrix': (
      <UnitePrixField
        key="unitePrix"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="unitePrix"
      />
    ),
    
    'typeOffre': (
      <TypeOffreField
        key="typeOffre"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="typeOffre"
      />
    ),
    
    'echange': (
      <EchangeField
        key="echange"
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="echange"
      />
    ),
    
    // 📍 CAMPOS DE LOCALIZACIÓN
    
    // En tu mapeo de campos, cambia esto:
'wilaya': (
  <WilayaCommunesField
    key="wilaya"
    postData={postData}
    handleChangeInput={handleChangeInput}
  />
),
 
  
    
    // 📱 CAMPOS ESPECÍFICOS DE TELÉFONOS
    'etat': (
      <Form.Group className="mb-3" key="etat">
        <Form.Label>🔧 {t('condition', 'État')}</Form.Label>
        <Form.Select
          name="etat"
          value={postData.etat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">Neuf (scellé)</option>
          <option value="tres_bon">Très bon état</option>
          <option value="bon">Bon état</option>
          <option value="usage">État d'usage</option>
          <option value="reparation">À réparer</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteStockage': (
      <Form.Group className="mb-3" key="capaciteStockage">
        <Form.Label>💾 {t('storage', 'Stockage')} (GB)</Form.Label>
        <Form.Select
          name="capaciteStockage"
          value={postData.capaciteStockage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_storage', 'Sélectionnez')}</option>
          <option value="16">16 GB</option>
          <option value="32">32 GB</option>
          <option value="64">64 GB</option>
          <option value="128">128 GB</option>
          <option value="256">256 GB</option>
          <option value="512">512 GB</option>
          <option value="1024">1 TB</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'systemeExploitation': (
      <Form.Group className="mb-3" key="systemeExploitation">
        <Form.Label>🖥️ {t('os', 'Système d\'exploitation')}</Form.Label>
        <Form.Select
          name="systemeExploitation"
          value={postData.systemeExploitation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_os', 'Sélectionnez')}</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="windows">Windows Phone</option>
          <option value="autres">Autres</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'reseau': (
      <Form.Group className="mb-3" key="reseau">
        <Form.Label>📶 {t('network', 'Réseau')}</Form.Label>
        <Form.Select
          name="reseau"
          value={postData.reseau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_network', 'Sélectionnez')}</option>
          <option value="5g">5G</option>
          <option value="4g">4G/LTE</option>
          <option value="3g">3G</option>
          <option value="2g">2G</option>
          <option value="dual_sim">Dual SIM</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'camera': (
      <Form.Group className="mb-3" key="camera">
        <Form.Label>📸 {t('camera', 'Caméra')} (MP)</Form.Label>
        <Form.Select
          name="camera"
          value={postData.camera || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_camera', 'Sélectionnez')}</option>
          <option value="8">8 MP</option>
          <option value="12">12 MP</option>
          <option value="16">16 MP</option>
          <option value="20">20 MP</option>
          <option value="48">48 MP</option>
          <option value="64">64 MP</option>
          <option value="108">108 MP</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'batterie': (
      <Form.Group className="mb-3" key="batterie">
        <Form.Label>🔋 {t('battery', 'Batterie')} (mAh)</Form.Label>
        <Form.Select
          name="batterie"
          value={postData.batterie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_battery', 'Sélectionnez')}</option>
          <option value="2000">2000 mAh</option>
          <option value="3000">3000 mAh</option>
          <option value="4000">4000 mAh</option>
          <option value="5000">5000 mAh</option>
          <option value="6000">6000+ mAh</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'garantie': (
      <Form.Group className="mb-3" key="garantie">
        <Form.Label>🛡️ {t('warranty', 'Garantie')}</Form.Label>
        <Form.Select
          name="garantie"
          value={postData.garantie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_warranty', 'Sélectionnez')}</option>
          <option value="oui">Avec garantie</option>
          <option value="non">Sans garantie</option>
          <option value="expiree">Garantie expirée</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'accessoires': (
      <Form.Group className="mb-3" key="accessoires">
        <Form.Label>🎁 {t('accessories', 'Accessoires inclus')}</Form.Label>
        <Form.Select
          name="accessoires"
          value={postData.accessoires || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_accessories', 'Sélectionnez')}</option>
          <option value="complet">Complet (boîte, chargeur, écouteurs)</option>
          <option value="chargeur">Chargeur uniquement</option>
          <option value="rien">Aucun accessoire</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'ram': (
      <Form.Group className="mb-3" key="ram">
        <Form.Label>⚡ {t('ram', 'Mémoire RAM')} (GB)</Form.Label>
        <Form.Select
          name="ram"
          value={postData.ram || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_ram', 'Sélectionnez')}</option>
          <option value="2">2 GB</option>
          <option value="3">3 GB</option>
          <option value="4">4 GB</option>
          <option value="6">6 GB</option>
          <option value="8">8 GB</option>
          <option value="12">12 GB</option>
        </Form.Select>
      </Form.Group>
    )
  };

  // 🔥 FUNCIÓN PARA OBTENER CAMPOS POR SUBCATEGORÍA
  const getFieldsForSubCategory = () => {
    const subCategoryFields = {
      'smartphones': [
        'marque', 'modele', 'etat', 'capaciteStockage', 'couleur', 
        'systemeExploitation', 'reseau', 'camera', 'batterie', 
        'ram', 'garantie', 'accessoires', 'prix', 'unitePrix',
        'typeOffre', 'echange', 'localisation', 'quantite', 'wilaya', 'commune'
      ],
      'tablettes': [
        'marque', 'modele', 'etat', 'capaciteStockage', 'couleur',
        'systemeExploitation', 'taille', 'prix', 'unitePrix',
        'typeOffre', 'echange', 'localisation'
      ],
      'telephones_cellulaires': [
        'marque', 'modele', 'etat', 'couleur', 'prix', 'unitePrix',
        'typeOffre', 'echange', 'localisation'
      ],
      'smartwatchs': [
        'marque', 'modele', 'etat', 'couleur', 'prix', 'unitePrix',
        'typeOffre', 'echange', 'localisation'
      ],
      'accessoires_telephones': [
        'marque', 'modele', 'etat', 'couleur', 'prix', 'unitePrix',
        'typeOffre', 'echange', 'localisation', 'quantite'
      ],
      // ... añade más según necesites
    };
    
    return subCategoryFields[subCategory] || [];
  };

  // 🔥 SI SE PIDE UN CAMPO ESPECÍFICO
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en TelephonesFields`);
      return (
        <Form.Group className="mb-3">
          <Form.Label>{fieldName}</Form.Label>
          <Form.Control
            type="text"
            name={fieldName}
            value={postData[fieldName] || ''}
            onChange={handleChangeInput}
            placeholder={`Entrez ${fieldName}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </Form.Group>
      );
    }
    
    return fieldComponent;
  }

  // 🔥 SI NO HAY FIELDNAME (MUESTRA TODOS LOS CAMPOS DE LA SUBCATEGORÍA)
  if (!subCategory) {
    return (
      <div className="alert alert-info">
        ℹ️ {t('select_subcategory', 'Sélectionnez une sous-catégorie')}
      </div>
    );
  }

  const fieldsToShow = getFieldsForSubCategory();
  
  if (fieldsToShow.length === 0) {
    return (
      <div className="alert alert-warning">
        ⚠️ {t('no_fields_for_subcategory', 'Aucun champ pour cette sous-catégorie')}
      </div>
    );
  }

  // Agrupar campos por secciones para mejor organización visual
  const groupedFields = {
    'Informations Produit': fieldsToShow.filter(f => 
      ['marque', 'modele', 'couleur', 'etat', 'quantite', 'taille'].includes(f)
    ),
    'Caractéristiques Techniques': fieldsToShow.filter(f => 
      ['capaciteStockage', 'systemeExploitation', 'reseau', 'camera', 'batterie', 'ram'].includes(f)
    ),
    'Prix et Conditions': fieldsToShow.filter(f => 
      ['prix', 'unitePrix', 'typeOffre', 'echange', 'garantie', 'accessoires'].includes(f)
    ),
    'Localisation': fieldsToShow.filter(f => 
      ['localisation', 'wilaya', 'commune'].includes(f)
    )
  };

  return (
    <>
      {Object.entries(groupedFields).map(([section, sectionFields]) => {
        if (sectionFields.length === 0) return null;
        
        return (
          <div key={section} className="mb-4 p-3 border rounded">
            <h6 className="mb-3 text-primary">
              {section === 'Informations Produit' && '📱'}
              {section === 'Caractéristiques Techniques' && '⚙️'}
              {section === 'Prix et Conditions' && '💰'}
              {section === 'Localisation' && '📍'}
              {' '}{section}
            </h6>
            
            <Row>
              {sectionFields.map((fieldKey, index) => (
                <Col key={`${fieldKey}-${index}`} md={6} className="mb-3">
                  {fields[fieldKey] || (
                    <div className="alert alert-danger">
                      ❌ {t('missing_field', 'Champ manquant')}: {fieldKey}
                    </div>
                  )}
                </Col>
              ))}
            </Row>
          </div>
        );
      })}
    </>
  );
};

export default TelephonesFields;