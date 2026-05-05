import React from 'react';
import { Form } from 'react-bootstrap';

const MarqueMotoField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  t, 
  name = 'marque_moto', 
  label = 'brand_moto'
}) => {
  
  const motorcycleBrands = [
    // Marcas japonesas (líderes globales)
    'Honda',
    'Yamaha',
    'Suzuki',
    'Kawasaki',
    
    // Marcas europeas
    'BMW Motorrad',
    'Ducati',
    'KTM',
    'Triumph',
    'Aprilia',
    'Moto Guzzi',
    'MV Agusta',
    'Harley-Davidson',
    'Vespa',
    'Piaggio',
    'Royal Enfield',
    'Benelli',
    'GasGas',
    'Husqvarna Motorcycles',
    
    // Marcas chinas e indias (populares en mercados emergentes)
    'Bajaj',
    'TVS',
    'Hero',
    'SYM',
    'Kymco',
    'Lifan',
    'Zongshen',
    'CFMoto',
    'Qingqi',
    'Jianshe',
    'Shineray',
    'Dayun',
    'Skygo',
    'Loncin',
    
    // Marcas disponibles en Argelia
    'Rato',
    'Regal Raptor',
    'Keeway',
    'BSE',
    'FYM',
    'Haosen',
    'Minsk',
    'JAWA',
    'URAL',
    'Dnepr',
    
    // Otras marcas globales
    'Kymco',
    'Brixton',
    'Fantic',
    'SWM',
    'Cagiva',
    'Bimota',
    'Norton',
    'Indian Motorcycle',
    'Zero Motorcycles',
    'Energica',
    
    // Marcas de scooters y eléctricas
    'Niu',
    'Super Soco',
    'Segway',
    'Xiaomi',
    'Ather Energy',
    'Ola Electric',
    
    // Marcas de competición y custom
    'Buell',
    'Erik Buell Racing (EBR)',
    'Confederate',
    'Arch Motorcycle',
    
    // Opción genérica
    'Other'
  ];

  return (
    <Form.Group>
      <Form.Label>🏍️ {t(label, 'Marque de Moto')}</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        custom
      >
        <option value="">{t('select_moto_brand', 'Sélectionnez une marque de moto')}</option>
        {motorcycleBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default MarqueMotoField;