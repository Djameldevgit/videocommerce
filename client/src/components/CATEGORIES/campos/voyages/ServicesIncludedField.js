// campos/voyages/ServicesIncludedField.js
import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next'; // ← Agrega esto
 
const ServicesIncludedField = ({ 
  postData, 
  handleChangeInput, 
 
 
}) => {

  const { t } = useTranslation(); // ← Usa el hook aquí
  const services = [
    { id: 'transport', label: '✈️ Transport', name: 'servicesIncluded_transport' },
    { id: 'hebergement', label: '🏨 Hébergement', name: 'servicesIncluded_hebergement' },
    { id: 'repas', label: '🍽️ Repas', name: 'servicesIncluded_repas' },
    { id: 'guide', label: '🗣️ Guide touristique', name: 'servicesIncluded_guide' },
    { id: 'assurance', label: '🛡️ Assurance voyage', name: 'servicesIncluded_assurance' },
    { id: 'visite', label: '🏛️ Visites guidées', name: 'servicesIncluded_visite' },
    { id: 'transfert', label: '🚗 Transfert aéroport', name: 'servicesIncluded_transfert' },
  ];

  return (
    <Form.Group>
      <Form.Label>✅ {t('included_services', 'Services inclus')}</Form.Label>
      <div className="border rounded p-3 bg-light">
        {services.map(service => (
          <Form.Check
            key={service.id}
            type="checkbox"
            id={`service_${service.id}`}
            name={service.name}
            label={service.label}
            checked={postData[service.name] || false}
            onChange={handleChangeInput}
            className="mb-2"
          />
        ))}
      </div>
    </Form.Group>
  );
};

export default ServicesIncludedField;