//import express to create the server
const express = require('express');

const app = express();
//import the connectDB function
const connectDB = require('./config/db');

//import the doteenv module
const dotenv = require('dotenv');

//load evnvironment variables from a .env file into process.env
dotenv.config();

//load the middleware to test the protected route
const authMiddleware = require('./middlewares/authMiddleware');

//connect to the database
connectDB();

//pase JSON Bodies
app.use(express.json()); //parse Json Bodies


//Routes
// const adRoutes = require('./routes/adRoutes');
const userRoutes = require('./routes/userRoutes');

//use the user routes
app.use('/api/user',userRoutes);


//Protected Route
app.post ('/api/protected-route',authMiddleware.verifyToken,(req,res)=>{
    res.status(200).json({message:'This is a protected Route', userId:req.user})
});




//setting the PORT
const PORT = process.env.PORT || 5000;

//start the server and listens to the specified port.
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
});




