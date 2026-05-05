import React from 'react';
import { useHistory } from "react-router-dom";

const AuthModal = ({
  showModal,
  setShowModal,
  languageReducer,
  t
}) => {
  const history = useHistory();

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button
          onClick={() => setShowModal(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            color: '#333',
            cursor: 'pointer',
            fontWeight: 'bold',
            lineHeight: '1',
          }}
          aria-label={t('close')}
        >
          ×
        </button>

        <h4>{t("title2", { lng: languageReducer.language })}</h4>
        <p>{t("message2", { lng: languageReducer.language })}</p>
        <div className="modal-buttons">
          <button onClick={() => history.push("/login")}>
            {t("login2", { lng: languageReducer.language })}
          </button>
          <button onClick={() => history.push("/register")}>
            {t("register2", { lng: languageReducer.language })}
          </button>
          <button onClick={() => setShowModal(false)}>
            {t("close2", { lng: languageReducer.language })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AuthModal);