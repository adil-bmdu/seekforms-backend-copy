const mongoose=require('mongoose');
const applicantSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    jobpostId:{
        type:mongoose.Types.ObjectId,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model('Applicant',applicantSchema)