// src/models/Combo.js
const db = require('../config/database');

class Combo {
    // Lấy tất cả combo
    static async getAll() {
        try {
            const [rows] = await db.execute(`
                SELECT ma_combo, ten_combo, mo_ta, anh_minh_hoa, gia_tien
                FROM combo
                ORDER BY gia_tien ASC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy combo theo khoảng giá
    static async getByPriceRange(minPrice, maxPrice) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_combo, ten_combo, mo_ta, anh_minh_hoa, gia_tien
                FROM combo
                WHERE gia_tien BETWEEN ? AND ?
                ORDER BY gia_tien ASC
            `, [minPrice, maxPrice]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết combo theo ID
    static async getById(maCombo) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_combo, ten_combo, mo_ta, anh_minh_hoa, gia_tien
                FROM combo
                WHERE ma_combo = ?
            `, [maCombo]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tìm kiếm combo theo tên
    static async search(keyword) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_combo, ten_combo, mo_ta, anh_minh_hoa, gia_tien
                FROM combo
                WHERE ten_combo LIKE ? OR mo_ta LIKE ?
                ORDER BY gia_tien ASC
            `, [`%${keyword}%`, `%${keyword}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
    // Lấy combo phổ biến (được mua nhiều nhất)
    static async getPopular(limit = 5) {
        try {
            const [rows] = await db.execute(`
                SELECT c.ma_combo, c.ten_combo, c.mo_ta, c.anh_minh_hoa, c.gia_tien,
                       SUM(hdc.so_luong) as so_luong_da_ban
                FROM combo c
                JOIN hoa_don_combo hdc ON c.ma_combo = hdc.ma_combo
                JOIN hoa_don hd ON hdc.ma_hoa_don = hd.ma_hoa_don
                WHERE hd.trang_thai = 'Đã thanh toán'
                GROUP BY c.ma_combo
                ORDER BY so_luong_da_ban DESC
                LIMIT ?
            `, [limit]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Combo;