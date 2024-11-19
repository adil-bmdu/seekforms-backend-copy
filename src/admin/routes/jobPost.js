const express=require('express')
const router=express.Router();
const jobPostController=require('../controllers/jobPostController')
const categoryController=require('../controllers/categoryController');
const subCategoryController=require('../controllers/jobpostSubCategory');
const authenticate=require('../../helper/jwtAuth');
const upload=require('../../helper/fileUpload')
// ======================================job post category api===================================

router.post('/add-category',upload.single('image'),authenticate,categoryController.addCategory);

router.put('/update-category/:categoryId',upload.single('image'),authenticate,categoryController.updateCategory);

router.get('/category',authenticate,categoryController.getCategory);

router.get('/category-list',authenticate,categoryController.getAllCategory);

router.get('/government-category',authenticate,categoryController.getGovernmentCategory);

router.delete('/delete-category/:categoryId',authenticate,categoryController.deleCategory);

// ====================================== job post category api===================================

router.post('/add-subcategory',authenticate,subCategoryController.addSubCategory);

router.put('/update-subcategory/:subcategoryId',authenticate,subCategoryController.updateSubCategory);

router.get('/subcategory',authenticate,subCategoryController.getSubCategory);

router.get('/subcategory-list',authenticate,subCategoryController.getAllSubCategory);

router.delete('/delete-subcategory/:subcategoryId',authenticate,subCategoryController.deleteSubCategory);

//===============================job post api=======================================

router.post('/create-jobpost',upload.single('companyLogo'),authenticate,jobPostController.createJobPost);

router.put('/update-jobpost/:Id',upload.single('companyLogo'),authenticate,jobPostController.updateJobPost);

router.get('/jobpost',authenticate,jobPostController.getJobPostList);

router.get('/jobpost-by-id/:Id',authenticate,jobPostController.getJobPostById);

router.get('/jobpost-list',authenticate,jobPostController.getJobPostForApp)

router.get('/government-job-list',authenticate,jobPostController.getJobForGovernment)

router.delete('/delete-jobpost/:Id',authenticate,jobPostController.deleteJobPost);

module.exports=router;