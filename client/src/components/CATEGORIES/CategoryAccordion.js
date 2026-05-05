import React, { useState, useEffect, useMemo } from 'react';
import { Accordion, Form, Badge, Card, Button, Spinner, Alert } from 'react-bootstrap';
 
import { ChevronRight, ChevronDown, ChevronUp, CheckCircle, ArrowRightCircle } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';

const CategoryAccordion = ({ postData = {}, handleChangeInput, onComplete }) => {
 
  
  const dispatch = useDispatch();
  const { 
    accordionCategories = [],
    accordionLoading = false,
    accordionError = null 
  } = useSelector((state) => ({
    accordionCategories: state.category?.accordionCategories || [],
    accordionLoading: state.category?.accordionLoading || false,
    accordionError: state.category?.accordionError || null
  }));

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [selectedItems, setSelectedItems] = useState({
    category: null,
    level1: null,
    level2: null
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  useEffect(() => {
    if (accordionCategories.length === 0 && !accordionLoading) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length, accordionLoading]);

  const categoryHierarchy = useMemo(() => {
    if (!accordionCategories || accordionCategories.length === 0) return {};

    const hierarchy = {};

    accordionCategories.forEach(mainCat => {
      const hasChildren = mainCat.children && mainCat.children.length > 0;
      const hasDeepChildren = hasChildren && mainCat.children.some(child => 
        child.children && child.children.length > 0
      );

      hierarchy[mainCat.slug] = {
        name: mainCat.name,
        emoji: mainCat.emoji || '📦',
        icon: mainCat.icon,
        levels: hasDeepChildren ? 2 : 1,
        level1: 'type',
        requiresLevel2: hasDeepChildren,
        
        subcategories: hasChildren ? mainCat.children.map(child => ({
          id: child.slug,
          name: child.name,
          emoji: child.emoji || '📄',
          icon: child.icon,
          hasSublevel: child.children && child.children.length > 0
        })) : [],
        
        subcategories2: {},
        properties: {}
      };

      if (hasDeepChildren) {
        const level3Map = {};
        mainCat.children.forEach(child => {
          if (child.children) {
            level3Map[child.slug] = child.children.map(grandChild => ({
              id: grandChild.slug,
              name: grandChild.name,
              emoji: grandChild.emoji || '📋',
              icon: grandChild.icon
            }));
          }
        });
        hierarchy[mainCat.slug].subcategories2 = level3Map;
        hierarchy[mainCat.slug].properties = level3Map;
      }
    });

    return hierarchy;
  }, [accordionCategories]);

  const categories = useMemo(() => {
    if (!accordionCategories || accordionCategories.length === 0) return [];
    return accordionCategories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      emoji: cat.emoji || '📦',
      icon: cat.icon
    }));
  }, [accordionCategories]);

  const getCategoryItems = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    return category?.subcategories || [];
  };

  const getLevel2Items = (categoryId, level1Id) => {
    const category = categoryHierarchy[categoryId];
    return category?.subcategories2?.[level1Id] || category?.properties?.[level1Id] || [];
  };

  useEffect(() => {
    if (!isInitialized && !accordionLoading && categories.length > 0 && categoryHierarchy) {
      const { categorie, subCategory, articleType } = postData;
      
      if (categorie || subCategory) {
        let mainCategory = categories.find(cat => cat.id === categorie || cat.name === categorie);
        
        if (mainCategory) {
          setActiveMainCategory(mainCategory.id);
          
          const categoryData = categoryHierarchy[mainCategory.id];
          if (categoryData) {
            const level1Items = getCategoryItems(mainCategory.id);
            let level1Item = null;
            let level2Item = null;

            if (subCategory) {
              level1Item = level1Items.find(item => 
                item.id === subCategory || item.name === subCategory
              );
            }

            if (!level1Item && subCategory) {
              for (const l1 of level1Items) {
                if (l1.hasSublevel) {
                  const level2Items = getLevel2Items(mainCategory.id, l1.id);
                  level2Item = level2Items.find(item => 
                    item.id === subCategory || item.name === subCategory
                  );
                  if (level2Item) {
                    level1Item = l1;
                    break;
                  }
                }
              }
            }

            if (level1Item) {
              const newSelected = {
                category: mainCategory.id,
                level1: level1Item.id,
                level2: null
              };

              if (articleType || (level2Item && level2Item.id)) {
                const targetArticle = articleType || (level2Item ? level2Item.id : null);
                if (targetArticle && level1Item.hasSublevel) {
                  const level2Items = getLevel2Items(mainCategory.id, level1Item.id);
                  const foundLevel2 = level2Items.find(item => 
                    item.id === targetArticle || item.name === targetArticle
                  );
                  if (foundLevel2) {
                    newSelected.level2 = foundLevel2.id;
                    setExpandedSubcategories(prev => ({
                      ...prev,
                      [`${mainCategory.id}-${level1Item.id}`]: true
                    }));
                  }
                }
              }

              setSelectedItems(newSelected);
            }
          }
        }
      }
      
      setIsInitialized(true);
    }
  }, [accordionLoading, categories, categoryHierarchy, postData, isInitialized]);

  const handleSubcategoryClick = (categoryId, level1Id, level1Item) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return;

    const newSelected = {
      category: categoryId,
      level1: level1Id,
      level2: null
    };
    setSelectedItems(newSelected);

    if (!level1Item.hasSublevel) {
      handleChangeInput({ target: { name: 'categorie', value: categoryId } });
      handleChangeInput({ target: { name: 'subCategory', value: level1Id } });
      handleChangeInput({ target: { name: 'articleType', value: level1Id } });

      setTimeout(() => onComplete && onComplete(), 150);
      return;
    }

    const key = `${categoryId}-${level1Id}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    handleChangeInput({ target: { name: 'articleType', value: level1Id } });
  };

  const handleLevel2Select = (categoryId, level1Id, level2Id) => {
    const category = categoryHierarchy[categoryId];
    if (!category || !level1Id || !level2Id) return;

    setSelectedItems({
      category: categoryId,
      level1: level1Id,
      level2: level2Id
    });

    setExpandedSubcategories(prev => ({
      ...prev,
      [`${categoryId}-${level1Id}`]: true
    }));

    handleChangeInput({ target: { name: 'categorie', value: categoryId } });
    handleChangeInput({ target: { name: 'subCategory', value: level1Id } });
    handleChangeInput({ target: { name: 'articleType', value: level2Id } });

    setTimeout(() => onComplete && onComplete(), 150);
  };

  const handleResetSelection = () => {
    setSelectedItems({ category: null, level1: null, level2: null });
    setExpandedSubcategories({});
    setActiveMainCategory(null);

    handleChangeInput({ target: { name: 'categorie', value: '' } });
    handleChangeInput({ target: { name: 'subCategory', value: '' } });
    handleChangeInput({ target: { name: 'articleType', value: '' } });
  };

  const renderCategoryContent = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return <div className="text-center p-3 text-muted">Données non disponibles</div>;

    const items = getCategoryItems(categoryId);
    if (items.length === 0) return <div className="text-center p-3 text-muted">Aucune option disponible</div>;

    return (
      <div className="category-content">
        <div className="subcategories-list">
          {items.map((item) => {
            const isSelected = selectedItems.category === categoryId && selectedItems.level1 === item.id;
            const hasSublevel = item.hasSublevel;
            const isExpanded = expandedSubcategories[`${categoryId}-${item.id}`];

            return (
              <div key={item.id} className="subcategory-wrapper">
                <div
                  className={`subcategory-item ${isSelected ? 'selected' : ''} ${hasSublevel ? 'has-sublevel' : ''}`}
                  onClick={() => handleSubcategoryClick(categoryId, item.id, item)}
                >
                  <div className="subcategory-content">
                    <div className="subcategory-icon">
                      {item.icon && !imageErrors[item.id] ? (
                        <img 
                          src={item.icon} 
                          alt={item.name}
                          className="item-image"
                          onError={() => handleImageError(item.id)}
                        />
                      ) : (
                        <span className="item-emoji">{item.emoji}</span>
                      )}
                      {hasSublevel && (
                        <span className="sublevel-indicator">
                          <ArrowRightCircle size={14} />
                        </span>
                      )}
                    </div>

                    <div className="subcategory-info">
                      <div className="subcategory-name">{item.name}</div>
                    </div>

                    <div className="subcategory-actions">
                      {hasSublevel ? (
                        <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </span>
                      ) : (
                        <ChevronRight className="text-muted" />
                      )}
                    </div>
                  </div>

                  {hasSublevel && (
                    <div className="subcategory-badge">
                      <Badge bg="warning" className="badge-sm">
                        + options
                      </Badge>
                    </div>
                  )}
                </div>

                {hasSublevel && isExpanded && (
                  <div className="level2-container">
                    <div className="level2-content">
                      {(() => {
                        const level2Items = getLevel2Items(categoryId, item.id);
                        if (level2Items.length === 0) {
                          return (
                            <div className="no-level2-message">
                              <p className="text-muted small">Aucune option disponible</p>
                            </div>
                          );
                        }

                        return (
                          <div className="level2-items">
                            {level2Items.map((level2Item) => (
                              <div
                                key={level2Item.id}
                                className={`level2-item ${selectedItems.level2 === level2Item.id ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLevel2Select(categoryId, item.id, level2Item.id);
                                }}
                              >
                                <div className="level2-item-content">
                                  {level2Item.icon && !imageErrors[level2Item.id] ? (
                                    <img 
                                      src={level2Item.icon} 
                                      alt={level2Item.name}
                                      className="level2-image"
                                      onError={() => handleImageError(level2Item.id)}
                                    />
                                  ) : (
                                    <span className="level2-emoji">{level2Item.emoji}</span>
                                  )}
                                  <span className="level2-name">{level2Item.name}</span>
                                  {selectedItems.level2 === level2Item.id && (
                                    <CheckCircle className="text-success ms-auto" size={16} />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.emoji.includes(searchTerm)
  );

  if (accordionLoading && categories.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des catégories...</p>
      </div>
    );
  }

  if (accordionError) {
    return (
      <Alert variant="danger" className="border-0">
        <div className="d-flex align-items-start">
          <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
          <div>
            <strong>Erreur de chargement</strong>
            <p className="mb-2">{accordionError}</p>
            <Button 
              size="sm" 
              variant="outline-primary"
              onClick={() => dispatch(getCategoriesForAccordion())}
            >
              <i className="fas fa-redo me-1"></i> Réessayer
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  if (categories.length === 0 && !accordionLoading) {
    return (
      <Card className="text-center py-4 border-0 shadow-sm">
        <div className="empty-icon mb-3">📭</div>
        <h5 className="mb-2">Aucune catégorie disponible</h5>
        <p className="text-muted mb-3">Les catégories n'ont pas pu être chargées</p>
        <Button 
          variant="primary"
          onClick={() => dispatch(getCategoriesForAccordion())}
        >
          <i className="fas fa-sync-alt me-1"></i> Charger les catégories
        </Button>
      </Card>
    );
  }

  return (
    <div className="nested-category-accordion">
      <div className="search-container mb-4">
        <Form.Control
          type="text"
          placeholder="🔍 Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-count mb-3 text-muted small">
        <span className="badge bg-primary rounded-pill">{filteredCategories.length}</span> catégories
      </div>

      <Accordion activeKey={activeMainCategory} className="main-accordion">
        {filteredCategories.map((category) => (
          <Accordion.Item
            key={category.id}
            eventKey={category.id}
            className="main-category-item"
          >
            <Accordion.Header
              onClick={() => setActiveMainCategory(activeMainCategory === category.id ? null : category.id)}
              className="main-category-header"
            >
              <div className="main-category-content">
                <div className="category-main-info">
                  {category.icon && !imageErrors[category.id] ? (
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="category-image"
                      onError={() => handleImageError(category.id)}
                    />
                  ) : (
                    <span className="category-emoji">{category.emoji}</span>
                  )}
                  <span className="category-name">{category.name}</span>
                </div>

                <div className="category-status">
                  {selectedItems.category === category.id && (
                    <Badge bg="success" className="selected-badge me-2">
                      <CheckCircle size={12} /> Sélectionné
                    </Badge>
                  )}
                  <span className="expand-icon">
                    {activeMainCategory === category.id ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </div>
              </div>
            </Accordion.Header>

            <Accordion.Body className="main-category-body">
              {renderCategoryContent(category.id)}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Botón para cambiar de categoría - simplificado */}
      {selectedItems.category && (
        <div className="text-center mt-4">
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleResetSelection}
          >
            <i className="fas fa-times me-2"></i>
            Changer de catégorie
          </Button>
        </div>
      )}

      <style jsx>{`
        .nested-category-accordion {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .search-input {
          padding: 12px 0 12px 45px;
          border-radius: 8px;
          border: 2px solid #e9ecef;
          font-size: 1rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 15px center;
          background-size: 20px;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }
        
        .main-accordion {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .main-category-item {
          border: none;
          border-bottom: 1px solid #e9ecef;
          border-radius: 0 !important;
        }
        
        .main-category-item:last-child {
          border-bottom: none;
        }
        
        .main-category-header {
          padding: 20px 0;
          background: white;
        }
        
        .main-category-header:hover {
          background: #f8f9fa;
        }
        
        .main-category-header .accordion-button {
          padding: 0;
          background: transparent;
          box-shadow: none !important;
        }
        
        .main-category-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .category-main-info {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-grow: 1;
        }
        
        .category-emoji {
          font-size: 1.8rem;
          min-width: 40px;
        }
        
        .category-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .category-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
        }
        
        .category-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .selected-badge {
          font-size: 0.8rem;
          padding: 4px 8px;
        }
        
        .main-category-body {
          padding: 0;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        
        .category-content {
          padding: 20px 0;
        }
        
        .subcategories-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .subcategory-wrapper {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        
        .subcategory-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.1);
        }
        
        .subcategory-item {
          padding: 15px 0;
          cursor: pointer;
          position: relative;
        }
        
        .subcategory-item:hover {
          background: #f8f9fa;
        }
        
        .subcategory-item.selected {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05), rgba(13, 110, 253, 0.1));
          border-left: 4px solid #0d6efd;
        }
        
        .subcategory-item.has-sublevel {
          border-left: 4px solid #ffc107;
        }
        
        .subcategory-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .subcategory-icon {
          position: relative;
          min-width: 50px;
        }
        
        .item-emoji {
          font-size: 1.8rem;
        }
        
        .item-image {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .sublevel-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ffc107;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          border: 2px solid white;
        }
        
        .subcategory-info {
          flex-grow: 1;
        }
        
        .subcategory-name {
          font-weight: 500;
          font-size: 0.95rem;
          color: #212529;
        }
        
        .subcategory-badge {
          position: absolute;
          top: 10px;
          right: 15px;
        }
        
        .badge-sm {
          font-size: 0.7rem;
          padding: 2px 6px;
        }
        
        .level2-container {
          background: #f1f3f4;
          border-top: 1px solid #dee2e6;
          animation: slideDown 0.3s ease;
        }
        
        .level2-content {
          padding: 20px 0;
        }
        
        .level2-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .level2-item {
          padding: 12px 0;
          background: white;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          cursor: pointer;
        }
        
        .level2-item:hover {
          border-color: #0d6efd;
          transform: translateX(5px);
        }
        
        .level2-item.selected {
          background: linear-gradient(135deg, rgba(25, 135, 84, 0.05), rgba(25, 135, 84, 0.1));
          border-color: #198754;
        }
        
        .level2-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .level2-emoji {
          font-size: 1.3rem;
          min-width: 30px;
        }
        
        .level2-image {
          width: 30px;
          height: 30px;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .level2-name {
          font-size: 0.9rem;
          font-weight: 500;
          flex-grow: 1;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .main-category-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .category-main-info {
            width: 100%;
            justify-content: space-between;
          }
          
          .category-status {
            width: 100%;
            justify-content: space-between;
          }
          
          .subcategory-content {
            gap: 10px;
          }
          
          .item-emoji {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .main-category-header {
            padding: 15px 0;
          }
          
          .category-content {
            padding: 15px 0;
          }
          
          .subcategory-item {
            padding: 12px 0;
          }
          
          .level2-content {
            padding: 15px 0;
          }
          
          .category-emoji {
            font-size: 1.5rem;
            min-width: 35px;
          }
          
          .category-name {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryAccordion;