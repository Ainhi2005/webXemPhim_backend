// src/models/Showtime.js
const db = require("../config/database")
class Showtime{
    // lấy danh sách suất chiếu theo ngày + rạp
    static async getByDate(date,maRap=null){//
        try {
            let query=`SELECT sc.ma_suat_chieu, sc.ngay_chieu, sc.gio_bat_dau, sc.gio_ket_thuc, 
                       sc.gia_ve_co_ban, p.ma_phong, p.ten_phong, p.loai_man_hinh,
                       r.ma_rap, r.ten_rap, r.dia_chi,
                       ph.ma_phim, ph.ten_phim, ph.the_loai, ph.thoi_luong, ph.anh_trailer from suat_chieu sc 
            join phong p  on p.ma_phong = sc.ma_phong
            join rap r on r.ma_rap=p.ma_rap
            join phim ph on ph.ma_phim= sc.ma_phim where sc.ngay_chieu =? `;
        const params=[date]// Mảng params dùng để tránh SQL Injection (giúp truyền dữ liệu vào dấu ?)
        if(maRap){// Nếu người dùng có truyền maRap, ta cộng thêm điều kiện lọc vào chuỗi SQ
            query+=`and r.ma_rap = ?`;
            params.push(maRap);//Đẩy giá trị maRap vào mảng tham số
        }
        query += ` order by sc.gio_bat_dau ASC`;

        const[rows]=await db.execute(query,params);
        return rows;
        }catch (error){
            throw error;
        }
    }
    // Lấy chiếu 6 ngày tới ( ví dụ hôm nay là 12-12-2025)
static async getNext6Day(maRap = null) {
    try {
        const result = {};
        // Khởi tạo mốc thời gian bắt đầu
        const startDate = new Date('2026-01-01'); 

        for (let i = 0; i < 6; i++) {
            // Tạo một đối tượng date mới dựa trên startDate để tránh tham chiếu ghi đè
            const currentDate = new Date(startDate);
            
            // Tăng thêm i ngày
            currentDate.setDate(startDate.getDate() + i);
            
            // Chuyển về định dạng YYYY-MM-D
            const dateStr = currentDate.toISOString().split('T')[0];// T là để phân cách
            
            // Gọi hàm getByDate đã viết trước đó để lấy dữ liệu
            const showtimes = await this.getByDate(dateStr, maRap);
            
            // Lưu vào object kết quả với key là ngày
            result[dateStr] = showtimes;
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

// lấy suaats chiếu theo phim 
static async getByMovie(maPhim, maRap) { // Sửa chính tả getByMovie
    try {
        let query = `
            SELECT 
                sc.ma_suat_chieu, sc.ngay_chieu, sc.gio_bat_dau, sc.gio_ket_thuc, 
                sc.gia_ve_co_ban, p.ma_phong, p.ten_phong, p.loai_man_hinh,
                r.ma_rap, r.ten_rap, r.dia_chi,
                ph.ma_phim, ph.ten_phim, ph.the_loai, ph.thoi_luong
            FROM suat_chieu sc
            JOIN phong p ON sc.ma_phong = p.ma_phong
            JOIN rap r ON p.ma_rap = r.ma_rap
            JOIN phim ph ON sc.ma_phim = ph.ma_phim
            WHERE sc.ma_phim = ? AND sc.ngay_chieu >= '2026-01-01'
        `;

        const params = [maPhim];
        if (maRap) {
            query += ` AND r.ma_rap = ?`; // Thêm khoảng trắng trước AND
            params.push(maRap);
        }

        query += ` ORDER BY sc.ngay_chieu ASC, sc.gio_bat_dau ASC`;

        const [rows] = await db.execute(query, params);

        const grouped = {};
        rows.forEach(st => {
            // Chuyển đối tượng Date thành chuỗi 'YYYY-MM-DD' để làm Key sạch
            const dateKey = new Date(st.ngay_chieu).toISOString().split('T')[0];

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(st);
        });

        return grouped;
    } catch (error) {
        console.error("Lỗi tại getByMovie Model:", error);
        throw error;
    }
}
// lấy số ghế trống của suất chiếu
static async getById(maSuatChieu) {
        try {
            const [rows] = await db.execute(`
                SELECT sc.ma_suat_chieu, sc.ngay_chieu, sc.gio_bat_dau, sc.gio_ket_thuc, 
                       sc.gia_ve_co_ban, p.ma_phong, p.ten_phong, p.loai_man_hinh,
                       r.ma_rap, r.ten_rap, r.dia_chi,
                       ph.ma_phim, ph.ten_phim, ph.the_loai, ph.thoi_luong, ph.anh_trailer, ph.mo_ta
                FROM suat_chieu sc
                JOIN phong p ON sc.ma_phong = p.ma_phong
                JOIN rap r ON p.ma_rap = r.ma_rap
                JOIN phim ph ON sc.ma_phim = ph.ma_phim
                WHERE sc.ma_suat_chieu = ?
            `, [maSuatChieu]);
            
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Lấy số ghế trống của suất chiếu
    static async getAvailableSeatsCount(maSuatChieu) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(*) as available
                FROM ghe_suat_chieu
                WHERE ma_suat_chieu = ? AND trang_thai = 0
            `, [maSuatChieu]);
            
            return rows[0].available;
        } catch (error) {
            throw error;
        }
    }

    // Lấy danh sách ghế của suất chiếu (kèm trạng thái)
    static async getSeats(maSuatChieu) {
        try {
            const [rows] = await db.execute(`
                SELECT gsc.ma_ghe, gsc.trang_thai, g.ma_phong, g.loai_ghe, g.vi_tri
                FROM ghe_suat_chieu gsc
                JOIN ghe g ON gsc.ma_ghe = g.ma_ghe
                WHERE gsc.ma_suat_chieu = ?
                ORDER BY g.vi_tri ASC
            `, [maSuatChieu]);
            
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra ghế còn trống không
    static async checkSeatAvailable(maSuatChieu, maGhe) {
        try {
            const [rows] = await db.execute(`
                SELECT trang_thai
                FROM ghe_suat_chieu
                WHERE ma_suat_chieu = ? AND ma_ghe = ?
            `, [maSuatChieu, maGhe]);
            
            return rows[0] && rows[0].trang_thai === 0;
        } catch (error) {
            throw error;
        }
    }

    
}

module.exports=Showtime;
