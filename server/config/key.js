// console.log("this is key");
// console.log("process.env : ", process.env);
if (process.env.NODE_ENV === 'production') {
    console.log("process.env.mongoURI in KEY : ", process.env);
    module.exports = require('./prod.js');
} else {
    module.exports = require('./dev.js');
}