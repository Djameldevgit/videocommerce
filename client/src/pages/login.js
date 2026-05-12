import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Loginfacegoogle from '../auth/Loginfacegoogle';
import './Login.css'; // Importamos los estilos externos

const Login = () => {
    const initialState = { email: '', password: '' };
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData;
    const [typePass, setTypePass] = useState(false);
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    const [isRTL, setIsRTL] = useState(document.documentElement.dir === 'rtl');
    const [currentLang, setCurrentLang] = useState(document.documentElement.lang || 'ar');

    // Referencia para el contenedor del formulario
    const formRef = useRef(null);

    useEffect(() => {
        const handleLanguageChange = () => {
            setIsRTL(document.documentElement.dir === 'rtl');
            setCurrentLang(document.documentElement.lang || 'ar');
        };
        window.addEventListener('languageChanged', handleLanguageChange);
        return () => window.removeEventListener('languageChanged', handleLanguageChange);
    }, []);

    useEffect(() => {
        if (auth.token) history.push("/");
    }, [auth.token, history]);

    const handleChangeInput = e => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(login(userData));
    };

    // ⚡ Prevención de propagación de eventos (evita que el clic en inputs active el login social)
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    // Bloqueo adicional para eventos de mouse (por si el componente social escucha clicks globales)
    const preventSocialClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={`login-page ${isRTL ? 'rtl' : 'ltr'}`}>
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card className="login-card">
                            {/* Header */}
                            <div className="login-header">
                                <div className="login-logo">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 className="login-title">Connexion</h3>
                            </div>

                            <div className="login-body">
                                <Form onSubmit={handleSubmit} ref={formRef} onClick={stopPropagation}>
                                    {/* ⚡🔥 Botones sociales con bloqueo de propagación */}
                                    <div 
                                        className="social-buttons-wrapper"
                                        onClick={preventSocialClick}
                                        onMouseDown={preventSocialClick}
                                    >
                                        <Loginfacegoogle />
                                    </div>

                                    {/* Divisor */}
                                    <div className="login-divider">
                                        <hr />
                                        <span>ou continuer avec</span>
                                    </div>

                                    {/* Email */}
                                    <div className="form-group">
                                        <label className="form-label">Adresse email</label>
                                        <div className="input-icon-wrapper">
                                            <div className="input-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                className="login-input"
                                                value={email}
                                                onChange={handleChangeInput}
                                                onClick={stopPropagation}
                                                onFocus={stopPropagation}
                                                placeholder="votre@email.com"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="form-group">
                                        <label className="form-label">Mot de passe</label>
                                        <div className={`input-icon-wrapper ${isRTL ? 'password-group-rtl' : 'password-group-ltr'}`}>
                                            <div className="input-icon">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type={typePass ? "text" : "password"}
                                                name="password"
                                                className="login-input"
                                                value={password}
                                                onChange={handleChangeInput}
                                                onClick={stopPropagation}
                                                onFocus={stopPropagation}
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTypePass(!typePass);
                                                }}
                                            >
                                                {typePass ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot Password */}
                                    <div className="forgot-link">
                                        <Link to="/forgot_password">Mot de passe oublié ?</Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="login-submit-btn"
                                        disabled={!(email && password)}
                                    >
                                        Se connecter
                                    </button>

                                    {/* Register Link */}
                                    <div className="register-link">
                                        Pas encore de compte ?{' '}
                                        <Link to="/register">S'inscrire</Link>
                                    </div>
                                </Form>
                            </div>

                            <div className="login-footer">
                                🔒 Tous droits réservés
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;