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

const User = mongoose.model('User', userSchema);
module.exports = User;