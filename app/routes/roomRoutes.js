// src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require('../controller/roomController');
const authMiddleware = require('../middleware/authMiddleware');

// ============== CUSTOMER ROUTES ==============
// Lấy tất cả phòng (phân trang)
router.get('/', roomController.getAll);

// Lọc phòng theo loại màn hình
router.get('/filter', roomController.filter);

// Lấy chi tiết phòng
router.get('/:id', roomController.getById);

// Lấy danh sách phòng theo rạp
router.get('/cinema/:maRap', roomController.getByCinema);

module.exports = router;