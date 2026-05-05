import { GLOBALTYPES } from './globalTypes';
import axios from 'axios';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify

export const BOUTIQUE_TYPES = {
  // Basic CRUD
  CREATE_BOUTIQUE: 'CREATE_BOUTIQUE',
  GET_BOUTIQUES: 'GET_BOUTIQUES',
  GET_BOUTIQUE: 'GET_BOUTIQUE',
  UPDATE_BOUTIQUE: 'UPDATE_BOUTIQUE',
  DELETE_BOUTIQUE: 'DELETE_BOUTIQUE',
  INCREMENT_BOUTIQUE_VIEW:'INCREMENT_BOUTIQUE_VIEW',
  GET_BOUTIQUES_BY_CATEGORY: 'GET_BOUTIQUES_BY_CATEGORY',
  GET_BOUTIQUES_FOR_HOME: 'GET_BOUTIQUES_FOR_HOME',
  // User specific
  GET_USER_BOUTIQUES: 'GET_USER_BOUTIQUES',
  GET_BOUTIQUE_BY_DOMAIN: 'GET_BOUTIQUE_BY_DOMAIN',
  
  UPDATE_BOUTIQUE_HEADER_IMAGES: 'UPDATE_BOUTIQUE_HEADER_IMAGES',
  DELETE_BOUTIQUE_HEADER_IMAGE: 'DELETE_BOUTIQUE_HEADER_IMAGE', 

  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  // Loading states
  LOADING_BOUTIQUE: 'LOADING_BOUTIQUE',
  LOADING_BOUTIQUES_BY_CATEGORY: 'LOADING_BOUTIQUES_BY_CATEGORY',

  FOLLOW_BOUTIQUE: 'FOLLOW_BOUTIQUE',
  UNFOLLOW_BOUTIQUE: 'UNFOLLOW_BOUTIQUE',
  LIKE_BOUTIQUE: 'LIKE_BOUTIQUE',
  UNLIKE_BOUTIQUE: 'UNLIKE_BOUTIQUE',
  GET_BOUTIQUE_FOLLOWERS: 'GET_BOUTIQUE_FOLLOWERS',
  GET_BOUTIQUE_LIKES: 'GET_BOUTIQUE_LIKES',
  
  GET_ADMIN_BOUTIQUES: 'GET_ADMIN_BOUTIQUES',            
  GET_ADMIN_BOUTIQUES_PENDIENTES: 'GET_ADMIN_BOUTIQUES_PENDIENTES',
  
  // Nuevos para admin
  APPROVE_BOUTIQUE: 'APPROVE_BOUTIQUE',
  REJECT_BOUTIQUE: 'REJECT_BOUTIQUE',
  UPDATE_ADMIN_BOUTIQUE_STATUS: 'UPDATE_ADMIN_BOUTIQUE_STATUS',
  CLEAR_ADMIN_BOUTIQUES: 'CLEAR_ADMIN_BOUTIQUES',
  LOADING_ADMIN_BOUTIQUES: 'LOADING_ADMIN_BOUTIQUES'
};

// ============ CREATE BOUTIQUE CON NOTIFICACIÓN ============
export const createBoutique = ({ 
  boutiqueData, 
  images, 
  auth,
  socket  // ✅ Añadir socket
}) => async (dispatch) => {
  console.time('⏱️ createBoutique action time');
  
  try {
    console.log('🟡 createBoutique action iniciada');
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    let finalImages = [];
    
    const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
    const existingImages = images.filter(img => img.isExisting);
    
    if (newImages.length > 0) {
      console.log(`📤 Subiendo ${newImages.length} imagen(es) a Cloudinary...`);
      const uploaded = await imageUpload(newImages);
      finalImages = [...existingImages, ...uploaded];
    } else {
      finalImages = existingImages;
    }
    
    const boutiqueToSend = {
      ...boutiqueData,
      images: finalImages
    };

    console.log('📦 Enviando al API:', {
      nom_boutique: boutiqueToSend.nom_boutique,
      imagesCount: boutiqueToSend.images.length
    });

    const res = await postDataAPI('boutique', boutiqueToSend, auth.token);
    
    dispatch({ 
      type: BOUTIQUE_TYPES.CREATE_BOUTIQUE, 
      payload: res.data.boutique
    });

    // ✅ Notificar al admin sobre nueva boutique pendiente
    const boutique = res.data.boutique;
    const msg = {
      id: auth.user._id,
      text: '🏪 Une nouvelle boutique a été créée et attend votre approbation',
      recipients: [], // Se enviará a todos los admins (backend)
      url: `/admin/boutiques/pendientes`,
      content: boutique.nom_boutique,
      image: boutique.images?.[0]?.url,
      type: 'boutique'
    };
    
    dispatch(createNotify({ msg, auth, socket }));

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response?.data?.message || err.message}
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
    console.timeEnd('⏱️ createBoutique action time');
  }
};

// ============ UPDATE BOUTIQUE CON NOTIFICACIÓN ============
export const updateBoutique = ({ 
  boutiqueId, 
  boutiqueData, 
  images, 
  auth,
  socket  // ✅ Añadir socket
}) => async (dispatch) => {
  console.time('⏱️ updateBoutique action time');
  
  try {
    console.log('🟡 updateBoutique action iniciada', { boutiqueId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    let finalImages = [];
    
    if (images && images.length > 0) {
      const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
      const existingImages = images.filter(img => img.isExisting);
      
      if (newImages.length > 0) {
        console.log(`📤 Subiendo ${newImages.length} imagen(es) nuevas a Cloudinary...`);
        const uploaded = await imageUpload(newImages);
        finalImages = [...existingImages, ...uploaded];
      } else {
        finalImages = existingImages;
      }
    }
    
    const boutiqueToSend = {
      ...boutiqueData,
      images: finalImages.length > 0 ? finalImages : boutiqueData.images || []
    };

    const res = await patchDataAPI(`boutique/${boutiqueId}`, boutiqueToSend, auth.token);
    
    dispatch({ 
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE, 
      payload: res.data.boutique || res.data
    });

    // ✅ Notificar al dueño sobre actualización de su boutique
    const boutique = res.data.boutique || res.data;
    const msg = {
      id: auth.user._id,
      text: '✏️ Votre boutique a été mise à jour avec succès',
      recipients: [boutique.user?._id || boutique.proprietaire?._id],
      url: `/boutique/${boutique._id}`,
      content: boutique.nom_boutique,
      image: boutique.images?.[0]?.url,
      type: 'boutique'
    };
    
    dispatch(createNotify({ msg, auth, socket }));

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Boutique mise à jour avec succès!' }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en updateBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response?.data?.message || err.message}
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
    console.timeEnd('⏱️ updateBoutique action time');
  }
};

// ============ DELETE BOUTIQUE CON NOTIFICACIÓN ============
export const deleteBoutique = ({ 
  boutiqueId, 
  auth,
  boutiqueData,  // ✅ Añadir datos de la boutique para la notificación
  socket         // ✅ Añadir socket
}) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    const res = await deleteDataAPI(`boutique/${boutiqueId}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.DELETE_BOUTIQUE,
      payload: boutiqueId
    });
    
    // ✅ Notificar al dueño sobre eliminación
    if (boutiqueData) {
      const msg = {
        id: auth.user._id,
        text: '🗑️ Votre boutique a été supprimée',
        recipients: [boutiqueData.user?._id || boutiqueData.proprietaire?._id],
        url: `/`,
        content: boutiqueData.nom_boutique,
        image: boutiqueData.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Boutique supprimée avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en deleteBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
  }
};

// ============ APROBAR BOUTIQUE CON NOTIFICACIÓN ============
export const approveBoutique = (boutiqueId, auth, socket, boutiqueData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    console.log('✅ Aprobando boutique:', boutiqueId);
    const res = await patchDataAPI(`admin/boutiques/aprobar/${boutiqueId}`, {}, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.APPROVE_BOUTIQUE,
      payload: boutiqueId
    });
    
    // ✅ Notificar al dueño que su boutique fue aprobada
    const boutique = res.data.boutique || boutiqueData;
    if (boutique && boutique.user?._id) {
      const msg = {
        id: auth.user._id,
        text: boutique.plan === 'gratuit' 
          ? '✅ Votre boutique a été approuvée et est maintenant visible'
          : '✅ Votre boutique a été approuvée. En attente de paiement pour activation',
        recipients: [boutique.user._id],
        url: `/boutique/${boutique._id}`,
        content: boutique.nom_boutique,
        image: boutique.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique approuvée avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en approveBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al aprobar boutique' }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ RECHAZAR BOUTIQUE CON NOTIFICACIÓN ============
export const rejectBoutique = (boutiqueId, auth, socket, boutiqueData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    console.log('❌ Rechazando boutique:', boutiqueId);
    const res = await deleteDataAPI(`admin/boutiques/rechazar/${boutiqueId}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.REJECT_BOUTIQUE,
      payload: boutiqueId
    });
    
    // ✅ Notificar al dueño que su boutique fue rechazada
    const boutique = res.data.boutique || boutiqueData;
    if (boutique && boutique.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '❌ Votre boutique a été rejetée par l\'administrateur',
        recipients: [boutique.user._id],
        url: `/`,
        content: boutique.nom_boutique,
        image: boutique.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique rejetée avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en rejectBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al rechazar boutique' }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ ACTIVAR BOUTIQUE DE PAGO CON NOTIFICACIÓN ============
export const activatePaidBoutique = (boutiqueId, auth, socket, boutiqueData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`admin/boutiques/activate-paid/${boutiqueId}`, {}, auth.token);
    
    // ✅ Notificar al dueño que el pago fue confirmado
    const boutique = res.data.boutique || boutiqueData;
    if (boutique && boutique.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '🎉 Paiement confirmé ! Votre boutique est maintenant active',
        recipients: [boutique.user._id],
        url: `/boutique/${boutique._id}`,
        content: boutique.nom_boutique,
        image: boutique.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique activée avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en activatePaidBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ FOLLOW BOUTIQUE CON NOTIFICACIÓN ============
export const followBoutique = (boutiqueId, auth, socket, boutiqueData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/follow`, {}, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.FOLLOW_BOUTIQUE,
      payload: {
        boutiqueId,
        following: res.data.following,
        followersCount: res.data.followersCount
      }
    });
    
    // ✅ Notificar al dueño de la boutique que alguien la sigue
    if (boutiqueData && boutiqueData.user?._id && boutiqueData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `👥 @${auth.user.username} a commencé à suivre votre boutique`,
        recipients: [boutiqueData.user._id],
        url: `/boutique/${boutiqueId}`,
        content: boutiqueData.nom_boutique,
        image: boutiqueData.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ LIKE BOUTIQUE CON NOTIFICACIÓN ============
export const likeBoutique = (boutiqueId, auth, socket, boutiqueData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/like`, {}, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.LIKE_BOUTIQUE,
      payload: {
        boutiqueId,
        liked: res.data.liked,
        likesCount: res.data.likesCount
      }
    });
    
    // ✅ Notificar al dueño de la boutique que alguien le dio like
    if (boutiqueData && boutiqueData.user?._id && boutiqueData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `❤️ @${auth.user.username} a aimé votre boutique`,
        recipients: [boutiqueData.user._id],
        url: `/boutique/${boutiqueId}`,
        content: boutiqueData.nom_boutique,
        image: boutiqueData.images?.[0]?.url,
        type: 'boutique'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ GET BOUTIQUE BY ID (sin cambios) ============
export const getBoutique = (id, auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${id}`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE,
      payload: res.data.boutique || res.data
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Boutique non trouvée'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ GET USER BOUTIQUES ============
export const getUserBoutiques = (auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI('boutique/user/me', auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_USER_BOUTIQUES,
      payload: res.data.boutiques || res.data
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement de vos boutiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ GET BOUTIQUES BY CATEGORY ============
export const getBoutiquesByCategory = (
  categorySlug,
  subSlug = null,
  page = 1,
  limit = 12,
  wilaya = '',
  commune = '',
  minPrice = null,
  maxPrice = null,
  sortBy = 'recent'
) => async (dispatch) => {
  try {
    const categoryPath = subSlug ? `${categorySlug}/${subSlug}` : categorySlug;

    const params = { 
      category: categorySlug, 
      page, 
      limit,
      sortBy
    };
    
    if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') params.sub = subSlug;
    if (wilaya && wilaya !== '') params.wilaya = wilaya;
    if (commune && commune !== '') params.commune = commune;
    if (minPrice !== null && minPrice !== '') params.minPrice = minPrice;
    if (maxPrice !== null && maxPrice !== '') params.maxPrice = maxPrice;

    console.log('📡 Llamando a API boutique/filter con params:', params);

    const res = await getDataAPI(`boutique/filter?${new URLSearchParams(params)}`);
    
    console.log('✅ Respuesta de API:', {
      boutiquesCount: res.data.boutiques?.length || 0,
      total: res.data.total,
      hasFilterMetadata: !!res.data.filterMetadata
    });
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY,
      payload: {
        categoryPath,
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        categoryInfo: res.data.categoryInfo || null,
        children: res.data.children || [],
        filterMetadata: res.data.filterMetadata || null
      }
    });

    return res.data;
  } catch (err) {
    console.error('❌ Error en getBoutiquesByCategory:', err);
    throw err;
  }
};

// ============ GET BOUTIQUES FOR HOME ============
export const getBoutiquesForHome = (limit = 6) => async (dispatch) => {
  try {
    console.log('🏪 Cargando boutiques para el home con límite:', limit);
    
    const params = { 
      category: 'boutiques', 
      page: 1, 
      limit: limit 
    };
    
    const res = await getDataAPI(`boutique/filter?${new URLSearchParams(params)}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_FOR_HOME,
      payload: res.data.boutiques || []
    });
    
    return res.data.boutiques;
    
  } catch (err) {
    console.error('❌ Error cargando boutiques para home:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return [];
  }
};

// ============ UPDATE BOUTIQUE STATUS ============
export const updateBoutiqueStatus = ({ 
  boutiqueId, 
  statusData, 
  auth,
  socket  // ✅ Añadir socket
}) => async (dispatch) => {
  try {
    console.log('🔄 updateBoutiqueStatus action iniciada', { boutiqueId, statusData });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/status`, statusData, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS,
      payload: {
        id: boutiqueId,
        ...res.data.boutique
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Statut mis à jour avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en updateBoutiqueStatus:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
  }
};

// ============ UPDATE BOUTIQUE HEADER IMAGES ============
export const updateBoutiqueHeaderImages = ({ boutiqueId, images, auth, socket }) => async (dispatch) => {
  try {
    console.log('🟡 updateBoutiqueHeaderImages action iniciada');
    
    if (!images || images.length === 0) {
      console.warn('⚠️ No hay imágenes para subir');
      return { success: false, error: 'No images to upload' };
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    let headerImages = [];

    const uploadedImages = await imageUpload(images);
    console.log('✅ Imágenes subidas desde Cloudinary:', uploadedImages);
    
    if (uploadedImages.length === 0) {
      throw new Error('No se pudieron subir las imágenes a Cloudinary');
    }
    
    headerImages = uploadedImages.map(img => ({
      url: img.url,
      public_id: img.public_id,
      alt: `Header image ${Date.now()}`
    }));

    const res = await patchDataAPI(
      `boutique/${boutiqueId}/headerimages`,
      { header_images: headerImages },
      auth.token
    );

    console.log('✅ Respuesta del backend:', res.data);

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Images téléchargées' }
    });

    dispatch({
      type: 'UPDATE_BOUTIQUE_HEADER_IMAGES',
      payload: {
        boutiqueId,
        header_images: res.data.header_images || headerImages
      }
    });

    return { success: true, header_images: res.data.header_images || headerImages };

  } catch (err) {
    console.error('❌ Error en updateBoutiqueHeaderImages:', err);
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ DELETE BOUTIQUE HEADER IMAGE ============
export const deleteBoutiqueHeaderImage = ({ 
  boutiqueId, 
  imageId, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('🗑️ Eliminando imagen de header:', { boutiqueId, imageId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await deleteDataAPI(
      `boutique/${boutiqueId}/headerimages/${imageId}`, 
      auth.token
    );

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Image supprimée avec succès' }
    });

    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_HEADER_IMAGES,
      payload: {
        boutiqueId,
        header_images: res.data.header_images
      }
    });

    return { success: true };

  } catch (err) {
    console.error('❌ Error en deleteBoutiqueHeaderImage:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ GET BOUTIQUE STATS ============
export const getBoutiqueStats = (boutiqueId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${boutiqueId}/stats`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_STATS,
      payload: {
        boutiqueId,
        stats: res.data.stats || res.data
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des statistiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ FUNCIONES AUXILIARES ============
export const incrementBoutiqueView = (boutiqueId) => async (dispatch) => {
  try {
    const sessionKey = `view_sent_${boutiqueId}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log('⏭️ Vista ya enviada en esta sesión');
      return;
    }
    
    console.log('📤 Llamando a API: PATCH /api/boutique/', boutiqueId, '/view');
    sessionStorage.setItem(sessionKey, Date.now());
    
    const response = await axios.patch(`/api/boutique/${boutiqueId}/view`);
    console.log('✅ Respuesta del servidor:', response.data);
    
    if (response.data.views) {
      dispatch({
        type: 'UPDATE_BOUTIQUE_VIEWS',
        payload: {
          boutiqueId: boutiqueId,
          views: response.data.views
        }
      });
    }
    
    return response.data;
  } catch (err) {
    console.error('❌ Error adding view:', err.response?.data || err.message);
  }
};

export const checkFollowBoutique = (boutiqueId, auth) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/follow/check`, auth.token);
    return res.data;
  } catch (err) {
    console.error('Error checking follow:', err);
    return { following: false };
  }
};

export const getBoutiqueFollowers = (boutiqueId, auth = null) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/followers`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_FOLLOWERS,
      payload: {
        boutiqueId,
        followersCount: res.data.followersCount,
        userFollowing: res.data.userFollowing
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getting followers:', err);
    return { followersCount: 0, userFollowing: false };
  }
};

export const getBoutiqueLikes = (boutiqueId, auth = null) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/likes`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_LIKES,
      payload: {
        boutiqueId,
        likesCount: res.data.likesCount,
        userLiked: res.data.userLiked
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getting likes:', err);
    return { likesCount: 0, userLiked: false };
  }
};

// ============ ADMIN FUNCTIONS ============
export const getAdminBoutiques = (page = 1, limit = 10, search = '', filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_ADMIN_BOUTIQUES, payload: true });
    
    const params = new URLSearchParams({ page, limit });
    if (search && search.trim()) params.append('search', search.trim());
    if (filters.status) params.append('status', filters.status);
    if (filters.categorie) params.append('categorie', filters.categorie);
    
    console.log('📡 Fetching boutiques aprobadas:', `/admin/boutiques/aprobadas?${params}`);
    
    const res = await getDataAPI(`admin/boutiques/aprobadas?${params}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_ADMIN_BOUTIQUES,
      payload: {
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        isSearching: !!search
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getAdminBoutiques:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cargar boutiques' }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_ADMIN_BOUTIQUES, payload: false });
  }
};

export const getAdminBoutiquesPendientes = (page = 1, limit = 10, search = '', categorie = '') => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_ADMIN_BOUTIQUES, payload: true });
    
    const params = new URLSearchParams({ page, limit });
    if (search && search.trim()) params.append('search', search.trim());
    if (categorie) params.append('categorie', categorie);
    
    console.log('📡 Fetching boutiques pendientes:', `/admin/boutiques/pendientes?${params}`);
    
    const res = await getDataAPI(`admin/boutiques/pendientes?${params}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_ADMIN_BOUTIQUES_PENDIENTES,
      payload: {
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getAdminBoutiquesPendientes:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cargar boutiques pendientes' }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_ADMIN_BOUTIQUES, payload: false });
  }
};

export const updateAdminBoutiqueStatus = (boutiqueId, isActive, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    console.log(`🔄 Cambiando estado de boutique ${boutiqueId} a ${isActive ? 'activo' : 'inactivo'}`);
    const res = await patchDataAPI(`admin/boutiques/status/${boutiqueId}`, { isActive }, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_ADMIN_BOUTIQUE_STATUS,
      payload: {
        id: boutiqueId,
        isActive
      }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || `Boutique ${isActive ? 'activée' : 'désactivée'} avec succès` }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en updateAdminBoutiqueStatus:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error al cambiar estado' }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

export const clearAdminBoutiques = () => ({
  type: BOUTIQUE_TYPES.CLEAR_ADMIN_BOUTIQUES
});

export const resetBoutiquesByCategory = (categoryPath) => ({
  type: 'CLEAR_BOUTIQUES_BY_CATEGORY',
  payload: { categoryPath }
});

export const resetAllBoutiques = () => ({
  type: 'CLEAR_BOUTIQUES'
});