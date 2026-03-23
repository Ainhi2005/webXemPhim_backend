const mysql = require('mysql2');

// Tạo pool kết nối
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'web_ban_ve',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chuyển sang dùng promise
const promisePool = pool.promise();

module.exports = promisePool;
