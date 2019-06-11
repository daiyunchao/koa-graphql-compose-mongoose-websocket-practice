const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const db = require('./mongodb');
const graphql = require('graphql-server-koa');
const schema = require('./schema');
const fs = require('fs');
const path = require('path');
const Common = require('./libs/common');
const _ = require('lodash');
let { graphqlKoa, graphiqlKoa } = graphql;
let app = new Koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
app.use(bodyParser());

// let online_user_count = 0;

//获取key值
let keys = fs.readFileSync(path.join(__dirname, './keys')).toString('utf8');
app.keys = keys.split('|');

//挂着session
app.use(session({
  maxAge: 20 * 60 * 1000,
  renew: true
}, app));
//实例化router
const router = new Router();

//挂着websocket

io.on('connection', (socket) => {
  socket.on('ws_request', (msg) => {
    if (msg) {
      let data = JSON.parse(msg);
      if (data.type == 'new_user_online') {
      }
    }
  });
  socket.on('disconnect', (info) => {
    console.log('user disconnected', info);
  });
});

//将 全部的graphql 请求转发到graphqlKoa进行处理
router.all('/graphql', async (ctx, next) => {

  //添加hook

  //前置hook
  console.log();

  await graphqlKoa({ schema: schema })(ctx, next);

  //后缀hook
  let { operationName } = ctx.request.body;

  if (operationName == 'newsCreateOne') {
    let body=JSON.parse(ctx.body);
    let newRecord = _.get(body, 'data.newsCreateOne.record', {});
    console.log("newRecord==>",newRecord);
    if (Object.keys(newRecord).length > 0) {
      //有值
      //发送一个socket通知出去
      io.emit('notice', JSON.stringify({
        "type": "new_news",
        "data": {}
      }));
    }
  }
})

//用于测试和debug的网页
router.get('/graphiql', async (ctx, next) => {
  await graphiqlKoa({ endpointURL: '/graphql' })(ctx, next)
})
router.use('/user', require('./routers/user'));

//全部的user跳转到user的路由去
app.use(static(path.join(__dirname, '../client')));
app.use(router.routes());

//连接数据库:
db();
//启动服务器:
server.listen(8080);