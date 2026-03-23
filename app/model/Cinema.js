// src/models/Cinema.js
const db = require('../config/database');

class Cinema {
    // Lấy tất cả rạp
    static async getAll() {
        try {
            const [rows] = await db.execute(`
                SELECT ma_rap, ten_rap, dia_chi, thanh_pho, SDT, anh_rap, mo_ta_rap
                FROM rap
                ORDER BY thanh_pho ASC, ten_rap ASC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết rạp theo ID
    static async getById(maRap) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_rap, ten_rap, dia_chi, thanh_pho, SDT, anh_rap, mo_ta_rap
                FROM rap
                WHERE ma_rap = ?
            `, [maRap]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy rạp theo thành phố
    static async getByCity(thanhPho) {
        try {
            const [rows] = await db.execute(`
                SELECT ma_rap, ten_rap, dia_chi, thanh_pho, SDT, anh_rap, mo_ta_rap
                FROM rap
                WHERE thanh_pho LIKE ?
                ORDER BY ten_rap ASC
            `, [`%${thanhPho}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách các thành phố có rạp
    static async getCities() {
        try {
            const [rows] = await db.execute(`
                SELECT DISTINCT thanh_pho
                FROM rap
                WHERE thanh_pho IS NOT NULL
                ORDER BY thanh_pho ASC
            `);
            return rows.map(row => row.thanh_pho);
        } catch (error) {
            throw error;
        }
    }

    // Lấy rạp kèm số lượng phòng
    static async getAllWithRoomCount() {
        try {
            const [rows] = await db.execute(`
                SELECT r.ma_rap, r.ten_rap, r.dia_chi, r.thanh_pho, r.SDT, r.anh_rap,
                       COUNT(p.ma_phong) as so_phong
                FROM rap r
                LEFT JOIN phong p ON r.ma_rap = p.ma_rap
                GROUP BY r.ma_rap
                ORDER BY r.thanh_pho ASC, r.ten_rap ASC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Lấy rạp kèm danh sách phòng
    static async getWithRooms(maRap) {
        try {
            const cinema = await this.getById(maRap);
            if (!cinema) return null;
            
            const [rooms] = await db.execute(`
                SELECT ma_phong, ten_phong, loai_man_hinh
                FROM phong
                WHERE ma_rap = ?
                ORDER BY ten_phong ASC
            `, [maRap]);
            
            return {
                ...cinema,
                phong: rooms
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Cinema;