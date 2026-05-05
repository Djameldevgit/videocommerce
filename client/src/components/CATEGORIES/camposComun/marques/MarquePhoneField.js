import React from 'react';
import { Form } from 'react-bootstrap';

const MarquePhoneField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  t, 
  name = 'marque_phone', 
  label = 'brand'
}) => {
  
  const smartphoneBrands = [
    // Marcas líderes en Argelia por cuota de mercado (datos de 2025)[citation:6]
    'Samsung', // 27.53%
    'Xiaomi',   // 18.2%
    'Oppo',     // 12.31%
    'Realme',   // 10.7%
    'Apple',    // 10.09%

    // Otras marcas globales importantes en el mercado[citation:2][citation:7]
    'Vivo',
    'Motorola',
    'Huawei',
    'Honor',
    'Google',
    'OnePlus',

    // Marcas de Transsion Holdings, populares en mercados emergentes[citation:1]
    'Tecno',
    'Infinix',
    'Itel',

    // Marcas locales de Argelia[citation:9]
    'Condor',
    'Vox',
    'Iris',
    'Géant',

    // Marcas globales y regionales ampliamente reconocidas
    'Nokia',
    'Sony',
    'Asus',
    'ZTE',
    'Lenovo',
    'Alcatel',
    'LG',
    'HTC',
    'BlackBerry',
    'Microsoft',
    'TCL',

    // Marcas de nicho, especializadas o regionales
    'CAT',
    'Fairphone',
    'Nothing',
    'Meizu',
    'Sharp',
    'Panasonic',
    'BLU',
    'Wiko',
    'Archos',

    // Marcas populares en regiones específicas (ej. India, Sudeste Asiático)
    'Micromax',
    'Lava',
    'Gionee',
    'Coolpad',
    'LeEco',
    'Xolo',
    'YU',
    'Intex',
    'Karbonn',
    'Spice',
    'Maxwest',

    // Marcas de smartphones resistentes y de nicho
    'Ulefone',
    'Umidigi',
    'Doogee',
    'Blackview',
    'Oukitel',
    'Cubot',
    'Elephone',
    'Vernee',

    // Marcas de Europa y otras regiones
    'BQ',
    'B Mobile',
    'Cherry Mobile',
    'MyPhone',
    'Starmobile',
    'Cloudfone',
    'Torque',
    'Kruger&Matz',
    'Logic',
    'Lanix',
    'Spectral',
    'Zopo',
    'Allview',

    // Operadoras móviles que ofrecen dispositivos con su marca
    'Vodafone',
    'Boost Mobile',
    'Cricket Wireless',
    'Metro by T-Mobile',
    'T-Mobile',
    'Verizon',
    'AT&T',
    'Sprint',
    'Virgin Mobile',

    // Marcas de fabricación propia y otras
    'Gradiente',
    'Positivo',
    'Multilaser',
    'Advance',
    'Movisun',
    'Wuum',
    'spc',
    'Neffos',
    'OtuxOne',

    // Opción genérica para marcas no listadas o desconocidas[citation:6]
    'Other'
];

  return (
    <Form.Group>
      <Form.Label>🏷️ {t(label, 'Marque')}</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        custom
      >
        <option value="">{t('select_brand', 'Sélectionnez une marque')}</option>
        {smartphoneBrands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default MarquePhoneField;