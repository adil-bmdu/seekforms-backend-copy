const express=require('express');
const router=express.Router();
const videoCategory=require('../controllers/videoCategory');
const video=require('../controllers/interviewVideo')
const authenticate=require('../../helper/jwtAuth')
const upload=require('../../helper/fileUpload')
//================================ video category api ===============================

router.post('/add-category',authenticate,upload.single('image'),videoCategory.createVideoCategory);

router.put('/update-category/:Id',authenticate,upload.single('image'),videoCategory.updateVideoCategory);

router.get('/category',authenticate,videoCategory.getVideoCategory);

router.delete('/delete-category/:Id',authenticate,videoCategory.deleteVideoCategory);

//============================ interview videos ==================================

router.post('/add-video',authenticate,upload.any(),video.createInterviewVideo);

router.put('/update-video/:Id',authenticate,upload.array('videos', 10),video.updateInterviewVideo);

router.get('/videos',authenticate,video.getInterviewVideos);

router.get('/videos-by-id/:Id',authenticate,video.getInterviewVideoById);

router.delete('/delete-videos/:Id',authenticate,video.deleteInterviewVideo);

router.delete('/delete-by-video-id/:Id',authenticate,video.deleteInterviewVideoByVideoId)


module.exports=router;