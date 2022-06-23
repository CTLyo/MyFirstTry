// 导入express
const express = require('express')
// 导入cors
const cors = require('cors')
// 导入 Joi
const Joi = require('joi')
// 导入express-jwt 用于解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')




// 创建服务器实例对象
const app = express()
// 注册cors中间件
app.use(cors())
// 配置解析 格式的表单数据
app.use(express.urlencoded({extended:false}))

// 注册express-jwt  以/api开头的请求不用 token权限
app.use(expressJWT({secret:config.jwtSecreKey,algorithms: ["HS256"]}).unless({ path: [/^\/api\//] }))

// 导入并注册 用户 的 路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)

// 导入并注册 查询用户信息的 模块
const userinfoRouter = require('./router/userinfo')
app.use('/user',userinfoRouter)



// 错误级别中间件
app.use(function(err,req,res,next){
    // 表单数据验证失败
    if(err instanceof Joi.ValidationError) return res.send(err.message)
    // 使用需要token权限请求失败时
    if(err.name === 'UnauthorizedError') return res.send('身份认证失败') 
})

// 启动服务器
app.listen(8080,(req,res)=>{
    console.log('api server running at http://127.0.0.1:8080')
})