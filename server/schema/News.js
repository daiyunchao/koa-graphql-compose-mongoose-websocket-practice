const composeMongoose = require('graphql-compose-mongoose/node8')
let { composeWithMongoose } = composeMongoose;
const mongoose = require('mongoose');
const Common=require('../libs/common')
let NewsSchema = new mongoose.Schema({
  nid: {
    type: String,
    index: true,
    default:Common.newUUID(),//默认值为创建的ID
  },
  uid: String,//发布新闻的用户
  title: String,
  content: String,
  pictures: Array,
  createTime: {
    type: Number,
    default: Date.now(),
    index: true
  }
});

let News = mongoose.model('News', NewsSchema);
const customizationOptions = {
  resolvers: {}
};

const NewsTC = composeWithMongoose(News, customizationOptions);
let schemaComposer = global.schemaComposer;


//query的方法:
schemaComposer.Query.addFields({
  newsById: NewsTC.getResolver('findById'),
  newsByIds: NewsTC.getResolver('findByIds'),
  newsOne: NewsTC.getResolver('findOne'),
  newsMany: NewsTC.getResolver('findMany'),
  newsCount: NewsTC.getResolver('count'),
  newsConnection: NewsTC.getResolver('connection'),
  newsPagination: NewsTC.getResolver('pagination')
});


//mutation的方法:
schemaComposer.Mutation.addFields({
  newsCreateOne: NewsTC.getResolver('createOne'),
  newsCreateMany: NewsTC.getResolver('createMany'),
  newsUpdateById: NewsTC.getResolver('updateById'),
  newsUpdateOne: NewsTC.getResolver('updateOne'),
  newsUpdateMany: NewsTC.getResolver('updateMany'),
  newsRemoveById: NewsTC.getResolver('removeById'),
  newsRemoveOne: NewsTC.getResolver('removeOne'),
  newsRemoveMany: NewsTC.getResolver('removeMany')
});

module.exports = {
  News, NewsTC
}