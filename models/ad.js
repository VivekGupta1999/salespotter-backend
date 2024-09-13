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
    coordinates: {
        type: {
          type: String,
          enum: ['Point'], // GeoJSON type, should always be 'Point'
          required: true,
        },
        coordinates: {
          type: [Number], // Array of numbers [longitude, latitude]
          required: true,
        },
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
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],  // Array of tag references

});

//add 2d sphere index for geospatial queries
adSchema.index({coordinates: '2dsphere'}); //Ensures 2dsphere index for geospatial queries


//everytime a save method is called on the model  this pre-save middleware set the coordinates field as a GeoJSON point




module.exports = mongoose.model('Ad',adSchema);
