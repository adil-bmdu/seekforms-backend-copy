const SubCategory=require('../Models/jobSubCategory')
const constant = require('../../config/constant')
const { sendResponse } = require('../../config/helper');
const { inputValidation } = require('../../validators/admin/adminValidator');
module.exports={
    addSubCategory:async(req,res)=>{
        try {
            const requestValidation = await inputValidation(req.body, "subCategory");
            if (requestValidation) return sendResponse(requestValidation, res, constant.CODE.INPUT_VALIDATION, {}, 0);

            const subcategory=new SubCategory(req.body)
            await subcategory.save();
            return sendResponse("Subcategory add successfully",res,constant.CODE.SUCCESS,{subcategory},1)
        } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    updateSubCategory:async(req,res)=>{
        try {
            const {subcategoryId}=req.params;
            const {categoryName,categoryType,subCategoryName,status}=req.body;
            let updatedField={}
            if(categoryName) updatedField.categoryName=categoryName;
            if(categoryType) updatedField.categoryType=categoryType;
            if(subCategoryName) updatedField.subCategoryName=subCategoryName;
            if(status) updatedField.status=status;
            const subcategory=await SubCategory.findByIdAndUpdate(subcategoryId,updatedField,{new:true})
            if(!subcategory) return sendResponse("Subcategory not found",res,constant.CODE.NOT_FOUND,{},0);
            return sendResponse("Subcategory updated successfully",res,constant.CODE.SUCCESS,{subcategory},1);
        } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    getSubCategory:async(req,res)=>{
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search=req.query.search||'';
            const fromDate=req.query.fromDate||'';
            const toDate=req.query.toDate||''
            const query={}
            if (search) {
            query.$or = [
                { categoryName: { $regex: new RegExp(search, 'i') } },
                { subCategoryName: { $regex: new RegExp(search, 'i') } },
                { categoryType: { $regex: new RegExp(search, 'i') } },            
            
            ]}
                if(fromDate&&toDate){
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); 
                query.createdAt={
                    $gte: from,
                    $lte: to
                }
            }
            const totalsubcategory = await SubCategory.countDocuments(query);

            const subcategory = await SubCategory.find(query).skip((page - 1) * limit).limit(limit).exec();
      
            const response = {
                data:subcategory,
                currentPage: page,
                totalPages: Math.ceil(totalsubcategory / limit),
                totalList:totalsubcategory
            };
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,response, 1);

                } catch (error) {
                    console.log(error)
                    return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }

    },

    
    deleteSubCategory:async(req,res)=>{
        try {
            const {subcategoryId}=req.params;
            const subcategory=await SubCategory.findByIdAndDelete(subcategoryId)
            if(!subcategory) return sendResponse("Subcategory not found",res,constant.CODE.NOT_FOUND,{},0);
            return sendResponse("Subcategory deleted successfully", res, constant.CODE.SUCCESS,{}, 1);
        } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
        }
    },
    getAllSubCategory:async(req,res)=>{
        try {
            const categoryName=req.query.categoryName;
            const category = await SubCategory.find({categoryName:categoryName}).select('_id categoryName subCategoryName')
        return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS,{data:category}, 1);
            } catch (error) {
            console.log(error)
            return sendResponse("Internal server Error",res,constant.CODE.INTERNAL_SERVER_ERROR,{},0)
    }
    }
}