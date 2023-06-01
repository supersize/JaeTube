if (process.env.NODE_ENV === 'production') {
    console.log("prod");
    module.exports = require('./prod.js');
} else {
    console.log("dev");
    module.exports = require('./dev.js');
}