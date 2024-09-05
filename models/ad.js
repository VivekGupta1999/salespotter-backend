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
          type: String, // 'Point'
          enum: ['Point'], // Must be 'Point' for GeoJSON
   
        },
        coordinates: {
          type: [Number], // Array of numbers: [longitude, latitude]
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

});

//add 2d sphere index for geospatial queries
adSchema.index({coordinates: '2dsphere'}); //Ensures 2dsphere index for geospatial queries


//everytime a save method is called on the model  this pre-save middleware set the coordinates field as a GeoJSON point



adSchema.pre('save', function (next) {
  
    if (this.coordinates && Array.isArray(this.coordinates)) {
      this.coordinates = {
        type: 'Point',
        coordinates: this.coordinates, // Array of [longitude, latitude]
      };
    }
    next();
  });
module.exports = mongoose.model('Ad',adSchema);
