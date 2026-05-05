import React from 'react';
import { Form } from 'react-bootstrap';

const MarqueAutoField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  t, 
  name = 'marque_auto', 
  label = 'brand_auto'
}) => {
  
  const automobileBrands = [
    'Fiat',
    'Toyota',
    'Renault',
    'Hyundai',
    'Peugeot',
    'Volkswagen',
    'Mercedes-Benz',
    'BMW',
    'Nissan',
    'Kia',
    'Honda',
    'Ford',
    'Mazda',
    'Opel',
    'Skoda',
    'Alfa Romeo',
    'Chery',
    'Geely',
    'BYD',
    'Great Wall Motors (GWM)',
    'Haval',
    'Jetour',
    'JAC',
    'Zotye',
    'BAIC',
    'DFSK',
    'Changan',
    'MG',
    'Omoda',
    'Exeed',
    'Bestune',
    'JMC',
    'Citroën',
    'Dacia',
    'Seat',
    'Audi',
    'Volvo',
    'Land Rover',
    'Jaguar',
    'Porsche',
    'Mini',
    'Smart',
    'Suzuki',
    'Mitsubishi',
    'Subaru',
    'Lexus',
    'Infiniti',
    'Acura',
    'DS Automobiles',
    'Cupra',
    'Daewoo',
    'Tata',
    'Mahindra',
    'Isuzu',
    'Chevrolet',
    'GMC',
    'Cadillac',
    'Buick',
    'Chrysler',
    'Dodge',
    'Jeep',
    'RAM',
    'Tesla',
    'Rivian',
    'Lucid',
    'Polestar',
    'Genesis',
    'Bentley',
    'Rolls-Royce',
    'Ferrari',
    'Lamborghini',
    'Maserati',
    'Aston Martin',
    'McLaren',
    'Bugatti',
    'Koenigsegg',
    'Pagani',
    'Iveco',
    'MAN',
    'Scania',
    'Volvo Trucks',
    'Renault Trucks',
    'DAF',
    'Shacman',
    'ECO',
    'Dayun',
    'Kwayou',
    'Victory',
    'Other'
  ];

  return (
    <Form.Group>
      <Form.Label>🚗 {t(label, 'Marque d\'Automobile')}</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        custom
      >
        <option value="">{t('select_auto_brand', 'Sélectionnez une marque automobile')}</option>
        {automobileBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default MarqueAutoField;