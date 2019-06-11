const common = require('./libs/common');
const fs = require('fs');
const path = require('path');
let str = "";
for (let index = 0; index < 100; index++) {
  str = str + "|" + common.newUUID();
}
fs.writeFileSync(path.join(__dirname, './keys'),str);