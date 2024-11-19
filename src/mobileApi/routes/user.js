const express = require('express');
const router = express.Router();
const userController = require('../../mobileApi/controllers/user')
const upload = require('../../helper/fileUpload');
const authentication = require('../../helper/jwtAuth');

router.post('/register',  userController.userRegister);

router.post('/login', userController.userLogin);

router.put('/change-password', authentication, userController.changePassword);

router.post('/forget-password', userController.forgetPassword);

router.put('/reset-password/:mobile', userController.resetPassword);

router.get('/profile', authentication, userController.profile);

router.put('/profile', authentication, userController.updateProfile)


module.exports = router;