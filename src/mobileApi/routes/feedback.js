const express=require('express');
const router=express.Router();
const feedbackController=require('../controllers/feedback');
const authenticate=require('../../helper/jwtAuth')
router.post('/add-feedback',authenticate,feedbackController.createFeedback);

router.put('/update-feedback/:id',authenticate,feedbackController.updateFeedback);

router.get('/feedback',authenticate,feedbackController.getFeedbackList);

router.delete('/delete-feedback/:id',authenticate,feedbackController.deleteFeedback);


module.exports=router;
