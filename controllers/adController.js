const Ad = require('../models/ad');
const mongoose = require('mongoose');



//create an ad
exports.createAd = async(req,res) =>{
    try{
        const{title,description,location,coordinates,date,images,contactInfo,createdBy,createdAt} = req.body;

        const ad = new Ad({
            title,
            description,
            location,
            coordinates,
            date,
            images,
            contactInfo,
            createdBy: req.user, //after authenticated middleware we get the user id
            createdAt
        });
     
        await ad.save();
        res.status(201).json(ad);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Failed to create Ad"});
    }
    
};

//get all ads

//get ads by user

//update an Ad


//Delete an AD


//Get ads nearby