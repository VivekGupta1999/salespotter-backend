// we will create the function to connect to db here 

const mongoose = require('mongoose');
 
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE_URL,{
      
            //avoind deprecation warnings
        });
        console.log('MongoDB Connected');
    }
    catch(error){
        console.error('Mongo DB Connection failed:',error.message);
        process.exit(1); //Exit process with failure
    }
}


module.exports = connectDB;