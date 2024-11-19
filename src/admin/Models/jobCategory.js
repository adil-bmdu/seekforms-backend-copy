const mongoose=require('mongoose')
const JobCategorySchema=new mongoose.Schema({
    categoryName:{
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
    },
    image:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('JobCategory',JobCategorySchema)