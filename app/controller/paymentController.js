// src/controllers/paymentController.js
const Invoice = require('../model/Invoice');
const Showtime = require('../model/Showtime');
const Combo = require('../model/Combo');
const Seat = require('../model/Seat');

const paymentController = {
    // Bước 1: Xem thông tin thanh toán (trước khi đặt)
    getCheckoutInfo: async (req, res) => {
        try {
            const { ma_suat_chieu, ma_ghe_list, ma_combo_list } = req.query;
            
            if (!ma_suat_chieu || !ma_ghe_list) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn suất chiếu và ghế'
                });
            }
            
            // Lấy thông tin suất chiếu
            const showtime = await Showtime.getById(ma_suat_chieu);
            if (!showtime) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy suất chiếu'
                });
            }
            
            // Lấy danh sách ghế
            const maGheArray = ma_ghe_list.split(',').map(Number);
            const seats = [];
            
            for (const maGhe of maGheArray) {
                const seat = await Seat.getById(maGhe);
                if (seat) {
                    const gia = Seat.calculatePrice(seat.loai_ghe, parseFloat(showtime.gia_ve_co_ban));
                    seats.push({
                        ma_ghe: seat.ma_ghe,
                        vi_tri: seat.vi_tri,
                        loai_ghe: seat.loai_ghe,
                        gia: gia
                    });
                }
            }
            
            // Lấy danh sách combo
            const combos = [];
            if (ma_combo_list) {
                const maComboArray = ma_combo_list.split(',').map(Number);
                for (const maCombo of maComboArray) {
                    const combo = await Combo.getById(maCombo);
                    if (combo) {
                        combos.push({
                            ma_combo: combo.ma_combo,
                            ten_combo: combo.ten_combo,
                            gia_tien: parseFloat(combo.gia_tien),
                            so_luong: 1
                        });
                    }
                }
            }
            
            // Tính tổng tiền
            let tongTien = 0;
            seats.forEach(seat => tongTien += seat.gia);
            combos.forEach(combo => tongTien += combo.gia_tien);
            
            res.json({
                success: true,
                message: 'Lấy thông tin thanh toán thành công',
                data: {
                    showtime: {
                        ma_suat_chieu: showtime.ma_suat_chieu,
                        ten_phim: showtime.ten_phim,
                        ngay_chieu: showtime.ngay_chieu,
                        gio_bat_dau: showtime.gio_bat_dau,
                        ten_rap: showtime.ten_rap,
                        ten_phong: showtime.ten_phong
                    },
                    seats: seats,
                    combos: combos,
                    tong_tien: tongTien
                }
            });
            
        } catch (error) {
            console.error('Error getCheckoutInfo:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Bước 2: Xác nhận đặt vé và tạo hóa đơn
    createOrder: async (req, res) => {
        try {
            // Kiểm tra đăng nhập
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Vui lòng đăng nhập để đặt vé'
                });
            }
            
            const { ma_suat_chieu, ma_ghe_list, ma_combo_list } = req.body;
            
            // Validate
            if (!ma_suat_chieu || !ma_ghe_list) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng chọn suất chiếu và ghế'
                });
            }
            
            // Lấy thông tin suất chiếu
            const showtime = await Showtime.getById(ma_suat_chieu);
            if (!showtime) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy suất chiếu'
                });
            }
            
            // Xử lý danh sách ghế
            const maGheArray = ma_ghe_list.split(',').map(Number);
            
            // Kiểm tra ghế còn trống không
            const seatsAvailable = await Invoice.checkSeatsAvailable(ma_suat_chieu, maGheArray);
            if (!seatsAvailable) {
                return res.status(400).json({
                    success: false,
                    message: 'Một số ghế đã được đặt, vui lòng chọn lại'
                });
            }
            
            // Tạo danh sách ghế với giá
            const seats = [];
            for (const maGhe of maGheArray) {
                const seat = await Seat.getById(maGhe);
                if (seat) {
                    const gia = Seat.calculatePrice(seat.loai_ghe, parseFloat(showtime.gia_ve_co_ban));
                    seats.push({
                        ma_ghe: maGhe,
                        loai_ghe: seat.loai_ghe,
                        vi_tri: seat.vi_tri,
                        gia: gia
                    });
                }
            }
            
            // Xử lý danh sách combo
            const combos = [];
            let tongTien = 0;
            
            // Tính tiền vé
            seats.forEach(seat => tongTien += seat.gia);
            
            if (ma_combo_list) {
                const maComboArray = ma_combo_list.split(',').map(Number);
                for (const maCombo of maComboArray) {
                    const combo = await Combo.getById(maCombo);
                    if (combo) {
                        // Gộp combo trùng
                        const existing = combos.find(c => c.ma_combo === maCombo);
                        if (existing) {
                            existing.so_luong++;
                        } else {
                            combos.push({
                                ma_combo: maCombo,
                                ten_combo: combo.ten_combo,
                                gia_tien: parseFloat(combo.gia_tien),
                                so_luong: 1
                            });
                        }
                        tongTien += parseFloat(combo.gia_tien);
                    }
                }
            }
            
            // Tạo hóa đơn
            const maHoaDon = await Invoice.create(
                req.user.ma_kh,
                ma_suat_chieu,
                seats,
                combos,
                tongTien
            );
            
            res.status(201).json({
                success: true,
                message: 'Đặt vé thành công! Vui lòng thanh toán',
                data: {
                    ma_hoa_don: maHoaDon,
                    tong_tien: tongTien
                }
            });
            
        } catch (error) {
            console.error('Error createOrder:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Lỗi server',
                error: error.message
            });
        }
    },

    // Bước 3: Thanh toán
    payOrder: async (req, res) => {
        try {
            const { ma_hoa_don, phuong_thuc_thanh_toan } = req.body;
            
            if (!ma_hoa_don || !phuong_thuc_thanh_toan) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp mã hóa đơn và phương thức thanh toán'
                });
            }
            
            // Thanh toán
            const paid = await Invoice.pay(ma_hoa_don, phuong_thuc_thanh_toan);
            
            if (!paid) {
                return res.status(400).json({
                    success: false,
                    message: 'Thanh toán thất bại. Hóa đơn không tồn tại hoặc đã được thanh toán'
                });
            }
            
            // Lấy thông tin vé sau khi thanh toán
            const invoiceDetail = await Invoice.getDetail(ma_hoa_don, req.user.ma_kh);
            
            res.json({
                success: true,
                message: 'Thanh toán thành công!',
                data: {
                    ma_hoa_don: ma_hoa_don,
                    tickets: invoiceDetail.tickets,
                    combos: invoiceDetail.combos
                }
            });
            
        } catch (error) {
            console.error('Error payOrder:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy chi tiết vé đã đặt
    getTicketDetail: async (req, res) => {
        try {
            const { ma_hoa_don } = req.params;
            
            const invoiceDetail = await Invoice.getDetail(ma_hoa_don, req.user.ma_kh);
            
            if (!invoiceDetail) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy hóa đơn'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy chi tiết vé thành công',
                data: invoiceDetail
            });
            
        } catch (error) {
            console.error('Error getTicketDetail:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy lịch sử đặt vé
    getHistory: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const history = await Invoice.getHistory(req.user.ma_kh, page, limit);
            
            res.json({
                success: true,
                message: 'Lấy lịch sử đặt vé thành công',
                data: history
            });
            
        } catch (error) {
            console.error('Error getHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Hủy đơn hàng (chưa thanh toán)
    cancelOrder: async (req, res) => {
        try {
            const { ma_hoa_don } = req.params;
            
            const cancelled = await Invoice.cancel(ma_hoa_don, req.user.ma_kh);
            
            res.json({
                success: true,
                message: 'Hủy đơn thành công'
            });
            
        } catch (error) {
            console.error('Error cancelOrder:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Lỗi server',
                error: error.message
            });
        }
    }
};

module.exports = paymentController;