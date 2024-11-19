const User=require('../../mobileApi/models/user');
const constant = require('../../config/constant')
const { sendResponse } = require('../../config/helper');
const SubAdmin=require('../Models/admin')
const helper = require('../../config/helper');

module.exports={
    getUserList:async(req,res)=>{
        try {
            const search = req.query.search || '';
            const fromDate = req.query.fromDate || '';
            const toDate = req.query.toDate || '';
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
    
            const query = {};
            
            if (search) {
                query.$or = [
                    { name: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                    { mobile: { $regex: new RegExp(search, 'i') } },
                    { cinNumber: { $regex: new RegExp(search, 'i') } },
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
            const total = await User.countDocuments(query);

            const user = await User.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
    
            const response = {
                data: user,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalList: total
            };
    
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS, response, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    getSubAdminList:async(req,res)=>{
        try {
            const search = req.query.search || '';
            const fromDate = req.query.fromDate || '';
            const toDate = req.query.toDate || '';
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
    
            const query = {role:"SUBADMIN"};
            
            if (search) {
                query.$or = [
                    { username: { $regex: new RegExp(search, 'i') } },
                    { email: { $regex: new RegExp(search, 'i') } },
                    { mobileNo: { $regex: new RegExp(search, 'i') } },
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
            const total = await SubAdmin.countDocuments(query);

            const user = await SubAdmin.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .exec();
    
            const response = {
                data: user,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalList: total
            };
    
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS, response, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    updateSubAdmin:async(req,res)=>{
        try {
            const Id=req.params.Id;
            console.log(Id,"Id")
            const {username,mobileNo,email,gender,modules,password,position}=req.body;
            let hashedPassword;
            if(password)  hashedPassword = await helper.encryptPassword(password)
            const subAdmin=await SubAdmin.findByIdAndUpdate(Id,{username,mobileNo,email,gender,modules,hashedPassword,position},{new:true})
            if(!subAdmin) return sendResponse("Data not found", res, constant.CODE.NOT_FOUND, {}, 0);

            return sendResponse("Subadmin update successfully", res, constant.CODE.SUCCESS, {}, 0);
            } catch (error) {
                return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);

        }
    }
}