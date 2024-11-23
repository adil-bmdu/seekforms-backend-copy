const User = require("../models/user");
const { inputValidation } = require("../../validators/api/userValidator");
const { sendResponse } = require("../../config/helper");
const constant = require("../../config/constant");
const helper = require("../../config/helper");
const OTP = require("../models/otp");
module.exports = {
  userRegister: async (req, res) => {
    try {
      const requestValidation = await inputValidation(req.body, "userRegister");
      if (requestValidation)
        return sendResponse(
          requestValidation,
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );

      const isUserMobileExist = await User.findOne({
        mobile: req.body.mobile.trim(),
      });
      if (isUserMobileExist)
        return sendResponse(
          constant.MESSAGE.MOBILE_ALREADY_EXIST,
          res,
          constant.CODE.EMAILEXIST,
          {},
          0
        );

      const isUserEmailExist = await User.findOne({
        email: req.body.email.trim().toLowerCase(),
      });
      if (isUserEmailExist)
        return sendResponse(
          constant.MESSAGE.EMAIL_ALREADY_EXIST,
          res,
          constant.CODE.EMAILEXIST,
          {},
          0
        );

      const cin_number = helper.generateCIN();
      const { name, email, password, mobile } = req.body;

      const newPassword = await helper.encryptPassword(password);
      const userObj = {
        name,
        email: email.trim().toLowerCase(),
        password: newPassword,
        mobile,
        cin_number,
      };

      const userSaved = new User(userObj);
      await userSaved.save();

      console.log(userSaved);

      return sendResponse(
        constant.MESSAGE.REGISTERED,
        res,
        constant.CODE.SUCCESS,
        { user: userSaved },
        1
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        { error },
        0
      );
    }
  },

  userLogin: async (req, res) => {
    try {
      const requestValidation = await inputValidation(req.body, "userLogin");
      if (requestValidation)
        return sendResponse(
          requestValidation,
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );

      const user = await User.findOne({ mobile: req.body.mobile.trim() });
      if (!user)
        return sendResponse(
          constant.MESSAGE.INVALID_USER,
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );

      const checkPassword = await helper.comparePassword(
        req.body.password,
        user.password
      );
      if (!checkPassword)
        return sendResponse(
          constant.MESSAGE.INCORRECT_PASS,
          res,
          constant.CODE.AUTH,
          {},
          0
        );

      const { mobile, _id } = user;
      const token = helper.createJwtToken({ mobile, _id });

      return sendResponse(
        constant.MESSAGE.LOGIN,
        res,
        constant.CODE.SUCCESS,
        { user, token: token },
        1
      );
    } catch (error) {
      return sendResponse(
        error.message,
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  changePassword: async (req, res) => {
    try {
      const requestValidation = await inputValidation(
        req.body,
        "changePassword"
      );
      if (requestValidation)
        return sendResponse(
          requestValidation,
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );

      if (!req.user)
        return sendResponse(
          constant.MESSAGE.Unauthorized,
          res,
          constant.CODE.AUTH,
          {},
          0
        );

      const { _id } = req.user;
      const isUserExist = await User.findById({ _id: _id });
      if (!isUserExist)
        return sendResponse(
          constant.MESSAGE.EMAIL_NOT_REGISTERED,
          res,
          constant.CODE.NOT_EXIST,
          {},
          0
        );

      const checkPassword = await helper.comparePassword(
        req.body.currentPassword,
        isUserExist.password
      );
      if (!checkPassword)
        return sendResponse(
          constant.MESSAGE.CURR_INCORRECT_PASS,
          res,
          constant.CODE.AUTH,
          {},
          0
        );

      const hashPassword = await helper.encryptPassword(req.body.newPassword);

      const result = await User.findOneAndUpdate(
        { _id: _id },
        { $set: { password: hashPassword } },
        { new: true }
      );

      return sendResponse(
        constant.MESSAGE.PASSWORD_UPDATE,
        res,
        constant.CODE.SUCCESS,
        { result },
        1
      );
    } catch (error) {
      return sendResponse(
        error.message,
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  forgetPassword: async (req, res) => {
    try {
      if (!req.body.mobile)
        return sendResponse(
          "Mobile Number is Mandatory",
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );
      const mobile = req.body.mobile.trim();
      const user = await User.findOne({ mobile: req.body.mobile });
      if (!user)
        return sendResponse(
          constant.MESSAGE.USER_NOT_FOUND,
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );

      const otp = helper.generateOtp();
      const savedOtp = await OTP.findOneAndUpdate(
        { mobile: req.body.mobile },
        { mobile, otp },
        { upsert: true, new: true }
      );
      return sendResponse(
        "Otp Send successfully",
        res,
        constant.CODE.SUCCESS,
        { savedOtp },
        1
      );
    } catch (error) {
      console.log(error);
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  resetPassword: async (req, res) => {
    try {
      const mobile = req.params.mobile?.trim();
      if (!mobile)
        return sendResponse(
          "Mobile Number is Mandatory",
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );

      const requestValidation = await inputValidation(
        req.body,
        "resetPassword"
      );
      if (requestValidation)
        return sendResponse(
          requestValidation,
          res,
          constant.CODE.INPUT_VALIDATION,
          {},
          0
        );

      const hashedPassword = await helper.encryptPassword(req.body.newPassword);
      const user = await User.findOneAndUpdate(
        { mobile },
        { $set: { password: hashedPassword } },
        { new: false }
      );

      if (!user)
        return sendResponse(
          constant.MESSAGE.USER_NOT_FOUND,
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );

      return sendResponse(
        "Password updated successfully",
        res,
        constant.CODE.SUCCESS,
        {},
        1
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  profile: async (req, res) => {
    try {
      const { _id } = req.user;

      const userProfile = await User.findById({ _id: _id });
      if (!userProfile)
        return sendResponse(
          constant.MESSAGE.EMAIL_NOT_REGISTERED,
          res,
          constant.CODE.SUCCESS,
          {},
          0
        );

      return sendResponse(
        "Profile data fetched successfully",
        res,
        constant.CODE.SUCCESS,
        { userProfile },
        1
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { _id } = req.user;
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.mobile) updateData.mobile = req.body.mobile;
      if (req.body.education) updateData.education = req.body.education;
      if (req.body.address) updateData.address = req.body.address;
      if (req.body.profession) updateData.profession = req.body.profession;

      const user = await User.findByIdAndUpdate(_id, updateData, { new: true });
      if (!user)
        return sendResponse(
          constant.MESSAGE.USER_NOT_FOUND,
          res,
          constant.CODE.NOT_FOUND,
          {},
          0
        );
      return sendResponse(
        "Profile updated successfully",
        res,
        constant.CODE.SUCCESS,
        { user },
        1
      );
    } catch (error) {
      return sendResponse(
        "Internal Server Error",
        res,
        constant.CODE.INTERNAL_SERVER_ERROR,
        {},
        0
      );
    }
  },
};
