const Tag = require('../models/tag');



//get all tags
exports.getTags = async(req,res) =>{
    try{
        const tags = await Tag.find();
        if(!tags){
            return res.status(404).json({message:"No Tags Found"});
        }

        res.status(200).json(tags);

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
} 

//create Tags
exports.createTag = async(req,res) =>{
    try {
       
       

        const tag = new Tag({ name: req.body.name});
        console.log(tag);
        await tag.save();
        res.status(201).json(tag);

    } catch (error) {
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
}


//delete tag
exports.deleteTag = async(req,res) =>{
    try{    
        const tagId = req.params.id;
        if(!tagId){
            return res.status(400).json({message:"No Tag Id provided"});
        }

        const tag = Tag.findById(tagId);

        if(!tag){
            return res.status(404).json({message:"No Tag found by this Id"});
        }

        await Tag.findByIdAndDelete(tagId);
        res.status(200).json({message:"Tag Deleted Successfully"});
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
}


//update Tag
exports.updateTag = async(req,res) =>{
    try{
        const tagId = req.params.id;
        if(!tagId){
            return res.status(400).json({message:"No Tag Id Provided"});
        }

        const tag = Tag.findById(tagId);
        if(!tag){
            return res.status(404).json({message:"No tag found"});
        }

        const upadateTag = await Tag.findByIdAndUpdate(tagId,{name:req.body.name},{new:true});
        res.status(200).json(upadateTag)
    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
        console.log(error);
    }
}