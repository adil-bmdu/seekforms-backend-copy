const mongoose=require('mongoose');
const complaintSchema=new mongoose.Schema({
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
    resolution:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:['pending','inprogress','completed'],
        default:"pending"
    }

},{timestamps:true})

module.exports=mongoose.model('Complaint',complaintSchema)