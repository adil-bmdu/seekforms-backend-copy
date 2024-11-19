const express= require('express')
const router= express.Router();
const authenticate=require('../../helper/jwtAuth')
const adminContoller=require('../controllers/adminController');

router.post('/sub-admin', adminContoller.register);

router.post('/login', adminContoller.login);

router.put('/change-password',authenticate,adminContoller.changePassword);

router.post('/forget-password',adminContoller.forgotPassword);

router.post('/reset-password',adminContoller.resetPassword);

router.get('/profile',authenticate,adminContoller.getAdmin);

module.exports=router