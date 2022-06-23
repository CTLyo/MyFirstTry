// 查询用户信息模块
const express = require('express')
const router = express.Router()

// 导入 处理函数 模块
const userHandler = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo',userHandler.getUserInfo)
// 更新用户信息
router.post('/updateuserinfo',userHandler.updateUserInfo)
// 更新登录密码
router.post('/updatepwd',userHandler.updatepwd)

// 向外共享模块
module.exports = router