// src/routes/showtimeRoutes.js
const express= require('express');
const route= express.Router();
const showtimeController = require('../controller/ShowtimeController');
const router = require('./authRoutes');
// lấy ra suất chiếu theo ngày
router.get ('/date/:date',showtimeController.getByDate);
router.get('/schedule',showtimeController.getNext6Day);// http://localhost:3000/api/showtime/schedule?ma_rap=3
router.get('/movie/:maPhim',showtimeController.getByMovie);
router.get('/:id',showtimeController.getById);
router.get('/:id/seats', showtimeController.getSeats);
module.exports = router