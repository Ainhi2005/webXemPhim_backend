const express = require('express');
const cors = require('cors');// cors để cho phép các domain khác nhau truy cập API
require('dotenv').config(); // để sử dụng biến môi trường từ file .env

const authRoutes = require('./app/routes/authRoutes');// để sử dụng các route liên quan đến xác thực (đăng ký, đăng nhập, lấy thông tin user)
const movieRoutes=require('./app/routes/movieRoutes');
const showtimeRoutes=require('./app/routes/showtimeRoutes');
const cinemaRoutes = require('./app/routes/cinemaRoutes');
const roomRoutes = require('./app/routes/roomRoutes');    
const comboRoutes = require('./app/routes/comboRoutes'); 
const seatRoutes = require('./app/routes/seatRoutes');
const paymentRoutes = require('./app/routes/paymentRoutes'); 
const app = express();// Tạo ứng dụng Express

// Middleware
app.use(cors());// Sử dụng CORS để cho phép các domain khác nhau truy cập API
app.use(express.json());// Middleware để parse JSON từ body của request
app.use(express.urlencoded({ extended: true }));// Middleware để parse URL-encoded data từ body của request (thường dùng cho form)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movie',movieRoutes);
app.use('/api/showtime',showtimeRoutes)
app.use('/api/cinema', cinemaRoutes);   
app.use('/api/room', roomRoutes);     
app.use('/api/combo', comboRoutes);
app.use('/api/seat', seatRoutes);
app.use('/api/payments', paymentRoutes);
// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API đang chạy' });
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chạy trên port ${PORT}`);
});