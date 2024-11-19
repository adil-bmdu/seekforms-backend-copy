const InterviewVideo=require('../Models/interviewVideo')
const constant = require('../../config/constant')
const { sendResponse } = require('../../config/helper');
const{ uploadToCloudinary}=require('../../helper/cloudinary')

module.exports={
    createInterviewVideo: async (req, res) => {
        try {
            const { categoryName, videoTitle } = req.body;

            if (!categoryName) return sendResponse('Category name field is mandatory', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!videoTitle) return sendResponse('Video title field is mandatory', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!req.files || req.files.length === 0) return sendResponse('At least one video file is required', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            
    
            const uploadPromises = req.files.map(async (file) => {
                const fileBuffer = file.buffer; 
                const originalFileName = file.originalname;
                const result = await uploadToCloudinary(fileBuffer, originalFileName);
                return result.secure_url; 
            });
    
            const videoUrls = await Promise.all(uploadPromises);
    
            // Create a new InterviewVideo record with the uploaded video URLs
            const videos = videoUrls.map((url) => ({
                videoUrl: url
            }));
    
            const interviewVideo = new InterviewVideo({
                categoryName,
                videoTitle,
                videos,
            });
    
            await interviewVideo.save();
    
            return sendResponse('Interview Video added successfully', res, constant.CODE.SUCCESS, { interviewVideo }, 1);
        } catch (error) {
            console.error('Error uploading videos:', error);
            return sendResponse('Internal Server Error', res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },
    

    updateInterviewVideo: async (req, res) => {
        try {
            const { categoryName, videoTitle, videoId } = req.body;
            const { Id } = req.params; 
    
            if (!Id) return sendResponse('Interview video ID is required', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!categoryName) return sendResponse('Category name field is mandatory', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!videoTitle) return sendResponse('Video title field is mandatory', res, constant.CODE.INPUT_VALIDATION, {}, 0);
    
            // Find the existing interview video
            const interviewVideo = await InterviewVideo.findById(Id);
            if (!interviewVideo) return sendResponse('Interview video not found', res, constant.CODE.NOT_FOUND, {}, 0);
    
            // Upload a new video file to Cloudinary if provided
            let uploadedVideo = null;
            if (req.files && req.files.length > 0) {
                const file = req.files[0]; // Assuming only one file is uploaded for this update
                const fileBuffer = file.buffer; // Make sure Multer is set up for memory storage
                const originalFileName = file.originalname;
                const result = await uploadToCloudinary(fileBuffer, originalFileName);
                uploadedVideo = { videoUrl: result.secure_url };
            }
    
            // Update the fields
            interviewVideo.categoryName = categoryName;
            interviewVideo.videoTitle = videoTitle;
    
            if (uploadedVideo) {
                if (videoId) {
                    // Update the existing video with the given videoId
                    const videoIndex = interviewVideo.videos.findIndex((video) => video._id.toString() === videoId);
                    if (videoIndex !== -1) {
                        interviewVideo.videos[videoIndex].videoUrl = uploadedVideo.videoUrl;
                    } else {
                        return sendResponse('Video not found with the given ID', res, constant.CODE.NOT_FOUND, {}, 0);
                    }
                } else {
                    // Add a new video to the videos array
                    interviewVideo.videos.push(uploadedVideo);
                }
            }
    
            await interviewVideo.save();
    
            return sendResponse('Interview Video updated successfully', res, constant.CODE.SUCCESS, { interviewVideo }, 1);
        } catch (error) {
            console.error('Error updating interview video:', error);
            return sendResponse('Internal Server Error', res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },
    

    deleteInterviewVideo: async (req, res) => {
        try {
            const { Id } = req.params;

            const deletedVideo = await InterviewVideo.findByIdAndDelete(Id);

            if (!deletedVideo) {
                return sendResponse("Interview video not found", res, constant.CODE.NOT_FOUND, {}, 0);
            }

            return sendResponse("Interview video deleted successfully", res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.error(error);
            return sendResponse('Internal Server Error', res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    deleteInterviewVideoByVideoId:async(req,res)=>{
        try {
            const { Id } = req.params; // The interview video ID
            const { videoId } = req.body; // The specific video ID to be deleted
    
            if (!Id) return sendResponse('Interview video ID is required', res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!videoId) return sendResponse('Video ID is required', res, constant.CODE.INPUT_VALIDATION, {}, 0);
    
            // Use the $pull operator to remove the video from the videos array
            const updatedInterviewVideo = await InterviewVideo.findByIdAndUpdate(
                Id,
                { $pull: { videos: { _id: videoId } } },
                { new: true }
            );
    
            if (!updatedInterviewVideo) {
                return sendResponse('Interview video not found', res, constant.CODE.NOT_FOUND, {}, 0);
            }
    
            return sendResponse('Video deleted successfully from the interview video', res, constant.CODE.SUCCESS, { updatedInterviewVideo }, 1);
        } catch (error) {
            console.error('Error deleting the video:', error);
            return sendResponse('Internal Server Error', res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    getInterviewVideos: async (req, res) => {
        try {
            const search = req.query.search || '';
            const fromDate = req.query.fromDate || '';
            const toDate = req.query.toDate || '';
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
    
            const query = {};
            
            if (search) {
                query.$or = [
                    { categoryName: { $regex: new RegExp(search, 'i') } },
                    { videoTitle: { $regex: new RegExp(search, 'i') } },
                ];
            }
    
            if (fromDate && toDate) {
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); 
                query.createdAt = {
                    $gte: from,
                    $lte: to
                };
            }
                const total = await InterviewVideo.countDocuments(query);
    
            const jobposts = await InterviewVideo.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
    
            const response = {
                data: jobposts,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalList: total
            };

            return sendResponse("Interview videos fetched successfully", res, constant.CODE.SUCCESS, response, 1);
        } catch (error) {
            console.error(error);
            return sendResponse('Internal Server Error', res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    getInterviewVideoById:async(req,res)=>{
        try {
            const {Id}=req.params;

            const interviewVideo=await InterviewVideo.findById(Id)
            if(!interviewVideo) sendResponse("Data not found",res,constant.CODE.NOT_FOUND,{},0)

            return sendResponse("Data Fetch Successfully",res,constant.CODE.SUCCESS,{interviewVideo},1)
            } catch (error) {
             return sendResponse("Internal Server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },

}