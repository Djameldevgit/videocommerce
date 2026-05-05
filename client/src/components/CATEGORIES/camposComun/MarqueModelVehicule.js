// components/CATEGORIES/camposComun/MarqueModelTelephone.js
import React, { useState, useEffect } from 'react';
import telefonosData from './json/vehicules.json';

const MarqueModelVehicule= ({
  postData,
  handleChangeInput,
  ...props
}) => {
  const [selectedMarque, setSelectedMarque] = useState(postData?.marque || "");
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    if (selectedMarque && telefonosData) {
      const marcaEncontrada = telefonosData.find((marca) => marca.marca === selectedMarque);
      
      if (marcaEncontrada && marcaEncontrada.modelo && Array.isArray(marcaEncontrada.modelo)) {
        setModelos(marcaEncontrada.modelo);
      } else {
        setModelos([]);
      }
      
      // Limpiar modelo al cambiar marca
      if (postData?.modele) {
        handleChangeInput({
          target: { name: 'modele', value: '' }
        });
      }
    } else {
      setModelos([]);
    }
  }, [selectedMarque]);

  const handleMarqueChange = (e) => {
    const value = e.target.value;
    setSelectedMarque(value);
    
    handleChangeInput({
      target: { name: 'marque', value: value }
    });
    
    // Limpiar modelo
    handleChangeInput({
      target: { name: 'modele', value: '' }
    });
  };

  const handleModeloChange = (e) => {
    handleChangeInput({
      target: { name: 'modele', value: e.target.value }
    });
  };

  return (
    <>
      {/* Marca */}
      <div className="mb-3">
        <label className="form-label fw-bold">
          Marque <span className="text-danger">*</span>
        </label>
        <select
          name="marque"
          className="form-control"
          value={postData?.marque || ''}
          onChange={handleMarqueChange}
          required
        >
          <option value="">Sélectionner la marque</option>
          {telefonosData && telefonosData.map((marca, index) => (
            <option key={index} value={marca.marca}>
              {marca.marca}
            </option>
          ))}
        </select>
      </div>
      
      {/* Modèle */}
      {selectedMarque && modelos.length > 0 && (
        <div className="mb-3">
          <label className="form-label fw-bold">
            Modèle <span className="text-danger">*</span>
          </label>
          <select
            name="modele"
            className="form-control"
            value={postData?.modele || ''}
            onChange={handleModeloChange}
            required
          >
            <option value="">Sélectionner le modèle</option>
            {modelos.map((modelo, index) => (
              <option key={index} value={modelo}>
                {modelo}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {selectedMarque && modelos.length === 0 && (
        <div className="alert alert-warning py-2 mb-3">
          <small>Aucun modèle disponible pour cette marque</small>
        </div>
      )}
    </>
  );
};

export default MarqueModelVehicule;