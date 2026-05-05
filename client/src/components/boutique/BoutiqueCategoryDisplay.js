// components/CATEGORIES/BoutiqueCategoryDisplay.jsx
import React from 'react';
import { Card, Badge, Alert } from 'react-bootstrap';
import { FaStore, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const BoutiqueCategoryDisplay = ({ categoryData, boutiqueInfo }) => {
  if (!categoryData || !categoryData.categorie) {
    return (
      <Alert variant="warning" className="text-center">
        <FaInfoCircle className="me-2" />
        Aucune catégorie définie pour cette boutique
      </Alert>
    );
  }

  return (
    <Card className="mb-4 border-0 bg-light">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <FaStore className="me-2" style={{ color: '#6366F1' }} size={20} />
          <h6 className="mb-0 fw-bold">Catégorie de la boutique</h6>
          <Badge bg="success" className="ms-2">
            <FaCheckCircle className="me-1" size={10} />
            Fixe
          </Badge>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {categoryData.categorie && (
            <Badge 
              bg="primary" 
              className="p-2"
              style={{ fontSize: '0.9rem' }}
            >
              {categoryData.categorie}
            </Badge>
          )}
          {categoryData.subCategory && (
            <Badge 
              bg="info" 
              className="p-2"
              style={{ fontSize: '0.9rem' }}
            >
              {categoryData.subCategory}
            </Badge>
          )}
          {categoryData.articleType && (
            <Badge 
              bg="secondary" 
              className="p-2"
              style={{ fontSize: '0.9rem' }}
            >
              {categoryData.articleType}
            </Badge>
          )}
        </div>

        <p className="text-muted small mb-0">
          <FaInfoCircle className="me-1" />
          Les catégories sont définies par votre boutique et ne peuvent pas être modifiées
        </p>
      </Card.Body>
    </Card>
  );
};

export default BoutiqueCategoryDisplay;