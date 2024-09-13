
const Tag = require('../models/tag');
const Ad = require('../models/ad');
const mongoose = require('mongoose');
const tag = require('../models/tag');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const geolib = require('geolib');

//create an ad
exports.createAd = async(req,res) =>{
    try{
        const{title,description,location,lng,lat,date,images,contactInfo,tags} = req.body;

        if(tags && tags.length >1){
            const validTags = await Tag.find({_id:{$in:tags}});
            if(validTags.length !== tags.length){
                return res.status(400).json({message:"Invalid Tag(s) Provided"});
            }
        }
        const ad = new Ad({
            title,
            description,
            location,
            coordinates:{
                type:"Point",
                coordinates:[lng,lat]
            },
            date,
            images,
            contactInfo,
            tags,
            createdBy: req.user, //after authenticated middleware we get the user ids
        });

        await ad.save();

        notifyUsers(ad);
        res.status(201).json(ad);
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Failed to create Ad"});
    }
    
};


const notifyUsers = async(newAd) =>{
   try {
        
        const users = await User.find({
            notificationTags: { $in: newAd.tags } // Step 2: Filter users based on matching tags
          });
    
       
        users.forEach((user)=>{
           const userCoordinates = user.notificationCoordinates.coordinates;
           const maxDistance = user.notificationDistance * 1000; //converted to meters
           
           const distance = geolib.getDistance(
            {latitude:newAd.coordinates.coordinates[1],longitude:newAd.coordinates.coordinates[0]},
            {latitude: userCoordinates[1],longitude: userCoordinates[0]}
           );

           if(distance <= maxDistance){
            sendNotification(user,newAd);
            console.log("within distance");
           }

        })
   } catch (error) {
        console.log("Error notifying users",error);
   }
};

//sendNotifications
const sendNotification = async(user,newAd) =>{
    console.log(`Sending Notifications to ${user.email} about ${newAd.title}`);

    const transporter = nodemailer.createTransport({
        service:'Outlook',
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD,
        },
    });

    const adlink = `${process.env.BASE_URL}/api/ad/get-ad/${newAd.id}`;
    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject:`New Ad Posted: ${newAd.title}`,
        text:`A new ad has been posted in your area: ${newAd.description}. Location: ${newAd.location}\n
        Here is a link to the Ad ${adlink}`

    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
      }
}
//get all ads
exports.getAllAds = async(req,res) =>{
    const {lng,lat,distance,tags,limit =10 ,page = 1} = req.query;
    try {
        let query = {};
        

        if(tags && tags.length >0){
            query.tags = {$in:  tags.split(',')};
        }
        //if lat, long and distance(km) are provided then we use geospatial queries of mongo db
        if ( lng && lat && distance) {

            const distanceInMeters = distance * 1000 ;

          
            query ={
                coordinates: {
                    $geoWithin:{
                        $centerSphere: [[lng, lat], distanceInMeters / 6378100]
                    },
                },
            };

   

        }
        //find ads without or without the coordinates
        const ads = await Ad.find(query).populate('tags');
        //.skip((page -1 ) * limit)
        //.limit(parseInt(limit));

        res.status(200).json(ads);
    } catch (error) {
        res.status(500).json({message:"Internal Servor Error"});
    }
};


//get My ads 
exports.getUserAds = async(req,res) =>{
    try{
        const ads = await Ad.find({createdBy: req.user}).populate('tags');
        if(ad.length == 0){
            return res.status(404).json({message:"No Ads Created by this user"});
        }
        res.status(200).json(ads);
    }catch{
        res.status(500).json({message:"Internal Servor Error"});
    }
}



//update an Ad
exports.updateAd = async(req,res) => {
    try{
        
        const userId = req.user;
        const adId = req.params.id;
        const {tags} = req.body.tags;
        //check if adId is provided
        if(!adId){
            return res.status(400).json({message:"Ad Id is required"});
        }

        const ad =  await Ad.findById(adId);
       
        if(!ad){
            return res.status(404).json({message:"Ad not found"});
        }

        if(ad.createdBy.toString() !== userId.toString()){
            return res.status(403).json({message:"you are not authorized to edit this ad"});
        }

        if(tags && tags.length >1){
            const validTags = await Tag.find({_id:{$in:tags}});
            if(validTags.length !== tags.length){
                return res.status(400).json("InvalidTagsProvided");
            }
        }
        const updatedAd = await Ad.findByIdAndUpdate(adId,req.body,{new:true});
        res.status(200).json(updatedAd);

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
}

//Delete an AD
exports.deleteAd = async(req,res) =>{
    try {
        const adId = req.params.id;
        const userId = req.user;

        //check if adId is provided
        if(!adId){
            return res.status(400).json({message:"Ad Id not found"});
        }

        const ad = await Ad.findById(adId);

        if(!ad){
            return res.status(404).json({message:"Ad Not Found"});
        }

        if(ad.createdBy.toString() !== userId.toString() ){
            return res.status(404).json({message:"Not Authorised to delete the Ad"});
        }

        await Ad.findByIdAndDelete(adId);
        res.status(200).json({message:"Ad Deleted Succesfully"});
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }

}

//Get ads by Id
exports.getAd = async(req,res) => {
    try{
        const adId = req.params.id;
        if(!adId){
            return res.status(400).json({message:"No Ad Id Provided"});
        }
        const ad = await Ad.findById(adId);

        if(!ad){
            return res.status(404).json({message:"No Ad found"});
        }

        res.status(200).json(ad);

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
}