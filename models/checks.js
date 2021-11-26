const mongoose = require('mongoose')


const checkSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    url:{
        type: String,
        trim: true,
        required: true
    },
    protocol:{
        type: String,
        trim: true,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    interval:{
        type: Number,
        default: 36000000
    },
    timeout:{
        type: Number,
        default: 5000
    }
}, {
    timestamps: true
})
const Check = mongoose.model('Check',checkSchema)
module.exports = Check