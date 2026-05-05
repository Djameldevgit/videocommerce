const BasePost = require('./BasePost');
const Vetement = require('./vetementModel');
const Telephone = require('./telephoneModel');

// Función para obtener el modelo correcto según la categoría
const getPostModel = (category) => {
    switch(category) {
        case 'vetement':
            return Vetement;
        case 'telephone':
            return Telephone;
        default:
            throw new Error(`Categoría no válida: ${category}`);
    }
};

module.exports = {
    BasePost,
    Vetement,
    Telephone,
    getPostModel
};