// src/models/Invoice.js
const db = require('../config/database');

class Invoice {
    // Tạo hóa đơn mới (đặt vé trực tiếp)
    static async create(maKh, maSuatChieu, seats, combos, tongTien) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. Tạo hóa đơn
            const [invoiceResult] = await connection.execute(`
                INSERT INTO hoa_don (ma_kh, ngay_tao, tong_tien, trang_thai)
                VALUES (?, NOW(), ?, 'Chưa thanh toán')
            `, [maKh, tongTien]);
            
            const maHoaDon = invoiceResult.insertId;
            
            // 2. Tạo vé cho từng ghế
            for (const seat of seats) {
                await connection.execute(`
                    INSERT INTO ve (ma_hoa_don, ma_suat_chieu, ma_ghe, gia)
                    VALUES (?, ?, ?, ?)
                `, [maHoaDon, maSuatChieu, seat.ma_ghe, seat.gia]);
                
                // 3. Cập nhật trạng thái ghế trong suất chiếu (đã đặt)
                await connection.execute(`
                    UPDATE ghe_suat_chieu 
                    SET trang_thai = 1 
                    WHERE ma_suat_chieu = ? AND ma_ghe = ?
                `, [maSuatChieu, seat.ma_ghe]);
            }
            
            // 4. Tạo combo cho hóa đơn
            for (const combo of combos) {
                await connection.execute(`
                    INSERT INTO hoa_don_combo (ma_hoa_don, ma_combo, so_luong)
                    VALUES (?, ?, ?)
                `, [maHoaDon, combo.ma_combo, combo.so_luong]);
            }
            
            await connection.commit();
            return maHoaDon;
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Thanh toán hóa đơn
    static async pay(maHoaDon, phuongThucThanhToan) {
        try {
            const [result] = await db.execute(`
                UPDATE hoa_don 
                SET trang_thai = 'Đã thanh toán', 
                    phuong_thuc_thanh_toan = ?
                WHERE ma_hoa_don = ? AND trang_thai = 'Chưa thanh toán'
            `, [phuongThucThanhToan, maHoaDon]);
            
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Lấy chi tiết hóa đơn (vé + combo)
    static async getDetail(maHoaDon, maKh) {
        try {
            // 1. Thông tin hóa đơn
            const [invoice] = await db.execute(`
                SELECT ma_hoa_don, ngay_tao, tong_tien, trang_thai, phuong_thuc_thanh_toan
                FROM hoa_don 
                WHERE ma_hoa_don = ? AND ma_kh = ?
            `, [maHoaDon, maKh]);
            
            if (invoice.length === 0) return null;
            
            // 2. Danh sách vé
            const [tickets] = await db.execute(`
                SELECT v.ma_ve, v.gia, v.ma_ghe, g.vi_tri, g.loai_ghe,
                       sc.ngay_chieu, sc.gio_bat_dau, sc.gio_ket_thuc,
                       ph.ten_phim, ph.anh_banner,
                       p.ten_phong, r.ten_rap, r.dia_chi
                FROM ve v
                JOIN ghe g ON v.ma_ghe = g.ma_ghe
                JOIN suat_chieu sc ON v.ma_suat_chieu = sc.ma_suat_chieu
                JOIN phim ph ON sc.ma_phim = ph.ma_phim
                JOIN phong p ON sc.ma_phong = p.ma_phong
                JOIN rap r ON p.ma_rap = r.ma_rap
                WHERE v.ma_hoa_don = ?
            `, [maHoaDon]);
            
            // 3. Danh sách combo
            const [combos] = await db.execute(`
                SELECT c.ma_combo, c.ten_combo, c.gia_tien, hdc.so_luong,
                       (c.gia_tien * hdc.so_luong) as thanh_tien
                FROM hoa_don_combo hdc
                JOIN combo c ON hdc.ma_combo = c.ma_combo
                WHERE hdc.ma_hoa_don = ?
            `, [maHoaDon]);
            
            return {
                invoice: invoice[0],
                tickets: tickets,
                combos: combos
            };
            
        } catch (error) {
            throw error;
        }
    }

    // Lấy lịch sử đặt vé của khách
    static async getHistory(maKh, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            
            const [rows] = await db.execute(`
                SELECT hd.ma_hoa_don, hd.ngay_tao, hd.tong_tien, hd.trang_thai,
                       COUNT(DISTINCT v.ma_ve) as so_ve,
                       ph.ten_phim, sc.ngay_chieu, sc.gio_bat_dau,
                       r.ten_rap
                FROM hoa_don hd
                JOIN ve v ON hd.ma_hoa_don = v.ma_hoa_don
                JOIN suat_chieu sc ON v.ma_suat_chieu = sc.ma_suat_chieu
                JOIN phim ph ON sc.ma_phim = ph.ma_phim
                JOIN phong p ON sc.ma_phong = p.ma_phong
                JOIN rap r ON p.ma_rap = r.ma_rap
                WHERE hd.ma_kh = ?
                GROUP BY hd.ma_hoa_don
                ORDER BY hd.ngay_tao DESC
                LIMIT ? OFFSET ?
            `, [maKh, limit, offset]);
            
            const [total] = await db.execute(`
                SELECT COUNT(*) as total FROM hoa_don WHERE ma_kh = ?
            `, [maKh]);
            
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

    // Kiểm tra ghế còn trống không
    static async checkSeatsAvailable(maSuatChieu, maGheList) {
        const placeholders = maGheList.map(() => '?').join(',');
        
        const [rows] = await db.execute(`
            SELECT ma_ghe FROM ghe_suat_chieu
            WHERE ma_suat_chieu = ? AND ma_ghe IN (${placeholders}) AND trang_thai = 1
        `, [maSuatChieu, ...maGheList]);
        
        return rows.length === 0;
    }

    // Hủy đơn (chỉ hủy được khi chưa thanh toán)
    static async cancel(maHoaDon, maKh) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Kiểm tra hóa đơn
            const [invoice] = await connection.execute(`
                SELECT trang_thai FROM hoa_don 
                WHERE ma_hoa_don = ? AND ma_kh = ?
            `, [maHoaDon, maKh]);
            
            if (invoice.length === 0) {
                throw new Error('Không tìm thấy hóa đơn');
            }
            
            if (invoice[0].trang_thai === 'Đã thanh toán') {
                throw new Error('Không thể hủy hóa đơn đã thanh toán');
            }
            
            // Lấy danh sách ghế cần giải phóng
            const [seats] = await connection.execute(`
                SELECT ma_suat_chieu, ma_ghe FROM ve WHERE ma_hoa_don = ?
            `, [maHoaDon]);
            
            // Giải phóng ghế
            for (const seat of seats) {
                await connection.execute(`
                    UPDATE ghe_suat_chieu 
                    SET trang_thai = 0 
                    WHERE ma_suat_chieu = ? AND ma_ghe = ?
                `, [seat.ma_suat_chieu, seat.ma_ghe]);
            }
            
            // Cập nhật trạng thái hóa đơn
            await connection.execute(`
                UPDATE hoa_don SET trang_thai = 'Hủy' WHERE ma_hoa_don = ?
            `, [maHoaDon]);
            
            await connection.commit();
            return true;
            
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = Invoice;