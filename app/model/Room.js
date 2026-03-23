// src/models/Room.js
const db = require('../config/database');

class Room {
    // Lấy danh sách phòng theo rạp
    static async getByCinema(maRap) {
        try {
            const [rows] = await db.execute(`
                SELECT p.ma_phong, p.ten_phong, p.loai_man_hinh, r.ten_rap,
                       COUNT(g.ma_ghe) as so_ghe
                FROM phong p
                JOIN rap r ON p.ma_rap = r.ma_rap
                LEFT JOIN ghe g ON p.ma_phong = g.ma_phong
                WHERE p.ma_rap = ?
                GROUP BY p.ma_phong
                ORDER BY p.ten_phong ASC
            `, [maRap]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết phòng theo ID
    static async getById(maPhong) {
        try {
            const [rows] = await db.execute(`
                SELECT p.ma_phong, p.ten_phong, p.loai_man_hinh, 
                       r.ma_rap, r.ten_rap, r.dia_chi
                FROM phong p
                JOIN rap r ON p.ma_rap = r.ma_rap
                WHERE p.ma_phong = ?
            `, [maPhong]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách tất cả phòng (có phân trang)
    static async getAll(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const [rows] = await db.execute(`
                SELECT p.ma_phong, p.ten_phong, p.loai_man_hinh, 
                       r.ma_rap, r.ten_rap, r.thanh_pho,
                       COUNT(g.ma_ghe) as so_ghe
                FROM phong p
                JOIN rap r ON p.ma_rap = r.ma_rap
                LEFT JOIN ghe g ON p.ma_phong = g.ma_phong
                GROUP BY p.ma_phong
                ORDER BY r.ten_rap ASC, p.ten_phong ASC
                LIMIT ? OFFSET ?
            `, [limit, offset]);
            
            const [total] = await db.execute('SELECT COUNT(*) as total FROM phong');
            
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

    // Lọc phòng theo loại màn hình
    static async filter(loaiManHinh, maRap = null) {
        try {
            let query = `
                SELECT p.ma_phong, p.ten_phong, p.loai_man_hinh, r.ten_rap,
                       COUNT(g.ma_ghe) as so_ghe
                FROM phong p
                JOIN rap r ON p.ma_rap = r.ma_rap
                LEFT JOIN ghe g ON p.ma_phong = g.ma_phong
                WHERE p.loai_man_hinh LIKE ?
            `;
            const params = [`%${loaiManHinh}%`];
            
            if (maRap) {
                query += ` AND r.ma_rap = ?`;
                params.push(maRap);
            }
            
            query += ` GROUP BY p.ma_phong ORDER BY p.ten_phong ASC`;
            
            const [rows] = await db.execute(query, params);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Room;