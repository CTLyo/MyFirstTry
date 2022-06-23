// 该文件(模块) 封装user路由模块的响应函数

// 导入数据库模块
const db = require('../db/index')
// 导入生成token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')
// 导入 joi
const Joi = require('joi')
 const schema = require('../schema/user')

exports.reguser = (req,res)=>{
    //获取客户端提交到服务器的信息
    const userinfo = req.body
    console.log(userinfo)
// 对表单中的数据进行合法校验(未优化) 后面使用Joi进行校验 (
// if(!userinfo.username || !userinfo.password){
//     // 信息为空
//     return res.send({status:1,message:'用户或密码不合法!'})
// }
        //使用Joi验证提交信息 
    const result = schema.reg_login_schema.validate({username:userinfo.username,password:userinfo.password})
    if(result.error) return res.send({suatus:1,msg:result.error.details[0].message})


// 定义sql语句 查询用户名是否被占用
const sqlStr1 = 'select * from ev_users where username = ?'
// results 返回的是一个数组
db.query(sqlStr1,[userinfo.username],(err,results)=>{
    if(err){
        return res.send({status:1,message:err.message})
    }
    // 判断用户名是否被占用
    if(results.length > 0){
        // results数组中有值,即用户名已存在
        return res.send({status:1,msg:'用户名已被注册,请更换其他用户名!'})
    }
 // 用户名未被占用
 const sqlStr2 = 'insert into ev_users set ?'
 db.query(sqlStr2,{username:userinfo.username,password:userinfo.password},(err,results)=>{
     if(err){
         return res.send({status:1,message:err.message})
     }
     if(results.affectedRows !== 1){
         return res.send({status:1,msg:'注册失败,请稍后再试!'})
     }
     // 注册成功
     res.send('注册成功')
 })

})
    //res.send('reguser OK')
}

exports.login = (req,res)=>{
        //获取客户端提交到服务器的信息
        const userinfo = req.body
        console.log(userinfo)
    // 对表单中的数据进行合法校验(未优化) 后面使用Joi进行校验 (后来,joi不行 超6
    // if(!userinfo.username || !userinfo.password){
    //     // 信息为空
    //     return res.send({status:1,message:'用户或密码不合法!'})
    // }

        //使用Joi验证提交信息 
        const result = schema.reg_login_schema.validate({username:userinfo.username,password:userinfo.password})
        if(result.error) return res.send({suatus:1,msg:result.error.details[0].message})

    const sqlStr1 = 'select * from ev_users where username = ?'

    db.query(sqlStr1,userinfo.username,(err,results)=>{
        if(err){
            return res.send({status:1,message:err.message})
        }
        // 查询成功但查询数据条数不等于1
        if(results.length !== 1) return res.send('登录失败,请输入正确的用户名!')

        // 查询到用户名,开始匹配密码
        const sqlStr2 = 'SELECT * FROM ev_users WHERE username = ?'
        db.query(sqlStr2,userinfo.username,(err,results)=>{
            if(err){
                return res.send({status:1,message:err.message})
            }
            // 查询到密码不匹配
            console.log(results[0])
            if(userinfo.password != results[0].password) return res.send('密码错误')
            // 密码正确 生成token
            //res.send('恭喜你,登陆成功!')
            // token 剔除密码和图片
            const user = {...results[0],password:'',user_pic:''}
            // 对用户的信息进行加密 生成token字符串 使用全局配置文件 config.js
            const tokenSt = jwt.sign(user,config.jwtSecreKey,{expiresIn:config.expiresIn})
            res.send({
                status:0,
                msg:'登陆成功',
                token:'Bearer' +tokenSt,
            })
        })
    })
}

