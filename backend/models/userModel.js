const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    profilePic:{type:String,default:"https://static.vecteezy.com/system/resources/thumbnails/013/360/247/small/default-avatar-photo-icon-social-media-profile-sign-symbol-vector.jpg"}
},
 {
    timestamps:true,
 }
);
userSchema.methods.matchPassword=async function(enteredPassword){
  return  await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})
const User=mongoose.model("User",userSchema);
module.exports=User;