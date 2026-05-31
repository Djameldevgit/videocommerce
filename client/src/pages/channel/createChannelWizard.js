// src/pages/channel/CreateChannelWizard.jsx - VERSIÓN CORREGIDA

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Container, Button, Card, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

import { createChannel, updateChannel, getMyChannels } from '../../redux/actions/channelAction';
import { getMainCategories } from '../../redux/actions/categoryAction';
import ImageUploadField from './ImageUploadField';
import WilayaCommuneField from './WilayaCommuneField';

const CreateChannelWizard = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { auth, socket } = useSelector(state => state);
    const { categories } = useSelector(state => state.category);
    
    const [isEdit, setIsEdit] = useState(false);
    const [channelToEdit, setChannelToEdit] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });

    const [avatarImages, setAvatarImages] = useState([]);
    const [coverImages, setCoverImages] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '',
        activity: '',
        description: '',
        wilaya: '',
        commune: '',
        phone: '',
        email: '',
        website: ''
    });

    useEffect(() => {
        if (!categories || categories.length === 0) {
            dispatch(getMainCategories(1, 100, false));
        }
    }, [dispatch, categories]);

    useEffect(() => {
        const locationState = history.location.state;
        if (locationState?.isEdit && locationState?.channelData) {
            setIsEdit(true);
            setChannelToEdit(locationState.channelData);
            
            const channel = locationState.channelData;
            setFormData({
                name: channel.name || '',
                activity: channel.activity || '',
                description: channel.description || '',
                wilaya: channel.wilaya || '',
                commune: channel.commune || '',
                phone: channel.phone || '',
                email: channel.email || '',
                website: channel.website || ''
            });
            
            if (channel.avatar && channel.avatar.length > 0) {
                setAvatarImages([{ url: channel.avatar, isExisting: true }]);
            }
            if (channel.cover && channel.cover.length > 0) {
                setCoverImages([{ url: channel.cover, isExisting: true }]);
            }
        }
    }, [history.location.state]);

    const showAlert = useCallback((message, variant = 'info') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), 5000);
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // ✅ FUNCIÓN CORREGIDA - Más clara y con logs
    const canProceedToNextStep = () => {
        switch (currentStep) {
            case 1:
                const isValid = formData.name.trim() !== '' && formData.activity !== '';
                console.log('Step 1 validation:', { name: formData.name, activity: formData.activity, isValid });
                return isValid;
            case 2:
                const isValid2 = formData.wilaya !== '' && formData.commune !== '';
                console.log('Step 2 validation:', { wilaya: formData.wilaya, commune: formData.commune, isValid: isValid2 });
                return isValid2;
            case 3:
                // ✅ Paso 3 SIEMPRE true - no hay validaciones obligatorias
                return true;
            case 4:
                // ✅ Paso 4 SIEMPRE true - las imágenes son opcionales
                return true;
            default:
                return false;
        }
    };

    const handleNextStep = () => {
        if (canProceedToNextStep()) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Mostrar mensaje de validación
            let message = '';
            switch (currentStep) {
                case 1:
                    message = 'Veuillez remplir le nom du canal et sélectionner une activité';
                    break;
                case 2:
                    message = 'Veuillez sélectionner la wilaya et la commune';
                    break;
                default:
                    message = 'Veuillez remplir tous les champs obligatoires';
            }
            showAlert(message, 'warning');
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // ✅ HANDLE SUBMIT CORREGIDO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Validaciones finales
        if (!formData.name || !formData.activity) {
            return showAlert("Veuillez remplir le nom du canal et l'activité", "warning");
        }
        if (!formData.wilaya || !formData.commune) {
            return showAlert("Veuillez sélectionner la wilaya et la commune", "warning");
        }
        
        setIsSubmitting(true);

        try {
            const channelData = {
                name: formData.name,
                activity: formData.activity,
                description: formData.description || '',
                wilaya: formData.wilaya,
                commune: formData.commune,
                phone: formData.phone || '',
                email: formData.email || '',
                website: formData.website || ''
            };
            
            console.log('📝 Enviando datos:', {
                channelData,
                avatarImages,
                coverImages,
                isEdit
            });
            
            let result;
            if (isEdit && channelToEdit) {
                result = await dispatch(updateChannel({
                    channelId: channelToEdit._id,
                    channelData,
                    avatar: avatarImages,
                    cover: coverImages,
                    auth
                }));
            } else {
                result = await dispatch(createChannel({
                    channelData,
                    avatar: avatarImages,
                    cover: coverImages,
                    auth
                }));
            }
            
            console.log('📝 Resultado:', result);
            
            if (result?.success) {
                showAlert(isEdit ? '✅ Canal actualisé avec succès!' : '✅ Canal créé avec succès!', 'success');
                await dispatch(getMyChannels(auth?.token));
                setTimeout(() => history.push('/my-channels'), 2000);
            } else {
                showAlert(result?.error || 'Erreur lors de la création du canal', 'danger');
            }
        } catch (error) {
            console.error('❌ Error en submit:', error);
            showAlert(error.message || 'Erreur inattendue', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ✅ Función para obtener el título del paso
    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Informations du canal";
            case 2: return "Localisation";
            case 3: return "Coordonnées";
            case 4: return "Images du canal";
            default: return "";
        }
    };

    return (
        <Container className="py-4">
            {/* Alertas */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <Alert variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })}>
                            {alert.message}
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center mb-4">
                <h1>{isEdit ? '✏️ Modifier le canal' : '➕ Créer un canal'}</h1>
                <p className="text-muted">Étape {currentStep} sur 4</p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
                <ProgressBar now={(currentStep / 4) * 100} style={{ height: '8px' }} />
                <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">Infos</small>
                    <small className="text-muted">Localisation</small>
                    <small className="text-muted">Contact</small>
                    <small className="text-muted">Images</small>
                </div>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
                {currentStep === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-4">
                            <h3>{getStepTitle()}</h3>
                            <hr />
                            <div className="mb-3">
                                <label className="form-label fw-bold">Nom du canal *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Cuisine Algérienne, Tech DZ, Mode & Beauté..."
                                    className="form-control"
                                />
                                <small className="text-muted">Ce nom sera visible par tous les utilisateurs</small>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Activité / Catégorie *</label>
                                <select
                                    name="activity"
                                    value={formData.activity}
                                    onChange={handleInputChange}
                                    className="form-select"
                                >
                                    <option value="">Sélectionnez une activité</option>
                                    {categories?.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Décrivez votre canal, vos produits ou services..."
                                    className="form-control"
                                    rows="4"
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-4">
                            <h3>{getStepTitle()}</h3>
                            <hr />
                            <WilayaCommuneField
                                wilaya={formData.wilaya}
                                commune={formData.commune}
                                onWilayaChange={(w) => setFormData(prev => ({ ...prev, wilaya: w }))}
                                onCommuneChange={(c) => setFormData(prev => ({ ...prev, commune: c }))}
                            />
                        </Card>
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-4">
                            <h3>{getStepTitle()}</h3>
                            <hr />
                            <div className="mb-3">
                                <label className="form-label fw-bold">Téléphone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+213 5XX XX XX XX"
                                    className="form-control"
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="contact@example.com"
                                    className="form-control"
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Site web</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                    className="form-control"
                                />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {currentStep === 4 && (
                    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <Card className="p-4">
                            <h3>{getStepTitle()}</h3>
                            <hr />
                            <div className="mb-4">
                                <label className="form-label fw-bold">Avatar du canal</label>
                                <ImageUploadField
                                    images={avatarImages}
                                    setImages={setAvatarImages}
                                    multiple={false}
                                    maxImages={1}
                                />
                                <small className="text-muted">Format recommandé: 500x500px, max 2MB</small>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Image de couverture</label>
                                <ImageUploadField
                                    images={coverImages}
                                    setImages={setCoverImages}
                                    multiple={false}
                                    maxImages={1}
                                />
                                <small className="text-muted">Format recommandé: 1500x400px, max 5MB</small>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="d-flex justify-content-between mt-4">
                <Button 
                    variant="outline-secondary" 
                    onClick={handlePrevStep} 
                    disabled={currentStep === 1}
                    size="lg"
                >
                    ← Précédent
                </Button>
                
                {currentStep < 4 ? (
                    <Button 
                        variant="primary" 
                        onClick={handleNextStep}
                        size="lg"
                    >
                        Suivant →
                    </Button>
                ) : (
                    <Button 
                        variant="success" 
                        onClick={handleSubmit} 
                        disabled={isSubmitting}
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" animation="border" className="me-2" />
                                {isEdit ? 'Mise à jour...' : 'Publication...'}
                            </>
                        ) : (
                            <>{isEdit ? '✅ Mettre à jour' : '🚀 Publier le canal'}</>
                        )}
                    </Button>
                )}
            </div>

            {/* Indicador de campos obligatorios */}
            <div className="text-center mt-4">
                <small className="text-muted">* Champs obligatoires</small>
            </div>
        </Container>
    );
};

export default CreateChannelWizard;