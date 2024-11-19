const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');
const authenticate=require('../../helper/jwtAuth');

router.get('/user-list',authenticate,userController.getUserList);
router.get('/subadmin-list',authenticate,userController.getSubAdminList);
router.put('/update-subadmin/:Id',authenticate,userController.updateSubAdmin)

module.exports=router