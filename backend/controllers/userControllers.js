const expressAsyncHandler = require("express-async-handler");
const userModel=require("../models/userModel")
const generateToken=require('../config/generateToken')
const registerUser=expressAsyncHandler(async(req,res)=>{
    const {name, email, password, profilePic}=req.body;
    if(!name || !email || !password ){
        res.status(400);
        throw new Error("please enter all required files");
    }
    const userExist=await userModel.findOne({email});
    if(userExist){  
        res.status(400);
        throw new Error("User already exist");
    }
    const user=await userModel.create({
        name,
        email,
        password,
        profilePic
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profilePic:user.profilePic,
            token:generateToken(user._id),
        });
    }else{
        res.status(400)
            throw new Error("user creation failed")
    }
})

const authUser=expressAsyncHandler(async (req,res)=>{
    const {email, password}=req.body;
    const user=await userModel.findOne({email});
    if(user && (await user.matchPassword(password))){
            res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profilePic:user.profilePic,
            token:generateToken(user._id),
        });
    }else{
        res.status(404)
        throw new Error("invalid user or password")
    }
})

const allusers=expressAsyncHandler(async (req,res)=>{
    const keyword=req.query.search ? {
        $or:[
            { name: {$regex: req.query.search, $options:"i"}},
            { email: {$regex: req.query.search, $options:"i"}},
        ]
    }:{};

    const users= await userModel.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
});
module.exports={registerUser, authUser, allusers}