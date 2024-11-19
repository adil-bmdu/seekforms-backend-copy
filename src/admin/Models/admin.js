const mongoose = require('mongoose');
const constant=require('../../config/constant')
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    role: {
        type: String, 
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNo: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    modules:{
        type:Array,
        default:null
    },
    gender:{
        type:String,
        required:true
    },
    position:{
        type:String,
        required:true
    } 
},
{
    timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;