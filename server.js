//got the modules here

const express = require("express"); //express for making it a server 
const mongoose =require("mongoose"); // to use mongo db 
const dotenv = require("dotenv"); //loads environment variables from a .env file into process.env

dotenv.config();

const app = express();
const Port = process.env.Port || 3000;

app.use(express.json());

mongoose.connect(process.env.Mongo_URI, {useNewUrlParser: true,})
    .then(()=> console.log('Mongo DB Connected'))
    .catch(err=> console.log(err));

app.get("/",(req,res) =>{
    res.send("API running")
});

app.listen(Port,()=> {
    console.log(`Server running at Port:${Port}/`);
});

