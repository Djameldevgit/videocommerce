import { GLOBALTYPES, EditData, DeleteData } from './globalTypes'
import { POST_TYPES } from './postAction'
import { postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from '../actions/notifyAction'

// Helper para obtener el tipo de acción según el modelo
const getActionType = (targetType) => {
    const types = {
        'post': POST_TYPES,
        'video': POST_TYPES,  // Temporal, luego crear VIDEO_TYPES
        'boutique': POST_TYPES // Temporal, luego crear BOUTIQUE_TYPES
    }
    return types[targetType] || POST_TYPES
}

export const createComment = ({target, newComment, auth, socket, targetType}) => async (dispatch) => {
    const newTarget = {...target, comments: [...(target.comments || []), newComment]}
    const TYPES = getActionType(targetType)
    
    dispatch({ type: TYPES.UPDATE_POST, payload: newTarget })

    try {
        const data = {
            ...newComment, 
            targetId: target._id, 
            targetModel: targetType,
            targetUserId: target.user._id
        }
        const res = await postDataAPI('comment', data, auth.token)

        const newData = {...res.data.newComment, user: auth.user}
        const updatedTarget = {...target, comments: [...(target.comments || []), newData]}
        dispatch({ type: TYPES.UPDATE_POST, payload: updatedTarget })

        if(socket) socket.emit('createComment', updatedTarget)

        const msg = {
            id: res.data.newComment._id,
            text: newComment.reply ? 'mentioned you in a comment.' : 'has commented on your post.',
            recipients: newComment.reply ? [newComment.tag._id] : [target.user._id],
            url: `/${targetType}/${target._id}`,
            content: target.content || target.title || target.nom_boutique || '', 
            image: target.images?.[0]?.url || target.logopordefecto || ''
        }

        dispatch(createNotify({msg, auth, socket}))
        
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response?.data?.msg || err.message} })
    }
}

export const updateComment = ({comment, target, content, auth, targetType}) => async (dispatch) => {
    const newComments = EditData(target.comments, comment._id, {...comment, content})
    const newTarget = {...target, comments: newComments}
    const TYPES = getActionType(targetType)
    
    dispatch({ type: TYPES.UPDATE_POST, payload: newTarget })
    try {
        await patchDataAPI(`comment/${comment._id}`, { content }, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response?.data?.msg || err.message} })
    }
}

export const likeComment = ({comment, target, auth, targetType}) => async (dispatch) => {
    const newComment = {...comment, likes: [...(comment.likes || []), auth.user]}
    const newComments = EditData(target.comments, comment._id, newComment)
    const newTarget = {...target, comments: newComments}
    const TYPES = getActionType(targetType)
    
    dispatch({ type: TYPES.UPDATE_POST, payload: newTarget })

    try {
        await patchDataAPI(`comment/${comment._id}/like`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response?.data?.msg || err.message} })
    }
}

export const unLikeComment = ({comment, target, auth, targetType}) => async (dispatch) => {
    const newComment = {...comment, likes: DeleteData(comment.likes || [], auth.user._id)}
    const newComments = EditData(target.comments, comment._id, newComment)
    const newTarget = {...target, comments: newComments}
    const TYPES = getActionType(targetType)
    
    dispatch({ type: TYPES.UPDATE_POST, payload: newTarget })

    try {
        await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response?.data?.msg || err.message} })
    }
}

// 📂 redux/actions/commentAction.js

export const deleteComment = ({target, comment, auth, socket, targetType}) => async (dispatch) => {
    try {
        // ✅ Verificar que tenemos los datos necesarios
        console.log('🗑️ deleteComment llamado:', { 
            commentId: comment._id, 
            targetId: target?._id,
            targetType,
            userId: auth.user?._id
        });

        if (!comment || !comment._id) {
            console.error('❌ deleteComment: commentId no válido');
            return;
        }

        // ✅ Llamar a la API para eliminar el comentario
        const res = await deleteDataAPI(`comment/${comment._id}`, auth.token);
        
        console.log('✅ deleteComment respuesta:', res.data);

        // ✅ Si la eliminación fue exitosa, actualizar el estado local
        if (res.data.msg === 'Deleted Comment!') {
            // Eliminar el comentario del array de comentarios del target
            const deleteArr = [...(target.comments || []).filter(cm => cm.reply === comment._id), comment];
            
            const newTarget = {
                ...target,
                comments: (target.comments || []).filter(cm => !deleteArr.find(da => cm._id === da._id))
            };
            
            const TYPES = getTargetType(targetType);
            
            if (TYPES && TYPES.UPDATE_POST) {
                dispatch({ type: TYPES.UPDATE_POST, payload: newTarget });
            }
            
            if (socket) {
                socket.emit('deleteComment', newTarget);
            }
        }
        
    } catch (err) {
        console.error('❌ Error en deleteComment:', err);
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: { error: err.response?.data?.msg || 'Error al eliminar comentario' } 
        });
    }
}