// src/controllers/comboController.js
const Combo = require('../model/Combo');

const comboController = {
    // Lấy tất cả combo
    getAll: async (req, res) => {
        try {
            const combos = await Combo.getAll();
            res.json({
                success: true,
                message: 'Lấy danh sách combo thành công',
                data: combos
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

    // Lấy combo theo khoảng giá
    getByPriceRange: async (req, res) => {
        try {
            const { min, max } = req.query;
            
            if (!min || !max) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp khoảng giá (min và max)'
                });
            }
            
            const combos = await Combo.getByPriceRange(parseFloat(min), parseFloat(max));
            res.json({
                success: true,
                message: 'Lấy combo theo khoảng giá thành công',
                data: combos
            });
        } catch (error) {
            console.error('Error getByPriceRange:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy chi tiết combo
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const combo = await Combo.getById(id);
            
            if (!combo) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy combo'
                });
            }
            
            res.json({
                success: true,
                message: 'Lấy chi tiết combo thành công',
                data: combo
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

    // Tìm kiếm combo
    search: async (req, res) => {
        try {
            const { keyword } = req.query;
            
            if (!keyword) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập từ khóa tìm kiếm'
                });
            }
            
            const combos = await Combo.search(keyword);
            res.json({
                success: true,
                message: 'Tìm kiếm combo thành công',
                data: combos
            });
        } catch (error) {
            console.error('Error search:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    },

    // Lấy combo phổ biến
    getPopular: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const combos = await Combo.getPopular(limit);
            res.json({
                success: true,
                message: 'Lấy combo phổ biến thành công',
                data: combos
            });
        } catch (error) {
            console.error('Error getPopular:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server',
                error: error.message
            });
        }
    }
};

module.exports = comboController;