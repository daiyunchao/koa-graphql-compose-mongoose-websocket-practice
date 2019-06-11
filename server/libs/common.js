const crypto = require('crypto');
module.exports = {
  md5(content) {
    let hash = crypto.createHash('md5');
    let obj = hash.update(content);
    return obj.digest('hex');
  },
  resError(msg) {
    return {
      hasError: true,
      msg
    }
  },
  resSucc(data) {
    return {
      hasError: false,
      data
    }
  },
  randomHeadImgIndex(max_index) {
    let index = Math.floor(Math.random() * max_index);
    return index;
  },
  newUUID() {
    let first_letter = `abcdefghijklmnoqprstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ`;
    let other_letter = `abcdefghijklmnoqprstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ0123456789`;
    let uuid = "";
    let len = 8;
    for (let index = 0; index < len; index++) {
      let letter = "";
      if (index == 0) {
        letter = first_letter[Math.floor(Math.random() * first_letter.length)];
      } else {
        letter = other_letter[Math.floor(Math.random() * other_letter.length)];
      }
      uuid += letter;
    }
    uuid += (Date.now().toString());
    return uuid;
  }
}