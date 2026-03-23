// src/routes/seatRoutes.js
const express = require('express');
const router = express.Router();
const seatController = require('../controller/seatController');
const authMiddleware = require('../middleware/authMiddleware');

// ============== CUSTOMER ROUTES ==============
// Lấy sơ đồ ghế của suất chiếu (quan trọng nhất cho đặt vé)
router.get('/showtime/:maSuatChieu', seatController.getSeatsByShowtime);

// Lấy danh sách ghế theo phòng
router.get('/room/:maPhong', seatController.getByRoom);

// Lấy chi tiết ghế
router.get('/:id', seatController.getById);
module.exports = router;