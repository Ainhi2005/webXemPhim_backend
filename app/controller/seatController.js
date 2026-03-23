// src/controllers/seatController.js
const Seat = require('../model/Seat');
const Showtime = require('../model/Showtime');

const seatController = {
    // Lấy danh sách ghế theo phòng
    getByRoom: async (req, res) => {
        try {
            const { maPhong } = req.params;
            const seats = await Seat.getByRoom(maPhong);
            
            res.json({
                success: true,
                message: 'Lấy danh sách ghế thành công',
                data: seats
            });
        } catch (error) {
            console.error('Error getByRoom:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy danh sách ghế theo phòng (có phân trang)
    getByRoomWithPagination: async (req, res) => {
        try {
            const { maPhong } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const result = await Seat.getByRoomWithPagination(maPhong, page, limit);
            res.json({
                success: true,
                message: 'Lấy danh sách ghế thành công',
                data: result.data,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit)
                }
            });
        } catch (error) {
            console.error('Error getByRoomWithPagination:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy chi tiết ghế
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const seat = await Seat.getById(id);
            
            if (!seat) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy ghế'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy chi tiết ghế thành công',
                data: seat
            });
        } catch (error) {
            console.error('Error getById:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy thống kê ghế theo loại trong phòng
    getCountByType: async (req, res) => {
        try {
            const { maPhong } = req.params;
            const stats = await Seat.getCountByType(maPhong);
            
            res.json({
                success: true,
                message: 'Lấy thống kê ghế thành công',
                data: stats
            });
        } catch (error) {
            console.error('Error getCountByType:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy sơ đồ ghế của suất chiếu (kèm trạng thái)
    getSeatsByShowtime: async (req, res) => {
        try {
            const { maSuatChieu } = req.params;
            
            // Lấy thông tin suất chiếu
            const showtime = await Showtime.getById(maSuatChieu);
            if (!showtime) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy suất chiếu'
                });
            }
            
            // Lấy danh sách ghế theo phòng
            const seats = await Seat.getByRoom(showtime.ma_phong);
            
            // Lấy trạng thái ghế trong suất chiếu
            const seatStatus = await Showtime.getSeats(maSuatChieu);
            const statusMap = {};
            seatStatus.forEach(s => {
                statusMap[s.ma_ghe] = s.trang_thai;
            });
            
            // Gộp thông tin
            const seatsWithStatus = seats.map(seat => ({
                ma_ghe: seat.ma_ghe,
                vi_tri: seat.vi_tri,
                loai_ghe: seat.loai_ghe,
                gia: Seat.calculatePrice(seat.loai_ghe, parseFloat(showtime.gia_ve_co_ban)),
                trang_thai: statusMap[seat.ma_ghe] === 0 ? 'trống' : 'đã đặt'
            }));
            
            res.json({
                success: true,
                message: 'Lấy sơ đồ ghế thành công',
                data: {
                    showtime: {
                        ma_suat_chieu: showtime.ma_suat_chieu,
                        ten_phim: showtime.ten_phim,
                        ngay_chieu: showtime.ngay_chieu,
                        gio_bat_dau: showtime.gio_bat_dau,
                        ten_rap: showtime.ten_rap,
                        ten_phong: showtime.ten_phong,
                        gia_ve_co_ban: showtime.gia_ve_co_ban
                    },
                    seats: seatsWithStatus
                }
            });
        } catch (error) {
            console.error('Error getSeatsByShowtime:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
};

module.exports = seatController;