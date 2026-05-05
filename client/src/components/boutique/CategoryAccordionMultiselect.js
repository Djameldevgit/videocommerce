// components/Boutique/CategoryAccordionMultiselect.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, Check, Search, X } from 'lucide-react';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';
import { Spinner, Badge, Form, InputGroup, Button} from 'react-bootstrap';

const CategoryAccordionMultiselect = ({ 
  selectedCategories = [], 
  onCategoriesChange,
  maxSelections = 20,
  showSearch = true 
}) => {
  const dispatch = useDispatch();
  const { accordionCategories, accordionLoading } = useSelector(state => state.category);
  
  const [expandedLevel1, setExpandedLevel1] = useState({});
  const [expandedLevel2, setExpandedLevel2] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Cargar categorías si no están
  useEffect(() => {
    if (!accordionCategories || accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories]);

  // Filtrar categorías por búsqueda
  useEffect(() => {
    if (!accordionCategories || !searchTerm) {
      setFilteredCategories([]);
      return;
    }

    const results = [];
    const term = searchTerm.toLowerCase();

    accordionCategories.forEach(cat1 => {
      if (cat1.name.toLowerCase().includes(term)) {
        results.push({
          type: 'level1',
          ...cat1,
          fullPath: cat1.slug,
          displayPath: cat1.name
        });
      }

      cat1.children?.forEach(cat2 => {
        if (cat2.name.toLowerCase().includes(term)) {
          results.push({
            type: 'level2',
            ...cat2,
            level1: cat1.slug,
            level1Name: cat1.name,
            level1Emoji: cat1.emoji,
            fullPath: `${cat1.slug}/${cat2.slug}`,
            displayPath: `${cat1.name} > ${cat2.name}`
          });
        }

        cat2.children?.forEach(cat3 => {
          if (cat3.name.toLowerCase().includes(term)) {
            results.push({
              type: 'level3',
              ...cat3,
              level1: cat1.slug,
              level1Name: cat1.name,
              level1Emoji: cat1.emoji,
              level2: cat2.slug,
              level2Name: cat2.name,
              level2Emoji: cat2.emoji,
              fullPath: `${cat1.slug}/${cat2.slug}/${cat3.slug}`,
              displayPath: `${cat1.name} > ${cat2.name} > ${cat3.name}`
            });
          }
        });
      });
    });

    setFilteredCategories(results);
  }, [searchTerm, accordionCategories]);

  // Verificar si una categoría está seleccionada
  const isSelected = (fullPath) => {
    return selectedCategories.some(cat => cat.fullPath === fullPath);
  };

  // Toggle selección de categoría
  const toggleCategory = (category) => {
    const exists = selectedCategories.findIndex(c => c.fullPath === category.fullPath);
    
    let newSelected;
    if (exists >= 0) {
      // Remover
      newSelected = selectedCategories.filter((_, i) => i !== exists);
    } else {
      // Agregar (con límite)
      if (selectedCategories.length >= maxSelections) {
        alert(`Vous pouvez sélectionner maximum ${maxSelections} catégories`);
        return;
      }
      newSelected = [...selectedCategories, category];
    }
    
    onCategoriesChange(newSelected);
  };

  // Remover categoría de la lista
  const removeCategory = (fullPath) => {
    const newSelected = selectedCategories.filter(cat => cat.fullPath !== fullPath);
    onCategoriesChange(newSelected);
  };

  // Limpiar todas las categorías
  const clearAll = () => {
    onCategoriesChange([]);
  };

  // Toggle expansión de nivel 1
  const toggleLevel1 = (catId) => {
    setExpandedLevel1(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Toggle expansión de nivel 2
  const toggleLevel2 = (catId) => {
    setExpandedLevel2(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  if (accordionLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Chargement des catégories...</p>
      </div>
    );
  }

  return (
    <div className="category-accordion-multiselect border rounded bg-white">
      {/* Header */}
      <div className="p-3 border-bottom bg-light">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-tags me-2 text-primary"></i>
            Catégories de produits
          </h5>
          {selectedCategories.length > 0 && (
            <Badge bg="primary" pill>
              {selectedCategories.length} / {maxSelections}
            </Badge>
          )}
        </div>
        
        {/* Barra de búsqueda */}
        {showSearch && (
          <InputGroup size="sm">
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button 
                variant="outline-secondary" 
                onClick={() => setSearchTerm('')}
                size="sm"
              >
                <X size={16} />
              </Button>
            )}
          </InputGroup>
        )}
      </div>

      {/* Resultados de búsqueda o árbol completo */}
      <div className="p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {searchTerm ? (
          // Modo búsqueda - resultados planos
          filteredCategories.length > 0 ? (
            <div className="search-results">
              {filteredCategories.map((result, idx) => (
                <div
                  key={result.fullPath}
                  className={`d-flex align-items-center p-2 mb-1 rounded cursor-pointer ${isSelected(result.fullPath) ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                  onClick={() => toggleCategory({
                    level1: result.level1 || result.slug,
                    level1Name: result.level1Name || result.name,
                    level1Emoji: result.level1Emoji || result.emoji,
                    level2: result.level2,
                    level2Name: result.level2Name,
                    level2Emoji: result.level2Emoji,
                    level3: result.type === 'level3' ? result.slug : undefined,
                    level3Name: result.type === 'level3' ? result.name : undefined,
                    level3Emoji: result.type === 'level3' ? result.emoji : undefined,
                    fullPath: result.fullPath,
                    displayPath: result.displayPath,
                    level: result.type === 'level1' ? 1 : result.type === 'level2' ? 2 : 3
                  })}
                >
                  <div className="me-2">
                    {result.emoji}
                  </div>
                  <div className="flex-grow-1">
                    <div className="small text-muted">{result.displayPath}</div>
                  </div>
                  <div className="ms-2">
                    {isSelected(result.fullPath) ? (
                      <Check size={18} className="text-success" />
                    ) : (
                      <div className="rounded-circle border" style={{ width: '18px', height: '18px' }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="fas fa-search mb-2" style={{ fontSize: '2rem' }}></i>
              <p>Aucune catégorie trouvée</p>
            </div>
          )
        ) : (
          // Modo árbol - estructura jerárquica
          <div className="category-tree">
            {accordionCategories?.map(cat1 => (
              <div key={cat1._id} className="mb-1">
                {/* Nivel 1 - Categoría principal */}
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-link p-1 text-decoration-none"
                    onClick={() => toggleLevel1(cat1._id)}
                  >
                    {expandedLevel1[cat1._id] ? 
                      <ChevronDown size={18} /> : 
                      <ChevronRight size={18} />
                    }
                  </button>
                  
                  <div
                    className={`flex-grow-1 d-flex align-items-center p-2 rounded cursor-pointer ${isSelected(cat1.slug) ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                    onClick={() => toggleCategory({
                      level1: cat1.slug,
                      level1Name: cat1.name,
                      level1Emoji: cat1.emoji,
                      fullPath: cat1.slug,
                      displayPath: cat1.name,
                      level: 1
                    })}
                  >
                    <span className="me-2">{cat1.emoji}</span>
                    <span className="flex-grow-1">{cat1.name}</span>
                    {isSelected(cat1.slug) && (
                      <Check size={18} className="text-success ms-2" />
                    )}
                  </div>
                </div>

                {/* Nivel 2 - Subcategorías */}
                {expandedLevel1[cat1._id] && cat1.children?.map(cat2 => (
                  <div key={cat2._id} className="ms-3 mt-1">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-link p-1 text-decoration-none"
                        onClick={() => toggleLevel2(cat2._id)}
                      >
                        {expandedLevel2[cat2._id] ? 
                          <ChevronDown size={16} /> : 
                          <ChevronRight size={16} />
                        }
                      </button>
                      
                      <div
                        className={`flex-grow-1 d-flex align-items-center p-2 rounded cursor-pointer ${isSelected(`${cat1.slug}/${cat2.slug}`) ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                        onClick={() => toggleCategory({
                          level1: cat1.slug,
                          level1Name: cat1.name,
                          level1Emoji: cat1.emoji,
                          level2: cat2.slug,
                          level2Name: cat2.name,
                          level2Emoji: cat2.emoji,
                          fullPath: `${cat1.slug}/${cat2.slug}`,
                          displayPath: `${cat1.name} > ${cat2.name}`,
                          level: 2
                        })}
                      >
                        <span className="me-2">{cat2.emoji}</span>
                        <span className="flex-grow-1">{cat2.name}</span>
                        {isSelected(`${cat1.slug}/${cat2.slug}`) && (
                          <Check size={16} className="text-success ms-2" />
                        )}
                      </div>
                    </div>

                    {/* Nivel 3 - Artículos */}
                    {expandedLevel2[cat2._id] && cat2.children?.map(cat3 => (
                      <div key={cat3._id} className="ms-5 mt-1">
                        <div
                          className={`d-flex align-items-center p-2 rounded cursor-pointer ${isSelected(`${cat1.slug}/${cat2.slug}/${cat3.slug}`) ? 'bg-primary bg-opacity-10' : 'hover-bg-light'}`}
                          onClick={() => toggleCategory({
                            level1: cat1.slug,
                            level1Name: cat1.name,
                            level1Emoji: cat1.emoji,
                            level2: cat2.slug,
                            level2Name: cat2.name,
                            level2Emoji: cat2.emoji,
                            level3: cat3.slug,
                            level3Name: cat3.name,
                            level3Emoji: cat3.emoji,
                            fullPath: `${cat1.slug}/${cat2.slug}/${cat3.slug}`,
                            displayPath: `${cat1.name} > ${cat2.name} > ${cat3.name}`,
                            level: 3,
                            isLeaf: true
                          })}
                        >
                          <span className="me-2">{cat3.emoji}</span>
                          <span className="flex-grow-1">{cat3.name}</span>
                          {isSelected(`${cat1.slug}/${cat2.slug}/${cat3.slug}`) && (
                            <Check size={16} className="text-success ms-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lista de categorías seleccionadas */}
      {selectedCategories.length > 0 && (
        <div className="p-3 border-top bg-light">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-bold">
              <i className="fas fa-check-circle text-success me-1"></i>
              Catégories sélectionnées ({selectedCategories.length})
            </span>
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={clearAll}
            >
              <i className="fas fa-trash me-1"></i>
              Tout effacer
            </Button>
          </div>
          <div className="selected-categories-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            {selectedCategories.map((cat, index) => (
              <div 
                key={index}
                className="d-flex align-items-center justify-content-between bg-white p-2 mb-1 rounded border"
              >
                <div className="d-flex align-items-center">
                  <span className="me-2">{cat.level1Emoji || '📦'}</span>
                  <div className="small">
                    <span className="fw-bold">{cat.level1Name}</span>
                    {cat.level2Name && (
                      <>
                        <span className="mx-1 text-muted">→</span>
                        <span>{cat.level2Name}</span>
                      </>
                    )}
                    {cat.level3Name && (
                      <>
                        <span className="mx-1 text-muted">→</span>
                        <span className="fw-bold">{cat.level3Name}</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="link"
                  className="text-danger p-0"
                  onClick={() => removeCategory(cat.fullPath)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx="true">{`
        .cursor-pointer {
          cursor: pointer;
        }
        .hover-bg-light:hover {
          background-color: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
};

export default CategoryAccordionMultiselect;