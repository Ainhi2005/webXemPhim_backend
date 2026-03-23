// src/controllers/roomController.js
const Room = require('../model/Room');

const roomController = {
    // Lấy danh sách phòng theo rạp
    getByCinema: async (req, res) => {
        try {
            const { maRap } = req.params;
            const rooms = await Room.getByCinema(maRap);
            
            res.json({
                success: true,
                message: 'Lấy danh sách phòng thành công',
                data: rooms
            });
        } catch (error) {
            console.error('Error getByCinema:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy chi tiết phòng
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const room = await Room.getById(id);
            
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy phòng'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy chi tiết phòng thành công',
                data: room
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

    // Lấy tất cả phòng (phân trang)
    getAll: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            
            const result = await Room.getAll(page, limit);
            res.json({
                success: true,
                message: 'Lấy danh sách phòng thành công',
                data: result.data,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: Math.ceil(result.total / result.limit)
                }
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

    // Lọc phòng theo loại màn hình
    filter: async (req, res) => {
        try {
            const { loai_man_hinh, ma_rap } = req.query;
            
            if (!loai_man_hinh) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập loại màn hình'
                });
            }
            
            const rooms = await Room.filter(loai_man_hinh, ma_rap);
            res.json({
                success: true,
                message: 'Lọc phòng thành công',
                data: rooms
            });
        } catch (error) {
            console.error('Error filter:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
};

module.exports = roomController;