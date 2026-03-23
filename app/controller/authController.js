const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

class AuthController {
    // ĐĂNG KÝ
    async register(req, res) {
        try {
            const { ho_ten, email, SDT, tai_khoan, mat_khau } = req.body;

            // Validate cơ bản
            if (!ho_ten || !email || !tai_khoan || !mat_khau) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
                });
            }

            // Kiểm tra tài khoản đã tồn tại
            const existingUser = await User.findByUsername(tai_khoan);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Tài khoản đã tồn tại'
                });
            }

            // Kiểm tra email đã tồn tại
            const existingEmail = await User.findByEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã được sử dụng'
                });
            }

            // Mã hóa mật khẩu (trong file sql mật khẩu để plain text, nhưng nên hash)
            // const hashedPassword = await bcrypt.hash(mat_khau, 10);
            
            // Tạo user mới (dùng mat_khau trực tiếp vì trong DB đang để plain text)
            const userId = await User.create({
                ho_ten,
                email,
                SDT,
                tai_khoan,
                mat_khau // Trong thực tế nên dùng hashedPassword
            });

            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công',
                data: { ma_kh: userId }
            });

        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

    // ĐĂNG NHẬP
    async login(req, res) {
        try {
            const { tai_khoan, mat_khau } = req.body;

            // Validate
            if (!tai_khoan || !mat_khau) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập tài khoản và mật khẩu'
                });
            }

            // Tìm user
            const user = await User.findByUsername(tai_khoan);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Tài khoản không tồn tại'
                });
            }

            // Kiểm tra mật khẩu (so sánh trực tiếp vì DB đang plain text)
            if (user.mat_khau !== mat_khau) {
                return res.status(401).json({
                    success: false,
                    message: 'Sai mật khẩu'
                });
            }

            // Tạo JWT token
            const token = jwt.sign(
                { 
                    ma_kh: user.ma_kh, 
                    tai_khoan: user.tai_khoan,
                    vai_tro: user.vai_tro 
                },
                'secret_key', // Nên để trong .env
                { expiresIn: '24h' }
            );

            // Không trả về mật khẩu
            delete user.mat_khau;

            res.json({
                success: true,
                message: 'Đăng nhập thành công',
                data: {
                    user,
                    token
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

    // LẤY THÔNG TIN USER (dùng token)
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.ma_kh);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy user'
                });
            }

            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }
}

module.exports = new AuthController();