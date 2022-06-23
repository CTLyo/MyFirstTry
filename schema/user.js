// 导入定义验证规则的包
// 别人封装好的包
const joi = require('joi')

// 定义用户名和密码的验证规则
//const username = joi.string().alphanum().min(1).max(10).required()
//const password = joi.string().pattern(/^[\S]{6,20}$/).required()

const reg_login_schema = joi.object({
    username : joi.string().pattern(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/).required(),
    password : joi.string().pattern(/^[\S]{6,20}$/).required()
})

const updata_userinfo_schema = joi.object({
     id : joi.number().integer().min(1).required(),
     nickname: joi.string(),
     email: joi.string().email(),
})

const update_password_schema = joi.object({
    OldPassword : joi.string().pattern(/^[\S]{6,20}$/).required(),
    NewPassword : joi.not(joi.ref('OldPassword')).concat(joi.string().pattern(/^[\S]{6,20}$/).required())
})
//console.log(reg_login_schema.validate({ username: 'abc', password: 'sdsdfsddds' })) 
//console.log(joi.attempt({ username: '', password: 199 },reg_login_schema))

exports.reg_login_schema = reg_login_schema
exports.updata_userinfo_schema = updata_userinfo_schema
exports.update_password_schema = update_password_schema