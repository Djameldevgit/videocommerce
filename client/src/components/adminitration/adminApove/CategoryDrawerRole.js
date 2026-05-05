// 📂 components/admin/CategoryDrawerRole.js - VERSIÓN CORREGIDA

import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { 
  FaChevronDown, FaChevronRight, FaSave, FaTimes, 
  FaFolder, FaCheckDouble
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesForAccordion } from '../../../redux/actions/categoryAction';

const CategoryDrawerRole = ({ show, onHide, user, onSuccess }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { accordionCategories = [], loading } = useSelector(state => state.category || {});
  
  const [openCategories, setOpenCategories] = useState({});
  const [selectedCategories, setSelectedCategories] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  
  useEffect(() => {
    if (accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length]);
  
  // Inicializar selecciones del usuario
  useEffect(() => {
    if (show && user && user.assignedCategories) {
      const initial = {};
      user.assignedCategories.forEach(assigned => {
        const subCats = {};
        (assigned.subCategories || []).forEach(sub => {
          subCats[sub.subCategoryId] = true;
        });
        initial[assigned.categoryId] = {
          selected: true,
          canApproveAll: assigned.canApproveAll || false,
          subCategories: subCats
        };
      });
      setSelectedCategories(initial);
    } else if (show) {
      setSelectedCategories({});
    }
  }, [show, user]);
  
  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // ✅ Seleccionar/Deseleccionar categoría completa
  const handleCategorySelect = (category) => {
    setSelectedCategories(prev => {
      const newState = { ...prev };
      if (newState[category._id]) {
        delete newState[category._id];
      } else {
        newState[category._id] = {
          selected: true,
          canApproveAll: true,
          subCategories: {}
        };
      }
      return newState;
    });
  };
  
  // ✅ CORREGIDO: Permite seleccionar MÚLTIPLES subcategorías
  const handleSubCategorySelect = (categoryId, subCategory) => {
    setSelectedCategories(prev => {
      const newState = { ...prev };
      
      // Si la categoría no existe, crearla
      if (!newState[categoryId]) {
        newState[categoryId] = {
          selected: true,
          canApproveAll: false,
          subCategories: {}
        };
      }
      
      const categoryState = newState[categoryId];
      
      // Alternar selección de la subcategoría específica
      if (categoryState.subCategories[subCategory._id]) {
        // Deseleccionar
        delete categoryState.subCategories[subCategory._id];
      } else {
        // Seleccionar (sin afectar otras subcategorías)
        categoryState.subCategories[subCategory._id] = true;
        categoryState.canApproveAll = false;
      }
      
      // Si no hay subcategorías y no está en modo "Todas", eliminar la categoría
      if (Object.keys(categoryState.subCategories).length === 0 && !categoryState.canApproveAll) {
        delete newState[categoryId];
      }
      
      return newState;
    });
  };
  
  // ✅ Activar/desactivar "Todas las subcategorías"
  const handleApproveAllToggle = (categoryId) => {
    setSelectedCategories(prev => {
      const newState = { ...prev };
      
      if (!newState[categoryId]) {
        newState[categoryId] = {
          selected: true,
          canApproveAll: true,
          subCategories: {}
        };
      } else {
        newState[categoryId].canApproveAll = !newState[categoryId].canApproveAll;
        if (newState[categoryId].canApproveAll) {
          newState[categoryId].subCategories = {};
        }
      }
      
      return newState;
    });
  };
  
  // Verificar estado de una categoría
  const getCategoryState = (categoryId) => {
    const state = selectedCategories[categoryId];
    if (!state) return 'unchecked';
    if (state.canApproveAll) return 'checked';
    if (Object.keys(state.subCategories).length > 0) return 'partial';
    return 'checked';
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    const assignedCategories = Object.entries(selectedCategories).map(([catId, data]) => {
      const category = accordionCategories.find(c => c._id === catId);
      const subCategories = Object.keys(data.subCategories).map(subId => {
        const subCat = category?.children?.find(c => c._id === subId);
        return {
          subCategoryId: subId,
          subCategorySlug: subCat?.slug || '',
          subCategoryName: subCat?.name || ''
        };
      });
      
      return {
        categoryId: catId,
        categorySlug: category?.slug || '',
        categoryName: category?.name || '',
        canApproveAll: data.canApproveAll,
        subCategories
      };
    });
    
    try {
      const res = await fetch(`/api/users/${user._id}/assign-categories`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({ assignedCategories })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setMessage({ show: true, text: 'Catégories assignées avec succès', type: 'success' });
        if (onSuccess) onSuccess(data.user);
        setTimeout(() => {
          setMessage({ show: false, text: '', type: '' });
          onHide();
        }, 1500);
      } else {
        setMessage({ show: true, text: data.message || 'Erreur', type: 'danger' });
      }
    } catch (error) {
      console.error('Error saving categories:', error);
      setMessage({ show: true, text: 'Erreur lors de l\'assignation', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };
  
  const totalSelected = Object.keys(selectedCategories).length;
  
  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '380px', backgroundColor: '#1a1a2e', color: '#fff' }}>
      <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center bg-dark">
        <div>
          <h6 className="mb-0 fw-bold text-white">
            <FaFolder className="me-2" />
            Assigner des catégories
          </h6>
          <small className="text-muted">{user?.username} - Modérateur</small>
        </div>
        <Button variant="link" className="text-white p-0" onClick={onHide}>
          <FaTimes />
        </Button>
      </div>
      
      <Offcanvas.Body className="p-0">
        {message.show && (
          <Alert variant={message.type} dismissible onClose={() => setMessage({ show: false, text: '', type: '' })} className="m-3">
            {message.text}
          </Alert>
        )}
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="mt-3 text-muted">Chargement des catégories...</p>
          </div>
        ) : (
          <div className="p-3">
            <div className="mb-4 p-2 rounded bg-dark bg-opacity-50">
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Catégories sélectionnées</span>
                <Badge bg="success" pill className="fs-6">{totalSelected}</Badge>
              </div>
            </div>
            
            <div className="mb-3 p-2 rounded bg-info bg-opacity-25">
              <small className="text-info">💡 Sélectionnez les catégories et sous-catégories</small>
            </div>
            
            <div className="mb-2">
              <div className="small text-muted mb-2 px-2">CATÉGORIES DISPONIBLES</div>
              
              {accordionCategories.map(category => {
                const state = getCategoryState(category._id);
                const isExpanded = openCategories[category._id];
                const hasChildren = category.children && category.children.length > 0;
                const isIndeterminate = state === 'partial';
                const categoryData = selectedCategories[category._id];
                
                return (
                  <div key={category._id} className="mb-2">
                    <div className={`d-flex align-items-center justify-content-between p-2 rounded cursor-pointer transition ${state !== 'unchecked' ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`}>
                      <div className="d-flex align-items-center gap-2 flex-grow-1">
                        {hasChildren && (
                          <Button variant="link" size="sm" onClick={() => toggleCategory(category._id)} className="p-0 text-white" style={{ textDecoration: 'none' }}>
                            {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                          </Button>
                        )}
                        <Form.Check
                          type="checkbox"
                          id={`cat-${category._id}`}
                          checked={state === 'checked'}
                          ref={(el) => { if (el && isIndeterminate) el.indeterminate = true; }}
                          onChange={() => handleCategorySelect(category)}
                          label={<span className="small"><span className="me-1">{category.emoji || '📁'}</span>{category.name}</span>}
                          className="text-white"
                        />
                      </div>
                      {hasChildren && state !== 'unchecked' && (
                        <Form.Check type="switch" id={`all-${category._id}`} label="Toutes" checked={categoryData?.canApproveAll || false} onChange={() => handleApproveAllToggle(category._id)} className="ms-2" size="sm" />
                      )}
                    </div>
                    
                    {hasChildren && isExpanded && (
                      <div className="ms-4 mt-1">
                        {category.children.map(child => {
                          const isChildSelected = categoryData?.subCategories[child._id] || categoryData?.canApproveAll || false;
                          return (
                            <div key={child._id} className={`d-flex align-items-center p-1 ps-3 rounded small cursor-pointer ${isChildSelected ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`} style={{ cursor: 'pointer' }}>
                              <Form.Check
                                type="checkbox"
                                id={`sub-${child._id}`}
                                checked={isChildSelected}
                                disabled={categoryData?.canApproveAll}
                                onChange={() => handleSubCategorySelect(category._id, child)}
                                label={<span className="small"><span className="me-1">{child.emoji || '📄'}</span>{child.name}</span>}
                                className="text-white"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {totalSelected > 0 && (
              <div className="mt-3 pt-3 border-top border-secondary">
                <div className="small text-muted text-center mb-2"><FaCheckDouble className="me-1" /> Résumé</div>
                <div className="d-flex flex-wrap gap-1 justify-content-center">
                  {Object.entries(selectedCategories).map(([catId, data]) => {
                    const category = accordionCategories.find(c => c._id === catId);
                    if (!category) return null;
                    return (
                      <Badge key={catId} bg={data.canApproveAll ? "success" : "info"} className="p-2">
                        {category.emoji} {category.name}
                        {data.canApproveAll && " (Tout)"}
                        {!data.canApproveAll && Object.keys(data.subCategories).length > 0 && <span className="ms-1">({Object.keys(data.subCategories).length})</span>}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </Offcanvas.Body>
      
      <div className="p-3 border-top border-secondary d-flex gap-2">
        <Button variant="secondary" onClick={onHide} className="flex-grow-1"><FaTimes className="me-1" /> Annuler</Button>
        <Button variant="primary" onClick={handleSave} disabled={saving} className="flex-grow-1">
          {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <FaSave className="me-2" />}
          Enregistrer
        </Button>
      </div>
    </Offcanvas>
  );
};

export default CategoryDrawerRole;