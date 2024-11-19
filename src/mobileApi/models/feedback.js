const mongoose=require('mongoose')
const feedbackSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    message:{
        type:String,
        default:null
    }
},{timestamps:true})

module.exports=mongoose.model("Feedback",feedbackSchema)