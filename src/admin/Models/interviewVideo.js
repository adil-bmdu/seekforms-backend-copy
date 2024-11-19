const mongoose=require('mongoose');
const interviewVideosSchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true
    },
    videoTitle:{
        type:String,
        required:true
    },
    videos: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, // This will automatically generate a unique ID for each video
            default: () => new mongoose.Types.ObjectId() // Assign a new ObjectId if not provided
        },
        videoUrl: { // Change 'type' to a descriptive field name like videoUrl
            type: String,
            required: true
        }
    }]
},{timestamps:true})

module.exports=mongoose.model('InterviewVideo',interviewVideosSchema)