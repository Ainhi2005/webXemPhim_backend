// src/routes/comboRoutes.js
const express = require('express');
const router = express.Router();
const comboController = require('../controller/comboController');
const authMiddleware = require('../middleware/authMiddleware');

// ============== CUSTOMER ROUTES ==============
// Lấy tất cả combo
router.get('/', comboController.getAll);

// Lấy combo theo khoảng giá
router.get('/price-range', comboController.getByPriceRange);

// Tìm kiếm combo
router.get('/search', comboController.search);

// Lấy combo phổ biến
router.get('/popular', comboController.getPopular);

// Lấy chi tiết combo
router.get('/:id', comboController.getById);

module.exports = router;