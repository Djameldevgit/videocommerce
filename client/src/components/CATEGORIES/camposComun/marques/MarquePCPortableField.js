import React from 'react';
import { Form } from 'react-bootstrap';

const MarquePCPortableField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  t, 
  name = 'marque_pc_portable', 
  label = 'brand_pc_portable'
}) => {
  
  const laptopBrands = [
    // Marcas globales líderes en el mercado de portátiles
    'Lenovo',
    'HP',
    'Dell',
    'Apple',
    'Acer',
    'Asus',
    'MSI',
    'Microsoft',
    'Samsung',
    'Huawei',
    'Xiaomi',
    'LG',
    'Toshiba',
    'Fujitsu',
    'Medion',
    
    // Marcas de gaming y alto rendimiento
    'Alienware',
    'Razer',
    'ROG (Republic of Gamers)',
    'Gigabyte',
    'Origin PC',
    'Clevo',
    
    // Marcas de nicho, especializadas o regionales
    'Chuwi',
    'Teclast',
    'Jumper',
    'Maibenben',
    'Hasee',
    'ThundeRobot',
    
    // Marcas disponibles en el mercado argelino y MENA
    'Condor',       // Marca local argelina
    'IRIS',         // Marca local argelina
    'Dell EMC',
    'HP Enterprise',
    'Vigor Gaming',
    'Aftershock',
    'MEGASYS',
    'Maxwell',
    'Avell',
    
    // Marcas de trabajo y estaciones móviles
    'ThinkPad',
    'Latitude',
    'EliteBook',
    'Precision',
    'ZBook',
    
    // Marcas económicas y de entrada
    'HP Pavilion',
    'Dell Inspiron',
    'Lenovo IdeaPad',
    'Acer Aspire',
    'Asus VivoBook',
    
    // Otras marcas globales
    'Panasonic',
    'Sony',
    'NEC',
    'Gateway',
    'eMachines',
    'Compaq',
    'IBM',
    
    // Opción genérica para marcas no listadas
    'Other'
  ];

  return (
    <Form.Group>
      <Form.Label>💻 {t(label, 'Marque de PC Portable')}</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        custom
      >
        <option value="">{t('select_laptop_brand', 'Sélectionnez une marque de PC portable')}</option>
        {laptopBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default MarquePCPortableField;