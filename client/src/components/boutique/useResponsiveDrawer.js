// hooks/useResponsiveDrawer.js
import { useState, useEffect } from 'react';

export const useResponsiveDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      
      // Auto-abrir drawer en desktop, cerrar en móvil
      if (width >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return {
    isOpen,
    isMobile,
    isTablet,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    isDesktop: !isMobile && !isTablet
  };
};