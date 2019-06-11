let graphqlCompose = require('graphql-compose');
let { schemaComposer } = graphqlCompose;
global.schemaComposer = schemaComposer;

//引入模型
require('./User');
require('./News');

//引入关系
require('./User_News_relation');

//构建自动语句
const graphqlSchema = global.schemaComposer.buildSchema();
module.exports = graphqlSchema;