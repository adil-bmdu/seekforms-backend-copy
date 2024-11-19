const Complaint = require("../models/complaint");
const { sendResponse } = require('../../config/helper');
const constant = require('../../config/constant');

module.exports = {
    
    createComplaint: async (req, res) => {
        try {
            const  userId  = req.user._id;
            const { subject, description } = req.body;
            if (!subject) return sendResponse("Subject field is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!description) return sendResponse("Description field is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);

            const complaint = new Complaint({ userId, subject, description });
            await complaint.save();
            sendResponse("Complaint raised successfully", res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.error(error);
            sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    // Get a list of complaints with optional filters
    getComplaintList: async (req, res) => {
        try {
            const search = req.query.search || '';
            const fromDate = req.query.fromDate||''; 
            const toDate = req.query.toDate||'';
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
    
            const matchQuery = {};
            if (fromDate && toDate) {
                matchQuery.createdAt = { $gte: fromDate, $lte: toDate };
            }
    
            const pipeline = [
                {
                    $match: matchQuery
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: {
                        path: '$userDetails',
                        preserveNullAndEmptyArrays: true 
                    }
                },
                {
                    $sort: { createdAt: -1 } 
                }
            ];
    
            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            { 'userDetails.name': { $regex: search, $options: 'i' } },
                            { 'userDetails.email': { $regex: search, $options: 'i' } },
                            { 'userDetails.mobile': { $regex: search, $options: 'i' } },
                           
                        ]
                    }
                });
            }
    
            const totalPipeline = [...pipeline, { $count: "total" }];
            const totalResult = await Complaint.aggregate(totalPipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;
    
            pipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
    
            pipeline.push({
                $project: {
                    _id: 1,
                    subject: 1,
                    description: 1,
                    createdAt: 1,
                    resolution:1,
                    status:1,
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    userMobile: '$userDetails.mobile'
                }
            });
            const complaints = await Complaint.aggregate(pipeline);
            const totalPages = Math.ceil(total / limit);
            const response = {
                data: complaints,
                currentPage: page,
                totalPages: totalPages,
                totalList: total
            };
            console.log(complaints)
            return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS, response, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    // Update an existing complaint
    updateComplaint: async (req, res) => {
        try {
            const { id } = req.params;
            const { resolution, status } = req.body;
            const updatedField={}
            if(resolution) updatedField.resolution=resolution;
            if(status) updatedField.status=status;

            const complaint=await Complaint.findByIdAndUpdate(id,updatedField,{new:true})

            return sendResponse("Complaint updated successfully", res, constant.CODE.SUCCESS, { complaint }, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    // Delete a complaint
    deleteComplaint: async (req, res) => {
        try {
            const { id } = req.params;
            const complaint = await Complaint.findByIdAndDelete(id);
            if (!complaint) return sendResponse("Complaint not found", res, constant.CODE.NOT_FOUND, {}, 0);

            return sendResponse("Complaint deleted successfully", res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    }
};
