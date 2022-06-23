// 导入 mysql模块
const db = require('../db/index')
// 导入 joi
 const schema = require('../schema/user')


exports.getUserInfo=(req,res)=>{
   //定义sql语句
   const sqlStr1 = 'select id,username,nickname,email,user_pic from ev_users where id = ?'
//    调用 db.query() 执行
// 注意这里的 req.user 是存在 token里面的数据
    db.query(sqlStr1,req.user.id,(err,results)=>{
        if(results.length != 1) return res.send('获取用户信息失败')
        
        // 获取成功：
        res.send({
            status:0,
            msg:'成功获取信息',
            data:results[0],
        })
    })
}

// 更新用户信息函数
exports.updateUserInfo = (req,res)=>{
    //res.send('updata is ok')
    const userinfo = req.body
    console.log(userinfo)
    // 使用joi验证
    const result = schema.updata_userinfo_schema.validate({id:userinfo.id,nickname:userinfo.nickname,email:userinfo.email})
    if(result.error) return res.send({suatus:1,msg:result.error.details[0].message})
    // 定义sql语句
    const sqlStr1 = 'update ev_users set ? where id = ?'
    db.query(sqlStr1,[userinfo,userinfo.id],(err,results)=>{
        if(err){
            return res.send({status:1,message:err.message})
        }
        if(results.affectedRows != 1){
            return res.send('修改用户信息失败')
        }
        // 修改成功
        const sqlStr2 = 'select id,username,nickname,email,user_pic from ev_users where id = ?'
        db.query(sqlStr2,userinfo.id,(err,results)=>{
            if(results.length != 1) return res.send('获取用户信息失败')
            
            // 获取成功：
            res.send({
                status:0,
                msg:'修改成功',
                data:results[0],
            })
        })
        
    })
}

// 修改密码
exports.updatepwd = (req,res)=>{
    const userinfo = req.body
    console.log(userinfo)
    const result = schema.update_password_schema.validate({OldPassword:userinfo.OldPassword,NewPassword:userinfo.NewPassword})
    if(result.error) return res.send({status:1,msg:result.error.details[0].message})
    // 验证通过
     
    //  1.验证旧密码是否正确
    const sqlStr1 = 'select password from ev_users where id = ?'
    db.query(sqlStr1,req.user.id,(err,results)=>{
        if(results.length != 1) return res.send('获取用户信息失败')
        //return res.send(results[0].passsword)
        if(userinfo.OldPassword !== results[0].password) {
            //console.log(results[0].password)
            return res.send('原密码错误')
        }

        const sqlStr2 = 'update ev_users set password = ? where id = ?'
        db.query(sqlStr2,[userinfo.NewPassword,req.user.id],(err,results)=>{
           if(err){
               return res.send({status:1,message:err.message})
           }
           if(results.affectedRows != 1){
               return res.send('修改用户信息失败')
           }
           // 修改成功
           res.send({
               status:0,
               msg:'修改密码成功'
           })
        })
    })

    
}