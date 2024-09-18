

//import the doteenv module
const dotenv = require('dotenv');

//load evnvironment variables from a .env file into process.env
dotenv.config();



const express = require('express');
const app = express();

app.use(express.json());





//Routes
// user Routes
const userRoutes = require('./routes/userRoutes');
//Ad Routes
const adRoutes = require('./routes/adRoutes');
//Tag Routes
const tagRoutes = require('./routes/tagRoutes');
//use the user routes
app.use('/api/user',userRoutes);
app.use('/api/ad',adRoutes);
app.use('/api/tag',tagRoutes);






module.exports = app;

