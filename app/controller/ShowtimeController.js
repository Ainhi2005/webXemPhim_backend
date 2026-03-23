// Import Model Showtime để sử dụng các hàm truy vấn database
const Showtime = require('../model/Showtime');

const ShowtimeController = {
    /**
     * API: Lấy danh sách suất chiếu theo ngày
     * Method: GET
     * URL Example: /api/showtimes/2024-05-20?ma_rap=1
     */
    getByDate: async (req, res) => {
        try {
            // 1. LẤY DỮ LIỆU TỪ REQUEST
            // Lấy 'date' từ URL params (Ví dụ: /showtimes/:date)
            const { date } = req.params; 
            
            // Lấy 'ma_rap' từ Query String (Ví dụ: ?ma_rap=123)
            // Nếu không có ma_rap trên URL, mặc định gán là null
            const maRap = req.query.ma_rap || null;

            // 2. GỌI XỬ LÝ TỪ MODEL
            // Chờ Model truy vấn Database và trả về danh sách suất chiếu
            const showtimes = await Showtime.getByDate(date, maRap);

            // 3. PHẢN HỒI THÀNH CÔNG (HTTP 200)
            // Trả về JSON cho Frontend với cấu trúc chuẩn
            res.json({
                success: true,
                message: 'Lấy suất chiếu thành công',
                data: showtimes // Đây là mảng các suất chiếu lấy được từ DB
            });

        } catch (error) {
            // 4. XỬ LÝ LỖI (HTTP 500)
            // Ghi log lỗi ra terminal của server để lập trình viên kiểm tra
            console.error('Lỗi lấy phim theo ngày: ', error);

            // Phản hồi lỗi về phía Client
            res.status(500).json({
                success: false,
                message: "Lỗi server",
                error: error.message // Gửi kèm thông báo lỗi cụ thể để dễ debug
            });
        }
    },
    getNext6Day: async(req,res)=>{
        try{
            const maRap=req.query.ma_rap || null;
            const schedule = await Showtime.getNext6Day(maRap);
            res.json({
                success:true,
                message:"lây lịch chiếu thành công",
                data: schedule
            })

        }catch(error){
            console.error('lỗi lấy lịch chiếu trong 6 ngàu tơid',error);
            res.status(500).json({
                success:false,
                message:'lỗi server',
                error:error.message
            });
        }
    },
    // lấy suất chiếu theo phim
    getByMovie: async(req,res)=>{
        try {
            const {maPhim}= req.params;
            const maRap= req.query.ma_rap || null;
            const showtimes= await Showtime.getByMovie(maPhim , maRap);
            res.json({
                success:true,
                message:"lây lịch chiếu theo phim thành công",
                data: showtimes
            })

        }catch(error){
            console.error('lỗi lấy suát chiêu theo phim ',error);
            res.status(500).json({
                success:false,
                message:'lỗi server',
                error:error.message
            });   
        }
    },
    // lấy tồng số ghế trống
// Lấy chi tiết suất chiếu
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const showtime = await Showtime.getById(id);
            if (!showtime) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy suất chiếu'
                });
            }
            
            // Lấy số ghế trống
            const availableSeats = await Showtime.getAvailableSeatsCount(id);
            
            res.json({
                success: true,
                message: 'Lấy chi tiết suất chiếu thành công',
                data: {
                    ...showtime,//Dấu ...: Có nghĩa là "lấy tất cả những gì đang có trong đối tượng này".
                    so_ghe_trong: availableSeats
                }
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
    getSeats: async (req, res) => {
        try {
            const { id } = req.params;
            
            const showtime = await Showtime.getById(id);
            if (!showtime) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy suất chiếu'
                });
            }
            
            const seats = await Showtime.getSeats(id);
            
            res.json({
                success: true,
                message: 'Lấy danh sách ghế thành công',
                data: {
                    showtime: {
                        ma_suat_chieu: showtime.ma_suat_chieu,
                        ten_phim: showtime.ten_phim,
                        ngay_chieu: showtime.ngay_chieu,
                        gio_bat_dau: showtime.gio_bat_dau,
                        ten_rap: showtime.ten_rap,
                        ten_phong: showtime.ten_phong
                    },
                    seats: seats.map(seat => ({
                        ma_ghe: seat.ma_ghe,
                        vi_tri: seat.vi_tri,
                        loai_ghe: seat.loai_ghe,
                        trang_thai: seat.trang_thai === 0 ? 'trống' : 'đã đặt'
                    }))
                }
            });
        } catch (error) {
            console.error('Error getSeats:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
}
// Xuất Controller để file Routes có thể require và sử dụng
module.exports = ShowtimeController;