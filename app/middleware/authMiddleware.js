//file này để kiểm tra token trong các request đến các route cần bảo vệ (như /profile) 
//để đảm bảo chỉ người dùng đã đăng nhập mới có thể truy cập được thông tin cá nhân của họ.
// Nếu token hợp lệ, middleware sẽ giải mã token và gắn thông tin người dùng vào req.user để controller có thể sử dụng.
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
};

module.exports = authMiddleware;