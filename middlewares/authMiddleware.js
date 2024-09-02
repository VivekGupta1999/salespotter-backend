const jwt = require('jsonwebtoken');

//middle ware to protect routes

//verify the token
exports.verifyToken = (req,res,next)=>{
    //get token from  headers


    const token = req.header('Authorization').replace('Bearer ','');

    if(!token){
        return res.status(401).json({message:'No token, authorization denied'});

    }
    try{
        //verify token
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET,{algorithms:['HS256']});
  
        req.user = decoded.userId;
   
        next();

    }catch(error){
        return res.status(401).json({message:'Token is invalid',error});
    }
};
