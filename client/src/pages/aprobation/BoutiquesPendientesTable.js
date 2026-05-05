// 📂 pages/aprobacionAdministration/components/BoutiquesPendientesTable.js
import React, { useState } from 'react';
import { Table, Button, Badge, Card, Pagination, Image } from 'react-bootstrap';
import { FaCheck, FaTrash, FaEye, FaStore, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BoutiquesPendientesTable = ({ boutiques, pagination, onPageChange, onApprove, onReject }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(boutiques.map(b => b._id));
    }
    setSelectAll(!selectAll);
  };
  
  const handleApproveSelected = () => {
    if (selectedItems.length === 0) return;
    selectedItems.forEach(id => {
      const boutique = boutiques.find(b => b._id === id);
      if (boutique) onApprove(boutique);
    });
    setSelectedItems([]);
    setSelectAll(false);
  };
  
  if (boutiques.length === 0) {
    return (
      <Card className="border-0 shadow-sm text-center py-5">
        <Card.Body>
          <FaStore className="fs-1 text-muted mb-3 opacity-50" />
          <h5 className="text-muted">Aucune boutique en attente</h5>
          <p className="small text-muted">Toutes les boutiques ont été vérifiées</p>
        </Card.Body>
      </Card>
    );
  }
  
  return (
    <>
      {/* Barra de acciones masivas */}
      {selectedItems.length > 0 && (
        <Card className="border-0 shadow-sm mb-3 bg-light">
          <Card.Body className="p-3">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                <FaCheck className="me-2 text-success" />
                {selectedItems.length} boutique(s) sélectionnée(s)
              </span>
              <Button size="sm" variant="success" onClick={handleApproveSelected}>
                <FaCheck className="me-1" /> Approuver sélection
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">Boutiques à vérifier</h5>
              <small className="text-muted">
                Page {pagination.page} sur {pagination.totalPages} - Total: {pagination.total}
              </small>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label className="form-check-label small">Tout sélectionner</label>
            </div>
          </div>
        </Card.Header>
        
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: '40px' }}>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th style={{ width: '60px' }}>Logo</th>
                <th>Boutique</th>
                <th>Propriétaire</th>
                <th>Catégorie</th>
                <th>Plan</th>
                <th>Date</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {boutiques.map(boutique => (
                <tr key={boutique._id} className={selectedItems.includes(boutique._id) ? 'table-primary' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(boutique._id)}
                      onChange={() => handleSelectItem(boutique._id)}
                    />
                  </td>
                  <td>
                    {boutique.images?.[0]?.url ? (
                      <Image
                        src={boutique.images[0].url}
                        width="45"
                        height="45"
                        className="rounded-3 object-fit-cover"
                      />
                    ) : (
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                        <FaStore className="text-muted" />
                      </div>
                    )}
                  </td>
                  <td>
                    <Link to={`/boutique/${boutique._id}`} className="text-decoration-none fw-medium">
                      {boutique.nom_boutique}
                    </Link>
                    <br />
                    <small className="text-muted">{boutique.domaine_boutique}</small>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-1">
                      <FaUser className="text-muted small" />
                      <span className="small">{boutique.user?.username || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="rounded-pill">
                      {boutique.categorie}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={boutique.plan === 'premium' ? 'warning' : 'secondary'} className="rounded-pill">
                      {boutique.plan}
                    </Badge>
                  </td>
                  <td>
                    <small className="text-muted">
                      {new Date(boutique.createdAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/boutique/${boutique._id}`}
                        variant="outline-primary"
                        size="sm"
                        title="Voir détails"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onApprove(boutique)}
                        title="Approuver"
                      >
                        <FaCheck />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onReject(boutique)}
                        title="Rejeter"
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
        
        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <Card.Footer className="bg-white border-0 py-3">
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev 
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                {[...Array(pagination.totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={pagination.page === idx + 1}
                    onClick={() => onPageChange(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                />
              </Pagination>
            </div>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default BoutiquesPendientesTable;