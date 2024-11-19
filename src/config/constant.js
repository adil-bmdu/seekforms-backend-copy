const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 200,
};
const SALT_VALUE = {
    value: 10
};

const CODE={
    AUTH: 401,
    SUCCESS: 200,
    NOT_FOUND:404,
    PARAMETER_MISSING: 418,
    NOT_EXIST: 413,
    ID_NOT_EXIST: 416,
    ALREADY_EXIST: 409,
    INVALID_PHONE_CODE: 411,
    INVALID_EMAIL: 402,
    EMAILEXIST: 421,
    PHONEEXIST: 422,
    INCORRECT_PASSWORD: 422,
    INCORRECT_TEXT: 423,
    BLOCKED: 425,
    INTERNAL_SERVER_ERROR: 500,
    INPUT_VALIDATION: 403
}

const MESSAGE = {
    SUCCESS: 'Success',
    INTERNAL_ERROR: 'Something went wrong please try after some time',
    ACCOUNT_DELETE: 'Your account has been deleted, please contact admin to reactivate',
    ACCOUNT_BLOCK: "You are blocked by Admin, please contact admin for more details",
    SENT_OTP: 'Otp sent successfully',
    INVALID_OTP: 'Invalid OTP',
    Unauthorized: 'Unauthorized Token',
    EMAIL_ALREADY_REGISTERED: "This email is already registered",
    EMAIL_NOT_REGISTERED: "This email is not registered.",
    REGISTERED: "Registered Successfully.",
    LOGIN: "Login Successfully",
    INCORRECT_PASS: "You have entered incorrect password.",
    CURR_INCORRECT_PASS: "Current password is incorrect.",
    PASSWORD_UPDATE: "Password updated successfully",
    INTERNAL_ERROR: 'Something went wrong please try after some time',
    SENT_OTP: 'Otp sent successfully',
    INVALID_OTP: 'Invalid OTP',
    Unauthorized: 'Unauthorized Token',
    PROFILE_UPDATE: "Profile updated successfully",
    INVALID_USER: 'These credentials do not match our records.',
    ADD: " added successfully",
    UPDATE: "updated successfully",
    FETCH:"Data fetch successfully",
    INVALID_FIELD: 'Invalid input addressId is required with makeDefault',
    EMAIL_ALREADY_EXIST:"Email already exist",
    MOBILE_ALREADY_EXIST:"Mobile already exist",
    EXPIRE_LINK: "Reset link has been expired",
    USER_NOT_FOUND:"User not found"

}

const ADMIN_TYPE = {
    admin: "ADMIN",
    subAdmin: "SUBADMIN",
    user: 3
}
module.exports = Object.freeze({
    STATUS_CODE,
    CODE,
    SALT_VALUE,
    MESSAGE,
    ADMIN_TYPE
});