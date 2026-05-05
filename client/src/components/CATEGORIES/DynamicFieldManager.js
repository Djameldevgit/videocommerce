// 📂 components/CATEGORIES/DynamicFieldManager.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getFieldsForCategory } from './FieldConfig';

// 🆕 IMPORTAR TODOS LOS COMPONENTES ESPECÍFICOS
import AlimentairesField from './specificFields/AlimentairesFields';
import VehiculesField from './specificFields/VehiculesFields';
import ImmobiliersField from './specificFields/ImmobiliersFields'; 
import TelephonesField from './specificFields/TelephonesFields';
import VetementsField from './specificFields/VetementsFields';
import ElectromenagerField from './specificFields/ElectromenagerFields';
import InformatiqueField from './specificFields/InformatiqueFields';
import LoisirsField from './specificFields/LoisirsFields';
import ServicesField from './specificFields/ServicesFields';
import SanteBeauteField from './specificFields/SanteBeauteFields';
import MeublesField from './specificFields/MeublesFields';
import MateriauxField from './specificFields/MateriauxFields';
import SportField from './specificFields/SportFields';
import VoyagesField from './specificFields/VoyagesFields';
import EmploiField from './specificFields/EmploiFields';
import PiecesDetacheesField from './specificFields/PiecesDetacheesFields';
import ArtField from './specificFields/ArtFields';



 
// Mapa de categorías a componentes específicos
const CATEGORY_COMPONENTS = {
  'alimentaires': AlimentairesField,
  'vehicules': VehiculesField,
  'immobilier': ImmobiliersField,
  'telephone': TelephonesField,
  'vetements': VetementsField,
  'electromenager': ElectromenagerField,
  'art':ArtField,
  'informatique': InformatiqueField,
  'loisirs': LoisirsField,
  'services': ServicesField,
  'sante-beaute': SanteBeauteField,
  'meubles': MeublesField,
  'materiaux': MateriauxField,
  'sport': SportField,
  'voyages': VoyagesField,
  'emploi': EmploiField,
  'pieces-detachees': PiecesDetacheesField
};

// Función para formatear un string a ID
const formatToId = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '_');

// Función para formatear un ID a nombre para mostrar
const formatDisplayName = (id) => {
  if (!id) return '';
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Emojis por defecto
const getDefaultEmoji = (categoryId) => {
  const emojis = {
    'immobilier': '🏠',
    'vehicules': '🚗',
    'telephone': '📱',
    'informatique': '💻',
    'electromenager': '🔌',
    'art': '🔌',
    'pieces-detachees': '⚙️',
    'vetements': '👕',
    'alimentaires': '🍎',
    'sante-beaute': '💄',
    'meubles': '🛋️',
    'services': '🛠️',
    'materiaux': '🧱',
    'loisirs': '🎮',
    'emploi': '💼',
    'sport': '⚽',
    'voyages': '✈️',
    'boutiques': '🏪'
  };
  return emojis[categoryId] || '📁';
};

const DynamicFieldManager = ({
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  currentStep = 1,
  onStepChange,
  showNavigation = true,
  isEdit = false
}) => {
  const { t } = useTranslation();
  const [categoryInfo, setCategoryInfo] = useState({
    categoryName: '',
    categoryEmoji: '',
    articleTypeName: '',
    articleTypeEmoji: '',
    subCategoryName: '',
    subCategoryEmoji: ''
  });
  
  const { categories: mongoCategories = [] } = useSelector((state) => ({
    categories: state.category?.categories || []
  }));

  // Obtener el componente específico
  const SpecificCategoryComponent = CATEGORY_COMPONENTS[mainCategory];

  // Efecto para información de categoría
  useEffect(() => {
    if (mainCategory) {
      if (mongoCategories.length === 0) {
        setCategoryInfo({
          categoryName: formatDisplayName(mainCategory),
          categoryEmoji: getDefaultEmoji(mainCategory),
          articleTypeName: articleType ? formatDisplayName(articleType) : '',
          articleTypeEmoji: articleType ? getDefaultEmoji(articleType) : '',
          subCategoryName: subCategory ? formatDisplayName(subCategory) : '',
          subCategoryEmoji: subCategory ? getDefaultEmoji(subCategory) : ''
        });
        return;
      }

      const mainCat = mongoCategories.find(cat => 
        cat.level === 1 && formatToId(cat.name) === mainCategory
      );

      if (mainCat) {
        let newCategoryInfo = {
          categoryName: mainCat.name,
          categoryEmoji: mainCat.emoji || getDefaultEmoji(mainCategory),
          articleTypeName: '',
          articleTypeEmoji: '',
          subCategoryName: '',
          subCategoryEmoji: ''
        };

        const findNodeInHierarchy = (targetId) => {
          for (const child of mainCat.children || []) {
            if (formatToId(child.name) === targetId) return child;
            for (const grandChild of child.children || []) {
              if (formatToId(grandChild.name) === targetId) return grandChild;
            }
          }
          return null;
        };

        if (articleType) {
          const articleTypeNode = findNodeInHierarchy(articleType);
          if (articleTypeNode) {
            newCategoryInfo.articleTypeName = articleTypeNode.name;
            newCategoryInfo.articleTypeEmoji = articleTypeNode.emoji || getDefaultEmoji(articleType);
          } else {
            newCategoryInfo.articleTypeName = formatDisplayName(articleType);
            newCategoryInfo.articleTypeEmoji = getDefaultEmoji(articleType);
          }
        }

        if (subCategory) {
          const subCategoryNode = findNodeInHierarchy(subCategory);
          if (subCategoryNode) {
            newCategoryInfo.subCategoryName = subCategoryNode.name;
            newCategoryInfo.subCategoryEmoji = subCategoryNode.emoji || getDefaultEmoji(subCategory);
          } else {
            newCategoryInfo.subCategoryName = formatDisplayName(subCategory);
            newCategoryInfo.subCategoryEmoji = getDefaultEmoji(subCategory);
          }
        }

        setCategoryInfo(newCategoryInfo);
      } else {
        setCategoryInfo({
          categoryName: formatDisplayName(mainCategory),
          categoryEmoji: getDefaultEmoji(mainCategory),
          articleTypeName: articleType ? formatDisplayName(articleType) : '',
          articleTypeEmoji: articleType ? getDefaultEmoji(articleType) : '',
          subCategoryName: subCategory ? formatDisplayName(subCategory) : '',
          subCategoryEmoji: subCategory ? getDefaultEmoji(subCategory) : ''
        });
      }
    } else {
      setCategoryInfo({
        categoryName: '',
        categoryEmoji: '',
        articleTypeName: '',
        articleTypeEmoji: '',
        subCategoryName: '',
        subCategoryEmoji: ''
      });
    }
  }, [mainCategory, subCategory, articleType, mongoCategories]);

  // Validación
  const canContinue = () => {
    if (currentStep === 1 || currentStep === 5) return true;

    const fields = getFieldsForCategory(mainCategory, subCategory, currentStep);
    
    const requiredFieldsByStep = {
      2: ['title', 'description'],
      3: ['price'],
      4: ['telephone', 'wilaya']
    };

    const currentRequired = requiredFieldsByStep[currentStep] || [];
    const availableRequired = currentRequired.filter(field => fields.includes(field));

    return availableRequired.every(field => {
      const value = postData[field] || '';
      return value.toString().trim() !== '';
    });
  };

  // Renderizar contenido
  const renderStepContent = () => {
    // STEP 1
    if (currentStep === 1) {
      return (
        <div className="step-content">
          <div className={`alert ${isEdit ? 'alert-warning' : 'alert-success'}`}>
            <div className="category-details mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center mb-3">
                    <div className="category-icon me-3" style={{ fontSize: '2.5rem' }}>
                      {categoryInfo.categoryEmoji}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{categoryInfo.categoryName || 'Sélectionnez une catégorie'}</h6>
                      <small className="text-muted">
                        {mainCategory ? 'Catégorie principale' : 'Sélectionnez une catégorie'}
                      </small>
                    </div>
                  </div>
                </div>

                {mainCategory && (
                  <>
                    {categoryInfo.articleTypeName && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">Type d'article</small>
                            <div className="fw-medium">
                              <span className="me-2">{categoryInfo.articleTypeEmoji}</span>
                              {categoryInfo.articleTypeName}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {categoryInfo.subCategoryName && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">Sous-catégorie</small>
                            <div className="fw-medium">
                              <span className="me-2">{categoryInfo.subCategoryEmoji}</span>
                              {categoryInfo.subCategoryName}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mt-3 mb-0">
                {isEdit
                  ? 'Vous pouvez modifier la catégorie si nécessaire.'
                  : 'Passez à l\'étape suivante pour ajouter les détails.'
                }
              </p>
            </div>
          </div>
        </div>
      );
    }

    // STEP 5
    if (currentStep === 5) {
      return (
        <div className="step-content">
          <div className="alert alert-info">
            <h5><i className="fas fa-images me-2"></i> Étape 5: Images</h5>
            <p>Téléchargez les images de votre annonce (minimum 1, maximum 10)</p>
          </div>
        </div>
      );
    }

    // STEPS 2, 3, 4
    if (!SpecificCategoryComponent) {
      return (
        <div className="alert alert-warning mb-0">
          <h5><i className="fas fa-exclamation-triangle me-2"></i> Configuration en cours</h5>
          <p className="mb-2">
            {!mainCategory
              ? 'Sélectionnez d\'abord une catégorie à l\'étape 1'
              : `Le composant pour "${categoryInfo.categoryName}" n'est pas encore configuré.`
            }
          </p>
        </div>
      );
    }

    return (
      <div className="step-content">
        {mainCategory && (
          <div className="category-path-card mb-4">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex align-items-center flex-wrap">
                <span className="path-step">
                  <span className="path-emoji">{categoryInfo.categoryEmoji}</span>
                  <span className="path-name">{categoryInfo.categoryName}</span>
                </span>

                {categoryInfo.articleTypeName && (
                  <>
                    <span className="path-arrow mx-2">
                      <i className="fas fa-arrow-right text-muted"></i>
                    </span>
                    <span className="path-step">
                      <span className="path-emoji">{categoryInfo.articleTypeEmoji}</span>
                      <span className="path-name">{categoryInfo.articleTypeName}</span>
                    </span>
                  </>
                )}

                {categoryInfo.subCategoryName && (
                  <>
                    <span className="path-arrow mx-2">
                      <i className="fas fa-arrow-right text-muted"></i>
                    </span>
                    <span className="path-step">
                      <span className="path-emoji">{categoryInfo.subCategoryEmoji}</span>
                      <span className="path-name">{categoryInfo.subCategoryName}</span>
                    </span>
                  </>
                )}
              </div>

              {isEdit && (
                <button
                  className="btn btn-sm btn-outline-warning mt-2 mt-sm-0"
                  onClick={() => onStepChange && onStepChange(1)}
                >
                  <i className="fas fa-edit me-1"></i> Changer
                </button>
              )}
            </div>
          </div>
        )}

        <SpecificCategoryComponent
          mainCategory={mainCategory}
          subCategory={subCategory}
          articleType={articleType}
          postData={postData}
          handleChangeInput={handleChangeInput}
          isRTL={isRTL}
          t={t}
          step={currentStep}
          isEdit={isEdit}
        />
      </div>
    );
  };

  // Verificar categoría
  if (currentStep > 1 && !mainCategory) {
    return (
      <div className="text-center py-4">
        <div className="alert alert-warning">
          <i className="fas fa-hand-point-up fa-2x mb-3"></i>
          <h5>Sélectionnez d'abord une catégorie</h5>
          <p className="mb-3">
            {isEdit
              ? 'Cette annonce n\'a pas de catégorie définie.'
              : 'Retournez à l\'étape 1 pour choisir une catégorie'
            }
          </p>
          <button className="btn btn-primary" onClick={() => onStepChange && onStepChange(1)}>
            <i className="fas fa-arrow-left me-2"></i>
            {isEdit ? 'Définir une catégorie' : 'Retour à l\'étape 1'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-field-manager">
      <div className="step-header mb-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h4 className="mb-1 fs-5 fs-md-4">
              {currentStep === 1 && (isEdit ? '✏️ Catégorie' : '✅ Catégorie')}
              {currentStep === 2 && '📝 Détails'}
              {currentStep === 3 && '💰 Prix'}
              {currentStep === 4 && '📍 Contact'}
              {currentStep === 5 && '🖼️ Images'}
            </h4>
            <small className="text-muted d-block">
              {mainCategory && (
                <div className="d-flex align-items-center flex-wrap">
                  <span className="category-badge me-2 mb-1">
                    {categoryInfo.categoryEmoji} {categoryInfo.categoryName}
                  </span>
                  {categoryInfo.articleTypeName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge me-2 mb-1">
                        {categoryInfo.articleTypeEmoji} {categoryInfo.articleTypeName}
                      </span>
                    </>
                  )}
                  {categoryInfo.subCategoryName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge mb-1">
                        {categoryInfo.subCategoryEmoji} {categoryInfo.subCategoryName}
                      </span>
                    </>
                  )}
                </div>
              )}
            </small>
          </div>
          <span className={`badge ${isEdit ? 'bg-warning' : 'bg-primary'}`}>
            {isEdit ? '✏️' : ''} Étape {currentStep}/5
          </span>
        </div>
        <div className="progress mt-2" style={{ height: '4px' }}>
          <div className={`progress-bar ${isEdit ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${(currentStep / 5) * 100}%` }} />
        </div>
      </div>

      <div className="step-content-wrapper">
        {renderStepContent()}
      </div>

      {showNavigation && (
        <div className="step-navigation mt-3 pt-2 border-top">
          <div className="d-flex justify-content-between flex-wrap gap-2">
            <div>
              {currentStep > 1 ? (
                <button className="btn btn-outline-secondary btn-sm btn-md" onClick={() => onStepChange && onStepChange(currentStep - 1)}>
                  <i className="fas fa-arrow-left me-1 me-md-2"></i> Précédent
                </button>
              ) : isEdit && (
                <button className="btn btn-outline-warning btn-sm btn-md" onClick={() => onStepChange && onStepChange(currentStep - 1)}>
                  <i className="fas fa-edit me-1 me-md-2"></i> Modifier catégorie
                </button>
              )}
            </div>

            <button
              className={`btn ${isEdit ? 'btn-warning' : 'btn-primary'} btn-sm btn-md`}
              onClick={() => { if (currentStep < 5) onStepChange && onStepChange(currentStep + 1); }}
              disabled={!canContinue()}
            >
              {currentStep < 5 ? (
                <>{isEdit ? 'Continuer' : 'Suivant'} <i className="fas fa-arrow-right ms-1 ms-md-2"></i></>
              ) : (
                <>Continuer <i className="fas fa-arrow-right ms-1 ms-md-2"></i></>
              )}
            </button>
          </div>

          {!canContinue() && currentStep !== 5 && (
            <div className="alert alert-warning mt-2 py-1 mb-0">
              <small>
                <i className="fas fa-exclamation-circle me-1"></i>
                {currentStep === 2 && 'Complétez le titre et la description'}
                {currentStep === 3 && 'Indiquez un prix'}
                {currentStep === 4 && 'Renseignez le téléphone et la wilaya'}
              </small>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .dynamic-field-manager {
          background: white;
          padding: 12px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
        }
        .step-header {
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
          flex-shrink: 0;
        }
        .step-content-wrapper {
          flex: 1;
          min-height: auto;
          width: 100%;
        }
        .step-content {
          width: 100%;
          animation: fadeIn 0.3s ease;
        }
        .category-badge {
          background: #f8f9fa;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
          font-size: 0.8rem;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .category-path-card {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          width: 100%;
        }
        .path-step {
          display: inline-flex;
          align-items: center;
          background: white;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          margin-bottom: 4px;
        }
        .path-emoji { margin-right: 6px; font-size: 1rem; }
        .path-name { font-weight: 500; font-size: 0.85rem; }
        .path-arrow { color: #6c757d; }
        
        /* Estilos para inputs en móvil - expansión horizontal */
        .step-content :global(.form-control),
        .step-content :global(.form-select),
        .step-content :global(.css-13cymwt-control),
        .step-content :global(.css-1dimb5e-singleValue),
        .step-content :global(input),
        .step-content :global(select),
        .step-content :global(textarea) {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .step-content :global(.form-control),
        .step-content :global(.form-select),
        .step-content :global(input),
        .step-content :global(select) {
          font-size: 16px !important; /* Previene zoom en iOS */
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .dynamic-field-manager { 
            padding: 10px; 
            border-radius: 8px;
          }
          .category-path-card { 
            padding: 8px 10px; 
          }
          .path-step { 
            padding: 3px 8px; 
            font-size: 0.75rem; 
          }
          .step-header h4 {
            font-size: 1rem;
          }
          .btn-sm, .btn-md {
            padding: 6px 12px;
            font-size: 0.85rem;
          }
        }
        
        @media (max-width: 480px) {
          .dynamic-field-manager { 
            padding: 8px; 
          }
          .category-path-card {
            padding: 6px 8px;
          }
          .path-step {
            padding: 2px 6px;
            font-size: 0.7rem;
          }
          .path-emoji {
            font-size: 0.8rem;
            margin-right: 4px;
          }
          .btn-sm, .btn-md {
            padding: 5px 10px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

DynamicFieldManager.defaultProps = {
  currentStep: 1,
  showNavigation: true,
  isEdit: false,
  mainCategory: null,
  subCategory: null,
  articleType: null,
  postData: {},
  handleChangeInput: () => { },
  isRTL: false,
  onStepChange: () => { }
};

export default DynamicFieldManager;