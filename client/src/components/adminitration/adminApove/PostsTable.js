// 📂 components/admin/PostsTable.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Card, Button, Badge, Table, Pagination, Alert, Spinner, Form, Image
} from 'react-bootstrap';
import { 
  FaCheck, FaTrash, FaEye, FaClipboardList, FaCheckDouble, FaCheckCircle
} from 'react-icons/fa';
import { getPostsPendientes, aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import { deletePost } from '../../../redux/actions/postAction';

const PostsTable = ({ selectedCategory, onLoadingChange, onPaginationUpdate }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector(state => state);
  const { postsPendientes = [], loading = false, total = 0, page = 1, totalPages = 1 } = useSelector(state => state.postAprove || {});
  
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [message, setMessage] = useState({ show: false, text: '', type: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // ✅ Refs para evitar bucles
  const hasLoadedRef = useRef(false);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const onPaginationUpdateRef = useRef(onPaginationUpdate);

  // ✅ Función para obtener la URL del post (la misma para todos, PostId maneja el token)
  const getPostUrl = (postId) => {
    return `/post/${postId}`;
  };

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
    if (onPaginationUpdateRef.current && total > 0) {
      onPaginationUpdateRef.current({ total, page, totalPages });
    }
  }, [total, page, totalPages]);

  // ✅ Construir filtros basados en selectedCategory
  const buildFilters = useCallback(() => {
    const filters = {};
    
    if (selectedCategory) {
      if (selectedCategory.categorie) {
        filters.categorie = selectedCategory.categorie;
      }
      if (selectedCategory.slug && !selectedCategory.categorie) {
        filters.categorie = selectedCategory.slug;
      }
      if (selectedCategory.subCategory) {
        filters.subCategory = selectedCategory.subCategory;
      }
    }
    
    return filters;
  }, [selectedCategory]);

  // ✅ Cargar posts solo cuando cambia currentPage o selectedCategory
  const loadPosts = useCallback((pageNum) => {
    if (auth?.token) {
      const filters = buildFilters();
      console.log('🔍 Cargando posts con filtros:', filters);
      dispatch(getPostsPendientes(auth.token, pageNum, postsPerPage, filters));
    }
  }, [dispatch, auth?.token, postsPerPage, buildFilters]);

  // ✅ Efecto de carga inicial y cambio de página/categoría
  useEffect(() => {
    loadPosts(currentPage);
    hasLoadedRef.current = true;
  }, [currentPage, selectedCategory, loadPosts]);

  // ✅ Reset selección cuando cambian los posts o la categoría
  useEffect(() => {
    setSelectedPosts([]);
    setSelectAll(false);
  }, [postsPendientes?.length, selectedCategory]);

  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(postsPendientes.map(post => post._id));
    }
    setSelectAll(!selectAll);
  };

  const showMessage = (text, type) => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: '' }), 3000);
  };

  const handleApproveSelected = () => {
    if (selectedPosts.length === 0) {
      showMessage('Sélectionnez au moins un post', 'warning');
      return;
    }
    
    if (window.confirm(`Approuver ${selectedPosts.length} post(s) sélectionné(s) ?`)) {
      selectedPosts.forEach(postId => {
        const post = postsPendientes.find(p => p._id === postId);
        if (post) {
          dispatch(aprovarPostPendiente({ post, estado: 'aprobado', auth, socket }));
        }
      });
      showMessage(`${selectedPosts.length} post(s) approuvé(s)`, 'success');
      setSelectedPosts([]);
      setSelectAll(false);
      loadPosts(currentPage);
    }
  };

  const handleApprove = (post) => {
    if (window.confirm(`Approuver le post "${post.title}" ?`)) {
      dispatch(aprovarPostPendiente({ post, estado: 'aprobado', auth, socket }));
      showMessage('Post approuvé avec succès', 'success');
      loadPosts(currentPage);
    }
  };

  const handleDelete = (post) => {
    if (window.confirm(`Supprimer définitivement le post "${post.title}" ? Cette action est irréversible.`)) {
      dispatch(deletePost({ post, auth, socket }));
      showMessage('Post supprimé', 'warning');
      loadPosts(currentPage);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  // ✅ Función para formatear fecha (formato DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading && postsPendientes.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des posts en attente...</p>
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
                <FaClipboardList className="me-2" style={{ color: '#0D6EFD' }} />
                Posts en attente
                {selectedCategory && selectedCategory.name && selectedCategory.name !== 'posts' && (
                  <Badge bg="info" className="ms-2">
                    {selectedCategory.name}
                  </Badge>
                )}
              </h5>
              <small className="text-muted">
                Page {page} sur {totalPages} - Total: {total} post(s)
              </small>
            </div>
            {postsPendientes.length > 0 && (
              <Form.Check
                type="checkbox"
                label="Tout sélectionner"
                checked={selectAll}
                onChange={handleSelectAll}
                className="fw-semibold"
              />
            )}
          </div>
        </Card.Header>

        {selectedPosts.length > 0 && (
          <Card.Body className="bg-light py-2">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="fw-semibold">
                <FaCheckCircle className="me-2 text-success" />
                {selectedPosts.length} post(s) sélectionné(s)
              </span>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={handleApproveSelected}
                >
                  <FaCheckDouble className="me-1" /> Approuver sélection
                </Button>
              </div>
            </div>
          </Card.Body>
        )}

        {postsPendientes.length === 0 ? (
          <Card.Body className="text-center py-5">
            <FaClipboardList className="fs-1 text-muted mb-3 opacity-50" />
            <h5 className="text-muted">Aucun post en attente</h5>
            <p className="small text-muted">Tous les posts ont été vérifiés</p>
          </Card.Body>
        ) : (
          <>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">
                      <Form.Check 
                        type="checkbox" 
                        checked={selectAll} 
                        onChange={handleSelectAll} 
                      />
                    </th>
                    <th style={{ width: '80px' }}>Image</th>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Utilisateur</th>
                    <th>Prix</th>
                    <th>Date</th>
                    <th style={{ width: '120px' }} className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {postsPendientes.map((post) => (
                    <tr key={post._id} className={selectedPosts.includes(post._id) ? 'table-primary' : ''}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={selectedPosts.includes(post._id)}
                          onChange={() => handleSelectPost(post._id)}
                        />
                      </td>
                      <td>
                        <Link to={getPostUrl(post._id)}>
                          {post.images?.[0]?.url ? (
                            <Image 
                              src={post.images[0].url} 
                              width="60"
                              height="40"
                              className="rounded"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: '60px', height: '40px' }}>
                              <FaClipboardList className="text-muted opacity-50" size={20} />
                            </div>
                          )}
                        </Link>
                      </td>
                      <td>
                        <Link to={getPostUrl(post._id)} className="text-decoration-none fw-medium">
                          {post.title?.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                        </Link>
                        <br />
                        <small className="text-muted">{post.type}</small>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {post.categorie}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="small fw-medium">{post.user?.username || 'N/A'}</span>
                          <small className="text-muted">{post.user?.email}</small>
                        </div>
                      </td>
                      <td className="fw-bold text-primary">
                        {post.price?.toLocaleString()} DA
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(post.createdAt)}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex gap-1 justify-content-center">
                          <Button
                            as={Link}
                            to={getPostUrl(post._id)}
                            variant="outline-primary"
                            size="sm"
                            title="Voir détails"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleApprove(post)}
                            title="Approuver"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(post)}
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

            {totalPages > 1 && (
              <Card.Footer className="bg-white border-0 py-3">
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={page === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    <Pagination.Next
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
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

export default PostsTable;