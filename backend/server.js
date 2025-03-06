const express = require("express");
const messageRoutes=require("./routes/messageRoutes")
const cors = require("cors");
const dotenv=require("dotenv");
dotenv.config()
const app = express();
const connectdb=require("./config/db")
const data = require("./data/data");  // Ensure this path is correct
const userRoutes=require("./routes/userRoutes")
const chatRoutes=require("./routes/chatRoutes")
connectdb();
app.use(cors());
app.use(express.json()); 
const PORT = process.env.PORT || 3000;
app.get("/",(req,res)=>{
  res.send("Api successfully running");
})
app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);
// if no routs are found
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

//  Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});


const server=app.listen(PORT ,() => console.log("Server started on port 3000"));
const io=require("socket.io") (server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173",

    }
})
io.on("connection",(socket)=>{
   console.log("connected to socket");
   socket.on('setup',(userData)=>{
      socket.join(userData._id);
      socket.emit('connected');
   })
   socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('user joined room'+ room);
   })
   socket.on('new message',(newMessageReceived)=>{
    var chat=newMessageReceived.chat;
    if(!chat.users) return console.log("no users");
    chat.users.forEach(user => {
        if(user._id==newMessageReceived.sender._id) return;
        socket.in(user._id).emit('message recieved',newMessageReceived);
    });
   })

   socket.off("setup",()=>{
    console.log("user disconnected");
    socket.leave(userData._id);
   })
})