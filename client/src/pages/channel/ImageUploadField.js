// frontend/src/components/ImageUploadField.jsx
import React, { useState } from 'react';

const ImageUploadField = ({ 
  images = [],  // ✅ VALOR POR DEFECTO como array vacío
  setImages, 
  label = 'Imagen',
  multiple = false,
  maxImages = 1
}) => {
  const [error, setError] = useState('');

  // ✅ Verificar que images sea un array
  const safeImages = Array.isArray(images) ? images : [];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validar límite
    if (safeImages.length + files.length > maxImages) {
      setError(`Máximo ${maxImages} imagen(es)`);
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Validar cada archivo
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten imágenes');
        continue;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar 2MB');
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length > 0) {
      setImages([...safeImages, ...validFiles]);
      setError('');
    }
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = [...safeImages];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const getPreviewUrl = (image) => {
    if (!image) return '';
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    return '';
  };

  return (
    <div className="image-upload-field mb-3">
      <label className="form-label fw-bold">{label}</label>
      
      {/* Preview de imágenes */}
      {safeImages.length > 0 && (
        <div className="d-flex gap-3 mb-3 flex-wrap">
          {safeImages.map((img, idx) => (
            <div key={idx} className="position-relative">
              <img 
                src={getPreviewUrl(img)} 
                alt={`preview-${idx}`}
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
              <button
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
                onClick={() => removeImage(idx)}
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  fontSize: '12px', 
                  padding: 0,
                  transform: 'translate(30%, -30%)'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input de archivo */}
      <input
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        onChange={handleFileChange}
        multiple={multiple}
        className="form-control"
      />
      
      {error && <div className="text-danger small mt-1">{error}</div>}
      <small className="text-muted">
        Formatos: JPG, PNG, GIF, WEBP (Máx. 2MB)
        {!multiple && ' - Solo una imagen'}
      </small>
    </div>
  );
};

export default ImageUploadField;