const Admin = require('../Models/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { sendMail } = require("../../helper/mail");
const constant = require('../../config/constant')
const { sendResponse } = require('../../config/helper');
const helper = require('../../config/helper');
const { inputValidation } = require('../../validators/admin/adminValidator');
const User = require("../../mobileApi/models/user");
0
module.exports = {
    register: async (req, res) => {
        try {
            const requestValidation = await inputValidation(req.body, "adminRegister");
            if (requestValidation) return sendResponse(requestValidation, res, constant.CODE.INPUT_VALIDATION, {}, 0);

            let checkEmail = await Admin.findOne({ email: req.body.email })
            if (checkEmail) return sendResponse(constant.MESSAGE.EMAIL_ALREADY_REGISTERED, res, constant.CODE.ALREADY_EXIST, {}, 0)
            
            let checkMobile = await Admin.findOne({ mobileNo: req.body.mobileNo })
            if (checkMobile) return sendResponse("This mobile number already registered ", res, constant.CODE.ALREADY_EXIST, {}, 0)
            
            const { username, role, email, mobileNo, password,position,gender,modules } = req.body;
            const hashedPassword = await helper.encryptPassword(password)

            let admin = new Admin({ username, role, email, mobileNo, password: hashedPassword,position,gender ,role:"SUBADMIN",modules})
            await admin.save()
            
            return sendResponse(constant.MESSAGE.REGISTERED, res, constant.CODE.SUCCESS, admin, 1)
        } catch (error) {
            console.log(error);
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0)
        }

    },

    login: async (req, res) => {
        try {
            const requestValidation = await inputValidation(req.body, "adminLogin");
            if (requestValidation) return sendResponse(requestValidation, res, constant.CODE.INPUT_VALIDATION, {}, 0);

            const isUserExist = await Admin.findOne({ email: req.body.email });
            if (!isUserExist) return sendResponse(constant.MESSAGE.INVALID_USER, res, constant.CODE.SUCCESS, {}, 0);

            const checkPassword = await helper.comparePassword(req.body.password, isUserExist.password);
            if (!checkPassword) return sendResponse(constant.MESSAGE.INCORRECT_PASS, res, constant.CODE.AUTH, {}, 0);

            const { _id, username, email, role } = isUserExist
            const token = helper.createJwtToken({ _id, username, email, role })

            return sendResponse(constant.MESSAGE.LOGIN, res, constant.CODE.SUCCESS, { user:isUserExist,token:token }, 1);
        } catch (error) {
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    changePassword: async (req, res) => {
        try {
            const requestValidation = await inputValidation(req.body, "changePassword");
            if (requestValidation) return sendResponse(requestValidation, res, constant.CODE.INPUT_VALIDATION, {}, 0);

            if (!req.user) return sendResponse(constant.MESSAGE.Unauthorized, res, constant.CODE.AUTH, {}, 0);

            const { _id } = req.user
            const isUserExist = await Admin.findById({ _id: _id });
            if (!isUserExist) return sendResponse(constant.MESSAGE.EMAIL_NOT_REGISTERED, res, constant.CODE.SUCCESS, {}, 0);

            const checkPassword = await helper.comparePassword(req.body.currentPassword, isUserExist.password);
            if (!checkPassword) return sendResponse(constant.MESSAGE.CURR_INCORRECT_PASS, res, constant.CODE.AUTH, {}, 0);

            const hashPassword = await helper.encryptPassword(req.body.newPassword)

            const result = await Admin.findOneAndUpdate({ _id: _id }, { $set: { password: hashPassword } }, { new: true });

            return sendResponse(constant.MESSAGE.PASSWORD_UPDATE, res, constant.CODE.SUCCESS, { result }, 1);
        } catch (error) {
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);
        }
    },

    forgotPassword: async (req, res) => {
        try {
            
            const email = req.body.email ? req.body.email.toLowerCase() : {};
            
            const adminData = await Admin.findOne({ email: email });
            

            if (!adminData)
                return sendResponse(constant.MESSAGE.EMAIL_NOT_REGISTERED, res, constant.CODE.SUCCESS, {}, constant.CODE.NOT_EXIST)

            const token = jwt.sign({ email: adminData.email, _id: adminData._id },
                process.env.JWT_SECRET_KEY,
                {
                    algorithm: "HS256",
                    expiresIn: "300s",
                });


            const sendvar = await sendMail(res, {
                name: adminData.username,
                email,
                subject: "Password Reset Link",
                link: `${process.env.ADMIN_RESET_PASSWORD_URL}/${token}`,

            });

            return sendResponse(constant.MESSAGE.EMAIL_SEND, res, constant.CODE.SUCCESS, {}, 1);
        } catch (error) {
            console.log(error)
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0)
        }
    },

    resetPassword: async (req, res) => {
        try {
            // validation
            const error = await inputValidation(req.body, "resetPassword");
            if (error) return sendResponse(error, res, constant.CODE.INPUT_VALIDATION, {}, 0);

            const { token, confirmPassword } = req.body;

            // checks token is expired or not
            const tokenValidation = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY,
                (error, valid) => {
                    if (error) {
                        return sendResponse(constant.MESSAGE.EXPIRE_LINK, res, constant.CODE.SUCCESS, {}, 0);
                    } else {
                        return valid;
                    }
                }
            );

            if (tokenValidation) {
                // bcrypt admin's password
                const hashPassword = await bcrypt.hash(
                    confirmPassword,
                    +constant.SALT_VALUE.value
                );
                await Admin.findOneAndUpdate(
                    { email: tokenValidation.email },
                    { $set: { password: hashPassword } }
                );
                return sendResponse(constant.MESSAGE.PASSWORD_UPDATE, res, constant.CODE.SUCCESS, {}, 1)
            }
        } catch (error) {
            console.log(error)
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0)

        }
    },

    getUsers: async (req, res) => {
        try {
            const users = await User.find();
            //console.log(users);
            res.json(users);
        } catch (error) {
            console.log(error);
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0)
        }

    },
    getAdmin: async (req, res) => {
        try {

            if (!req.user) return sendResponse(constant.MESSAGE.Unauthorized, res, constant.CODE.AUTH, {}, 0);

            const { _id } = req.user;

            const userProfile = await Admin.findById({ _id: _id });
            if (!userProfile) return sendResponse(constant.MESSAGE.EMAIL_NOT_REGISTERED, res, constant.CODE.SUCCESS, {}, 0);

            return sendResponse(constant.MESSAGE.FETCH, res, constant.CODE.SUCCESS, { userProfile }, 1);

        } catch (error) {
            return sendResponse(error.message, res, constant.CODE.INTERNAL_SERVER_ERROR, {}, 0);

        }
    },

}