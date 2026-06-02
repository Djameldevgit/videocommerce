// middleware/auth.js - VERSIÓN CORREGIDA
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req, res, next) => {
  try {
    // 1. Obtener token del header Authorization
    const authHeader = req.header('Authorization');
    console.log('🔐 [AUTH] Authorization header RAW:', authHeader);
    console.log('🔐 [AUTH] ¿Empieza con Bearer?', authHeader.startsWith('Bearer '));
    if (!authHeader) {
      console.log('❌ No Authorization header');
      return res.status(401).json({ error: 'Accès non autorisé' });
    }
    
    // 2. Extraer token (formato: "Bearer <token>")
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : authHeader;
    
    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    console.log('🔑 Token recibido:', token.substring(0, 30) + '...');
    
    // 3. Verificar token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('✅ Token decodificado:', decoded);
    
    // 4. Buscar usuario en DB
    const user = await User.findById(decoded.id || decoded._id || decoded.userId)
      .select('-password');
    
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    // 5. Añadir usuario a req (CON AMBOS FORMATOS para compatibilidad)
    req.user = {
      _id: user._id,
      id: user._id,  // Para compatibilidad
      ...user.toObject()
    };
    
    console.log('✅ Usuario autenticado:', req.user._id);
    next();
    
  } catch (err) {
    console.error('❌ Error en auth middleware:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

module.exports = auth;