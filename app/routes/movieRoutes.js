const express = require('express');
const router = express.Router();
const movieController= require('../controller/moiveController');
router.get('/', movieController.getAllMovie);
router.get('/now-showing', movieController.getNowShowingMovie);
router.get('/coming-soon', movieController.getComingSoonMovie);
router.get('/hot', movieController.getHotMovie);
router.get('/:ma_phim',movieController.getMovieById)
module.exports=router