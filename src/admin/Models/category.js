const mongoose=require('mongoose')
const categorySchema=new mongoose.Schema({
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
    }
},{timestamps:true})

module.exports=mongoose.model('Category',categorySchema)