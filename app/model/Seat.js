// src/models/Seat.js
const db = require('../config/database');

class Seat {
    // Lấy tất cả ghế theo phòng
    static async getByRoom(maPhong) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_ghe, ma_phong, loai_ghe, tinh_trang, vi_tri, ma_phong_ghe
                FROM ghe
                WHERE ma_phong = ?
                ORDER BY vi_tri ASC
            `, [maPhong]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách ghế theo phòng (có phân trang)
    static async getByRoomWithPagination(maPhong, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.execute(`
                SELECT ma_ghe, ma_phong, loai_ghe, tinh_trang, vi_tri, ma_phong_ghe
                FROM ghe
                WHERE ma_phong = ?
                ORDER BY vi_tri ASC
                LIMIT ? OFFSET ?
            `, [maPhong, limit, offset]);
            
            const [total] = await db.execute(`
                SELECT COUNT(*) as total FROM ghe WHERE ma_phong = ?
            `, [maPhong]);
            
            return {
                data: rows,
                total: total[0].total,
                page,
                limit
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết ghế theo ID
    static async getById(maGhe) {
        try {
            const [rows] = await db.execute(`
                SELECT g.ma_ghe, g.ma_phong, g.loai_ghe, g.tinh_trang, g.vi_tri, g.ma_phong_ghe,
                       p.ten_phong, r.ten_rap
                FROM ghe g
                JOIN phong p ON g.ma_phong = p.ma_phong
                JOIN rap r ON p.ma_rap = r.ma_rap
                WHERE g.ma_ghe = ?
            `, [maGhe]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy số lượng ghế theo loại trong phòng
    static async getCountByType(maPhong) {
        try {
            const [rows] = await db.execute(`
                SELECT loai_ghe, COUNT(*) as so_luong
                FROM ghe
                WHERE ma_phong = ?
                GROUP BY loai_ghe
            `, [maPhong]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Tính giá vé dựa trên loại ghế và giá cơ bản
    static calculatePrice(loaiGhe, giaCoBan) {
        switch(loaiGhe) {
            case 'VIP':
                return giaCoBan * 1.5;
            case 'Đôi':
                return giaCoBan * 2;
            case 'Thường':
            default:
                return giaCoBan;
        }
    }
}

module.exports = Seat;