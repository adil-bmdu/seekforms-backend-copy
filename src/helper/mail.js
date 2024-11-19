const nodemailer = require("nodemailer");
const { sendResponse } = require("../config/helper")
require("dotenv").config();

const { MAIL_USERNAME, MAIL_PASSWORD } = process.env;
const authUP = {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD
}

const sendMail = async (res, data) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: authUP,
        tls: {
            rejectUnauthorized: false
        }
    });

    const mailFormat = {   
        from: MAIL_USERNAME,
        to: data.email,
        subject: data.subject,
        html: `<table width="100%" height="100%" border="0" cellspacing="0" bgcolor="#E5E5E5" cellpadding="0" align="center" style="border-collapse:collapse" > <tbody> <tr> <td valign="top" align="center" height="10"></td> </tr> <tr> <td valign="top" align="center" width="600"> <table border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse;border:1px solid #f0f1f6" > <tbody> <tr> <td width="600" valign="top" align="center" style="max-width:600px" bgcolor="#ffffff" > <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse" > <tbody> <tr> <td valign="top" align="center" bgcolor="#ffffff" style="border-bottom:1px solid #ecf1f8" > <table width="95%" align="center" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse" > <tbody> <tr> <td valign="top" height="24"></td> </tr> <tr> <td valign="top" align="center"> <table width="100%" border="0" cellspacing="0" cellpadding="0" > <tbody> <tr> <td valign="middle" align="left"> <table width="105" align="left" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse" > <tbody> <tr> <td height="20" valign="bottom" > <a href=${`${process.env.ADMIN_RESET_PASSWORD_URL}`} style="text-decoration:none" target="_blank" > <img src="https://i.pinimg.com/originals/66/08/90/66089002defc31c6fc8f36e4252b25ca.jpg" width="40" alt=Balaji Security border="0" style="font-family:'Roboto',Arial;font-size:13px;text-align:left;color:#006ab9;width:7rem;" class="CToWUd" data-bit="iit" /> </a> </td> </tr> </tbody> </table> </td> <td valign="middle" align="right"> <table align="right" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse" > <tbody></tbody> </table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td valign="top" height="17"></td> </tr> </tbody> </table> </td> </tr> <tr> <td align="center" valign="top"> <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse" > <tbody> <tr> <td valign="top" align="center"> <table width="100%" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse" > <tbody> <tr> <td valign="top" align="center"> <table width="100%" align="center" cellpadding="0" cellspacing="0" style="border-collapse:collapse" > <tbody> <tr> <td align="center" valign="top" bgcolor="#ffffff" > <table width="90%" align="center" cellpadding="0" cellspacing="0" style="max-width:460px" > <tbody> <tr> <td width="440" height="24" ></td> </tr> <tr> <td align="center"> <img src="https://ride-chef-dev.s3.ap-south-1.amazonaws.com/cephalgo/images/1685857290014.png" width="45" alt="reset password" class="CToWUd" data-bit="iit" style="width:10rem;" /> </td> </tr> <tr> <td height="20"></td> </tr> <tr> <td style="font-family:'Roboto Slab',Arial,Helvetica,sans-serif;font-size:23px;text-align:center;color:#1b2437;font-weight:700;line-height:30px" valign="top" align="center" > <span class="il"> Reset </span> your password </td> </tr> <tr> <td height="6"></td> </tr> <tr> <td height="6"></td> </tr> <tr> <td style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:15px;text-align:center;color:#445578;font-weight:400;line-height:22px;"> Dear ${data.name}, A request has been received to change the password for your account. </td> </tr> <tr> <td height="6"></td> </tr> <tr> <td style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:15px;text-align:center;color:#445578;font-weight:400;line-height:22px" valign="top" align="center" > This link will be valid for one-time use for the next 72 hours. </td> </tr> <tr> <td height="12"></td> </tr> <tr> <td valign="top" align="center" > <table style="border-collapse:collapse;border-radius:50px;color:#ffffff" width="197" cellspacing="0" cellpadding="0" bgcolor="#7FA28A" align="center" > <tbody> <tr> <td width="5"></td> <td valign="middle" height="40" align="center" > <a href=${data.link} style="font-family:'Roboto',Arial,Helvetica,sans-serif;text-decoration:none;font-size:15px;display:block;text-align:center;color:#ffffff;font-weight:500;line-height:40px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=${data.link}&source=gmail&ust=1686397462806000&usg=AOvVaw2saVSgl3USj9EyKCWL-uV4" > Create a new password </a> </td><td width="5"></td> </tr> </tbody> </table> </td> </tr> <tr> <td height="28"></td> </tr> <tr> <td style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:14px;text-align:center;color:#000;font-weight:400;line-height:22px;"> if you have problems accessing url please copy and paste the link below into your browser </td> </tr><tr> <td style="font-family:'Roboto',Arial,Helvetica,sans-serif;font-size:14px;text-align:center;color:#445578;font-weight:400;line-height:22px;"> <a href=${data.link} target="_blank" style="white-space:pre-wrap;word-break:break-all" data-saferedirecturl="https://www.google.com/url?q=${data.link}&source=gmail&ust=1686397462806000&usg=AOvVaw2saVSgl3USj9EyKCWL-uV4">${data.link}</a> </td> </tr> <tr> <td height="28"></td> </tr> <tr> <td align="center"> <table border="0" align="center" cellpadding="0" cellspacing="0" > <tbody> <tr> <td width="400" align="center" style="border:1px solid #eaf1f5;border-radius:10px" > <table width="88%" border="0" align="center" cellpadding="0" cellspacing="0" ></table> </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="32"></td> </tr> <tr> <td height="16"></td> </tr> <tr> <td height="15"></td> </tr> <tr> <td align="center"> <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0" > <tbody> <tr> <td style="font-family:'Roboto',Arial;text-align:center;font-size:10px;line-height:14px;color:#8292b4;font-weight:400" valign="top" align="center" > ${`You have received this mail because your e-mail ID is registered with Balaji . This is a system-generated e-mail, please don't reply to this message.`} </td> </tr> </tbody> </table> </td> </tr> <tr> <td height="45"></td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr>  <tr> <td valign="top" align="center" height="10"></td> </tr> </tbody> </table>`
    };

    await transporter.sendMail(mailFormat, function (error, info) {
        if (error) {
            return sendResponse(error, res, 500, {}, 0)
        }
      //  console.log(info);
    });
    
};

module.exports = { sendMail };
