const path = require("path");
const uploadspath = path.join(__dirname, "/../uploads/")
var config = {
    userspath: uploadspath + 'users/'
}
module.exports = function (mode) {
    return config;
}