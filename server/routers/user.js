const Router = require('koa-router');
const { User } = require('../schema/User')
const Common = require('../libs/common');
let userRouter = new Router();
userRouter.post('/login', async ctx => {
  let { name, pass } = ctx.request.body;
  try {
    let new_pass = Common.md5(pass);
    let info = await User.findOne({
      name,
      pwd: new_pass
    });
    if (info && info.name == name) {
      ctx.session.sid = info["uid"];
      ctx.body = Common.resSucc({
        userInfo: info
      })
    } else {
      ctx.body = Common.resError("登录失败")
    }
  } catch (error) {
    ctx.body = Common.resError("登录失败")
  }

})

userRouter.post('/register', async ctx => {
  let { name, pass, re_pass } = ctx.request.body;
  console.log("register name==>", name);
  console.log("register pass==>", pass);
  console.log("register re_pass==>", re_pass);
  try {
    let info = await User.create({
      uid: Common.newUUID(),
      name,
      pwd: Common.md5(pass),
      headImage: ""
    });
    console.log(info);
    ctx.session.sid = info["uid"];
    ctx.body = Common.resSucc({
      userInfo: info
    })
  } catch (error) {
    ctx.body = Common.resError("注册失败")
  }
})
module.exports = userRouter.routes();