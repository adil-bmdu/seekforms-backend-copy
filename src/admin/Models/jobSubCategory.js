const mongoose=require('mongoose')
const jobSubCategorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    subCategoryName:{
        type:String,
        required:true
    },
    categoryType:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    }

},{timestamps:true})

module.exports=mongoose.model('JobSubCategory',jobSubCategorySchema)