const db = require('../config/database');

class User {
    // Tìm user bằng tài khoản
    static async findByUsername(taiKhoan) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM khach_hang WHERE tai_khoan = ?',
                [taiKhoan]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tìm user bằng email
    static async findByEmail(email) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM khach_hang WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tạo user mới
    static async create(userData) {
        try {
            const { ho_ten, email, SDT, tai_khoan, mat_khau } = userData;
            const [result] = await db.execute(
                'INSERT INTO khach_hang (ho_ten, email, SDT, tai_khoan, mat_khau, vai_tro) VALUES (?, ?, ?, ?, ?, ?)',
                [ho_ten, email, SDT, tai_khoan, mat_khau, 'khách hàng']
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Lấy user theo ID
    static async findById(ma_kh) {
        try {
            const [rows] = await db.execute(
                'SELECT ma_kh, ho_ten, email, SDT, tai_khoan, vai_tro, avatar FROM khach_hang WHERE ma_kh = ?',
                [ma_kh]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;