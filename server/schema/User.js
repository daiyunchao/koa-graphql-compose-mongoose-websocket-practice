const composeMongoose = require('graphql-compose-mongoose/node8')
let { composeWithMongoose } = composeMongoose;
const mongoose = require('mongoose');
const Common=require('../libs/common')
//用户Schema
const UserSchema = new mongoose.Schema({
  uid: {
    type: String,
    index: true
  },
  name: String,
  pwd: String,//使用md5签名存储
  headImage:{
    type:String,
    default:`/images/heads/${Common.randomHeadImgIndex(7)}.jpg`
  },
});

//用户对象
const User = mongoose.model('User', UserSchema);

const customizationOptions = {

};

const UserTC = composeWithMongoose(User, customizationOptions);
UserTC.extendField('pwd', {
  resolve: (source, args, context) => null
});
let schemaComposer = global.schemaComposer;

//query的方法:
schemaComposer.Query.addFields({
  userById: UserTC.getResolver('findById'),
  userByIds: UserTC.getResolver('findByIds'),
  userOne: UserTC.getResolver('findOne'),
  userMany: UserTC.getResolver('findMany'),
  userCount: UserTC.getResolver('count'),
  userConnection: UserTC.getResolver('connection'),
  userPagination: UserTC.getResolver('pagination')
});


//mutation的方法:
schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.getResolver('createOne'),
  userCreateMany: UserTC.getResolver('createMany'),
  userUpdateById: UserTC.getResolver('updateById'),
  userUpdateOne: UserTC.getResolver('updateOne'),
  userUpdateMany: UserTC.getResolver('updateMany'),
  userRemoveById: UserTC.getResolver('removeById'),
  userRemoveOne: UserTC.getResolver('removeOne'),
  userRemoveMany: UserTC.getResolver('removeMany')
});


module.exports = {
  User, UserTC
}