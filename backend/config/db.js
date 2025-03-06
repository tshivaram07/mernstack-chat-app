require("dotenv").config({path:"./.env"});
const mongoose=require('mongoose')
const connectdb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);

        console.log(`mongodb connected:${conn.connection.host}`)
    }catch(error){
        console.log(`Error: ${error.message}`);
        process.exit(); 
    }
};
module.exports=connectdb;