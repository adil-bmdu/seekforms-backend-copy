const Category=require('../Models/jobCategory')
const constant = require('../../config/constant')
const { sendResponse } = require('../../config/helper');
const{ uploadToCloudinary}=require('../../helper/cloudinary')

module.exports={
    addCategory: async (req, res) => {
        try {
            if (!req.body.categoryName) return sendResponse("Category name is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!req.body.categoryType) return sendResponse("Category type is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!req.body.color) return sendResponse("Color Name is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!req.file) return sendResponse("Image is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            
            // Upload image to Cloudinary
            const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
            if (uploadResult?.http_code === 400) {
                return sendResponse("Error during file upload", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            }
            const categoryData = {
                ...req.body,
                image: uploadResult.secure_url
            };
            const category = new Category(categoryData);
            await category.save();
    
            return sendResponse("Category added successfully", res, constant.CODE.SUCCESS, { category }, 1);
        } catch (error) {
            console.error("Error in addCategory:", error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },
    
    updateCategory:async(req,res)=>{
        try {
            const {categoryId}=req.params;
            const bodyData={...req.body};
            let result;
            if (req.file) {
                 result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
                 if(result?.http_code==400) return sendResponse("error during upload file", res, constant.CODE.INPUT_VALIDATION, {}, 0);
                 bodyData.image=result.secure_url
            }
            const category=await Category.findByIdAndUpdate(categoryId,bodyData,{new:true})
            if(!category) return sendResponse("Category not found",res,constant.CODE.NOT_FOUND,{},0);
            return sendResponse("Category updated successfully",res,constant.CODE.SUCCESS,{category},1);
        } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    getCategory:async(req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const name=req.query.search||'';
            const fromDate=req.query.fromDate||'';
            const toDate=req.query.toDate||''
            const query={}
            if(name) query.name={ $regex: new RegExp(name, 'i') };
            if(fromDate&&toDate){
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); 
                query.createdAt={
                    $gte: from,
                    $lte: to
                }
            }
            const totalcategory = await Category.countDocuments(query);

            const category = await Category.find(query).sort({createdAt:-1}).skip((page - 1) * limit).limit(limit).exec();
      
            const response = {
                data:category,
                currentPage: page,
                totalPages: Math.ceil(totalcategory / limit),
                totalList:totalcategory
            };
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,response, 1);

                } catch (error) {
                    console.log(error)
                    return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }

    },

    deleCategory:async(req,res)=>{
        try {
            const {categoryId}=req.params;
            const category=await Category.findByIdAndDelete(categoryId)
            if(!category) return sendResponse("Category not found",res,constant.CODE.NOT_FOUND,{},0);
            return sendResponse("category deleted successfully", res, constant.CODE.SUCCESS,{}, 1);
        } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    getGovernmentCategory:async(req,res)=>{
        try {
                const category = await Category.find({categoryType:"Government",status:'active'})
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,{data:category}, 1);
                } catch (error) {
                console.log(error)
                return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    getAllCategory:async(req,res)=>{
        try {
            const category = await Category.find().select('_id categoryName').sort({created:-1})
        return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,{data:category}, 1);
            } catch (error) {
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
    }
    }
}