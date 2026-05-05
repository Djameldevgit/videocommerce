import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import Loginfacegoogle from '../auth/Loginfacegoogle';

const Login = () => {
    const initialState = { email: '', password: '' };
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData;
    const [typePass, setTypePass] = useState(false);
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    // ✅ Obtener idioma actual desde el documento (LanguageManager lo maneja globalmente)
    const [isRTL, setIsRTL] = useState(document.documentElement.dir === 'rtl');
    const [currentLang, setCurrentLang] = useState(document.documentElement.lang || 'ar');
    
    // Referencia para el contenedor del formulario
    const formContainerRef = useRef(null);

    // ✅ Escuchar cambios de idioma (evento global)
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

    // Prevenir propagación de eventos en los inputs
    const handleInputFocus = (e) => {
        e.stopPropagation();
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 0.5rem',
                direction: isRTL ? 'rtl' : 'ltr'
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <Card 
                            ref={formContainerRef}
                            className="shadow-lg border-0"
                            style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.98)',
                                direction: isRTL ? 'rtl' : 'ltr'
                            }}
                        >
                            {/* Header elegante */}
                            <div 
                                className="text-center py-4"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    position: 'relative'
                                }}
                            >
                                <div 
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        background: 'rgba(255,255,255,0.25)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        backdropFilter: 'blur(10px)',
                                        border: '3px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    <svg 
                                        width="40" 
                                        height="40" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="white" 
                                        strokeWidth="2"
                                    >
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                        <polyline points="10 17 15 12 10 7"></polyline>
                                        <line x1="15" y1="12" x2="3" y2="12"></line>
                                    </svg>
                                </div>
                                <h3 
                                    className="text-uppercase fw-bold mb-0" 
                                    style={{ 
                                        color: 'white',
                                        letterSpacing: '1px',
                                        fontSize: '1.75rem'
                                    }}
                                >
                                    Connexion
                                </h3>
                            </div>

                            <Card.Body className="p-3 p-md-4">
                                <Form onSubmit={handleSubmit}>
                                    
                                    {/* Login con Facebook/Google */}
                                    <Form.Group 
                                        className="mb-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Loginfacegoogle />
                                    </Form.Group>

                                    {/* Divisor */}
                                    <div className="position-relative mb-4">
                                        <hr style={{ 
                                            margin: '0',
                                            borderTop: '1px solid #e2e8f0'
                                        }} />
                                        <span 
                                            className={`position-absolute top-50 ${isRTL ? 'end-0 translate-middle-x' : 'start-50 translate-middle'} px-3 bg-white`}
                                            style={{
                                                color: '#a0aec0',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            ou continuer avec
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <Form.Group className="mb-4">
                                        <Form.Label 
                                            className="fw-semibold"
                                            style={{ color: '#4a5568', fontSize: '0.95rem' }}
                                        >
                                            Adresse email
                                        </Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text 
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    borderRadius: isRTL ? '0 12px 12px 0' : '12px 0 0 12px'
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                    <polyline points="22,6 12,13 2,6"></polyline>
                                                </svg>
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                onChange={handleChangeInput}
                                                onFocus={handleInputFocus}
                                                onClick={handleInputClick}
                                                value={email}
                                                placeholder="votre@email.com"
                                                style={{
                                                    borderLeft: isRTL ? '2px solid #e2e8f0' : 'none',
                                                    borderRight: isRTL ? 'none' : '2px solid #e2e8f0',
                                                    borderRadius: isRTL ? '12px 0 0 12px' : '0 12px 12px 0',
                                                    padding: '0.75rem 1rem',
                                                    fontSize: '1rem',
                                                    border: '2px solid #e2e8f0',
                                                    direction: 'ltr'
                                                }}
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    {/* Password */}
                                    <Form.Group className="mb-3">
                                        <Form.Label 
                                            className="fw-semibold"
                                            style={{ color: '#4a5568', fontSize: '0.95rem' }}
                                        >
                                            Mot de passe
                                        </Form.Label>
                                        <InputGroup>
                                            {isRTL ? (
                                                // Orden RTL: Botón → Input → Icono
                                                <>
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => setTypePass(!typePass)}
                                                        style={{
                                                            borderRadius: '12px 0 0 12px',
                                                            border: '2px solid #e2e8f0',
                                                            borderRight: 'none',
                                                            background: 'white',
                                                            color: '#667eea',
                                                            order: 1
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
                                                    </Button>
                                                    <Form.Control
                                                        type={typePass ? "text" : "password"}
                                                        name="password"
                                                        onChange={handleChangeInput}
                                                        onFocus={handleInputFocus}
                                                        onClick={handleInputClick}
                                                        value={password}
                                                        placeholder="••••••••"
                                                        style={{
                                                            borderLeft: 'none',
                                                            borderRight: 'none',
                                                            borderRadius: '0',
                                                            padding: '0.75rem 1rem',
                                                            fontSize: '1rem',
                                                            border: '2px solid #e2e8f0',
                                                            order: 2
                                                        }}
                                                    />
                                                    <InputGroup.Text 
                                                        style={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            border: 'none',
                                                            borderRadius: '0 12px 12px 0',
                                                            order: 3
                                                        }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                        </svg>
                                                    </InputGroup.Text>
                                                </>
                                            ) : (
                                                // Orden LTR: Icono → Input → Botón
                                                <>
                                                    <InputGroup.Text 
                                                        style={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            border: 'none',
                                                            borderRadius: '12px 0 0 12px'
                                                        }}
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                        </svg>
                                                    </InputGroup.Text>
                                                    <Form.Control
                                                        type={typePass ? "text" : "password"}
                                                        name="password"
                                                        onChange={handleChangeInput}
                                                        onFocus={handleInputFocus}
                                                        onClick={handleInputClick}
                                                        value={password}
                                                        placeholder="••••••••"
                                                        style={{
                                                            borderLeft: 'none',
                                                            borderRight: 'none',
                                                            borderRadius: '0',
                                                            padding: '0.75rem 1rem',
                                                            fontSize: '1rem',
                                                            border: '2px solid #e2e8f0'
                                                        }}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => setTypePass(!typePass)}
                                                        style={{
                                                            borderRadius: '0 12px 12px 0',
                                                            border: '2px solid #e2e8f0',
                                                            borderLeft: 'none',
                                                            background: 'white',
                                                            color: '#667eea'
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
                                                    </Button>
                                                </>
                                            )}
                                        </InputGroup>
                                    </Form.Group>

                                    {/* Forgot Password Link */}
                                    <div className={`mb-4 ${isRTL ? 'text-start' : 'text-end'}`}>
                                        <Link 
                                            to="/forgot_password"
                                            style={{
                                                color: '#667eea',
                                                textDecoration: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.color = '#5a67d8';
                                                e.target.style.textDecoration = 'underline';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.color = '#667eea';
                                                e.target.style.textDecoration = 'none';
                                            }}
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-100 fw-bold text-uppercase"
                                        disabled={!(email && password)}
                                        style={{
                                            background: email && password 
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : '#cbd5e0',
                                            border: 'none',
                                            borderRadius: '12px',
                                            padding: '0.875rem',
                                            fontSize: '1rem',
                                            letterSpacing: '1px',
                                            boxShadow: email && password 
                                                ? '0 10px 25px rgba(102, 126, 234, 0.3)'
                                                : 'none',
                                            transition: 'all 0.3s ease',
                                            cursor: email && password ? 'pointer' : 'not-allowed',
                                            opacity: email && password ? 1 : 0.6
                                        }}
                                        onMouseEnter={(e) => {
                                            if (email && password) {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.4)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (email && password) {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                                            }
                                        }}
                                    >
                                        Se connecter
                                    </Button>

                                    {/* Register Link */}
                                    <div className="text-center mt-4">
                                        <p className="mb-0" style={{ color: '#718096' }}>
                                            Pas encore de compte ?{' '}
                                            <Link 
                                                to="/register" 
                                                style={{
                                                    color: 'crimson',
                                                    textDecoration: 'none',
                                                    fontWeight: '600',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                            >
                                                S'inscrire
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>

                            {/* Footer */}
                            <div 
                                className="text-center py-2"
                                style={{
                                    background: '#f8f9fa',
                                    fontSize: '0.75rem',
                                    color: '#a0aec0'
                                }}
                            >
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