// 📂 pages/aprobacionAdministration/AprobacionContent.js
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Spinner, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaStore, FaBox, FaNewspaper } from 'react-icons/fa';
import PostsPendientesTable from './components/PostsPendientesTable';
import BoutiquesPendientesTable from './components/BoutiquesPendientesTable';
import ProductosPendientesTable from './components/ProductosPendientesTable';

const AprobacionContent = ({ selectedCategory, selectedType }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ posts: [], boutiques: [], productos: [] });
  const [pagination, setPagination] = useState({
    posts: { page: 1, total: 0, totalPages: 1 },
    boutiques: { page: 1, total: 0, totalPages: 1 },
    productos: { page: 1, total: 0, totalPages: 1 }
  });
  
  // Cambiar tab según el tipo seleccionado
  useEffect(() => {
    if (selectedType) {
      setActiveTab(selectedType);
    }
  }, [selectedType]);
  
  // Cargar datos según el tipo y categoría
  const fetchData = useCallback(async (type, page = 1) => {
    setLoading(true);
    try {
      let url = '';
      let params = new URLSearchParams({ page, limit: 10 });
      
      if (type === 'posts') {
        if (selectedCategory && selectedCategory.slug !== 'posts') {
          params.append('categorie', selectedCategory.slug);
        }
        url = `/api/posts/admin/pendientes?${params.toString()}`;
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const result = await res.json();
        
        if (result.success) {
          setData(prev => ({ ...prev, posts: result.posts }));
          setPagination(prev => ({
            ...prev,
            posts: {
              page: result.page,
              total: result.total,
              totalPages: result.totalPages
            }
          }));
        }
      } 
      else if (type === 'boutiques') {
        url = `/api/boutiques/admin/pendientes?${params.toString()}`;
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const result = await res.json();
        
        if (result.success) {
          setData(prev => ({ ...prev, boutiques: result.boutiques }));
          setPagination(prev => ({
            ...prev,
            boutiques: {
              page: result.page,
              total: result.total,
              totalPages: result.totalPages
            }
          }));
        }
      }
      else if (type === 'productos') {
        let boutiqueId = '';
        if (selectedCategory && selectedCategory.slug !== 'productos') {
          // Si es una boutique específica
          boutiqueId = selectedCategory._id;
        }
        url = `/api/boutiques/products/pendientes?${params.toString()}&boutiqueId=${boutiqueId}`;
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        const result = await res.json();
        
        if (result.success) {
          setData(prev => ({ ...prev, productos: result.products }));
          setPagination(prev => ({
            ...prev,
            productos: {
              page: result.page,
              total: result.total,
              totalPages: result.totalPages
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [auth.token, selectedCategory]);
  
  useEffect(() => {
    if (auth.token) {
      fetchData(activeTab, 1);
    }
  }, [auth.token, activeTab, selectedCategory, fetchData]);
  
  const handlePageChange = (type, newPage) => {
    fetchData(type, newPage);
  };
  
  const handleApprove = async (type, item, onSuccess) => {
    try {
      let url = '';
      if (type === 'posts') {
        url = `/api/posts/admin/aprobar/${item._id}`;
      } else if (type === 'boutiques') {
        url = `/api/boutiques/admin/aprobar/${item._id}`;
      } else if (type === 'productos') {
        url = `/api/boutiques/products/aprobar/${item._id}`;
      }
      
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        }
      });
      
      const result = await res.json();
      if (result.success) {
        // Recargar datos
        fetchData(type, pagination[type].page);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error approving:', error);
    }
  };
  
  const handleReject = async (type, item) => {
    if (!window.confirm(`¿Rechazar este elemento?`)) return;
    
    try {
      let url = '';
      if (type === 'posts') {
        url = `/api/posts/admin/rechazar/${item._id}`;
      } else if (type === 'boutiques') {
        url = `/api/boutiques/admin/rechazar/${item._id}`;
      } else if (type === 'productos') {
        url = `/api/boutiques/products/rechazar/${item._id}`;
      }
      
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      const result = await res.json();
      if (result.success) {
        fetchData(type, pagination[type].page);
      }
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };
  
  const getTitle = () => {
    if (activeTab === 'posts') {
      if (selectedCategory && selectedCategory.slug !== 'posts') {
        return `Posts pendientes - ${selectedCategory.name}`;
      }
      return 'Todos los posts pendientes';
    }
    if (activeTab === 'boutiques') {
      return 'Boutiques pendientes de verificación';
    }
    if (activeTab === 'productos') {
      if (selectedCategory && selectedCategory.slug !== 'productos') {
        return `Productos pendientes - ${selectedCategory.name}`;
      }
      return 'Todos los productos pendientes de boutique';
    }
    return 'Elementos pendientes';
  };
  
  const tabs = [
    { key: 'posts', label: 'Posts', icon: <FaNewspaper />, count: pagination.posts.total },
    { key: 'boutiques', label: 'Boutiques', icon: <FaStore />, count: pagination.boutiques.total },
    { key: 'productos', label: 'Produits', icon: <FaBox />, count: pagination.productos.total }
  ];
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">{getTitle()}</h4>
          <p className="text-muted small mb-0">Gérez les validations des contenus</p>
        </div>
      </div>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 border-bottom"
      >
        {tabs.map(tab => (
          <Tab
            key={tab.key}
            eventKey={tab.key}
            title={
              <span className="d-flex align-items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <Badge bg="danger" pill className="ms-1">
                    {tab.count}
                  </Badge>
                )}
              </span>
            }
          />
        ))}
      </Tabs>
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement...</p>
        </div>
      ) : (
        <>
          {activeTab === 'posts' && (
            <PostsPendientesTable
              posts={data.posts}
              pagination={pagination.posts}
              onPageChange={(page) => handlePageChange('posts', page)}
              onApprove={(post) => handleApprove('posts', post)}
              onReject={(post) => handleReject('posts', post)}
            />
          )}
          
          {activeTab === 'boutiques' && (
            <BoutiquesPendientesTable
              boutiques={data.boutiques}
              pagination={pagination.boutiques}
              onPageChange={(page) => handlePageChange('boutiques', page)}
              onApprove={(boutique) => handleApprove('boutiques', boutique)}
              onReject={(boutique) => handleReject('boutiques', boutique)}
            />
          )}
          
          {activeTab === 'productos' && (
            <ProductosPendientesTable
              products={data.productos}
              pagination={pagination.productos}
              onPageChange={(page) => handlePageChange('productos', page)}
              onApprove={(product) => handleApprove('productos', product)}
              onReject={(product) => handleReject('productos', product)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AprobacionContent;