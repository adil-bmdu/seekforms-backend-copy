const express= require('express')
const router= express.Router();
const authenticate=require('../../helper/jwtAuth')
const categoryController=require('../controllers/categoryController');

router.post('/add-category',authenticate,categoryController.addCategory);

router.put('/update-category/:categoryId',authenticate,categoryController.updateCategory);

router.get('/category',authenticate,categoryController.getCategory);

router.delete('/delete-category/:categoryId',authenticate,categoryController.deleCategory)

module.exports=router