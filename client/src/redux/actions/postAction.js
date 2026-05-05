
// 📂 actions/postAction.js - VERSIÓN LIMPIA
import { GLOBALTYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'
import axios from 'axios'
import { BASE_URL } from '../../utils/config'

//import { BASE_URL } from '../utils/config';

export const POST_TYPES = {
  // Estados básicos
  LOADING_POST: 'LOADING_POST',
  CREATE_POST: 'CREATE_POST',
  GET_POST: 'GET_POST',
  GET_POSTS: 'GET_POSTS',

  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',


  GET_CATEGORY_POSTS_SUCCESS: 'GET_CATEGORY_POSTS_SUCCESS',
  GET_CATEGORY_POSTS_FAIL: 'GET_CATEGORY_POSTS_FAIL',

  // 🎯 NUEVAS CONSTANTES PARA PAGINACIÓN
  LOADING_MORE_POSTS: 'LOADING_MORE_POSTS',
  LOAD_MORE_POSTS_SUCCESS: 'LOAD_MORE_POSTS_SUCCESS',
  LOAD_MORE_POSTS_FAIL: 'LOAD_MORE_POSTS_FAIL',
  RESET_CATEGORY_POSTS: 'RESET_CATEGORY_POSTS',

  // Posts similares
  GET_SIMILAR_POSTS: 'GET_SIMILAR_POSTS',
  LOADING_SIMILAR_POSTS: 'LOADING_SIMILAR_POSTS',
  CLEAR_SIMILAR_POSTS: 'CLEAR_SIMILAR_POSTS',

  // Filtros
  SET_POST_FILTERS: 'SET_POST_FILTERS',

  // Errores
  ERROR_POST: 'ERROR_POST',
  CLEAR_POST_ERROR: 'CLEAR_POST_ERROR',

  // Reset
  RESET_POST_STATE: 'RESET_POST_STATE',

  // Likes/Saves
  LIKE_POST: 'LIKE_POST',
  UNLIKE_POST: 'UNLIKE_POST',
  SAVE_POST: 'SAVE_POST',
  UNSAVE_POST: 'UNSAVE_POST'
 

};

export const setPostFilters = (filters) => ({
  type: POST_TYPES.SET_POST_FILTERS,
  payload: filters
});
export const resetCategoryPosts = () => ({
  type: POST_TYPES.RESET_CATEGORY_POSTS
});

// 🎯 Acción para indicar que se están cargando más posts
export const loadingMorePosts = () => ({
  type: POST_TYPES.LOADING_MORE_POSTS
});

// 🎯 Acción para éxito al cargar más posts
export const loadMorePostsSuccess = (payload) => ({
  type: POST_TYPES.LOAD_MORE_POSTS_SUCCESS,
  payload
});

// 🎯 Acción para error al cargar más posts
export const loadMorePostsFail = (error) => ({
  type: POST_TYPES.LOAD_MORE_POSTS_FAIL,
  payload: error
});


export const createPost = ({ postData, images, auth, socket }) => async (dispatch) => {
  let media = [];

  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    if (images.length > 0) {
      media = await imageUpload(images);
    }

    const postToSend = {
      ...postData,
      images: media
    };

    const res = await postDataAPI('posts', postToSend, auth.token);

    const newPost = res.data.newPost;

    dispatch({
      type: POST_TYPES.CREATE_POST,
      payload: {
        ...newPost,
        user: auth.user,
        categorySpecificData: postData.categorySpecificData || {}
      }
    });

    socket.emit('createPost', newPost);

    // ✅ NOTIFICACIÓN 1: Para el creador (post pendiente)
    const msgForCreator = {
      id: auth.user._id,
      text: '⏳ Votre annonce est en attente d\'approbation',
      recipients: [auth.user._id],
      url: `/post/${newPost._id}`,
      content: newPost.title,
      image: newPost.images?.[0]?.url || null,
      type: 'post_pending'
    };
    
    console.log('📨 Enviando notificación al creador:', msgForCreator);
    dispatch(createNotify({ msg: msgForCreator, auth, socket }));

    // ✅ NOTIFICACIÓN 2: Para admins (nuevo post para aprobar)
    const msgForAdmin = {
      id: auth.user._id,
      text: '📝 Un nouveau post est en attente d\'approbation',
      recipients: ["admin"], // El string "admin" será procesado por el backend
      url: `/admin/posts/pendientes`,
      content: newPost.title,
      image: newPost.images?.[0]?.url || null,
      type: 'post_admin'
    };
    
    console.log('📨 Enviando notificación al admin:', msgForAdmin);
    dispatch(createNotify({ msg: msgForAdmin, auth, socket }));

    // ✅ NOTIFICACIÓN 3: Para followers (opcional)
    if (auth.user.followers && auth.user.followers.length > 0) {
      const msgForFollowers = {
        id: auth.user._id,
        text: 'a créé un nouveau post.',
        recipients: auth.user.followers,
        url: `/post/${newPost._id}`,
        content: newPost.title,
        image: newPost.images?.[0]?.url || null,
        type: 'post'
      };
      
      console.log('📨 Enviando notificación a followers:', msgForFollowers);
      dispatch(createNotify({ msg: msgForFollowers, auth, socket }));
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    
    // Mostrar mensaje de éxito
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: 'Votre annonce a été créée et est en attente d\'approbation' 
      } 
    });

  } catch (err) {
    console.error('❌ Error en createPost:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
  }
};
/*export const getPost = (id) => async (dispatch) => {
  try {
    console.log('🔍 Fetching post with ID:', id)

    // ✅ Usar axios directamente con BASE_URL
    const res = await axios.get(`${BASE_URL}/api/post/${id}`)

    console.log('✅ Post response:', res.data)

    dispatch({
      type: POST_TYPES.GET_POST,
      payload: res.data.post
    })

  } catch (err) {
    console.error('❌ Error getting post:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: `${BASE_URL}/api/post/${id}`
    })

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg ||
          err.message ||
          'Error loading post'
      }
    })
  }
}*/
export const updatePost = ({
  postId,
  postData,
  images,
  auth,
  socket,      // ✅ Añadir socket como parámetro
  oldPostData  // ✅ Añadir datos del post anterior para notificación
}) => async (dispatch) => {
  console.time('⏱️ updatePost action time');
  let media = [];

  try {
    console.log('🟡 ========== UPDATE POST INICIADO ==========');
    console.log('📌 postId:', postId);
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
    const existingImages = images.filter(img => img.isExisting && img.url && !img.url.startsWith('blob:'));

    if (newImages.length > 0) {
      console.log(`📤 Subiendo ${newImages.length} imágenes nuevas...`);
      media = await imageUpload(newImages);
    }

    const finalImages = [
      ...existingImages.map(img => ({ url: img.url, public_id: img.public_id })),
      ...media
    ];

    const postToSend = {
      ...postData,
      images: finalImages,
      categorySpecificData: postData.categorySpecificData || {}
    };

    const res = await patchDataAPI(`post/${postId}`, postToSend, auth.token);

    dispatch({
      type: POST_TYPES.UPDATE_POST,
      payload: {
        ...res.data.post,
        user: auth.user,
        categorySpecificData: postData.categorySpecificData || {},
        _oldCategory: res.data.oldCategory,
        _categoryChanged: res.data.categoryChanged
      }
    });

    // ✅ Enviar notificación al dueño del post (si no es el mismo usuario)
    const updatedPost = res.data.post;
    if (oldPostData && oldPostData.user?._id && oldPostData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: '✏️ Votre annonce a été modifiée',
        recipients: [oldPostData.user._id],
        url: `/post/${updatedPost._id}`,
        content: updatedPost.title,
        image: updatedPost.images?.[0]?.url,
        type: 'post'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: "Post mis à jour avec succès!" } 
    });

  } catch (err) {
    console.error('❌ Error en updatePost:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
    console.timeEnd('⏱️ updatePost action time');
  }
};
 
export const getPost = (id) => async (dispatch) => {
  try {
    console.log('🔍 Fetching post with ID:', id)

    // ✅ Usar axios directamente con BASE_URL
    const res = await axios.get(`${BASE_URL}/api/post/${id}`)

    console.log('✅ Post response:', res.data)

    dispatch({
      type: POST_TYPES.GET_POST,
      payload: res.data.post
    })

  } catch (err) {
    console.error('❌ Error getting post:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      url: `${BASE_URL}/api/post/${id}`
    })

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg ||
          err.message ||
          'Error loading post'
      }
    })
  }
}
// 📂 redux/actions/postAction.js - AGREGAR ESTA ACCIÓN

// 🎯 ACCIÓN PARA FILTRAR POSTS CON PAGINACIÓN
export const filterPosts = (
  categorySlug,
  subSlug = null,
  articleSlug = null,
  page = 1,
  limit = 12,
  wilaya = null,
  commune = null,
  minPrice = null,
  maxPrice = null,
  sortBy = 'recent'
) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES.LOADING_POST, payload: true });
    
    console.log('📡 filterPosts - Llamada con parámetros:', {
      categorySlug,
      subSlug,
      articleSlug,
      page,
      limit,
      wilaya,
      commune,
      minPrice,
      maxPrice,
      sortBy
    });

    const params = {
      category: categorySlug,
      page,
      limit,
      sortBy
    };
    
    if (subSlug) params.sub = subSlug;
    if (articleSlug) params.article = articleSlug;
    if (wilaya) params.wilaya = wilaya;
    if (commune) params.commune = commune;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    
    const { data } = await axios.get(`${BASE_URL}/api/posts/filter`, { params });
    
    console.log(`✅ Posts recibidos: ${data.posts?.length || 0}, total: ${data.total || 0}, página: ${data.page || page}`);
    
    // 🔥 Si es página 1, reemplazar; si no, concatenar
    if (page === 1) {
      dispatch({
        type: POST_TYPES.GET_CATEGORY_POSTS_SUCCESS,
        payload: {
          posts: data.posts || [],
          total: data.total || 0,
          page: data.page || page,
          totalPages: data.totalPages || 1,
          hasMore: data.hasMore || false,
          categoryInfo: data.categoryInfo || {},
          children: data.children || [],
          filterMetadata: data.filterMetadata || {}
        }
      });
    } else {
      dispatch({
        type: POST_TYPES.LOAD_MORE_POSTS_SUCCESS,
        payload: {
          posts: data.posts || [],
          pagination: {
            currentPage: data.page || page,
            totalPages: data.totalPages || 1,
            totalPosts: data.total || 0,
            hasMore: data.hasMore || false,
            limit
          }
        }
      });
    }
    
    dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
    
    return data;
    
  } catch (error) {
    console.error('❌ Error en filterPosts:', error);
    dispatch({
      type: POST_TYPES.ERROR_POST,
      payload: error.response?.data?.message || error.message
    });
    dispatch({ type: POST_TYPES.LOADING_POST, payload: false });
    return { success: false, posts: [] };
  }
};

// 🎯 ACCIÓN PARA CARGAR MÁS POSTS (SCROLL INFINITO)
export const loadMoreFilteredPosts = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { filters, pagination, posts } = state.post;
    
    const nextPage = (pagination?.currentPage || 1) + 1;
    
    // Verificar si hay más posts
    if (!pagination?.hasMore) {
      console.log('⏸️ No hay más posts para cargar');
      return;
    }
    
    console.log('📡 loadMoreFilteredPosts - Cargando página:', nextPage);
    
    dispatch({ type: POST_TYPES.LOADING_MORE_POSTS });
    
    const params = {
      category: filters.categorySlug,
      page: nextPage,
      limit: pagination.limit || 12,
      sortBy: filters.sortBy || 'recent'
    };
    
    if (filters.subSlug) params.sub = filters.subSlug;
    if (filters.articleSlug) params.article = filters.articleSlug;
    if (filters.wilaya) params.wilaya = filters.wilaya;
    if (filters.commune) params.commune = filters.commune;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    
    const { data } = await axios.get(`${BASE_URL}/api/posts/filter`, { params });
    
    dispatch({
      type: POST_TYPES.LOAD_MORE_POSTS_SUCCESS,
      payload: {
        posts: data.posts || [],
        pagination: {
          currentPage: data.page || nextPage,
          totalPages: data.totalPages || 1,
          totalPosts: data.total || 0,
          hasMore: data.hasMore || false,
          limit: pagination.limit
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error en loadMoreFilteredPosts:', error);
    dispatch({
      type: POST_TYPES.LOAD_MORE_POSTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};
export const addView = (id) => async () => {
  try {

    await axios.patch(`/api/post/${id}/view`)

  } catch (err) {
    console.error(err)
  }
}

export const deletePost = ({ post, auth, socket }) => async (dispatch) => {
  dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

  try {
    const res = await deleteDataAPI(`post/${post._id}`, auth.token)

    // ✅ Notify (ya implementado correctamente)
    const msg = {
      id: post._id,
      text: 'added a new post.',
      recipients: res.data.newPost.user.followers,
      url: `/post/${post._id}`,
    }
    dispatch(removeNotify({ msg, auth, socket }))

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response.data.msg }
    })
  }
}


export const likePost = ({ post, auth, socket }) => async (dispatch) => {
  const newPost = { ...post, likes: [...post.likes, auth.user] }
  dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

  socket.emit('likePost', newPost)

  try {
    await patchDataAPI(`post/${post._id}/like`, null, auth.token)

    const msg = {
      id: auth.user._id,
      text: 'liked your post.',
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      content: post.content,
      image: post.images[0]?.url
    }

    dispatch(createNotify({ msg, auth, socket }))

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error liking post' }
    })
  }
}

// ============================================
// ✅ UNLIKE POST (YA TIENE NOTIFICACIÓN - VERIFICADO)
// ============================================
export const unLikePost = ({ post, auth, socket }) => async (dispatch) => {
  const newPost = { ...post, likes: post.likes.filter(like => like._id !== auth.user._id) }
  dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

  socket.emit('unLikePost', newPost)

  try {
    await patchDataAPI(`post/${post._id}/unlike`, null, auth.token)

    const msg = {
      id: auth.user._id,
      text: 'unliked your post.',
      recipients: [post.user._id],
      url: `/post/${post._id}`,
    }
    dispatch(removeNotify({ msg, auth, socket }))

  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error unliking post' }
    })
  }
}
export const savePost = ({ post, auth }) => async (dispatch) => {
  const newUser = { ...auth.user, saved: [...auth.user.saved, post._id] }
  dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })

  try {
    await patchDataAPI(`savePost/${post._id}`, null, auth.token)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error saving post' }
    })
  }
}

/**
 * Quitar post guardado
 */
export const unSavePost = ({ post, auth }) => async (dispatch) => {
  const newUser = { ...auth.user, saved: auth.user.saved.filter(id => id !== post._id) }
  dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } })

  try {
    await patchDataAPI(`unSavePost/${post._id}`, null, auth.token)
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || 'Error unsaving post' }
    })
  }
}

// ========== ACCIONES AUXILIARES ==========

/**
 * Obtener posts similares
 */
/*export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: true })
        
        // Obtener el post actual para saber su categoría
        const state = getState();
        let currentPost = state.detailPost;
        
        if (!currentPost || currentPost._id !== postId) {
            const res = await getDataAPI(`post/${postId}`);
            currentPost = res.data?.post || res.data;
        }
        
        if (!currentPost || !currentPost.category) {
            dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
            return;
        }
        
        // Llamar a la API de posts similares
        const params = new URLSearchParams({
            category: currentPost.category._id || currentPost.category,
            excludeId: postId,
            limit: options.limit || 6,
            page: options.page || 1
        });
        
        const res = await getDataAPI(`posts/similar?${params}`);
        
        if (res.data.success) {
            dispatch({
                type: POST_TYPES.GET_SIMILAR_POSTS,
                payload: {
                    posts: res.data.posts || [],
                    page: options.page || 1,
                    total: res.data.total || 0,
                    currentPostId: postId
                }
            });
        }
        
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
        
    } catch (err) {
        console.error('❌ Error en getSimilarPosts:', err.message);
        dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
    }
}


  export const clearSimilarPosts = () => (dispatch) => {
    dispatch({ type: POST_TYPES.CLEAR_SIMILAR_POSTS });
  };*/
export const getCategories = (page = 1, limit = 2) => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    const res = await getDataAPI(`categories/paginated?page=${page}&limit=${limit}`, auth.token);

    dispatch({
      type: POST_TYPES.GET_CATEGORIES_PAGINATED,
      payload: {
        categories: res.data.categories,
        page: res.data.page,
        total: res.data.total,
        totalPages: res.data.totalPages,
        hasMore: res.data.hasMore
      }
    });

    return res.data;
  } catch (err) {
    dispatch({
      type: 'ALERT',
      payload: { error: err.response?.data?.msg || 'Error al cargar categorías' }
    });
    throw err;
  }
};

// actions/postAction.js - VERSIÓN CORREGIDA
export const getSimilarPosts = (postId, options = {}) => async (dispatch, getState) => {
  try {
    console.log('🚀 ======= INICIO BÚSQUEDA SIMILARES =======');
    console.log('📌 Post ID objetivo:', postId);

    dispatch({
      type: POST_TYPES.LOADING_SIMILAR_POSTS,
      payload: true
    });

    // Obtener el post actual
    const state = getState();
    let currentPost = null;

    // Buscar el post en diferentes lugares
    if (state.detailPost && state.detailPost._id === postId) {
      currentPost = state.detailPost;
    } else if (state.posts?.posts) {
      currentPost = state.posts.posts.find(p => p._id === postId);
    }

    // Si no está, obtener de API
    if (!currentPost) {
      const res = await getDataAPI(`post/${postId}`);
      currentPost = res.data?.post || res.data;
      dispatch({ type: 'GET_POST', payload: currentPost });
    }

    if (!currentPost || !currentPost.categorie || !currentPost.subCategory) {
      console.error('❌ Post sin categoría completa');
      dispatch({ type: POST_TYPES.LOADING_SIMILAR_POSTS, payload: false });
      return;
    }

    // Construir parámetros
    const params = new URLSearchParams({
      categorie: currentPost.categorie,
      subCategory: currentPost.subCategory,
      excludeId: postId,
      limit: options.limit || 6,
      page: options.page || 1
    });

    console.log('🌐 Llamando API:', `/posts/similar?${params}`);

    const res = await getDataAPI(`posts/similar?${params}`);

    console.log('📦 Respuesta API:', {
      success: res.data.success,
      postsCount: res.data.posts?.length,
      data: res.data
    });

    if (res.data.success) {
      // ✅ AHORA GUARDAMOS EN similarPostsArray (consistente con el reducer)
      dispatch({
        type: POST_TYPES.GET_SIMILAR_POSTS,
        payload: {
          posts: res.data.posts || [],
          page: options.page || 1,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
          hasMore: res.data.hasMore || false,
          currentPostId: postId
        }
      });
    } else {
      throw new Error(res.data.message || 'Error en el servidor');
    }

  } catch (err) {
    console.error('❌ ERROR en getSimilarPosts:', err.message);
    dispatch({
      type: POST_TYPES.ERROR_POST,
      payload: err.message
    });
  } finally {
    dispatch({
      type: POST_TYPES.LOADING_SIMILAR_POSTS,
      payload: false
    });
  }
};
export const clearSimilarPosts = () => (dispatch) => {
  dispatch({ type: POST_TYPES.CLEAR_SIMILAR_POSTS });
};

