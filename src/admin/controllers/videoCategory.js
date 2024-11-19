const VideoCategory = require('../Models/videoCategory');
const constant = require('../../config/constant');
const { sendResponse } = require('../../config/helper');
const{ uploadToCloudinary}=require('../../helper/cloudinary')
module.exports = {
    // Create a new video category
    createVideoCategory: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) return sendResponse("Category name field is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!req.file) return sendResponse("Please select an image", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
            if(result.http_code==400) return sendResponse("error during upload file", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            const videoCategory = new VideoCategory({
                name,
                image: result.secure_url
            });

            await videoCategory.save();

        // Upload the file to Cloudinary
            return sendResponse("Video category added successfully", res, constant.CODE.SUCCESS, {videoCategory}, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, { error }, 0);
        }
    },

    updateVideoCategory: async (req, res) => {
        try {
            const { Id } = req.params; 
            const { name } = req.body;
            const updateData = {};

            if (name) updateData.name = name;
            if (req.file) {
                const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
                if(result.http_code==400) return sendResponse("", res, constant.CODE.INPUT_VALIDATION, {}, 0);
                updateData.image=result.secure_url
            } 

            const updatedCategory = await VideoCategory.findByIdAndUpdate(Id, updateData, { new: true });
            if (!updatedCategory) {
                return sendResponse("Video category not found", res, constant.CODE.NOT_FOUND, {}, 0);
            }

            return sendResponse("Video category updated successfully", res, constant.CODE.SUCCESS, updatedCategory, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, { error }, 0);
        }
    },

    getVideoCategory: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search=req.query.search||'';
            const fromDate=req.query.fromDate||'';
            const toDate=req.query.toDate||''
            const query={}
            if (search)  query.name={ $regex: new RegExp(search, 'i') };
                if(fromDate&&toDate){
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); 
                query.createdAt={
                    $gte: from,
                    $lte: to
                }
            }
            const totalvideocategory = await VideoCategory.countDocuments(query);

            const videocategory = await VideoCategory.find(query).skip((page - 1) * limit).limit(limit).exec();
      
            const response = {
                data:videocategory,
                currentPage: page,
                totalPages: Math.ceil(totalvideocategory / limit),
                totalList:totalvideocategory
            };
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,response, 1);

                } catch (error) {
                    console.log(error)
                    return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },

    deleteVideoCategory: async (req, res) => {
        try {
            const { Id } = req.params;
            const deletedCategory = await VideoCategory.findByIdAndDelete(Id);
            if (!deletedCategory) {
                return sendResponse("Video category not found", res, constant.CODE.NOT_FOUND, {}, 0);
            }

            return sendResponse("Video category deleted successfully", res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, { error }, 0);
        }
    }
};
