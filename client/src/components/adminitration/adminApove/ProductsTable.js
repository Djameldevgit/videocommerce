// 📂 components/admin/ProductsTable.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Badge, Card, Pagination, Image, Alert, Spinner } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaBox, FaStore, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getProductsPendientes, aprobarProducto, rechazarProducto } from '../../../redux/actions/boutiqueAproveAction';

const ProductsTable = ({ selectedCategory, onLoadingChange, onPaginationUpdate }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector(state => state); // ✅ Obtener socket del estado global
  const { 
    products = [], 
    loading = false, 
    totalProducts = 0, 
    pageProducts = 1, 
    totalPagesProducts = 1 
  } = useSelector(state => state.boutiqueAprove || {});
  
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // ✅ Refs para evitar bucles
  const hasLoadedRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onPaginationUpdateRef = useRef(onPaginationUpdate);

  // ✅ Actualizar refs cuando cambian
  useEffect(() => {
    onLoadingChangeRef.current = onLoadingChange;
    onPaginationUpdateRef.current = onPaginationUpdate;
  }, [onLoadingChange, onPaginationUpdate]);

  // ✅ Notificar loading sin causar bucles
  useEffect(() => {
    if (onLoadingChangeRef.current) {
      onLoadingChangeRef.current(loading);
    }
  }, [loading]);

  // ✅ Notificar paginación sin causar bucles
  useEffect(() => {
    if (onPaginationUpdateRef.current && totalProducts > 0) {
      onPaginationUpdateRef.current({ total: totalProducts, page: pageProducts, totalPages: totalPagesProducts });
    }
  }, [totalProducts, pageProducts, totalPagesProducts]);

  // ✅ Construir filtros basados en selectedCategory
  const buildFilters = useCallback(() => {
    const filters = {};
    if (selectedCategory?.slug && selectedCategory.slug !== 'products') {
      filters.categorie = selectedCategory.slug;
    }
    return filters;
  }, [selectedCategory]);

  // ✅ Cargar productos solo cuando cambia currentPage
  const loadProducts = useCallback((pageNum) => {
    if (auth?.token) {
      const filters = buildFilters();
      dispatch(getProductsPendientes(auth.token, pageNum, limit, filters));
    }
  }, [dispatch, auth?.token, limit, buildFilters]);

  // ✅ Efecto de carga inicial y cambio de página
  useEffect(() => {
    if (!hasLoadedRef.current || currentPage !== pageProducts) {
      loadProducts(currentPage);
      hasLoadedRef.current = true;
    }
  }, [currentPage, loadProducts, pageProducts]);

  // ✅ Reset selección cuando cambian los productos
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [products.length]);

  const handleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map(p => p._id));
    }
    setSelectAll(!selectAll);
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  // ✅ APROBAR - con auth y socket desde el estado
  const handleApprove = async (product) => {
    if (!window.confirm(`Approuver le produit "${product.title}" ?`)) return;

    const result = await dispatch(aprobarProducto(product._id, auth.token, auth, socket));
    if (result?.success) {
      showMessage('Produit approuvé avec succès', 'success');
      loadProducts(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de l\'approbation', 'danger');
    }
  };

  // ✅ RECHAZAR - con auth y socket desde el estado
  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer définitivement le produit "${product.title}" ? Cette action est irréversible.`)) return;

    const result = await dispatch(rechazarProducto(product._id, auth.token, auth, socket));
    if (result?.success) {
      showMessage('Produit supprimé', 'warning');
      loadProducts(currentPage);
    } else {
      showMessage(result?.error || 'Erreur lors de la suppression', 'danger');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPagesProducts && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  // ✅ Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // ✅ Función para navegar al detalle del producto
  const handleViewProduct = (productId) => {
    console.log('🖱️ Navegando a producto:', productId);
    // history.push(`/product/${productId}`);
  };

  if (loading && products.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits en attente...</p>
      </Card>
    );
  }

  return (
    <>
      {message.show && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ show: false })}>
          {message.text}
        </Alert>
      )}

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="mb-0 fw-bold">
                <FaBox className="me-2" style={{ color: '#EC4899' }} />
                Produits en attente
                {selectedCategory?.name && selectedCategory.name !== 'products' && (
                  <Badge bg="info" className="ms-2">
                    {selectedCategory.name}
                  </Badge>
                )}
              </h5>
              <small className="text-muted">
                Page {pageProducts} sur {totalPagesProducts} - Total: {totalProducts} produit(s)
              </small>
            </div>
            {products.length > 0 && (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <label className="form-check-label small">Tout sélectionner</label>
              </div>
            )}
          </div>
        </Card.Header>

        {selectedItems.length > 0 && (
          <Card.Body className="bg-light py-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="fw-semibold">
                <FaCheck className="me-2 text-success" />
                {selectedItems.length} produit(s) sélectionné(s)
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    selectedItems.forEach(id => {
                      const product = products.find(p => p._id === id);
                      if (product) handleApprove(product);
                    });
                  }}
                >
                  <FaCheck className="me-1" /> Approuver sélection
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        {products.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaBox className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucun produit en attente</h5>
            <p className="small text-muted">Tous les produits ont été vérifiés</p>
          </Card.Body>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                    </th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Produit</th>
                    <th>Boutique</th>
                    <th>Prix</th>
                    <th>État</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className={selectedItems.includes(product._id) ? 'table-primary' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(product._id)}
                          onChange={() => handleSelectItem(product._id)}
                        />
                      </td>
                      <td>
                        <div 
                          onClick={() => handleViewProduct(product._id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              width="60"
                              height="40"
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-dark rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px', cursor: 'pointer' }}>
                              <FaBox className="text-white opacity-50" size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{product.title?.substring(0, 40)}</div>
                        <small className="text-muted">{product.subCategory}</small>
                       </td>
                      <td>
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center gap-1">
                            <FaStore className="text-muted small" />
                            <span className="small fw-medium">{product.boutique?.nom_boutique || 'N/A'}</span>
                          </div>
                          <small className="text-muted">{product.boutique?.user?.email}</small>
                        </div>
                       </td>
                      <td>
                        <div className="fw-bold text-primary">
                          <FaMoneyBillWave className="me-1" size={12} />
                          {product.price?.toLocaleString()} DA
                        </div>
                       </td>
                      <td>
                        <Badge 
                          bg={
                            product.etat === 'neuf' ? 'success' :
                            product.etat === 'comme-neuf' ? 'info' :
                            product.etat === 'bon-etat' ? 'warning' : 'secondary'
                          } 
                          className="rounded-pill"
                        >
                          {product.etat}
                        </Badge>
                       </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {product.categorie}
                        </Badge>
                       </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(product.createdAt)}
                        </small>
                       </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewProduct(product._id)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(product)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            title="Supprimer"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {totalPagesProducts > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(pageProducts - 1)}
                      disabled={pageProducts === 1}
                    />
                    {[...Array(Math.min(totalPagesProducts, 5))].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={pageProducts === idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(pageProducts + 1)}
                      disabled={pageProducts === totalPagesProducts}
                    />
                  </Pagination>
                </div>
              </Card.Footer>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default ProductsTable;