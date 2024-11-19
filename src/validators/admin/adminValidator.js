const { Validator } = require('node-input-validator');
const adminRegister = {
    username: 'required|string',
    email: 'required|email',
    gender:"required|string",
    position:"required|string",
    mobileNo:"required|string",
    password: 'required|string|minLength:6',
    modules:'required|array'
    
};

const adminLogin = {
    email: 'required|email',
    password: 'required|string|minLength:6',
    
};

const changePassword={
  currentPassword: 'required|string',
  newPassword: 'required|string',
  confirmPassword:  'required|string|same:newPassword'
}

const subCategory={
  categoryType:'required|string',
  categoryName: 'required|string',
  subCategoryName: 'required|string',
}


const validateSchema={
    adminRegister:adminRegister,
    adminLogin:adminLogin,
    changePassword:changePassword,
    subCategory:subCategory
}

const inputValidation = async (data,type) => {
    const v = new Validator(data, validateSchema[type]);
    const valid = await v.check();
    if (!valid) {
      return v.errors[Object.keys(v.errors)[0]].message;
    } else {
      return false;
    }
};

module.exports = {inputValidation};