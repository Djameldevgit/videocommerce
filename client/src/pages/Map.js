import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Alert,
  Spinner,
  Badge,
  Carousel
} from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import "leaflet/dist/leaflet.css";

// Fix para los íconos de Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Íconos
import {
  FaStore,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSyncAlt,
  FaGlobe,
  FaCity,
  FaHome,
  FaIdCard,
  FaRuler,
  FaLocationArrow,
  FaWhatsapp,
  FaVideo,
  FaShoppingCart,
  FaTruck
} from "react-icons/fa";

// 🎯 DATOS ESTÁTICOS DE LA TIENDA - ACTUALIZADOS
const SHOP_DATA = {
  _id: 'Boutique Djamel',
  username: 'Djamel',
  nombretienda: 'Vêtements Djamel',
  role: 'admin',
  wilaya: 'alger',
  commune: 'reghaia',
  address: 'Cite Soumam, Alger',
  mobile: '+213 661 23 45 67',
  email: 'djamelart@fmail.com',
  presentacion: 'shop_presentation', // 🔥 CAMBIADO PARA USAR TRADUCCIÓN
  avatar: '/images/boutique-logo.png',
  typesVente: 'Vente en détail et en gros',
  proprietaire: 'Djamel'
};

// 🆕 FUNCIÓN PARA CALCULAR DISTANCIA
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

// 🆕 HOOK PARA OBTENER UBICACIÓN ACTUAL DEL USUARIO
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalisation non supportée'));
        return;
      }

      setIsGettingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setIsGettingLocation(false);
          resolve(location);
        },
        (error) => {
          let errorMessage = 'Erreur lors de l\'obtention de la localisation';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Autorisation de localisation refusée';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Informations de localisation non disponibles';
              break;
            case error.TIMEOUT:
              errorMessage = 'Délai d\'attente dépassé';
              break;
          }
          setLocationError(errorMessage);
          setIsGettingLocation(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  return { userLocation, locationError, isGettingLocation, getUserLocation };
};

// 🆕 COMPONENTE DE CÁLCULO DE DISTANCIA
const DistanceCalculator = ({ shopPosition }) => {
  const { t } = useTranslation(['map', 'common']);
  const { userLocation, locationError, isGettingLocation, getUserLocation } = useUserLocation();
  const [distance, setDistance] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculateDistanceToShop = async () => {
    if (!shopPosition) return;

    try {
      setCalculating(true);

      const currentLocation = await getUserLocation();

      if (currentLocation && shopPosition.lat && shopPosition.lng) {
        const calculatedDistance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          shopPosition.lat,
          shopPosition.lng
        );

        setDistance(calculatedDistance);
      }
    } catch (error) {
      console.error(t('map:distanceCalculationError', 'Erreur de calcul de distance:'), error);
    } finally {
      setCalculating(false);
    }
  };

  const formatDistance = (km) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} ${t('map:meters', 'm')}`;
    } else if (km < 1000) {
      return `${km.toFixed(1)} ${t('map:kilometers', 'km')}`;
    } else {
      return `${Math.round(km)} ${t('map:kilometers', 'km')}`;
    }
  };

  if (!shopPosition || !shopPosition.lat) {
    return null;
  }

  return (
    <div className="mt-3 p-3 bg-light rounded border">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <FaRuler className="text-primary me-2" size={20} />
          <h6 className="mb-0 fw-bold">{t('map:distanceToShop', 'Distance à la boutique')}</h6>
        </div>

        <Button
          variant={distance ? "outline-success" : "primary"}
          size="sm"
          onClick={calculateDistanceToShop}
          disabled={calculating || isGettingLocation}
        >
          {calculating || isGettingLocation ? (
            <Spinner animation="border" size="sm" />
          ) : distance ? (
            <FaSyncAlt />
          ) : (
            <FaLocationArrow />
          )}
          <span className="ms-2">
            {distance ? t('map:recalculate', 'Recalculer') : t('map:calculate', 'Calculer')}
          </span>
        </Button>
      </div>

      {distance !== null ? (
        <div className="text-center">
          <Badge bg="success" className="fs-6 p-2">
            <h4 className="mb-0">{formatDistance(distance)}</h4>
          </Badge>
          <p className="text-muted small mb-0 mt-1">
            {t('map:distanceDescription', 'Distance en ligne droite depuis votre position actuelle')}
          </p>
        </div>
      ) : locationError ? (
        <Alert variant="warning" className="py-2 mb-0">
          <small>{locationError}</small>
        </Alert>
      ) : (
        <p className="text-muted small mb-0">
          {t('map:getDistance', 'Cliquez sur "Calculer" pour connaître la distance depuis votre position actuelle')}
        </p>
      )}

      {userLocation && (
        <small className="text-muted d-block mt-2">
          {t('map:yourLocation', 'Votre position actuelle')}: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
        </small>
      )}
    </div>
  );
};

// Avatar component
const Avatar = ({ user, size = 60 }) => {
  const { t } = useTranslation('common');

  return (
    <div
      className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center text-white shadow"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {user?.username?.charAt(0)?.toUpperCase() || t('common:initial', 'T')}
    </div>
  );
};

// Ícono personalizado para tienda
const ShopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE1IDI3LjVDMTUuODI4NCAyNy41IDE2LjUgMjYuODI4NCAxNi41IDI2VjI0LjVIMTMuNVYyNkMxMy41IDI2LjgyODQgMTQuMTcxNiAyNy41IDE1IDI3LjVaIiBmaWxsPSIjREQyRTM2Ii8+CjxwYXRoIGQ9Ik0yMSAyNkgyMUgyMUgyMVoiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTkgNkg5SDIxSDIxVjI2SDlWNloiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTcgOUg3SDIzSDIzVjI2SDdWOVoiIGZpbGw9IiNGRjVCMzYiLz4KPHBhdGggZD0iTTUgMTJINVYyNkg1VjEyWiIgZmlsbD0iI0ZGNUIzNiIvPgo8cGF0aCBkPSJNMjUgMTJIMjVWMjZIMjVWMTJaIiBmaWxsPSIjRkY1QjM2Ii8+CjxwYXRoIGQ9Ik0xOC41IDE2LjVMMTguNSAxNi41TDE4LjUgMTYuNUwxOC41IDE2LjVaIiBmaWxsPSIjRkY1QjM2Ii8+CjxwYXRoIGQ9Ik0xNSAxOS41QzE0LjE3MTYgMTkuNSAxMy41IDE4LjgyODQgMTMuNSAxOFYxNi41SDE2LjVWMThDMTYuNSAxOC44Mjg0IDE1LjgyODQgMTkuNSAxNSAxOS41WiIgZmlsbD0iI0ZGNUIzNiIvPgo8cGF0aCBkPSJNMTEuNSAxNi41VjE2LjVIMTguNVYxNi41IiBzdHJva2U9IiNGRjVCMzYiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxwYXRoIGQ9Ik0xMS41IDE5LjVWMTkuNUgxOC41VjE5LjUiIHN0cm9rZT0iI0ZGNUIzNiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHBhdGggZD0iTTExLjUgMTMuNVYxMy41SDE4LjVWMTMuNSIgc3Ryb2tlPSIjRkY1QjM2IiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8L3N2Zz4K',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// ✅ COMPONENTE DE CAROUSEL
const ImageCarousel = ({ images }) => {
  const { t } = useTranslation(['common', 'map']);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-4 bg-light rounded">
        <FaStore size={32} className="text-muted mb-2" />
        <p className="text-muted mb-0">{t('common:noImages', 'Aucune image disponible')}</p>
      </div>
    );
  }

  return (
    <Carousel fade interval={3000} controls={images.length > 1} indicators={images.length > 1}>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '250px', overflow: 'hidden' }}
          >
            <img
              className="d-block w-100 h-100 object-fit-cover"
              src={image}
              alt={t('common:shopImage', 'Image de la boutique') + ` ${index + 1}`}
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            <div className="position-absolute text-center" style={{ display: 'none' }}>
              <FaStore size={48} className="text-muted mb-2" />
              <p className="text-muted">{t('common:imageNotAvailable', 'Image non disponible')}</p>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

const Map = () => {
  const history = useHistory();
  const { t, i18n } = useTranslation(['map', 'common', 'location']);

  // 🎯 SIMPLIFICADO: No necesitamos homeUsers ni auth para los datos
  const { auth } = useSelector((state) => state);

  const [mapCenter, setMapCenter] = useState([36.5, 3.5]);
  const [markerPosition, setMarkerPosition] = useState([36.5, 3.5]);
  const [shopPosition, setShopPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [mapStyle, setMapStyle] = useState("street");

  // 🎯 SIEMPRE usar los datos estáticos
  const selectedUser = SHOP_DATA;
  const isUserAuthenticated = !!auth.user;
  const isRTL = i18n.language === 'ar';

  // Imágenes del carousel
  const carouselImages = [
    '/images/shop1.jpg',
    '/images/shop2.jpg',
    '/images/shop3.jpg',
    '/images/shop4.jpg'
  ].filter(img => img);

  // Proveedores de mapas
  const mapProviders = {
    street: {
      name: t('map:street', 'Rue'),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '© OpenStreetMap'
    },
    satellite: {
      name: t('map:satellite', 'Satellite'),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '© Esri'
    },
    terrain: {
      name: t('map:terrain', 'Terrain'),
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '© OpenTopoMap'
    }
  };

  // 🎯 FUNCIONES DE CONTACTO MEJORADAS
  const handleCallOwner = () => {
    const phoneNumber = selectedUser.mobile;
    if (!phoneNumber) {
      alert(t('map:phoneNotAvailable', 'Numéro de téléphone non disponible'));
      return;
    }

    // 🎯 LLAMADA DIRECTA
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleVideoCall = () => {
    // 🎯 INICIAR VIDEO LLAMADA (puedes integrar con tu servicio)
    alert(t('map:videoCallSoon', 'Fonction d\'appel vidéo sera bientôt disponible!'));
  };

  const contactViaWhatsApp = () => {
    const message = t('map:whatsappMessage', `Bonjour {{username}}, j'ai vu votre boutique dans l'application et je suis intéressé par vos produits.`, {
      username: selectedUser.username
    });
    const whatsappUrl = `https://wa.me/${selectedUser.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // 🎯 BUSCAR UBICACIÓN CON DATOS ESTÁTICOS
  const searchLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      setShopPosition(null);

      const locationFields = [];

      // Usar los datos ESTÁTICOS de la tienda
      if (selectedUser.wilaya) {
        let query = selectedUser.wilaya;
        if (selectedUser.commune) query += `, ${selectedUser.commune}`;
        if (selectedUser.address) query += `, ${selectedUser.address}`;
        query += ', Algeria';

        locationFields.push({ value: query, zoom: 14, priority: 1 });
      }

      if (selectedUser.wilaya && selectedUser.commune) {
        locationFields.push({
          value: `${selectedUser.wilaya}, ${selectedUser.commune}, Algeria`,
          zoom: 12,
          priority: 2
        });
      }

      if (selectedUser.wilaya) {
        locationFields.push({
          value: `${selectedUser.wilaya}, Algeria`,
          zoom: 10,
          priority: 3
        });
      }

      // Ordenar por prioridad
      locationFields.sort((a, b) => a.priority - b.priority);

      for (const field of locationFields) {
        try {
          const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(field.value)}&format=json&limit=1`;
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'ShopApp/1.0',
              'Accept-Language': i18n.language || 'fr'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);

              setMapCenter([lat, lon]);
              setMarkerPosition([lat, lon]);
              setShopPosition({ lat, lng: lon });
              setZoomLevel(field.zoom);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.warn(t('map:locationSearchWarning', 'Avertissement lors de la recherche de localisation:'), error);
          continue;
        }
      }

      // Si no se encontró ninguna ubicación
      setError(t('map:locationNotFound', 'Localisation non trouvée pour les données fournies'));

    } catch (error) {
      console.error(t('map:locationError', 'Erreur de localisation:'), error);
      setError(t('map:generalError', 'Erreur lors du chargement de la localisation'));
    } finally {
      setLoading(false);
    }
  };

  // 🎯 EFECTO SIMPLIFICADO
  useEffect(() => {
    searchLocation();
  }, [i18n.language]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleMapStyleChange = (style) => {
    setMapStyle(style);
  };

  return (
    <Container fluid className="py-4" dir={isRTL ? "rtl" : "ltr"}>
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>

          {/* 🎯 HEADER SIMPLIFICADO */}
          <Card className="shadow-sm mb-3 border-0 bg-light">
            <Card.Body className="text-center">
              <h4 className="text-primary mb-2">
                <FaStore className={isRTL ? "ms-2" : "me-2"} />
                {selectedUser.nombretienda}
              </h4>
              <p className="mb-0">
                <strong>{t('map:officialInfo', 'Informations officielles de notre boutique')}</strong>
                <br />
                <small className="text-muted">
                  {!isUserAuthenticated && (
                    <Link to="/login" className="text-decoration-none">
                      {t('map:loginForFeatures', 'Connectez-vous pour accéder à toutes les fonctionnalités')}
                    </Link>
                  )}
                </small>
              </p>
            </Card.Body>
          </Card>

          {/* CAROUSEL */}
          <Card className="shadow-sm mb-3 border-0">
            <Card.Body className="p-0">
              <ImageCarousel images={carouselImages} />
            </Card.Body>
          </Card>

          {/* 🎯 INFORMACIÓN DE LA TIENDA - ACTUALIZADA SEGÚN ESPECIFICACIONES */}
          <Card className="shadow-sm mb-3 border-0">
            <Card.Body>
              <Row className={`g-3 ${isRTL ? 'flex-row-reverse' : ''}`}>

                {/* 01 - Nombre de la tienda con icono */}
                <Col xs={12}>
                  <div className="d-flex align-items-center p-2 bg-primary bg-opacity-10 rounded">
                    <FaStore className={isRTL ? "ms-3" : "me-3"} size={24} />
                    <div>
                      <h5 className="mb-0 text-primary fw-bold">{selectedUser.nombretienda}</h5>
                      <small className="text-muted">{t('map:clothingShop', 'Boutique de vêtements et mode')}</small>
                    </div>
                  </div>
                </Col>

                {/* 02 - Propriétaire */}
                <Col xs={12}>
                  <div className="d-flex align-items-center p-2 border-bottom">
                    <FaUser className={isRTL ? "ms-3" : "me-3"} size={20} />
                    <div className="d-flex align-items-center w-100">
                      <strong className="text-dark me-2">{t('map:owner', 'Propriétaire')}:</strong>
                      <span className="text-primary fw-bold fs-6">{selectedUser.proprietaire}</span>
                    </div>
                  </div>
                </Col>

                {/* 03 - Types de vente */}
                <Col xs={12}>
                  <div className="d-flex align-items-center p-2 border-bottom">
                    <FaShoppingCart className={isRTL ? "ms-3" : "me-3"} size={20} />
                    <div className="d-flex align-items-center w-100">
                      <strong className="text-dark me-2">{t('map:saleTypes', 'Types de vente')}:</strong>
                      <span className="text-success fw-bold fs-6">{selectedUser.typesVente}</span>
                    </div>
                  </div>
                </Col>

                {/* 04 - Adresse complète */}
                <Col xs={12}>
                  <div className="d-flex align-items-center p-2 border-bottom">
                    <FaMapMarkerAlt className={isRTL ? "ms-3" : "me-3"} size={20} />
                    <div className="d-flex align-items-center w-100">
                      <strong className="text-dark me-2">{t('location:address', 'Adresse')}:</strong>
                      <span className="fw-bold fs-6">{selectedUser.address}</span>
                    </div>
                  </div>
                </Col>

                {/* 05 - Téléphone avec acciones */}
                <Col xs={12}>
                  <div className="p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <FaPhone className={isRTL ? "ms-3" : "me-3"} size={20} />
                      <div className="d-flex align-items-center">
                        <strong className="text-dark me-2">{t('map:phone', 'Téléphone')}:</strong>
                        <span className="fw-bold fs-6">{selectedUser.mobile}</span>
                      </div>
                    </div>

                    {/* Botones de acción para teléfono */}
                    <div className={`d-flex gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={handleCallOwner}
                        className="d-flex align-items-center"
                      >
                        <FaPhone className={isRTL ? "ms-1" : "me-1"} />
                        {t('map:call', 'Appeler')}
                      </Button>

                      <Button
                        variant="info"
                        size="sm"
                        onClick={handleVideoCall}
                        className="d-flex align-items-center"
                      >
                        <FaVideo className={isRTL ? "ms-1" : "me-1"} />
                        {t('map:video', 'Vidéo')}
                      </Button>

                      <Button
                        variant="success"
                        size="sm"
                        onClick={contactViaWhatsApp}
                        className="d-flex align-items-center"
                        style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                      >
                        <FaWhatsapp className={isRTL ? "ms-1" : "me-1"} />
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </Col>

                {/* Información adicional */}
                {/* Información adicional */}
                <Col xs={12}>
                  <div className="d-flex align-items-start p-2 mt-2">
                    <FaIdCard className={isRTL ? "ms-3 mt-1" : "me-3 mt-1"} size={18} />
                    <div>
                      <strong className="text-dark me-2">{t('map:presentation', 'Présentation')}:</strong>
                      <p className="mb-0 text-muted">
                        {t('map:shopPresentation', 'Más de 10 años vistiendo a la femme moderne. Spécialistes en tenues traditionnelles, robes de soirée et vêtements décontractés de haute qualité. Tissus importés et designs exclusifs.')}
                      </p>
                    </div>
                  </div>
                </Col>

              </Row>
            </Card.Body>
          </Card>

          {/* MAPA - SIEMPRE FUNCIONAL */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <h5 className="mb-0">
                    <FaGlobe className={isRTL ? "ms-2" : "me-2"} />
                    {t('map:location', 'Localisation sur la Carte')}
                  </h5>
                  <small className="text-muted">
                    {selectedUser.wilaya && `${selectedUser.wilaya}`}
                    {selectedUser.commune && `, ${selectedUser.commune}`}
                    {selectedUser.address && `, ${selectedUser.address}`}
                  </small>
                </Col>
                <Col xs="auto">
                  <ButtonGroup size="sm">
                    {Object.keys(mapProviders).map(style => (
                      <Button
                        key={style}
                        variant={mapStyle === style ? "primary" : "outline-primary"}
                        onClick={() => handleMapStyleChange(style)}
                      >
                        {mapProviders[style].name}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body className="p-0">
              {loading && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3 fs-5">{t('map:searching', 'Recherche de localisation...')}</p>
                </div>
              )}

              {error && !loading && (
                <Alert variant="warning" className="m-4">
                  <div className="d-flex align-items-center">
                    <i className={`fas fa-exclamation-triangle ${isRTL ? "ms-2" : "me-2"}`}></i>
                    <div>
                      <strong>{t('map:locationUnavailable', 'Localisation non disponible')}</strong>
                      <p className="mb-0">{error}</p>
                    </div>
                  </div>
                </Alert>
              )}

              {!loading && !error && (
                <>
                  <div style={{ height: '400px', width: '100%' }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={zoomLevel}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                      key={`${mapStyle}-${mapCenter[0]}-${mapCenter[1]}`}
                    >
                      <ChangeView center={mapCenter} zoom={zoomLevel} />
                      <TileLayer
                        url={mapProviders[mapStyle].url}
                        attribution={mapProviders[mapStyle].attribution}
                      />

                      <Marker position={markerPosition} icon={ShopIcon}>
                        <Popup>
                          <div style={{ minWidth: '250px', textAlign: isRTL ? 'right' : 'left' }}>
                            <h6 className="fw-bold text-primary mb-2">
                              {selectedUser.nombretienda}
                            </h6>
                            {selectedUser.wilaya && <div className="mb-1"><strong>📍 {t('location:wilaya', 'Wilaya')}:</strong> {selectedUser.wilaya}</div>}
                            {selectedUser.commune && <div className="mb-1"><strong>🏘️ {t('location:commune', 'Commune')}:</strong> {selectedUser.commune}</div>}
                            {selectedUser.address && <div className="mb-1"><strong>🏠 {t('location:address', 'Adresse')}:</strong> {selectedUser.address}</div>}
                            {selectedUser.mobile && (
                              <Button
                                variant="success"
                                size="sm"
                                className="w-100 mt-2"
                                onClick={contactViaWhatsApp}
                              >
                                <FaWhatsapp className={isRTL ? "ms-1" : "me-1"} />
                                {t('map:contactWhatsApp', 'Contacter par WhatsApp')}
                              </Button>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>

                  {/* COMPONENTE DE CÁLCULO DE DISTANCIA */}
                  <DistanceCalculator shopPosition={shopPosition} />
                </>
              )}
            </Card.Body>

            <Card.Footer className="bg-white">
              <Row className={`align-items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Col>
                  <small className="text-muted">
                    {t('map:usingData', 'Utilisation des données officielles de la boutique')}
                  </small>
                </Col>
                <Col xs="auto">
                  <div className={`d-flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={searchLocation}
                      disabled={loading}
                    >
                      <FaSyncAlt className={isRTL ? "ms-1" : "me-1"} />
                      {t('map:reload', 'Actualiser')}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleGoBack}
                    >
                      {t('common:back', 'Retour')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Map;