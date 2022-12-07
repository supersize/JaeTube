// console.log("this is key");
// console.log("process.env : ", process.env);
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod.js');
    console.log("process.env.mongoURI in KEY : ", process.env.mongoURI);
} else {
    module.exports = require('./dev.js');
}