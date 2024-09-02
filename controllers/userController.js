const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto =require('crypto');
const nodemailer = require('nodemailer');
const { text } = require('express');
const { constrainedMemory } = require('process');

//Register new user 
exports.registerUser = async (req,res) =>{
    try{
        
        const{firstName,lastName,email,password,location,profile_picture,notificationDistance} = req.body

        //check if user already exists
        const exsistingUser = await User.findOne({email});
       
        if(exsistingUser){
            return res.status(400).json({message: 'User already exists'});

        }

        //Create a new User

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            location,
            profile_picture,
            notificationDistance
            
        });

        await newUser.save();



        res.status(201).json({message: 'User registered successfully'});

    }
    catch(error){
        res.status(500).json({message:'Server error', error});
    }
};

//Login
exports.loginUser = async(req,res) =>{
    try{

        const{email,password} = req.body;

        //find the user by email
        const user = await User.findOne({email});
        console.log("user",user);
        
        if(!user){
            return res.status(404).json({message:'User Not Found' });

        }
        //verify password (compare the pasword with bcrypt hashed password)
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid Credentials'});


        }



        //genetate Token
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'1h',algorithm:'HS256'});

        res.status(200).json({message:'Login Successfull',token});


    }catch(error){
        return res.status(500).json({message:'Server Error',error});
    }
};


//Update User Profile
exports.updateUserProfile = async(req,res) => {
    try {
        const {firstName,lastName,email,location,profile_picture,notificationDistance} = req.body;
        const user = await User.findById(req.user); 

         if(!user){
            return res.status(404).json("User Not Found");
         }

         user.firstName = firstName || user.firstName;
         user.lastName = lastName || user.lastName;
         user.email = email || user.email;
         user.location = location || user.location;
         user.profile_picture = profile_picture || user.profile_picture;
         user.notificationDistance = notificationDistance || user.notificationDistance;

         await user.save();
         res.status(500).json({message:"User Profile Updated Successfully",user});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
    }
};


//change Password
exports.changePassword = async(req,res) => {
    try{
        const {currentPassword,newPassword } = req.body;
        const user = await User.findById(req.user);
        console.log(user);
        if(!user){
           return res.status(404).json({message:"User Not Found"});
        }

        const isMatch = await bcrypt.compare(currentPassword,user.password);

        if(!isMatch){
           return res.status(400).json({message:'Current Password is incorrect'});

        }

  


        user.password = newPassword;
        await user.save();

        res.status(200).json({message:"Password Changed Successfully"});

    }   
    catch(err){
        res.status(500).json({message:`Internal Server Error,error:${err}`});
    }

};

//delete a user
exports.deleteUser = async(req,res) =>{
    try{
        const {filled_password} = req.body;

        const user = await User.findById(req.user);

        if(!user){
           return res.status(404).json("User Not Found");
        }
 
        const isMatch = await bcrypt.compare(filled_password,user.password);
        if(!isMatch){
           return res.status(400).message("Wrong Password");
        }
      
        await user.deleteOne();

        res.status(200).json({message:"User account deleted"});

    }
    catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
};


//password forgot generates a token and sends reset password email with token
exports.forgotPassword = async(req,res) =>{
    try{
        const {email} = req.body;
  
        const user = await User.findOne({email});
    
        if(!user){
           return res.status(404).json({message:"User not found"});
        }

        //generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        //hash the reset password token and set the resetPasswordToken and resetPasswordExpires field of user
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPassswordExpires = Date.now() + 10 * 60 * 1000; //Token expires in 10 mins
        console.log("user",user);
        await user.save();
       
        //create a reset url
        const resetUrl = `${process.env.BASE_URL}/api/user/reset-password/${resetToken}`;

        
        //send email to user with the reset tokem
        const transporter = nodemailer.createTransport({
            service:'Outlook',
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAIL_PASSWORD,
            },
        });

        
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject:"Password Reset",
            text:`You are receiving this email because you(or someone else) have requested the reset of the password for your SaleSpotter Account. \n\n
                Please click on the following link, or paste this into your browser to complete the process within the next 10 minutes: \n\n
                ${resetUrl} \n 
                 If you did not request this, please ignore this email and your password will remain  unchanged.\n`

        };
   
        await transporter.sendMail(mailOptions);

        res.status(200).json({message: "Password Reset Email has been sent"});





    }catch(err){
        res.status(500).json({message:`Internal Server Error:${err}`});
    }
};

//resets the password after verifying if correct token is passed
exports.resetPassword = async(req,res) =>{
    try{
        const {token} = req.params;//as we gave the token in the url
        const {newPassword} = req.body;
       
        //hash the token received to compare with the stored tokem
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPassswordExpires: {$gt: Date.now()},
        });

      

        if(!user){
            return res.status(404).json({message:"Invalid or token expired"});

        }

        //set the new password
        user.password = newPassword;
        user.resetPassswordExpires = undefined;
        user.resetPasswordToken = undefined;

        user.save();
        console.log("user",user);
        res.status(200).json({message:"Password Updated Successfully"});


    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }
};

//gets user profile

exports.getUserProfile = async(req,res) => {
    try{
         const userId = req.user
         console.log("userid",userId);
         const user = await User.findById(userId);
         console.log("user",user);
         if(!user){
            return res.status(404).json({message:"User Not Found"});

         }

        res.json({user});

        

    }catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
};


