const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    profile_picture:{
        type: String,
        default: ''
    },
    notificationDistance:{
        type: Number,
        default:0,

    },
    resetPasswordToken:{
        type:String,
        default:undefined
    },
    resetPassswordExpires:{
        type:Date,
    }
    ,notificationTags:[{type:mongoose.Schema.Types.ObjectId,ref: 'Tag'}], //refers to the tag model,
    notificationCoordinates: {
        type: {
          type: String,
          enum: ['Point'], // GeoJSON type, should always be 'Point'
       
        },
        coordinates: {
          type: [Number], // Array of numbers [longitude, latitude]
          
        },
      },
    
    
    
});

//Hash the password before saving the user
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try{
        //Generate a Salt
        const salt = await bcrypt.genSalt(10);
        //hash the password with the salt

        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(err){
        next(err);
    }
    
});
userSchema.index({ notificationCoordinates: '2dsphere' });

const User = mongoose.model('User', userSchema);
module.exports = User;



