// src/routes/cinemaRoutes.js
const express = require('express');
const router = express.Router();
const cinemaController = require('../controller/cinemaController');
const authMiddleware = require('../middleware/authMiddleware');

// ============== CUSTOMER ROUTES ==============
// Lấy danh sách rạp
router.get('/', cinemaController.getAll);

// Lấy danh sách rạp kèm số phòng
router.get('/with-rooms', cinemaController.getAllWithRoomCount);

// Lấy danh sách thành phố
router.get('/cities', cinemaController.getCities);

// Lấy rạp theo thành phố
router.get('/city/:city', cinemaController.getByCity);

// Lấy chi tiết rạp
router.get('/:id', cinemaController.getById);

// Lấy rạp kèm danh sách phòng
router.get('/:id/rooms', cinemaController.getWithRooms);

module.exports = router;