const Feedback=require('../models/feedback');
const { sendResponse}  = require("../../config/helper");
const constant=require('../../config/constant');

module.exports = {
    createFeedback: async (req, res) => {
        try {
            const  userId  = req.user._id;
            const { subject, description } = req.body;
            if (!subject) return sendResponse("Subject field is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);
            if (!description) return sendResponse("Description field is mandatory", res, constant.CODE.INPUT_VALIDATION, {}, 0);

            const feedback = new Feedback({ userId, subject, description });
            await feedback.save();
            sendResponse("Feedback raised successfully", res, constant.CODE.SUCCESS, {feedback}, 1);
        } catch (error) {
            console.error(error);
            sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },


getFeedbackList: async (req, res) => {
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
        const totalResult = await Feedback.aggregate(totalPipeline);
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
                userName: '$userDetails.name',
                userEmail: '$userDetails.email',
                userMobile: '$userDetails.mobile'
            }
        });
        const feedbacks = await Feedback.aggregate(pipeline);
        const totalPages = Math.ceil(total / limit);
        const response = {
            data: feedbacks,
            currentPage: page,
            totalPages: totalPages,
            totalList: total
        };

        return sendResponse("Data fetched successfully", res, constant.CODE.SUCCESS, response, 1);
    } catch (error) {
        console.error(error);
        return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
    }
},

    updateFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const { subject, description } = req.body;
            const feedback=await Feedback.findByIdAndUpdate(id,{subject,description},{new:true})
            if (!feedback) return sendResponse("Feedback not found", res, constant.CODE.NOT_FOUND, {}, 0); 

            return sendResponse("Feedback updated successfully", res, constant.CODE.SUCCESS, { feedback }, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    // Delete a Feedback
    deleteFeedback: async (req, res) => {
        try {
            const { id } = req.params;
            const feedback = await Feedback.findByIdAndDelete(id);
            if (!feedback) return sendResponse("Feedback not found", res, constant.CODE.NOT_FOUND, {}, 0);

            return sendResponse("Feedback deleted successfully", res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.error(error);
            return sendResponse("Internal Server Error", res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    }
};