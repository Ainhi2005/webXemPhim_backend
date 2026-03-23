const db = require('../config/database');
class Movie{
    //lấy ra phim đang chiếu
    static async getNowShowingMovie(){
        try{
            const[rows]= await db.execute(
                `select * from phim where ngay_khoi_chieu <= '2025-12-12' 
                order by ngay_khoi_chieu DESC`// ví dụ lấy ngày 12/12 là hôm nay
            );
            return rows;
        }catch(error){
            throw error;
        }
    }
    //lấy ra phim sắp chiếu
    static async getComingSoonMovie(){
        try{
        const[rows]=await db.execute(`select * from phim where ngay_khoi_chieu >= '2025-12-12'
                order by ngay_khoi_chieu DESC`)
        return rows;
        }catch (error){
            throw error;
        }
    } 
    //lấy ra phim hot
     static async getHotMovie(){
        try{
        const[rows]=await db.execute(`select * from phim where hot=1
                order by ngay_khoi_chieu DESC`)
        return rows;
        }catch (error){
            throw error;
        }
    }
    //lấy ra tất ca phim (CÓ PHÂN TRANG) 
    static async getAllMovie(page=1,limit=3){
        try {
        const offset = (page-1)*limit;
        const [rows]= await db.execute(
            `select * from phim 
                order by ngay_khoi_chieu DESC  
                LIMIT ? OFFSET ?`,[limit,offset]
        );
        const[total]=await db.execute('SELECT COUNT(*) as total FROM phim');
        return {
            data: rows,
            total: total[0].total,
            page,
            limit
        };
        }
        catch(error){
            throw error;
        }
    }
    //lấy ra phim theo mã phim,
    static async getMovieById(ma_phim){
        try{
            const [rows]=await db.execute(`select * from phim where ma_phim=?`,[ma_phim]);
        return rows[0]
        }catch(error){
            throw error;
        }
    }
    }
module.exports=Movie;


//lọc phim 

