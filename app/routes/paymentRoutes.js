// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Tất cả routes đều cần đăng nhập (khách hàng)
router.use(authMiddleware);

// Bước 1: Xem thông tin thanh toán (trước khi đặt)
router.get('/checkout', paymentController.getCheckoutInfo);

// Bước 2: Tạo đơn hàng
router.post('/order', paymentController.createOrder);

// Bước 3: Thanh toán
router.post('/pay', paymentController.payOrder);

// Lịch sử đặt vé
router.get('/history', paymentController.getHistory);

// Chi tiết vé
router.get('/ticket/:ma_hoa_don', paymentController.getTicketDetail);

// Hủy đơn
router.delete('/order/:ma_hoa_don/cancel', paymentController.cancelOrder);

module.exports = router;