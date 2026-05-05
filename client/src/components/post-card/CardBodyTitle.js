import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { CardBody } from "react-bootstrap";
import { FaEllipsisH } from "react-icons/fa"
import { deletePost } from "../../redux/actions/postAction";
  
import { MESS_TYPES } from '../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const CardBodyTitle = ({ post }) => {
    const location = useLocation();
    const history = useHistory();
    const { t } = useTranslation(['cardtitle', 'common']);
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    const isRTL = t('common:dir') === 'rtl';
    const [showDropdown, setShowDropdown] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isSuperUtilisateur = auth.user?.role === "Super-utilisateur";
    const isAdmin = auth.user?.role === "admin";
    const isPostOwner = auth.user && post && auth.user._id === post.user?._id;
    const hasAdminRights = isSuperUtilisateur || isAdmin;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);

    const handleChatWithStore = () => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('store.contactError', 'Impossible de contacter cette boutique') }
            });
            return;
        }

        try {
            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { ...post.user, text: '', media: [] }
            });

            history.push(`/message/${post.user._id}`);
            setShowDropdown(false);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: t('store.chatStarted', 'Chat iniciado con la boutique') }
            });

        } catch (error) {
            console.error('Error al iniciar chat avec boutique:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('store.chatError', 'Error al iniciar el chat') }
            });
        }
    };

    const handleViewStoreProfile = () => {
        if (!post.user || !post.user._id) {
            alert(t('store.profileError', 'Impossible de voir le profil de cette boutique'));
            return;
        }
        history.push(`/profile/${post.user._id}`);
        setShowDropdown(false);
    }; 
    
    const handleEditPost = () => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
    
        if (!post || !post._id) {
            console.error('❌ No hay post o ID disponible para editar');
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'No se puede editar este post' }
            });
            return;
        }
    
        
        // 🎯 PREPARAR DATOS DE CATEGORÍA PARA EL ACCORDION
        const postDataForEdit = {
            ...post,
            // 🔥 Asegurar que estos campos existan (pueden venir de diferentes lugares)
            categorie: post.categorie || post.category?.name || '',
            subCategory: post.subCategory || post.categorySpecificData?.subCategory || '',
            articleType: post.articleType || post.categorySpecificData?.articleType || '',
            // 🎯 Pasar también categorySpecificData si existe
            categorySpecificData: post.categorySpecificData || {}
        };
    
        console.log('📦 Datos formateados para edición:', postDataForEdit);
    
        // 🎯 Redirigir a CreateAnnoncePage con TODOS los datos
        history.push(`/edit-post/${post._id}`, {
            isEdit: true,
            postData: postDataForEdit  // 🔥 Pasar TODOS los datos del post
        });
    
        dispatch({
            type: GLOBALTYPES.STATUS,
            payload: { ...post, onEdit: true }
        });
    
        setShowDropdown(false);
    };

/*    const handleEditPost = () => {
        if (!auth.user) { setShowAuthModal(true); return; }
        history.push(`/editer-annonce/${post._id}`, {
            isEdit: true,
            postData: post 
        });
        dispatch({ type: 'GLOBALTYPES.STATUS', payload: { ...post, onEdit: true } });
        setShowDropdown(false);
    };*/


    const handleDeletePost = () => {
        if (window.confirm("Are you sure want to delete this posthhhhhh?")) {
            dispatch(deletePost({ post, auth, socket }));
            history.push("/");
        }
    };

    const handleFollowStore = () => {
        console.log("Seguir boutique:", post.user?._id);
        setShowDropdown(false);
    };

    const handleSharePost = () => {
        setShowShareModal(true);
        setShowDropdown(false);
    };

    const handleViewDetails = () => {
        history.push(`/post/${post._id}`);
        setShowDropdown(false);
    };

    const getDropdownOptions = () => {
        const options = [];

        // ✅ Opciones para ADMIN/SUPER-USUARIO
        if (hasAdminRights) {
            options.push(
                { icon: "✏️", text: t('editPost', 'Modifier le post'), action: handleEditPost },
                { icon: "🗑️", text: t('deletePost', 'Supprimer le post'), action: handleDeletePost }
            );
        }

        // ✅ Opciones para el DUEÑO del post
        if (isPostOwner) {
            options.push(
                { icon: "✏️", text: t('editPost', 'Modifier le post'), action: handleEditPost },
                { icon: "🗑️", text: t('deletePost', 'Supprimer le post'), action: handleDeletePost }
            );
        }

        // ✅ Opciones para USUARIOS AUTENTICADOS
        if (auth.user) {
            options.push(
                { icon: "💬", text: t('writeToStore', 'Écrire à la boutique'), action: handleChatWithStore },
                { icon: "👤", text: t('viewStoreProfile', 'Voir profil boutique'), action: handleViewStoreProfile },
                { icon: "📤", text: t('sharePost', 'Partager'), action: handleSharePost },
                { icon: "🔍", text: t('viewDetails', 'Voir détails'), action: handleViewDetails }
            );

            if (!isPostOwner) {
                options.push(
                    { icon: "➕", text: t('followStore', 'Suivre la boutique'), action: handleFollowStore }
                );
            }
        }

        // ✅ Eliminar duplicados
        return options.filter((option, index, self) =>
            index === self.findIndex(o => o.text === option.text)
        );
    };

    const dropdownOptions = getDropdownOptions();
    const handleOptionClick = (action) => { action(); setShowDropdown(false); };

    const DropdownItem = ({ icon, text, onClick, isDanger = false }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            cursor: 'pointer',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '14px',
            color: isDanger ? '#e53e3e' : '#4a5568',
            flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
            onClick={onClick}>
            <span style={{ fontSize: '16px', width: '20px' }}>{icon}</span>
            <span>{text}</span>
        </div>
    );


    return (
        <div className="cardtitle" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <CardBody className="card-header" style={{
                padding: '8px 12px',
                borderBottom: '1px solid #e2e8f0',
                background: 'white',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
            }}>
                {/* SOLO ICONO DE DROPDOWN PARA ACCIONES */}
                <div className="dropdown-container" style={{ position: 'relative' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: 'white'
                    }}
                        onClick={() => setShowDropdown(!showDropdown)}
                        title={t('cardbody.moreOptions', 'Plus d\'options')}>
                        <FaEllipsisH
                            size={14}
                            color="#6b7280"
                        />
                    </div>

                    {showDropdown && auth.user && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            [isRTL ? 'left' : 'right']: '0',
                            marginTop: '4px',
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            minWidth: '200px',
                            zIndex: 1000,
                            overflow: 'hidden',
                            textAlign: isRTL ? 'right' : 'left'
                        }}>
                            {dropdownOptions.map((option, index) => (
                                <DropdownItem
                                    key={index}
                                    icon={option.icon}
                                    text={option.text}
                                    onClick={() => handleOptionClick(option.action)}
                                    isDanger={option.icon === '🗑️'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardBody>

            {/* MODALES */}
            {showAuthModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '280px',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}>
                        <h3 style={{
                            marginBottom: '12px',
                            color: '#2d3748',
                            fontSize: '16px'
                        }}>
                            {t('auth.required', 'Authentification Requise')}
                        </h3>
                        <p style={{
                            marginBottom: '16px',
                            color: '#718096',
                            fontSize: '14px'
                        }}>
                            {t('auth.loginToContinue', 'Veuillez vous connecter pour continuer')}
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }}>
                            <button onClick={() => history.push('/login')} style={{
                                padding: '8px 16px',
                                backgroundColor: '#4a5568',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}>
                                {t('auth.loginnnnn', 'Connexion')}
                            </button>
                            <button onClick={() => history.push('/register')} style={{
                                padding: '8px 16px',
                                backgroundColor: '#e2e8f0',
                                color: '#4a5568',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}>
                                {t('auth.register', 'Inscription')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardBodyTitle;