const express=require('express');
const router=express.Router();
const complaintController=require('../controllers/complaint');
const authenticate=require('../../helper/jwtAuth');

router.post('/raise-complaint',authenticate,complaintController.createComplaint);

router.put('/update-complaint/:id',authenticate,complaintController.updateComplaint);

router.get('/complaint',authenticate,complaintController.getComplaintList);

router.delete('/delete-complaint/:id',authenticate,complaintController.deleteComplaint);


module.exports=router