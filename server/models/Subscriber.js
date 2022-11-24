const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    // userTo : a target channel
    userTo: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    // userFrom : subscriber(client).
    userFrom: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    videos: {
        type: Array,
        default: []

    }
}, { timestamps: true })


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }