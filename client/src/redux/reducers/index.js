import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import postAprove from './postAprovetReducer'
import modal from './modalReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
import message from './messageReducer'
import online from './onlineReducer'
import call from './callReducer'
import languageReducer from './languageReducer'
import homeUsers from './userReducer'
 
import usersActionReducer from './usersActionReducer'
import blog from './blogReducer'
import ProvaReducer from './provaReducer'
import reportReducer from './reportReducer'
import publiBlogReducer from './publiBlogReducer'
import form from './formReducer'
import { roleReducer } from './roleReducer'
import settings from './settingsReducer'
import privacy from './privacyReducer'
import posts from './postReducer'
import category from './categoryReducer'
import { accordionReducer } from './accordionReducer'
import boutique from './boutiqueReducer'
import boutiqueProduct from './boutiqueProductReducer'  // 🔥 SOLO UNA VEZ
import boutiqueAprove from './boutiqueAproveReducer'
import productAprove from './productAproveReducer'
import filter from './filterReducer.'
import carousel from './carouselReducer'
import video  from './videoReducer'
import videoApprove from './videoApproveReducer';
import userVideo from './userVideoReducer'; // ✅ NUEVO
import image from './imageReducer'

export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    postAprove,
    boutiqueAprove,   
    productAprove,
    modal,
    detailPost,
    discover,
    suggestions,
    socket,
    notify,
    message,
    online,
    call,
    languageReducer,
    roleReducer,
    homeUsers,
    
    usersActionReducer,
    ProvaReducer,
    reportReducer,
    publiBlogReducer,
    blog,
    form,
    settings,
    privacy,
    boutique,
    boutiqueProduct,   
    posts,
    category,
    accordionReducer,
    filter,
    carousel,video ,videoApprove,userVideo ,image
})