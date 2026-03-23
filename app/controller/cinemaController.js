// src/controllers/cinemaController.js
const Cinema = require('../model/Cinema');

const cinemaController = {
    // Lấy tất cả rạp
    getAll: async (req, res) => {
        try {
            const cinemas = await Cinema.getAll();
            res.json({
                success: true,
                message: 'Lấy danh sách rạp thành công',
                data: cinemas
            });
        } catch (error) {
            console.error('Error getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy rạp kèm số lượng phòng
    getAllWithRoomCount: async (req, res) => {
        try {
            const cinemas = await Cinema.getAllWithRoomCount();
            res.json({
                success: true,
                message: 'Lấy danh sách rạp thành công',
                data: cinemas
            });
        } catch (error) {
            console.error('Error getAllWithRoomCount:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy chi tiết rạp
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const cinema = await Cinema.getById(id);
            
            if (!cinema) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy rạp'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy chi tiết rạp thành công',
                data: cinema
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

    // Lấy rạp kèm danh sách phòng
    getWithRooms: async (req, res) => {
        try {
            const { id } = req.params;
            const cinema = await Cinema.getWithRooms(id);
            
            if (!cinema) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy rạp'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy thông tin rạp và phòng thành công',
                data: cinema
            });
        } catch (error) {
            console.error('Error getWithRooms:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy rạp theo thành phố
    getByCity: async (req, res) => {
        try {
            const { city } = req.params;
            const cinemas = await Cinema.getByCity(city);
            
            res.json({
                success: true,
                message: 'Lấy danh sách rạp theo thành phố thành công',
                data: cinemas
            });
        } catch (error) {
            console.error('Error getByCity:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy danh sách thành phố có rạp
    getCities: async (req, res) => {
        try {
            const cities = await Cinema.getCities();
            res.json({
                success: true,
                message: 'Lấy danh sách thành phố thành công',
                data: cities
            });
        } catch (error) {
            console.error('Error getCities:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
};

module.exports = cinemaController;