// 📁 src/hooks/useCategorySlugs.js
import { useState } from 'react';
import { categoryConfigs } from '../components/CATEGORIES/CategoryConfig/index';

export const useCategorySlugs = () => {
  const [slugs, setSlugs] = useState({
    category: '',
    subcategory: '',
    propertyType: ''
  });

  // Obtener configuración completa basada en slugs
  const getCategoryConfig = () => {
    if (!slugs.category) return null;
    return categoryConfigs[slugs.category];
  };

  // Obtener subcategorías disponibles
  const getAvailableSubcategories = () => {
    const config = getCategoryConfig();
    if (!config) return [];
    return config.subcategories || [];
  };

  // Obtener tipos de propiedad disponibles
  const getAvailablePropertyTypes = () => {
    const config = getCategoryConfig();
    if (!config || !slugs.subcategory) return [];
    return config.propertyTypes?.[slugs.subcategory] || [];
  };

  // Generar ruta completa
  const generateRoute = () => {
    let route = '';
    
    if (slugs.category) {
      route += `/${slugs.category}`;
    }
    
    if (slugs.subcategory) {
      route += `/${slugs.subcategory}`;
    }
    
    if (slugs.propertyType) {
      route += `/${slugs.propertyType}`;
    }
    
    return route ? `${route}/1` : '/';
  };

  // Validar si la selección está completa
  const isSelectionComplete = () => {
    const config = getCategoryConfig();
    if (!config) return false;
    
    if (config.levels === 1) {
      return !!slugs.category && !!slugs.subcategory;
    }
    
    if (config.requiresLevel2) {
      return !!slugs.category && !!slugs.subcategory && !!slugs.propertyType;
    }
    
    return !!slugs.category && !!slugs.subcategory;
  };

  return {
    slugs,
    setSlugs,
    getCategoryConfig,
    getAvailableSubcategories,
    getAvailablePropertyTypes,
    generateRoute,
    isSelectionComplete
  };
};