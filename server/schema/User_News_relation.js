const { UserTC } = require('./User')
const { NewsTC } = require('./News')
NewsTC.addRelation('postUser', {
  resolver() {
    return UserTC.getResolver('findOne');
  },
  prepareArgs: {
    filter: source => {
      return {
        uid: source.uid
      }
    }
  },
  projection: {
    uid: true
  }
});

