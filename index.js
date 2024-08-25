//import express to create the server
const express = require('express');

const connectDB = require('./config/db');
//import the connectDB function

//load evnvironment variables from a .env file into process.env
require('dotenv').config();


const app = express();

//middleware to parse incoming JSON requests and put the parsed data into req.body
app.use(express.json());

//connect to the database
connectDB();

//Routes
const adRoutes = require('./routes/adRoutes');
const userRoutes = require('./routes/userRoutes');
const { Connection } = require('mongoose');

app.use('/api/ads',adRoutes);
app.use('/api/users',userRoutes);
//route setup 


//setting the PORT
const PORT = process.env.PORT || 5000;

//start the server and listens to the specified port.
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
});




