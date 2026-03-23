// test-db.js
const mysql = require('mysql2');

// Cấu hình kết nối
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Để trống nếu không có pass
    database: 'web_ban_ve'
});

// Kiểm tra kết nối
connection.connect((err) => {
    if (err) {
        console.error('❌ Kết nối thất bại:', err.message);
        return;
    }
    console.log('✅ Kết nối database thành công!');
    
    // Test query đơn giản
    connection.query('SELECT COUNT(*) AS total FROM khach_hang', (err, results) => {
        if (err) {
            console.error('❌ Query thất bại:', err.message);
        } else {
            console.log(`📊 Tổng số khách hàng: ${results[0].total}`);
        }
        
        // Đóng kết nối
        connection.end();
    });
});