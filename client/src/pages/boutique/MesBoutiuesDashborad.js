// 📂 components/dashboard/MesBoutiquesDashboard.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
 import { getUserBoutiques } from '../../redux/actions/boutiqueAction';
import { Link } from 'react-router-dom';
import { FaStore, FaPlus, FaSpinner } from 'react-icons/fa';

 
const MesBoutiquesDashboard = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading } = useSelector(state => state.boutique);

  useEffect(() => {
    if (auth?.token) {
      // ✅ REUTILIZAMOS la acción existente
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="spinner" size={30} />
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-boutiques">
      <div className="section-header">
        <h3><FaStore /> Mes Boutiques</h3>
        <Link to="/create-boutique" className="btn-sm">
          <FaPlus /> Nouvelle
        </Link>
      </div>
      
      {userBoutiques?.length === 0 ? (
        <p className="text-muted">Vous n'avez pas encore de boutique</p>
      ) : (
        <div className="boutiques-list">
          {userBoutiques.slice(0, 3).map(boutique => (
            <div key={boutique._id} className="boutique-item">
              <img src={boutique.images?.[0]?.url || '/store-default.jpg'} alt="" />
              <div>
                <strong>{boutique.nom_boutique}</strong>
                <small>{boutique.productsCount || 0} produits</small>
              </div>
              <Link to={`/mes-produits-boutique/${boutique._id}`}>Gérer</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MesBoutiquesDashboard;
