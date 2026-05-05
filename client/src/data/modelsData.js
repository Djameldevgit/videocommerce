// 📁 src/data/modelsData.js
export const MODELS_DATABASE = {
    // ============ 📱 APPLE ============
    'Apple iPhone': [
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
      'iPhone SE (2022)', 'iPhone SE (2020)', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11'
    ],
  
    'Apple iPad': [
      'iPad Pro 12.9" (2023)', 'iPad Pro 11" (2023)', 'iPad Air (2022)',
      'iPad (2022)', 'iPad mini (2021)', 'iPad Pro 12.9" (2021)', 'iPad Pro 11" (2021)'
    ],
  
    'Apple Watch': [
      'Apple Watch Series 9', 'Apple Watch Ultra 2', 'Apple Watch Series 8',
      'Apple Watch SE (2022)', 'Apple Watch Series 7', 'Apple Watch Series 6'
    ],
  
    // ============ 🚗 TOYOTA ============
    'Toyota': [
      'Corolla', 'Yaris', 'RAV4', 'Hilux', 'Land Cruiser', 'Camry', 'C-HR',
      'Prius', 'Highlander', '4Runner', 'Tacoma', 'Supra', 'GR86'
    ],
  
    // ============ 🏠 SAMSUNG TV ============
    'Samsung': [
      'QLED QN900C 8K', 'QLED QN800C 8K', 'Neo QLED QN95C', 'Neo QLED QN90C',
      'The Frame (2023)', 'The Serif (2023)', 'Crystal UHD AU8000',
      'OLED S95C', 'OLED S90C', 'TU7000 Crystal UHD'
    ],
  
    // ============ 💻 DELL LAPTOPS ============
    'Dell': [
      'XPS 13 Plus', 'XPS 15', 'XPS 17', 'Inspiron 15', 'Inspiron 14',
      'Latitude 5440', 'Latitude 7440', 'Alienware m18', 'Alienware x16',
      'Precision 7680'
    ],
  
    // ============ 👗 ZARA ============
    'Zara': [
      'Basic T-Shirt', 'Premium Linen Shirt', 'Wide Leg Pants', 'Oversized Blazer',
      'Mom Jeans', 'Ribbed Knit Dress', 'Faux Leather Jacket', 'Trench Coat',
      'Wool Blend Coat', 'Mini Skirt', 'Cargo Pants'
    ],
  
    // ============ 🛋️ IKEA ============
    'IKEA': [
      'BILLY Bookcase', 'PAX Wardrobe', 'KALLAX Shelf unit', 'MALM Bed frame',
      'POÄNG Armchair', 'HEMNES Dresser', 'EKTORP Sofa', 'KIVIK Sofa',
      'LACK Coffee table', 'NORDLI Bed', 'BRIMNES Storage'
    ],
  
    // ============ 🎮 SONY PLAYSTATION ============
    'Sony PlayStation': [
      'PlayStation 5', 'PlayStation 5 Digital Edition', 'PlayStation 4 Pro',
      'PlayStation 4 Slim', 'PlayStation 3', 'PlayStation 2', 'PlayStation 1',
      'PlayStation VR2', 'PlayStation Portal'
    ],
  
    // ============ 🏢 PROMOTEUR PUBLIC ============
    'Promoteur Public': [
      'AADL', 'LPA', 'CNEP', 'CNL', 'OPGI', 'ENPI', 'ERIAD'
    ]
  };
  
  // 🔄 FUNCIÓN PARA OBTENER MODELOS POR MARCA
  export const getModelsByBrand = (brand, mainCategory = null) => {
    if (!brand) return [];
  
    // Primero buscar en la base de datos específica
    if (MODELS_DATABASE[brand]) {
      return MODELS_DATABASE[brand];
    }
  
    // Si no se encuentra, generar modelos genéricos basados en la categoría
    const genericModels = {
      'telephones': ['Standard', 'Pro', 'Pro Max', 'Plus', 'Lite', 'Ultra'],
      'vehicules': ['Base', 'Comfort', 'Luxe', 'Sport', 'GT', 'Limited'],
      'electromenager': ['Standard', 'Pro', 'Smart', 'Connect', 'Eco', 'Premium'],
      'informatique': ['Basic', 'Pro', 'Ultra', 'Gaming', 'Workstation'],
      'vetements': ['S', 'M', 'L', 'XL', 'XXL']
    };
  
    if (mainCategory && genericModels[mainCategory]) {
      return genericModels[mainCategory].map(model => `${brand} ${model}`);
    }
  
    return [`${brand} Standard`, `${brand} Pro`, `${brand} Premium`];
  };
  
  // 🔍 FUNCIÓN DE BÚSQUEDA INTELIGENTE
  export const smartModelSearch = (brand, query, mainCategory) => {
    const allModels = getModelsByBrand(brand, mainCategory);
    
    if (!query) return allModels;
    
    return allModels.filter(model =>
      model.toLowerCase().includes(query.toLowerCase())
    );
  };