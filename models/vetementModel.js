const mongoose = require('mongoose');
const BasePost = require('./BasePost');

const vetementSchema = new mongoose.Schema({
    // 🔷 TIPO Y CATEGORÍA
    subCategory: {
        type: String,
        required: true,
        enum: [
            'vetements_homme', 'vetements_femme', 'vetements_enfant',
            'chaussures_homme', 'chaussures_femme', 'accessoires',
            'bijoux', 'montres', 'sacs_valises', 'professionnel'
        ]
    },
    
    // 🔷 CARACTERÍSTICAS FÍSICAS
    gender: {
        type: String,
        enum: ['homme', 'femme', 'unisexe', 'enfant']
    },
    size: [String], // Tallas disponibles
    color: [String],
    material: String,
    brand: String,
    
    // 🔷 CONDICIÓN
    condition: {
        type: String,
        enum: ['neuf', 'occasion', 'vintage', 'reconditionné'],
        required: true
    },
    
    // 🔷 ESTILO Y OCASIÓN
    season: String,
    style: String,
    occasion: String,
    
    // 🔷 CAMPOS ESPECÍFICOS POR SUBCATEGORÍA
    // Para zapatos
    heelHeight: String,
    closureType: String,
    toeShape: String,
    soleType: String,
    
    // Para bijouterie
    stoneType: String,
    jewelMaterial: String,
    
    // Para relojes
    watchMovement: String,
    strapMaterial: String,
    waterResistance: String,
    watchType: String,
    
    // Para sacos/valises
    strapType: String,
    bagSize: String,
    
    // Para profesional
    robeType: String,
    workSector: String
    
}, {
    discriminatorKey: 'kind'
});

const Vetement = BasePost.discriminator('Vetement', vetementSchema);

module.exports = Vetement;