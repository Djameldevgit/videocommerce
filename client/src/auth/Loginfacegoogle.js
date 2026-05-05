import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { socialLogin } from '../redux/actions/authAction';
import { showErrMsg, showSuccessMsg } from '../utils/notification/Notification';
import { useTranslation } from 'react-i18next';

const Loginfacegoogle = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { languageReducer } = useSelector(state => state);
  const lang = languageReducer.language || 'en';
  
  const { t, i18n } = useTranslation('auth');
  const [msg, setMsg] = useState({ err: '', success: '' });

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  // ✅ GOOGLE SIGN-IN TRADICIONAL (Popup)
   

 

  // ✅ CARGAR GOOGLE API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleFacebookResponse = async (response) => {
    try {
      const { accessToken, userID } = response;
      if (!accessToken || !userID) {
        setMsg({ err: t('auth_error_facebook'), success: '' });
        return;
      }
      await dispatch(socialLogin({ accessToken, userID }, 'facebook'));
      setMsg({ err: '', success: t('login_success_facebook') });
      setTimeout(() => history.push('/'), 1000);
    } catch (err) {
      setMsg({ err: t('login_error_facebook'), success: '' });
    }
  };

  return (
    <div className="login_page">
      {msg.err && showErrMsg(msg.err)}
      {msg.success && showSuccessMsg(msg.success)}

     
      {/* Facebook */}
      <div className="social">
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
        
          callback={handleFacebookResponse}
          render={renderProps => (
            <button
              className="btn btn-primary w-100"
              onClick={renderProps.onClick}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                height: '45px'
              }}
            >
              <img src="/facebook-icon.png" alt="Facebook" width="20" height="20" />
              {t('login_with_facebook')}
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default Loginfacegoogle;