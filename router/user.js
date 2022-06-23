// 该文件作为 用户注册登录 的 路由模块
const express = require('express')
const router = express.Router()
// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 导入joi验证表单数据的中间件
const expressJoi = require('express-joi')
const Joi = require('joi')
const schema = require('../schema/user')
// 导入需要验证规的则对象
const {reg_login_schema} = require('../schema/user')

// 注册新用户
// router.post('/reguser',(req,res)=>{
//     res.send('reguser OK')
// })
// 验证通过后流转给后面的路由处理函数
// 验证不通过则终止后面代码的执行,并抛出一个全局error,进入全局错误级别中间件处理
 //router.post('/reguser',expressJoi.joiValidate(reg_login_schema),userHandler.reguser)
router.post('/reguser',userHandler.reguser)

// 登录
// router.post('/login',(req,res)=>{
//     res.send('login OK')
// })
router.post('/login',userHandler.login)

// 将路由共享出去
module.exports = router