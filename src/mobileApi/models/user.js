const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        trim:true
    },
    profileImage:{
        type:String,
        default:null
    },
    cin_number:{
        type:String,
        required:true
    }
    
},{timestamps:true});

const User = mongoose.model('User', userSchema);

module.exports = User;
