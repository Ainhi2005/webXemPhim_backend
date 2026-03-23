const Movie= require("../model/movieModel")
// lấy danh sách phim đang chiếu
const movieController={
    getNowShowingMovie : async(req, res)=>{
        try {
            const movies=await Movie.getNowShowingMovie();
            res.json({
                success:true,
                message:"Lấy danh sách phim đang chiếu thành công ",
                data: movies
            })
            }catch (error){
                console.error('lỗi lấy phim đang chiếu ',error);
                res.status(500).json({
                    success:false,
                    message:"lỗi server",
                    error:error.message
                });

            }
    },
// lấy danh sách phim sắp chiếu
    getComingSoonMovie : async(req,res)=>{
    try {
        const moives= await Movie.getComingSoonMovie();
        res.json({
        success:true,
        message:" lấy danh sách phim sắp chiếu thành công",
        data:moives
    }) ;   
    }catch(error){
        console.error('lỗi lấy phim sắp chiếu', error);
        res.status(500).json({
            success:false,
            message:"lỗi server",
            error:error.message});
    }
    },

// lấy danh sách phim HOT
    getHotMovie : async(req,res)=>{
    try {
        const moive= await Movie.getHotMovie();
        res.json({
        success:true,
        message:" lấy danh sách phim HOT thành công",
        data:moive
    }) ;   
    }catch(error){
        console.error('lỗi lấy phim HOT', error);
        res.status(500).json({
            success:false,
            message:"lỗi server",
            error:error.message});
    }
    },
    // lấy phim theo id
    getMovieById: async (req,res)=>{
        try{
        const {ma_phim}= req.params;
        const movie=await Movie.getMovieById(ma_phim);
        if(!movie){
            return res.status(404).json({
                success:false,
                message:"không tìm thấy phim với mã này"
            });
        }

        return res.json({
            success:true,
            message:"lấy phim theo mã phim thành công",
            data:movie
        });

        }catch (error){
            console.error("lỗi lấy phim theo mã",error);
            res.status(500).json({
            success:false,
            message:"lỗi server",
            error:error.message
            });
        }
    },
// Lấy tất cả phim (có phân trang)
    getAllMovie: async(req,res)=>{
        try{
            const page= parseInt(req.query.page)|| 1;
            const limit = parseInt(req.query.limit) || 3;
            const result=await Movie.getAllMovie(page,limit);
            res.json({
                success:true,
                message:"lấy all list movie thành công",
                data:result.data,
                pagination:{
                    total:result.total,
                    page:result.page,
                    limit:result.limit,
                    totalPages:Math.ceil(result.total/result.limit)
                   // tính toán ( Math.ceil- làm tròn ) lấy số trang 
                }
            });
        }catch (error){
        console.error('lỗi lấy full all movie', error);
        res.status(500).json({
            success:false,
            message:"lỗi server",
            error:error.message});   
        }
    }

};
    module.exports=movieController;