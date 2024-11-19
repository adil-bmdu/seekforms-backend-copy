const bcrypt=require('bcrypt')
const constant=require('../config/constant')
const jwt = require('jsonwebtoken')
module.exports = {
    sendResponse: (msg, res,statusCode, data = null, customeCode=0,)=>{
        let finalData = {
            code: customeCode,
            statusCode:statusCode,
            message: msg,
            result: data == null ? {} : (data),
          }
        return res.status(statusCode).json(finalData);
    },
    encryptPassword: async (password) => {
        const generateSalt = await bcrypt.genSalt(constant.SALT_VALUE.value);
        return await bcrypt.hash(password, generateSalt);
      },
    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
      },
    createJwtToken: (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      },
    catchBlocks: (
      msg,
      res,
      status = 500, // Set the desired HTTP status code here
      code = 1,
      err = null,
      //requestfrom = "mobile",
      userLogin = 0
    ) => {
      return res.status(status).json({
        data: {
          status:status,
          code: code,
          message: msg,
          userLogin: userLogin,
          result: err == null ? {} : err,
        },
      });
    },

    generateOtp:()=>{
      return Math.floor(100000 + Math.random() * 900000);
    },
   generateCIN:()=> {
      const startingDigits = Math.floor(100000 + Math.random() * 900000).toString();
      return `CIN${startingDigits}`;
  }
}