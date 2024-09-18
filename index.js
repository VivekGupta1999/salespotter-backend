//import the connectDB function
const connectDB = require('./config/db');
const app = require('./app');


//connect to the database
connectDB();
//setting the PORT



const PORT = process.env.PORT || 5000;


//start the server and listens to the specified port. 
app.listen(PORT,()=>{
    console.log(`Server is running on port: ${PORT}`);
});



