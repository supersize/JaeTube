const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = mongoose.Schema({
    video: {
        type: Schema.Types.ObjectId, 
        ref: 'Video'
        // type: String, 
        // trim: true
    },
    viewerId: {
        type: String, 
        trim: true
    }
}, { timestamps: true })


const Record = mongoose.model('Record', recordSchema);

module.exports = { Record }