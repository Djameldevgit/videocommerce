// 📂 components/SameBoutiqueProducts.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch  } from 'react-redux';
import { Row, Col, Spinner } from 'react-bootstrap';
import ProductCardHorizontal from './ProductCardHorizontal';
import { getProductsFromSameBoutique } from '../../redux/actions/boutiqueProductAction';
 
const SameBoutiqueProducts = ({ productId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    if (productId) {
      setLoading(true);
      dispatch(getProductsFromSameBoutique(productId, 6))
        .then((result) => {
          console.log('📦 Productos misma boutique recibidos:', result?.products?.length || 0);
          setProducts(result?.products || []);
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, productId]);
  
  if (loading) {
    return (
      <div className="same-boutique-section mt-5 pt-4">
        <hr />
        <h5 className="mb-4">🏪 Autres produits de la même boutique</h5>
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" size="sm" />
          <p className="mt-2 text-muted small">Chargement...</p>
        </div>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return null;
  }
  
  return (
    <div className="same-boutique-section mt-5 pt-4">
      <hr />
      <h5 className="mb-4">
        🏪 Autres produits de la même boutique ({products.length})
      </h5>
      <Row className="g-3">
        {products.map(product => (
          <Col key={product._id} xs={12} md={6} lg={4}>
            <ProductCardHorizontal product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SameBoutiqueProducts;