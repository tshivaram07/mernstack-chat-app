const token=require("jsonwebtoken")
const generateToken=(id)=>{
     return token.sign({id},process.env.TOKEN,{
        expiresIn:"30d",
     })
}

module.exports=generateToken;