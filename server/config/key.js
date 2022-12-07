// console.log("this is key");
// console.log("process.env : ", process.env);
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}