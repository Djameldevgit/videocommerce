// routes/roleRoutes.js - VERSIÓN CORREGIDA
const router = require('express').Router()
const roleCtrl = require('../controllers/roleCtrl')
const auth = require("../middleware/auth")

// ============================================
// 1️⃣ RUTAS DE BÚSQUEDA
// ============================================
router.get('/users/search', auth, roleCtrl.searchUser)

// ============================================
// 2️⃣ RUTAS DE ASIGNACIÓN DE ROLES (específicas)
// ============================================
router.patch('/user/:id/role/no-identificado', auth, roleCtrl.UserRoleNoIdentificado);
router.patch('/user/:id/roleuser', auth, roleCtrl.assignUserRole);
router.patch('/user/:id/roleuserpro', auth, roleCtrl.assignUserProRole);
router.patch('/user/:id/rolemoderador', auth, roleCtrl.assignModeratorRole);
router.patch('/user/:id/roleadmin', auth, roleCtrl.assignAdminRole);

// ============================================
// 3️⃣ RUTA GENÉRICA DE ACTUALIZACIÓN
// ============================================
router.patch('/user/:id/role', auth, roleCtrl.updateRole);

module.exports = router