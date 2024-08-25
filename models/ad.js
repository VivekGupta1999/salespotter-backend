const mongoose = require('mongoose');

const adSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type:String,
        requred: true,
    },
    location:{
        type:String,
        required: true,
    },
    date:{
        type:Date,
        default: Date.now,
    },
    images:{
        type: [String],
        default: [],
    },
    contactInfo:{
        type: String,
        default: ''
    },

});

module.exports = mongoose.model('Ad',adSchema);
